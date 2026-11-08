import AppError from "../../utils/AppError.js";
import { FAIL } from "../../utils/httpStatusText.js";
import {
  createOffer as createOfferRepository,
  getAllOffers as getAllOffersRepository,
  getOfferById as getOfferByIdRepository,
  findOfferById,
  findProductById,
  findCategoryById,
  findSeasonById,
  findProductsByCategory,
  findOverlappingProductOffer,
  findOverlappingCategoryOffer,
  findOverlappingProductOffersForProducts,
  deleteOffersByIds,
  findProductsByIds,
  updateOffer as updateOfferRepository,
  updateOfferStatus as updateOfferStatusRepository,
  deleteOffer as deleteOfferRepository,
} from "../../repositories/offerRepository.js";
import { calculateDiscountAmount } from "../../utils/pricingUtils.js";
import { userRoles } from "../../utils/userRoles.js";
import { isCurrentPeriod } from "../../utils/periodUtils.js";

const calculateOfferStatus = (isActive, startDate, endDate, archivedBySeason = false, now = new Date()) => {
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

  const season = await findSeasonById(seasonId);

  if (!season) {
    throw AppError.create("Season not found.", 404, FAIL);
  }

  const seasonStart = new Date(season.startDate);
  const seasonEnd = new Date(season.endDate);

  if (!Number.isFinite(seasonStart.getTime()) || !Number.isFinite(seasonEnd.getTime()) || seasonEnd <= seasonStart) {
    throw AppError.create("The season has invalid dates.", 400, FAIL);
  }

  if (start < seasonStart || end > seasonEnd) {
    throw AppError.create(`Offer dates must be within the season dates (${seasonStart.toISOString().slice(0, 10)} to ${seasonEnd.toISOString().slice(0, 10)}).`, 400, FAIL);
  }

  return { startDate: start, endDate: end };
};

const validateOfferTarget = async (offerData) => {
  if (offerData.targetType === "product") {
    const product = await findProductById(offerData.product);

    if (!product) {
      throw AppError.create("Product not found.", 404, FAIL);
    }

    return product;
  }

  if (offerData.targetType === "category") {
    const category = await findCategoryById(offerData.category);

    if (!category) {
      throw AppError.create("Category not found.", 404, FAIL);
    }

    return findProductsByCategory(category._id);
  }

  throw AppError.create("Invalid offer target type.", 400, FAIL);
};

const removeWeakerProductOffers = async (categoryOffer, products) => {
  if (!products.length) return;

  const productIds = products.map((product) => product._id);

  const productOffers = await findOverlappingProductOffersForProducts(productIds, categoryOffer.startDate, categoryOffer.endDate);

  const productsMap = new Map(
    products.map((product) => [
      String(product._id),
      product,
    ])
  );

  const offersToDelete = [];

  for (const productOffer of productOffers) {
    const product = productsMap.get(String(productOffer.product));

    if (!product) continue;

    const categoryDiscountAmount = calculateDiscountAmount(product.price, categoryOffer);
    const productDiscountAmount = calculateDiscountAmount(product.price, productOffer);

    if (categoryDiscountAmount > productDiscountAmount) {
      offersToDelete.push(productOffer._id);
    }
  }

  await deleteOffersByIds(offersToDelete);
};

const validateDiscount = (type, discount) => {
  const value = Number(discount);

  if (!Number.isFinite(value) || value < 0) {
    throw AppError.create("Invalid discount value.", 400, FAIL);
  }

  if (type === "percentage" && value > 100) {
    throw AppError.create("Percentage discount cannot be greater than 100.", 400, FAIL);
  }
};

const getAllOffers = async ({ page = 1, limit = 10, search, status, target, season, isActive }, userRole) => {
  const isAdmin = userRole === userRoles.ADMIN;

  return getAllOffersRepository({
    page,
    limit,
    search,
    status: isAdmin ? status : undefined,
    target: isAdmin ? target : undefined,
    season,
    isAdmin,
    isActive: isAdmin ? isActive : undefined,
  });
};

const getOfferById = async (offerId, userRole) => {
  const isAdmin = userRole === userRoles.ADMIN;

  const offer = await getOfferByIdRepository(offerId);

  if (!offer) {
    throw AppError.create("Offer not found.", 404, FAIL);
  }

  if (isAdmin) {
    return offer;
  }

  const now = new Date();

  const isPubliclyAvailable = 
    offer.isActive && !offer.archivedBySeason && 
    new Date(offer.startDate) <= now && new Date(offer.endDate) > now;

  if (!isPubliclyAvailable) return null;

  if (offer.targetType === "product") {
    const product = await findProductById(offer.product?._id || offer.product);

    if (!product || !product.isActive || product.archivedByCategory || product.archivedByBrand) {
      return null;
    }
  } else if (offer.targetType === "category") {
    const categoryId = offer.category?._id || offer.category;
    const products = await findProductsByCategory(categoryId);

    const hasAvailableProducts = products.some(
      (product) => product.isActive && !product.archivedByCategory && !product.archivedByBrand
    );

    if (!hasAvailableProducts) return null;
  }

  return offer;
};

const createOffer = async (offerData) => {
  const now = new Date();

  const normalizedDates = await normalizeOfferDatesForSeason({
    seasonId: offerData.season,
    startDate: offerData.startDate,
    endDate: offerData.endDate,
    checkPast: true,
  });

  const startDate = normalizedDates.startDate;
  const endDate = normalizedDates.endDate;

  if (endDate <= now) {
    throw AppError.create("Cannot create an offer with an end date in the past.", 400, FAIL);
  }

  offerData.startDate = startDate;
  offerData.endDate = endDate;

  if (startDate > now) {
    offerData.isActive = false;
  } else {
    offerData.isActive = offerData.isActive ?? true;
  }

  offerData.archivedBySeason = false;

  if (offerData.targetType === "product") {
    if (!offerData.product) {
      throw AppError.create("Product ID is required when target type is product.", 400, FAIL);
    }

    offerData.category = null;
  } else if (offerData.targetType === "category") {
    if (!offerData.category) {
      throw AppError.create("Category ID is required when target type is category.", 400, FAIL);
    }

    offerData.product = null;
  } else {
    throw AppError.create("Invalid offer target type.", 400, FAIL);
  }

  const target = await validateOfferTarget(offerData);

  offerData.status = calculateOfferStatus(offerData.isActive, startDate, endDate, false, now);

  validateDiscount(offerData.type, offerData.discount);

  if (offerData.targetType === "product") {
    const existingProductOffer = await findOverlappingProductOffer(offerData.product, startDate, endDate);

    if (existingProductOffer) {
      throw AppError.create("This product already has another Product Offer during this period.", 409, FAIL);
    }

    const categoryOffer = await findOverlappingCategoryOffer(target.category, startDate, endDate);

    if (categoryOffer) {
      const productDiscountAmount = calculateDiscountAmount(target.price, offerData);
      const categoryDiscountAmount = calculateDiscountAmount(target.price, categoryOffer);

      if (productDiscountAmount < categoryDiscountAmount) {
        throw AppError.create("Product Offer must be stronger than the existing Category Offer.", 409, FAIL);
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
  const existingOffer = await findOfferById(offerId);

  if (!existingOffer) {
    throw AppError.create("Existing offer not found.", 404, FAIL);
  }

  const now = new Date();

  const finalTargetType = offerData.targetType || existingOffer.targetType;
  const finalProduct = offerData.product !== undefined ? offerData.product : existingOffer.product;
  const finalCategory = offerData.category !== undefined ? offerData.category : existingOffer.category;

  if (finalTargetType === "product") {
    if (!finalProduct) {
      throw AppError.create("Product ID is required for product offers.", 400, FAIL);
    }

    offerData.product = finalProduct;
    offerData.category = null;
  } else if (finalTargetType === "category") {
    if (!finalCategory) {
      throw AppError.create("Category ID is required for category offers.", 400, FAIL);
    }

    offerData.category = finalCategory;
    offerData.product = null;
  } else {
    throw AppError.create("Invalid offer target type.", 400, FAIL);
  }

  offerData.targetType = finalTargetType;

  const finalSeason = offerData.season !== undefined ? offerData.season : existingOffer.season;
  const requestedStartDate = offerData.startDate ?? existingOffer.startDate;
  const requestedEndDate = offerData.endDate ?? existingOffer.endDate;

  const normalizedDates = await normalizeOfferDatesForSeason({
    seasonId: finalSeason,
    startDate: requestedStartDate,
    endDate: requestedEndDate,
  });

  const startDate = normalizedDates.startDate;
  const endDate = normalizedDates.endDate;

  const isFuture = startDate > now;
  const isExpired = endDate <= now;

  if (offerData.isActive === true && (isFuture || isExpired)) {
    throw AppError.create("Only a current offer can be activated.", 400, FAIL);
  }

  delete offerData.archivedBySeason;
  delete offerData.status;

  let finalIsActive = offerData.isActive !== undefined ? offerData.isActive : existingOffer.isActive;

  if (isFuture || isExpired) {
    finalIsActive = false;
  }

  offerData.startDate = startDate;
  offerData.endDate = endDate;
  offerData.isActive = finalIsActive;

  const updatedData = {
    ...existingOffer.toObject(),
    ...offerData,
    season: finalSeason || null,
  };

  validateDiscount(updatedData.type, updatedData.discount);

  let target;

  if (finalTargetType === "product") {
    target = await findProductById(updatedData.product);

    if (!target) {
      throw AppError.create("Product not found.", 404, FAIL);
    }

    const existingProductOffer = await findOverlappingProductOffer(updatedData.product, startDate, endDate, offerId);

    if (existingProductOffer) {
      throw AppError.create("This product already has another Product Offer during this period.", 409, FAIL);
    }

    const categoryOffer = await findOverlappingCategoryOffer(target.category, startDate, endDate, offerId);

    if (categoryOffer) {
      const productDiscountAmount = calculateDiscountAmount(target.price, updatedData);
      const categoryDiscountAmount = calculateDiscountAmount(target.price, categoryOffer);

      if (productDiscountAmount < categoryDiscountAmount) {
        throw AppError.create("Product Offer must be stronger than the existing Category Offer.", 409, FAIL);
      }
    }
  } else {
    const category = await findCategoryById(updatedData.category);

    if (!category) {
      throw AppError.create("Category not found.", 404, FAIL);
    }

    target = await findProductsByCategory(category._id);
  }

  const finalStatus = calculateOfferStatus(finalIsActive, startDate, endDate, existingOffer.archivedBySeason, now);
  offerData.status = finalStatus;

  const updatedOffer = await updateOfferRepository(offerId, offerData);

  if (updatedOffer && updatedOffer.targetType === "category") {
    await removeWeakerProductOffers(updatedOffer, target);
  }

  return updatedOffer;
};

const updateOfferStatus = async (offerId, isActive) => {
  const offer = await findOfferById(offerId);

  if (!offer) {
    throw AppError.create("Offer not found.", 404, FAIL);
  }

  if (!isCurrentPeriod(offer.startDate, offer.endDate)) {
    throw AppError.create("Only a current offer can be activated or deactivated.", 400, FAIL);
  }

  if (isActive && offer.archivedBySeason) {
    throw AppError.create("This offer belongs to an inactive season. Activate the season first.", 409, FAIL);
  }

  const status = calculateOfferStatus(isActive, offer.startDate, offer.endDate, offer.archivedBySeason);
  return updateOfferStatusRepository(offerId, isActive, status);
};

const deleteOffer = async (offerId) => {
  return deleteOfferRepository(offerId);
};

export {
  createOffer,
  getAllOffers,
  getOfferById,
  updateOffer,
  updateOfferStatus,
  deleteOffer,
};