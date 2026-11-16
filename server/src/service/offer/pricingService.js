import Offer from "../../model/Offer.js";
import { calculateDiscountAmount, isOfferValidNow, calculateFinalPrice } from "../../utils/pricingUtils.js";

const getProductPricing = async (product, options = {}) => {
  const { session } = options;
  const now = new Date();
  const categoryId = product.category?._id || product.category;

  let productOfferQuery = Offer.findOne({
    targetType: "product",
    product: product._id,
    isActive: true,
    archivedBySeason: { $ne: true },
    startDate: { $lte: now },
    endDate: { $gt: now },
  }).sort({ createdAt: -1 });

  let categoryOfferQuery = Offer.findOne({
    targetType: "category",
    category: categoryId,
    isActive: true,
    archivedBySeason: { $ne: true },
    startDate: { $lte: now },
    endDate: { $gt: now },
  }).sort({ createdAt: -1 });

  if (session) {
    productOfferQuery = productOfferQuery.session(session);
    categoryOfferQuery = categoryOfferQuery.session(session);
  }

  const [productOffer, categoryOffer] = await Promise.all([
    productOfferQuery,
    categoryOfferQuery,
  ]);

  const validProductOffer = isOfferValidNow(productOffer, now) ? productOffer : null;
  const validCategoryOffer = isOfferValidNow(categoryOffer, now) ? categoryOffer : null;

  let selectedOffer = null;

  if (validProductOffer && !validCategoryOffer) {
    selectedOffer = validProductOffer;
  } else if (!validProductOffer && validCategoryOffer) {
    selectedOffer = validCategoryOffer;
  } else if (validProductOffer && validCategoryOffer) {
    const productDiscountAmount = calculateDiscountAmount(product.price, validProductOffer);
    const categoryDiscountAmount = calculateDiscountAmount(product.price, validCategoryOffer);

    selectedOffer =
      productDiscountAmount >= categoryDiscountAmount
        ? validProductOffer
        : validCategoryOffer;
  }

  if (!selectedOffer) {
    return {
      originalPrice: product.price,
      discount: null,
      finalPrice: product.price,
    };
  }

  const discountAmount = calculateDiscountAmount(product.price, selectedOffer);

  return {
    originalPrice: product.price,
    discount: {
      type: selectedOffer.type,
      value: selectedOffer.discount,
      amount: discountAmount,
    },
    finalPrice: calculateFinalPrice(product.price, discountAmount),
  };
};

const addPricingToProduct = async (product, options = {}) => {
  const pricing = await getProductPricing(product, options);

  return {
    ...product.toObject(),
    pricing,
  };
};

export {
  getProductPricing,
  addPricingToProduct,
};