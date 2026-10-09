import Offer from "../../model/Offer.js";
import Product from "../../model/Product.js";
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
    const products = await Product.find({ category: offerData.category?._id }).select("_id price");

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
      updatedData.startDate,
      updatedData.endDate,
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