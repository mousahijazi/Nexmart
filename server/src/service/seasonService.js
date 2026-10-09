import { createSeason as createSeasonRepository, getAllSeasons as getAllSeasonsRepository, getSeasonById as getSeasonByIdRepository, updateSeason as updateSeasonRepository, deleteSeason as deleteSeasonRepository } from "../repositories/seasonRepository.js";

const createSeason = async (seasonData) => {
  return await createSeasonRepository(seasonData);
};

const getAllSeasons = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const result = await getAllSeasonsRepository({ skip, limit });

  return {
    seasons: result.seasons,
    total: result.totalSeasons,
    page,
    limit,
    skip,
    totalPages: Math.ceil(result.totalSeasons / limit),
  };
};

const getSeasonById = async (seasonId) => {
  return await getSeasonByIdRepository(seasonId);
};

const updateSeason = async (seasonId, seasonData) => {
  return await updateSeasonRepository(seasonId, seasonData);
};

const deleteSeason = async (seasonId) => {
  return await deleteSeasonRepository(seasonId);
};

export {
  createSeason,
  getAllSeasons,
  getSeasonById,
  updateSeason,
  deleteSeason,
};