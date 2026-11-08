import Offer from "../model/Offer.js";
import Product from "../model/Product.js";
import Category from "../model/Category.js";
import Season from "../model/Season.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildStatusFilter = (status, now = new Date()) => {
  const currentPeriod = {
    startDate: { $lte: now },
    endDate: { $gt: now },
  };

  switch (status) {
    case "Active":
      return {
        archivedBySeason: { $ne: true },
        isActive: true,
        ...currentPeriod,
      };

    case "Scheduled":
      return {
        archivedBySeason: { $ne: true },
        startDate: { $gt: now },
      };

    case "Expired":
      return {
        archivedBySeason: { $ne: true },
        endDate: { $lte: now },
      };

    case "Inactive":
      return {
        $or: [
          { archivedBySeason: true },
          {
            ...currentPeriod,
            isActive: false,
            archivedBySeason: { $ne: true },
          },
        ],
      };

    default:
      return {};
  }
};

const buildOfferFilter = ({ search, status, target, season, now = new Date() }) => {
  const conditions = [];

  if (search?.trim()) {
    const regex = new RegExp(escapeRegex(search.trim()), "i");

    conditions.push({
      $or: [
        { "name.ar": regex },
        { "name.en": regex },
      ],
    });
  }

  if (target && ["product", "category"].includes(target)) {
    conditions.push({ targetType: target });
  }

  if (season) {
    conditions.push({ season });
  }

  const statusFilter = buildStatusFilter(status, now);

  if (Object.keys(statusFilter).length) {
    conditions.push(statusFilter);
  }

  if (!conditions.length) return {};

  return { $and: conditions };
};

const getPublicTargetIds = async () => {
  const validProductFilter = {
    isActive: true,
    archivedByCategory: { $ne: true },
    archivedByBrand: { $ne: true },
  };

  const [productIds, categoryResults] = await Promise.all([
    Product.distinct("_id", validProductFilter),

    Product.aggregate([
      {
        $match: validProductFilter,
      },
      {
        $group: {
          _id: "$category",
        },
      },
      {
        $match: {
          _id: { $type: "objectId" },
        },
      },
    ]),
  ]);

  const categoryIds = categoryResults.map((item) => item._id);

  return {
    productIds,
    categoryIds,
  };
};

const createOffer = async (offerData) => {
  return Offer.create(offerData);
};

const getAllOffers = async ({ page = 1, limit = 10, search, status, target, season, isActive, isAdmin = false }) => {
  const now = new Date();
  const conditions = [];
  
  const regularFilter = buildOfferFilter({ search, status, target, season, now, isActive });

  if (Object.keys(regularFilter).length) {
    conditions.push(regularFilter);
  }

  if (!isAdmin) {
    const { productIds, categoryIds } = await getPublicTargetIds();

    conditions.push({
      isActive: true,
      archivedBySeason: { $ne: true },
      startDate: { $lte: now },
      endDate: { $gt: now },
      $or: [
        { targetType: "product", product: { $in: productIds } },
        { targetType: "category", category: { $in: categoryIds } },
      ],
    });
  }

  const filter = conditions.length ? { $and: conditions } : {};
  const skip = (page - 1) * limit;

  const [offers, total] = await Promise.all([
    Offer.find(filter, { __v: false })
      .populate("product").populate("category").populate("season").sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limit).lean(),

    Offer.countDocuments(filter),
  ]);

  return {
    offers,
    total,
    page,
    limit,
    skip,
    totalPages: Math.ceil(total / limit),
  };
};

const getOfferById = async (offerId) => {
  return Offer.findById(offerId, { __v: false })
    .populate("product").populate("category").populate("season");
};

const findOfferById = async (offerId) => {
  return Offer.findById(offerId);
};

const findProductById = async (productId) => {
  return Product.findById(productId);
};

const findCategoryById = async (categoryId) => {
  return Category.findById(categoryId);
};

const findSeasonById = async (seasonId) => {
  return Season.findById(seasonId);
};

const findProductsByCategory = async (categoryId) => {
  return Product.find({ category: categoryId })
    .select("_id price category isActive archivedByCategory archivedByBrand").lean();
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

  return Offer.findOne(filter);
};

const findOverlappingCategoryOffer = async (categoryId, startDate, endDate, excludedOfferId = null) => {
  const filter = {
    targetType: "category",
    category: categoryId,
    archivedBySeason: { $ne: true },
    startDate: { $lt: new Date(endDate) },
    endDate: { $gt: new Date(startDate) },
  };

  if (excludedOfferId) {
    filter._id = { $ne: excludedOfferId };
  }

  return Offer.findOne(filter);
};

const findOverlappingProductOffersForProducts = async (productIds, startDate, endDate) => {
  if (!productIds.length) return [];

  return Offer.find({
    targetType: "product",
    product: { $in: productIds },
    archivedBySeason: { $ne: true },
    isActive: true,
    startDate: { $lt: new Date(endDate) },
    endDate: { $gt: new Date(startDate) },
  }).lean();
};

const deleteOffersByIds = async (offerIds) => {
  if (!offerIds.length) return { deletedCount: 0 };

  return Offer.deleteMany({ _id: { $in: offerIds } });
};

const findProductsByIds = async (productIds) => {
  if (!productIds.length) return [];

  return Product.find({ _id: { $in: productIds } })
    .select("_id price").lean();
};

const updateOffer = async (offerId, offerData) => {
  return Offer.findByIdAndUpdate(
    offerId,
    { $set: offerData },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  ).populate("product").populate("category").populate("season");
};

const updateOfferStatus = async (offerId, isActive, status) => {
  return Offer.findByIdAndUpdate(
    offerId,
    { $set: { isActive, status } },
    {
      new: true,
      runValidators: true,
    }
  ).populate("product").populate("category").populate("season");
};

const deleteOffer = async (offerId) => {
  return Offer.findByIdAndDelete(offerId);
};

export {
  createOffer,
  getAllOffers,
  getOfferById,
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
  updateOffer,
  updateOfferStatus,
  deleteOffer,
};