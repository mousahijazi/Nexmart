import Offer from "../../model/Offer.js";
import Product from "../../model/Product.js";
import Category from "../../model/Category.js"
import Season from "../../model/Season.js";
import AppError from "../../utils/AppError.js";
import { FAIL } from "../../utils/httpStatusText.js";
import { createOffer as createOfferRepository, getAllOffers as getAllOffersRepository, getOfferById as getOfferByIdRepository, updateOffer as updateOfferRepository, deleteOffer as deleteOfferRepository } from "../../repositories/offerRepository.js";
import { calculateDiscountAmount } from "../../utils/pricingUtils.js";

const validateOfferTarget = async (offerData) => {
  if (offerData.targetType === "product") {
    const product = await Product.findById(offerData.product);

    if (!product) {
      throw AppError.create("Product not found", 404, FAIL);
    }

    return product;
  }

  if (offerData.targetType === "category") {
    const categoryId = offerData.category?._id || offerData.category;
    
    const category = await Category.findById(categoryId);
    if (!category) {
      throw AppError.create("Category not found", 404, FAIL);
    }

    const products = await Product.find({ category: categoryId }).select("_id price");
    return products;
  }

  return null;
};

const findOverlappingProductOffer = async (productId, startDate, endDate, excludedOfferId = null) => {
  const filter = {
    targetType: "product",
    product: productId,
    startDate: { $lt: new Date(endDate) },
    endDate: { $gt: new Date(startDate) },
  };

  if (excludedOfferId) {
    filter._id = { $ne: excludedOfferId };
  }

  return await Offer.findOne(filter);
};

const removeWeakerProductOffers = async (categoryOffer, products) => {
  for (const product of products) {
    const productOffers = await Offer.find({
      targetType: "product",
      product: product._id,
      startDate: { $lt: categoryOffer.endDate },
      endDate: { $gt: categoryOffer.startDate },
      isActive: true,
    });

    for (const productOffer of productOffers) {
      const categoryDiscountAmount = calculateDiscountAmount(product.price, categoryOffer);
      const productDiscountAmount = calculateDiscountAmount(product.price, productOffer);

      if (categoryDiscountAmount > productDiscountAmount) {
        await Offer.findByIdAndDelete(productOffer._id);
      }
    }
  }
};

const createOffer = async (offerData) => {
  if (offerData.season) {
    const season = await Season.findById(offerData.season);

    if (!season) {
      throw AppError.create("Season not found", 404, FAIL);
    }
  }

  const now = new Date();
  const startDate = new Date(offerData.startDate);
  const endDate = new Date(offerData.endDate);

  if (endDate <= now) {
    throw AppError.create("Cannot create an offer with an end date in the past.", 400, FAIL);
  }

  if (endDate <= startDate) {
    throw AppError.create("End date must be after start date.", 400, FAIL);
  }

  if (startDate <= now && endDate > now) {
    offerData.isActive = true;
  } else {
    offerData.isActive = false;
  }

  if (offerData.targetType === "product") {
    if (!offerData.product) {
      throw AppError.create("Product ID is required when target type is product.", 400, FAIL);
    }

    offerData.category = undefined; 
  } else if (offerData.targetType === "category") {
    if (!offerData.category) {
      throw AppError.create("Category ID is required when target type is category.", 400, FAIL);
    }

    offerData.product = undefined; 
  }

  const target = await validateOfferTarget(offerData);

  if (offerData.targetType === "product") {
    const existingProductOffer = await findOverlappingProductOffer(offerData.product, offerData.startDate, offerData.endDate);

    if (existingProductOffer) {
      throw AppError.create("This product already has another Product Offer during this period", 409, FAIL);
    }

    const categoryOffer = await Offer.findOne({
      targetType: "category",
      category: target.category,
      startDate: { $lt: new Date(offerData.endDate) },
      endDate: { $gt: new Date(offerData.startDate) },
    });

    if (categoryOffer) {
      const productDiscountAmount = calculateDiscountAmount(target.price, offerData);
      const categoryDiscountAmount = calculateDiscountAmount(target.price, categoryOffer);

      if (productDiscountAmount < categoryDiscountAmount) {
        throw AppError.create("Product Offer must be stronger than the existing Category Offer", 409, FAIL);
      }
    }
  }

  const offer = await createOfferRepository(offerData);

  if (offerData.targetType === "category") {
    await removeWeakerProductOffers(offer, target);
  }

  return offer;
};

const getAllOffers = async ({ page = 1, limit = 6 }) => {
  const skip = (page - 1) * limit;

  const offers = await getAllOffersRepository({ skip, limit });

  return {
    offers: offers.offers,
    total: offers.totaloffers,
    page,
    limit,
    skip,
    totalPages: Math.ceil(offers.totaloffers / limit),
  };
};

const getOfferById = async (offerId) => {
  return await getOfferByIdRepository(offerId);
};

const updateOffer = async (offerId, offerData) => {
  const existingOffer = await Offer.findById(offerId);

  if (!existingOffer) {
    return null;
  }

  const finalTargetType = offerData.targetType || existingOffer.targetType;

  if (finalTargetType === "product") {
    const targetProduct = offerData.product || existingOffer.product;
    if (!targetProduct) {
      throw AppError.create("Product ID is required for product offers.", 400, FAIL);
    }
    
    offerData.product = targetProduct;
    offerData.category = null;
  } else if (finalTargetType === "category") {
    const targetCategory = offerData.category || existingOffer.category;
    if (!targetCategory) {
      throw AppError.create("Category ID is required for category offers.", 400, FAIL);
    }

    offerData.category = targetCategory;
    offerData.product = null;
  }

  const now = new Date();
  const currentStartDate = new Date(existingOffer.startDate);
  const currentEndDate = new Date(existingOffer.endDate);

  const isExpired = currentEndDate <= now;
  const isFuture = currentStartDate > now;

  if (offerData.isActive !== undefined) {
    if (isExpired && offerData.isActive === true) {
      throw AppError.create("Cannot activate an expired offer.", 400, FAIL);
    }
    if (isFuture && offerData.isActive === true) {
      throw AppError.create("Cannot activate a future offer before its start date.", 400, FAIL);
    }
  }

  const newStartDate = new Date(offerData.startDate || existingOffer.startDate);
  const newEndDate = new Date(offerData.endDate || existingOffer.endDate);

  if (isFuture || isExpired) {
    if (newStartDate <= now && newEndDate > now) {
      offerData.isActive = true;
    } else {
      offerData.isActive = false;
    }
  }

  const updatedData = {
    ...existingOffer.toObject(),
    ...offerData,
  };

  if (updatedData.targetType === "product") {
    const product = await Product.findById(updatedData.product);

    if (!product) {
      throw AppError.create("Product not found", 404, FAIL);
    }

    const existingProductOffer = await findOverlappingProductOffer(
      updatedData.product,
      updatedData.startDate || existingOffer.startDate,
      updatedData.endDate || existingOffer.endDate,
      offerId
    );

    if (existingProductOffer) {
      throw AppError.create("This product already has another Product Offer during this period", 409, FAIL);
    }

    const categoryOffer = await Offer.findOne({
      targetType: "category",
      category: product.category,
      startDate: { $lt: new Date(updatedData.endDate) },
      endDate: { $gt: new Date(updatedData.startDate) },
      _id: { $ne: offerId },
    });

    if (categoryOffer) {
      const productDiscountAmount = calculateDiscountAmount(product.price, updatedData);
      const categoryDiscountAmount = calculateDiscountAmount(product.price, categoryOffer);

      if (productDiscountAmount < categoryDiscountAmount) {
        throw AppError.create("Product Offer must be stronger than the existing Category Offer", 409, FAIL);
      }
    }
  }

  const updatedOffer = await updateOfferRepository(offerId, offerData);

  if (updatedOffer && updatedOffer.targetType === "category") {
    const products = await Product.find({ category: updatedOffer.category }).select("_id price");

    await removeWeakerProductOffers(updatedOffer, products);
  }

  return updatedOffer;
};

const deleteOffer = async (offerId) => {
  return await deleteOfferRepository(offerId);
};

export {
  createOffer,
  getAllOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
};