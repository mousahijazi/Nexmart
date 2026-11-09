import {
  createSeason as createSeasonRepository,
  getAllSeasons as getAllSeasonsRepository,
  getSeasonById as getSeasonByIdRepository,
  updateSeason as updateSeasonRepository,
  deleteSeason as deleteSeasonRepository,
} from "../repositories/seasonRepository.js";
import Season from "../model/Season.js";
import Offer from "../model/Offer.js";
import Product from "../model/Product.js";
import { userRoles } from "../utils/userRoles.js";
import AppError from "../utils/AppError.js";
import { FAIL } from "../utils/httpStatusText.js";

const escapeRegex = (value = "") => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const isValidDate = (date) => {
  return date instanceof Date && Number.isFinite(date.getTime());
};

const calculateSeasonStatus = (isActive, startDate, endDate) => {
  const now = new Date();

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now >= end) {
    return "Expired";
  }

  if (now < start) {
    return "Scheduled";
  }

  if (!isActive) {
    return "Inactive";
  }

  return "Active";
};

const validateSeasonDates = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (!isValidDate(start) || !isValidDate(end)) {
    throw AppError.create("Invalid season start date or end date.", 400, FAIL);
  }

  if (end <= start) {
    throw AppError.create("End date must be after start date.", 400, FAIL);
  }

  return {
    start,
    end,
  };
};

const synchronizeSeasonOffers = async (seasonId, isActive) => {
  await Offer.updateMany(
    { season: seasonId },
    {
      $set: { archivedBySeason: !isActive },
    }
  );
};

const getValidSeasonIds = async () => {
  const activeOffers = await Offer.find({
    isActive: true,
    archivedBySeason: { $ne: true },
    season: { $ne: null },
  })
    .select("season targetType product category")
    .populate([
      { path: "product", select: "isActive archivedByCategory archivedByBrand" },
      { path: "category", select: "_id" },
    ]).lean();

  const validSeasonIds = new Set();
  const categoryIds = new Set();

  for (const offer of activeOffers) {
    if (!offer.season) continue;

    const seasonId = offer.season.toString();

    if (offer.targetType === "product" && offer.product && offer.product.isActive && offer.product.archivedByCategory !== true && offer.product.archivedByBrand !== true) {
      validSeasonIds.add(seasonId);
    }

    if (offer.targetType === "category" && offer.category?._id) {
      categoryIds.add(offer.category._id.toString());
    }
  }

  if (categoryIds.size > 0) {
    const validCategories = await Product.distinct("category", {
      category: { $in: Array.from(categoryIds) },
      isActive: true,
      archivedByCategory: { $ne: true },
      archivedByBrand: { $ne: true },
    });

    const validCategoryIds = new Set(validCategories.map((id) => id.toString()));

    for (const offer of activeOffers) {
      if (offer.targetType === "category" && offer.category?._id && validCategoryIds.has(offer.category._id.toString())) {
        validSeasonIds.add(offer.season.toString());
      }
    }
  }

  return Array.from(validSeasonIds);
};

const getAllSeasons = async ({ page = 1, limit = 10, search = "", status = "" }, userRole) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));

  const skip = (safePage - 1) * safeLimit;

  const filter = {};

  const normalizedSearch = String(search).trim();

  if (normalizedSearch) {
    const searchRegex = new RegExp(escapeRegex(normalizedSearch), "i");

    filter.$or = [
      { "name.ar": searchRegex },
      { "name.en": searchRegex },
    ];
  }

  const normalizedStatus = String(status).trim();

  if (userRole === userRoles.ADMIN) {
    if (normalizedStatus && normalizedStatus !== "All Statuses") {
      filter.status = normalizedStatus;
    }
  } else {
    filter.isActive = true;
    filter.status = "Active";

    const now = new Date();
    
    filter.startDate = { $lte: now };
    filter.endDate = { $gt: now };

    const validSeasonIds = await getValidSeasonIds();

    filter._id = { $in: validSeasonIds };
  }

  const result = await getAllSeasonsRepository({ skip, limit: safeLimit, filter });

  return {
    seasons: result.seasons,
    total: result.totalSeasons,
    page: safePage,
    limit: safeLimit,
    skip,
    totalPages: Math.ceil(result.totalSeasons / safeLimit),
  };
};

const getSeasonById = async (seasonId, userRole) => {
  const season = await getSeasonByIdRepository(seasonId);

  if (!season) {
    return null;
  }

  if (userRole !== userRoles.ADMIN) {
    if (!season.isActive || season.status !== "Active") {
      return null;
    }

    const validSeasonIds = await getValidSeasonIds();
    const isVisible = validSeasonIds.includes(season._id.toString());

    if (!isVisible) {
      return null;
    }
  }

  return season;
};

const createSeason = async (seasonData) => {
  const now = new Date();

  const { start, end } = validateSeasonDates(seasonData.startDate, seasonData.endDate);

  if (end <= now) {
    throw AppError.create("Cannot create a season with an end date in the past.", 400, FAIL);
  }

  if (start > now) {
    seasonData.isActive = false;
  } else {
    seasonData.isActive = seasonData.isActive !== undefined ? seasonData.isActive : true;
  }

  seasonData.status = calculateSeasonStatus(seasonData.isActive, start, end);

  return await createSeasonRepository(seasonData);
};

const updateSeason = async (seasonId, seasonData) => {
  const existingSeason = await Season.findById(seasonId);

  if (!existingSeason) {
    return null;
  }

  const now = new Date();

  const requestedStartDate = seasonData.startDate ? new Date(seasonData.startDate) : existingSeason.startDate;
  const requestedEndDate = seasonData.endDate ? new Date(seasonData.endDate) : existingSeason.endDate;

  const { start, end } = validateSeasonDates(requestedStartDate, requestedEndDate);

  const isFuture = start > now;
  const isExpired = end <= now;

  let finalIsActive = existingSeason.isActive;

  if (existingSeason.status === "Scheduled" && !isFuture && !isExpired) {
    finalIsActive = true;
  }

  if (seasonData.isActive !== undefined) {
    finalIsActive = seasonData.isActive;
  }

  if (isFuture) {
    if (seasonData.isActive === true) {
      throw AppError.create("Cannot activate a future season before its start date.", 400, FAIL);
    }

    finalIsActive = false;
  }

  if (isExpired) {
    if (seasonData.isActive === true) {
      throw AppError.create("Cannot activate an expired season.", 400, FAIL);
    }

    finalIsActive = false;
  }

  seasonData.isActive = finalIsActive;
  seasonData.status = calculateSeasonStatus(finalIsActive, start, end);

  const updatedSeason = await updateSeasonRepository(seasonId, seasonData);

  if (existingSeason.isActive !== finalIsActive) {
    await synchronizeSeasonOffers(seasonId, finalIsActive);
  }

  return updatedSeason;
};

const updateSeasonStatus = async (seasonId, isActive) => {
  const season = await Season.findById(seasonId);

  if (!season) {
    throw AppError.create("Season not found", 404, FAIL);
  }

  const now = new Date();

  const start = new Date(season.startDate);
  const end = new Date(season.endDate);

  if (now < start || now >= end) {
    throw AppError.create("Only a current season can be activated or deactivated.", 400, FAIL);
  }

  if (typeof isActive !== "boolean") {
    throw AppError.create("isActive must be a boolean value.", 400, FAIL);
  }

  season.isActive = isActive;
  season.status = calculateSeasonStatus(isActive, start, end);
  await season.save();

  await synchronizeSeasonOffers(seasonId, isActive);

  return season;
};

const deleteSeason = async (seasonId) => {
  const season = await Season.findById(seasonId);

  if (!season) {
    return null;
  }

  await Offer.updateMany(
    { season: seasonId },
    {
      $set: {
        season: null,
        archivedBySeason: false,
      },
    }
  );

  return await deleteSeasonRepository(seasonId);
};

export {
  createSeason,
  getAllSeasons,
  getSeasonById,
  updateSeason,
  updateSeasonStatus,
  deleteSeason,
};