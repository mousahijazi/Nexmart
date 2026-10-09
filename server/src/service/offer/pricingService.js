import Offer from "../../model/Offer.js";
import { calculateDiscountAmount, isOfferValidNow, calculateFinalPrice } from "../../utils/pricingUtils.js";

const getProductPricing = async (product) => {
  const now = new Date();
  const categoryId = product.category?._id;

  const [productOffer, categoryOffer] = await Promise.all([
    Offer.findOne({
      targetType: "product",
      product: product._id,
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gt: now },
    }).sort({ createdAt: -1 }),

    Offer.findOne({
      targetType: "category",
      category: categoryId,
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gt: now },
    }).sort({ createdAt: -1 }),
  ]);

  const validProductOffer = isOfferValidNow(productOffer, now) ? productOffer : null;
  const validCategoryOffer = isOfferValidNow(categoryOffer, now) ? categoryOffer : null;
  let selectedOffer = null;

  if (validProductOffer && !validCategoryOffer) {
    selectedOffer = validProductOffer;
  }

  if (!validProductOffer && validCategoryOffer) {
    selectedOffer = validCategoryOffer;
  }

  if (validProductOffer && validCategoryOffer) {
    const productDiscountAmount = calculateDiscountAmount(product.price, validProductOffer);
    const categoryDiscountAmount = calculateDiscountAmount(product.price, validCategoryOffer);

    if (productDiscountAmount >= categoryDiscountAmount) {
      selectedOffer = validProductOffer;
    } else {
      selectedOffer = validCategoryOffer;
    }
  }

  if (!selectedOffer) {
    return {
      originalPrice: product.price,
      discount: null,
      finalPrice: product.price,
    };
  }

  const discountAmount = calculateDiscountAmount(product.price, selectedOffer);
  const finalPrice = calculateFinalPrice(product.price, discountAmount);

  return {
    originalPrice: product.price,
    discount: {
      type: selectedOffer.type,
      value: selectedOffer.discount,
      amount: discountAmount,
    },
    finalPrice,
  };
};

const addPricingToProduct = async (product) => {
  const pricing = await getProductPricing(product);

  return {
    ...product.toObject(),
    pricing,
  };
};

export {
  getProductPricing,
  addPricingToProduct,
};