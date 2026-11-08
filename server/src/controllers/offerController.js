import { createOffer, getAllOffers, getOfferById, updateOffer, updateOfferStatus, deleteOffer } from "../service/offer/offerService.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { FAIL, SUCCESS } from "../utils/httpStatusText.js";

const parsePagination = (query) => {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);

  if (!Number.isInteger(page) || !Number.isInteger(limit) || page < 1 || limit < 1 || limit > 100) {
    throw AppError.create("Page must be a positive integer and limit must be between 1 and 100.", 400, FAIL);
  }

  return { page, limit };
};

const getAllOffersController = asyncHandler(async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const { search, status, target, season } = req.query;

  const allowedStatuses = [
    "Active",
    "Scheduled",
    "Expired",
    "Inactive",
  ];

  const allowedTargets = ["product", "category"];

  if (status && !allowedStatuses.includes(status)) {
    throw AppError.create("Invalid offer status filter.", 400, FAIL);
  }

  if (target && !allowedTargets.includes(target)) {
    throw AppError.create("Invalid offer target filter.", 400, FAIL);
  }

  const result = await getAllOffers({ page, limit, search, status, target, season }, req.userRole);

  res.status(200).json({
    status: SUCCESS,
    data: result,
  });
});

const getOfferByIdController = asyncHandler(
  async (req, res, next) => {
    const offer = await getOfferById(req.params.offerId, req.userRole);

    if (!offer) {
      return next(AppError.create("Offer not found.", 404, FAIL));
    }

    res.status(200).json({
      status: SUCCESS,
      data: { offer },
    });
  }
);

const createOfferController = asyncHandler(async (req, res) => {
  const offer = await createOffer(req.body);

  res.status(201).json({
    status: SUCCESS,
    data: { offer },
  });
});

const updateOfferController = asyncHandler(
  async (req, res, next) => {
    const offer = await updateOffer(req.params.offerId, req.body);

    if (!offer) {
      return next(AppError.create("Offer not found.", 404, FAIL));
    }

    res.status(200).json({
      status: SUCCESS,
      data: { offer },
    });
  }
);

const updateOfferStatusController = asyncHandler(
  async (req, res) => {
    const offer = await updateOfferStatus(req.params.offerId, req.body.isActive);

    res.status(200).json({
      status: SUCCESS,
      data: { offer },
    });
  }
);

const deleteOfferController = asyncHandler(
  async (req, res, next) => {
    const offer = await deleteOffer(req.params.offerId);

    if (!offer) {
      return next(AppError.create("Offer not found.", 404, FAIL));
    }

    res.status(200).json({
      status: SUCCESS,
      message: "Offer deleted successfully.",
      data: { offer },
    });
  }
);

export {
  createOfferController,
  getAllOffersController,
  getOfferByIdController,
  updateOfferController,
  updateOfferStatusController,
  deleteOfferController,
};