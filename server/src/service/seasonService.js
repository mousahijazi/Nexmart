import { createSeason as createSeasonRepository, getAllSeasons as getAllSeasonsRepository, getSeasonById as getSeasonByIdRepository, updateSeason as updateSeasonRepository, deleteSeason as deleteSeasonRepository } from "../repositories/seasonRepository.js";
import Season from "../model/Season.js";
import Offer from "../model/Offer.js";
import { userRoles } from "../utils/userRoles.js";
import { isCurrentPeriod } from "../utils/periodUtils.js";
import AppError from "../utils/AppError.js";
import { FAIL } from "../utils/httpStatusText.js";

const calculateSeasonStatus = (isActive, startDate, endDate) => {
  if (!isActive) return "Inactive";

  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return "Scheduled";
  if (now >= start && now <= end) return "Active";
  return "Expired";
};

const getAllSeasons = async ({ page = 1, limit = 10 }, userRole) => {
  const skip = (page - 1) * limit;
  const filter = {};

  if (userRole !== userRoles.ADMIN) {
    filter.isActive = true;
  }

  const result = await getAllSeasonsRepository({ skip, limit, filter });

  return {
    seasons: result.seasons,
    total: result.totalSeasons,
    page,
    limit,
    skip,
    totalPages: Math.ceil(result.totalSeasons / limit),
  };
};

const getSeasonById = async (seasonId, userRole) => {
  const season = await getSeasonByIdRepository(seasonId);

  if (!season || (userRole !== userRoles.ADMIN && !season.isActive)) {
    return null;
  }

  return season;
};

const createSeason = async (seasonData) => {
  const now = new Date();
  const start = new Date(seasonData.startDate);
  const end = new Date(seasonData.endDate);

  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime())) {
    throw AppError.create("Invalid season start date or end date.", 400, FAIL);
  }

  if (end <= now) {
    throw AppError.create("Cannot create a season with an end date in the past.", 400, FAIL);
  }

  if (end <= start) {
    throw AppError.create("End date must be after start date.", 400, FAIL);
  }

  if (start > now) {
    seasonData.isActive = false;
  } else {
    seasonData.isActive = seasonData.isActive !== undefined ? seasonData.isActive : true;
  }

  seasonData.status = calculateSeasonStatus(seasonData.isActive, seasonData.startDate, seasonData.endDate);

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

  if (!Number.isFinite(requestedStartDate.getTime()) || !Number.isFinite(requestedEndDate.getTime())) {
    throw AppError.create("Invalid season start date or end date.", 400, FAIL);
  }

  if (requestedEndDate <= requestedStartDate) {
    throw AppError.create("End date must be after start date.", 400, FAIL);
  }

  const isExpired = requestedEndDate <= now;
  const isFuture = requestedStartDate > now;

  if (seasonData.isActive !== undefined) {
    if (isExpired) {
      throw AppError.create("Cannot update a season to an end date in the past.", 400, FAIL);
    }
    if (isFuture && seasonData.isActive === true) {
      throw AppError.create("Cannot activate a future season before its start date.", 400, FAIL);
    }
  }

  if (isFuture || isExpired) {
    if (requestedStartDate <= now && requestedEndDate > now) {
      seasonData.isActive = true;
    } else {
      seasonData.isActive = false;
    }
  }

  const finalIsActive = seasonData.isActive !== undefined ? seasonData.isActive : existingSeason.isActive;

  seasonData.status = calculateSeasonStatus(finalIsActive, requestedStartDate, requestedEndDate);

  return await updateSeasonRepository(seasonId, seasonData);
};

const updateSeasonStatus = async (seasonId, isActive) => {
  const season = await Season.findById(seasonId);

  if (!season) {
    throw AppError.create("Season not found", 404, FAIL);
  }

  if (!isCurrentPeriod(season.startDate, season.endDate)) {
    throw AppError.create("Only a current season can be activated or deactivated.", 400, FAIL);
  }

  season.isActive = isActive;
  season.status = calculateSeasonStatus(isActive, season.startDate, season.endDate);
  await season.save();

  await Offer.updateMany(
    { season: seasonId },
    { $set: { archivedBySeason: !isActive } }
  );

  return season;
};

const deleteSeason = async (seasonId) => {
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