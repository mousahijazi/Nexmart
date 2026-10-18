import Product from "../model/Product.js";
import { getProductPricing } from "./offer/pricingService.js";
import { toMinorUnits, fromMinorUnits } from "../utils/moneyUtils.js";

const CURRENCY = "SAR";

const mergeDuplicateItems = (items) => {
  const merged = new Map();

  for (const item of items) {
    const productId = String(item.productId).toLowerCase();
    merged.set(productId, (merged.get(productId) || 0) + item.quantity);
  }

  return merged;
};

const isProductAvailable = (product) => product.isActive && !product.archivedByCategory && !product.archivedByBrand;

const priceCart = async (items) => {
  const requested = mergeDuplicateItems(items);

  const products = await Product.find({ _id: { $in: [...requested.keys()] } })
    .select("title slug mainImage price stock category isActive archivedByCategory archivedByBrand");
  
  const productsById = new Map(products.map((product) => [String(product._id), product]));

  const issues = [];
  const validEntries = [];

  for (const [productId, quantity] of requested) {
    const product = productsById.get(productId);

    if (!product) {
      issues.push({ productId, code: "PRODUCT_NOT_FOUND", message: "Product not found" });
      continue;
    }

    if (!isProductAvailable(product)) {
      issues.push({ productId, code: "PRODUCT_UNAVAILABLE", message: "Product is not available" });
      continue;
    }

    if (quantity > product.stock) {
      issues.push({ productId, code: "INSUFFICIENT_STOCK", message: "Requested quantity exceeds available stock", availableStock: product.stock });
      continue;
    }

    validEntries.push({ product, quantity });
  }

  const pricings = await Promise.all(validEntries.map(({ product }) => getProductPricing(product)));

  let originalSubtotalMinor = 0;
  let subtotalMinor = 0;

  const lines = validEntries.map(({ product, quantity }, index) => {
    const pricing = pricings[index];

    const originalMinor = toMinorUnits(pricing.originalPrice);
    const finalMinor = toMinorUnits(pricing.finalPrice);
    const discountMinor = originalMinor - finalMinor;

    originalSubtotalMinor += originalMinor * quantity;
    subtotalMinor += finalMinor * quantity;

    return {
      productId: String(product._id),
      slug: product.slug,
      title: product.title,
      mainImage: product.mainImage,
      quantity,
      pricing: {
        originalPrice: fromMinorUnits(originalMinor),
        discount: pricing.discount
          ? {
              type: pricing.discount.type,
              value: pricing.discount.value,
              amount: fromMinorUnits(discountMinor),
            }
          : null,
        finalPrice: fromMinorUnits(finalMinor),
      },
      lineTotal: fromMinorUnits(finalMinor * quantity),
    };
  });

  return {
    currency: CURRENCY,
    items: lines,
    issues,
    totals: {
      originalSubtotal: fromMinorUnits(originalSubtotalMinor),
      discountTotal: fromMinorUnits(originalSubtotalMinor - subtotalMinor),
      subtotal: fromMinorUnits(subtotalMinor),
    },
    canCheckout: lines.length > 0 && issues.length === 0,
  };
};

export { priceCart };