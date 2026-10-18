import Offer from "../../model/Offer.js";
import Product from "../../model/Product.js";
import Category from "../../model/Category.js"
import Season from "../../model/Season.js";
import AppError from "../../utils/AppError.js";
import { FAIL } from "../../utils/httpStatusText.js";
import { createOffer as createOfferRepository, getAllOffers as getAllOffersRepository, getOfferById as getOfferByIdRepository, updateOffer as updateOfferRepository, deleteOffer as deleteOfferRepository } from "../../repositories/offerRepository.js";
import { calculateDiscountAmount } from "../../utils/pricingUtils.js";
import { userRoles } from "../../utils/userRoles.js";
import { isCurrentPeriod } from "../../utils/periodUtils.js";

const calculateOfferStatus = (isActive, startDate, endDate, archivedBySeason = false) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (archivedBySeason) return "Inactive";

  if (now >= end) return "Expired";
  if (now < start) return "Scheduled";

  if (!isActive) return "Inactive";

  return "Active";
};

const normalizeOfferDatesForSeason = async ({ seasonId, startDate, endDate, checkPast = false }) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime())) {
    throw AppError.create("Invalid offer start date or end date.", 400, FAIL);
  }

  const currentMinute = new Date(now);
  currentMinute.setSeconds(0, 0);

  if (checkPast && (start < currentMinute || end <= now)) {
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
    throw AppError.create(`Offer dates must be strictly within the season dates (${seasonStart.toISOString().slice(0, 10)} to ${seasonEnd.toISOString().slice(0, 10)}).`, 400, FAIL);
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
    archivedBySeason: { $ne: true },
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

const getAllOffers = async ({ page = 1, limit = 10, season, isActive }, userRole) => {
  const skip = (page - 1) * limit;
  const filter = {};

  if (season) {
    filter.season = season;
  }

  // todo
  if (userRole === userRoles.ADMIN) {
    if (isActive !== undefined) {
      filter.isActive = isActive;
    }
  } else {
    filter.isActive = true;
    // todo
    filter.archivedBySeason = { $ne: true };
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

const getOfferById = async (offerId, userRole) => {
  const offer = await getOfferByIdRepository(offerId);

  if (!offer || (userRole !== userRoles.ADMIN && (!offer.isActive || offer.archivedBySeason))) {
    return null;
  }

  return offer;
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
    checkPast: true,
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

  offerData.status = calculateOfferStatus(offerData.isActive, offerData.startDate, offerData.endDate, offerData.archivedBySeason);

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
      archivedBySeason: { $ne: true },
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
      archivedBySeason: { $ne: true },
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

const updateOfferStatus = async (offerId, isActive) => {
  const offer = await Offer.findById(offerId);

  if (!offer) {
    throw AppError.create("Offer not found", 404, FAIL);
  }

  if (!isCurrentPeriod(offer.startDate, offer.endDate)) {
    throw AppError.create("Only a current offer can be activated or deactivated.", 400, FAIL);
  }

  if (isActive && offer.archivedBySeason) {
    throw AppError.create("This offer belongs to an inactive season. Activate the season first.", 409, FAIL);
  }

  offer.isActive = isActive;
  offer.status = calculateOfferStatus(isActive, offer.startDate, offer.endDate);
  await offer.save();

  await offer.populate("product category season");
  return offer;
};

const deleteOffer = async (offerId) => {
  return await deleteOfferRepository(offerId);
};

export {
  createOffer,
  getAllOffers,
  getOfferById,
  updateOffer,
  updateOfferStatus,
  deleteOffer,
};