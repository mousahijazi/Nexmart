import Season from "../model/Season.js";

const createSeason = async (seasonData) => {
    return await Season.create(seasonData);
};

const getSeasonById = async (seasonId) => {
    return await Season.findById(seasonId);
};

const getAllSeasons = async (filter = {}) => {
    return await Season.find(filter)
        .sort({ startDate: -1 });
};

const updateSeason = async (seasonId, updateData) => {
    return await Season.findByIdAndUpdate(
        seasonId,
        updateData,
        {
            new: true,
            runValidators: true,
        }
    );
};

const deleteSeason = async (seasonId) => {
    return await Season.findByIdAndDelete(seasonId);
};

export default {
    createSeason,
    getSeasonById,
    getAllSeasons,
    updateSeason,
    deleteSeason,
};