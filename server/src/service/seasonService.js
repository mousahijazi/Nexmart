import seasonRepository from "../repositories/seasonRepository.js";
import AppError from "../utils/AppError.js";
import { ERROR } from "../utils/httpStatusText.js";

const createSeason = async (seasonData) => {
    return await seasonRepository.createSeason(seasonData);
};

const getSeasonById = async (seasonId) => {
    const season = await seasonRepository.getSeasonById(seasonId);

    if (!season) {
        throw AppError.create("Season not found", 404, ERROR);
    }

    return season;
};

const getAllSeasons = async (filter = {}) => {
    return await seasonRepository.getAllSeasons(filter);
};

const updateSeason = async (seasonId, updateData) => {
    const season = await seasonRepository.getSeasonById(seasonId);

    if (!season) {
        throw AppError.create("Season not found", 404, ERROR);
    }

    return await seasonRepository.updateSeason(seasonId, updateData);
};

const deleteSeason = async (seasonId) => {
    const season = await seasonRepository.getSeasonById(seasonId);

    if (!season) {
        throw AppError.create("Season not found", 404, ERROR);
    }

    return await seasonRepository.deleteSeason(seasonId);
};

const updateSeasonStatus = async (seasonId, isActive) => {
    const season = await seasonRepository.getSeasonById(seasonId);

    if (!season) {
        throw AppError.create("Season not found", 404, ERROR);
    }

    return await seasonRepository.updateSeason(seasonId, { isActive });
};


export default {
    createSeason,
    getSeasonById,
    getAllSeasons,
    updateSeason,
    deleteSeason,
    updateSeasonStatus,
};