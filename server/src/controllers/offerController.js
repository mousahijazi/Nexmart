import { createOffer, getAllOffers, getOfferById, updateOffer, deleteOffer } from "../service/offer/offerService.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { FAIL, SUCCESS } from "../utils/httpStatusText.js";

const getAllOffersController = asyncHandler(
  async (req, res) => {
    const {page = 1, limit = 10} = req.query;
    const offers = await getAllOffers({page: Number(page), limit: Number(limit)});

    res.status(200).json({
      status: SUCCESS,
      data: {
        offers,
      }, 
    });
  }
);

const getOfferByIdController = asyncHandler(
  async (req, res, next) => {
    const offer = await getOfferById(req.params.offerId);

    if (!offer) {
      return next(AppError.create("Offer not found", 404, FAIL));
    }

    res.status(200).json({
      status: SUCCESS,
      data: {
        offer,
      },
    });
  }
);

const createOfferController = asyncHandler(
  async (req, res) => {
    const offer = await createOffer(req.body);

    res.status(201).json({
      status: SUCCESS,
      data: {
        offer,
      },
    });
  }
);

const updateOfferController = asyncHandler(
  async (req, res, next) => {
    const offer = await updateOffer(req.params.offerId, req.body);

    if (!offer) {
      return next(AppError.create("Offer not found", 404, FAIL));
    }

    res.status(200).json({
      status: SUCCESS,
      data: {
        offer,
      },
    });
  }
);

const deleteOfferController = asyncHandler(
  async (req, res, next) => {
    const offer = await deleteOffer(req.params.offerId);

    if (!offer) {
      return next(
        AppError.create("Offer not found", 404, FAIL)
      );
    }

    res.status(200).json({
      status: SUCCESS,
      message: "Offer deleted successfully",
      data: {
        offer,
      },
    });
  }
);

export {
  createOfferController,
  getAllOffersController,
  getOfferByIdController,
  updateOfferController,
  deleteOfferController,
};