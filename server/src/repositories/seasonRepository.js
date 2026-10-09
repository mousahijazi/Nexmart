import Season from "../model/Season.js";

const createSeason = async (seasonData) => {
  return await Season.create(seasonData);
};

const getAllSeasons = async ({ skip, limit }) => {
  const seasons = await Season.find({}, { __v: false })
    .sort({ createdAt: -1 }).skip(skip).limit(limit);

  const totalSeasons = await Season.countDocuments();

  return {
    seasons,
    totalSeasons,
  };
};

const getSeasonById = async (seasonId) => {
  return await Season.findById(seasonId, { __v: false });
};

const updateSeason = async (seasonId, seasonData) => {
  return await Season.findByIdAndUpdate(
    seasonId,
    seasonData,
    {
      returnDocument: "after",
      runValidators: true,
    }
  );
};

const deleteSeason = async (seasonId) => {
  return await Season.findByIdAndDelete(seasonId);
};

export {
  createSeason,
  getAllSeasons,
  getSeasonById,
  updateSeason,
  deleteSeason,
};