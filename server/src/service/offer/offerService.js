import Offer from "../../model/Offer.js";
import Product from "../../model/Product.js";
import Category from "../../model/Category.js"
import Season from "../../model/Season.js";
import AppError from "../../utils/AppError.js";
import { FAIL } from "../../utils/httpStatusText.js";
import { createOffer as createOfferRepository, getAllOffers as getAllOffersRepository, getOfferById as getOfferByIdRepository, updateOffer as updateOfferRepository, deleteOffer as deleteOfferRepository } from "../../repositories/offerRepository.js";
import { calculateDiscountAmount } from "../../utils/pricingUtils.js";

const calculateOfferStatus = (isActive, startDate, endDate) => {
  if (!isActive) return "Inactive";

  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return "Scheduled";
  if (now >= start && now <= end) return "Active";
  return "Expired";
};

const normalizeOfferDatesForSeason = async ({ seasonId, startDate, endDate }) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime())) {
    throw AppError.create("Invalid offer start date or end date.", 400, FAIL);
  }

  if (start < now || end <= now) {
    throw AppError.create("Offer dates cannot be in the past.", 400, FAIL);
  }

  if (end <= start) {
    throw AppError.create("End date must be after start date.", 400, FAIL);
  }

  if (!seasonId) {
    return { startDate: start, endDate: end };
  }

  const season = await Season.findById(seasonId);

  if (!season) {
    throw AppError.create("Season not found.", 404, FAIL);
  }

  const seasonStart = new Date(season.startDate);
  const seasonEnd = new Date(season.endDate);

  if (!Number.isFinite(seasonStart.getTime()) || !Number.isFinite(seasonEnd.getTime()) || seasonEnd <= seasonStart) {
    throw AppError.create("The season has invalid dates.", 400, FAIL);
  }

  if (start < seasonStart || end > seasonEnd) {
    throw AppError.create(
      `Offer dates must be strictly within the season dates (${seasonStart.toISOString().slice(0, 10)} to ${seasonEnd.toISOString().slice(0, 10)}).`,
      400,
      FAIL
    );
  }

  return { startDate: start, endDate: end };
};

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

const getAllOffers = async ({ page = 1, limit = 10, season, isActive }) => {
  const skip = (page - 1) * limit;

  const filter = {};

  if (season) {
    filter.season = season;
  }

  if (isActive !== undefined) {
    filter.isActive = isActive;
  }

  const result = await getAllOffersRepository({ skip, limit, filter });

  return {
    offers: result.offers,
    total: result.totaloffers,
    page,
    limit,
    skip,
    totalPages: Math.ceil(result.totaloffers / limit),
  };
};

const getOfferById = async (offerId) => {
  return await getOfferByIdRepository(offerId);
};

const createOffer = async (offerData) => {
  if (offerData.season) {
    const season = await Season.findById(offerData.season);

    if (!season) {
      throw AppError.create("Season not found", 404, FAIL);
    }
  }

  const now = new Date();
  const normalizedDates = await normalizeOfferDatesForSeason({
    seasonId: offerData.season,
    startDate: offerData.startDate,
    endDate: offerData.endDate,
  });

  offerData.startDate = normalizedDates.startDate;
  offerData.endDate = normalizedDates.endDate;
  
  const startDate = offerData.startDate;
  const endDate = offerData.endDate;

  if (endDate <= now) {
    throw AppError.create("Cannot create an offer with an end date in the past.", 400, FAIL);
  }

  if (endDate <= startDate) {
    throw AppError.create("End date must be after start date.", 400, FAIL);
  }

  const isFuture = startDate > now;

  if (isFuture) {
    offerData.isActive = false;
  } else {
    offerData.isActive = offerData.isActive !== undefined ? offerData.isActive : true;
  }

  offerData.status = calculateOfferStatus(offerData.isActive, offerData.startDate, offerData.endDate);

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

  const finalSeason = offerData.season !== undefined ? offerData.season : existingOffer.season;
  const requestedStartDate = offerData.startDate ?? existingOffer.startDate;
  const requestedEndDate = offerData.endDate ?? existingOffer.endDate;

  const normalizedDates = await normalizeOfferDatesForSeason({
    seasonId: finalSeason,
    startDate: requestedStartDate,
    endDate: requestedEndDate,
  });

  const now = new Date();
  const currentStartDate = normalizedDates.startDate;
  const currentEndDate = normalizedDates.endDate;

  const isExpired = currentEndDate <= now;
  const isFuture = currentStartDate > now;

  if (offerData.isActive !== undefined) {
    if (isExpired) {
      throw AppError.create("Cannot update an offer to an end date in the past.", 400, FAIL);
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

  offerData.status = calculateOfferStatus(
    offerData.isActive !== undefined ? offerData.isActive : existingOffer.isActive,
    offerData.startDate || existingOffer.startDate,
    offerData.endDate || existingOffer.endDate
  );

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