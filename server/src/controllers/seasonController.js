import { createSeason, getAllSeasons, getSeasonById, updateSeason, deleteSeason } from "../service/seasonService.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { FAIL, SUCCESS } from "../utils/httpStatusText.js";

const getAllSeasonsController = asyncHandler(
  async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const result = await getAllSeasons({ page: Number(page), limit: Number(limit) });

    res.status(200).json({
      status: SUCCESS,
      data: result,
    });
  }
);

const getSeasonByIdController = asyncHandler(
  async (req, res, next) => {
    const season = await getSeasonById(req.params.seasonId);

    if (!season) {
      return next(AppError.create("Season not found", 404, FAIL));
    }

    res.status(200).json({
      status: SUCCESS,
      data: {
        season,
      },
    });
  }
);

const createSeasonController = asyncHandler(
  async (req, res) => {
    const season = await createSeason(req.body);

    res.status(201).json({
      status: SUCCESS,
      data: {
        season,
      },
    });
  }
);

const updateSeasonController = asyncHandler(
  async (req, res, next) => {
    const season = await updateSeason(req.params.seasonId, req.body);

    if (!season) {
      return next(AppError.create("Season not found", 404, FAIL));
    }

    res.status(200).json({
      status: SUCCESS,
      data: {
        season,
      },
    });
  }
);

const deleteSeasonController = asyncHandler(
  async (req, res, next) => {
    const season = await deleteSeason(req.params.seasonId);

    if (!season) {
      return next(
        AppError.create("Season not found", 404, FAIL)
      );
    }

    res.status(200).json({
      status: SUCCESS,
      message: "Season deleted successfully",
      data: {
        season,
      },
    });
  }
);

export {
  createSeasonController,
  getAllSeasonsController,
  getSeasonByIdController,
  updateSeasonController,
  deleteSeasonController,
};