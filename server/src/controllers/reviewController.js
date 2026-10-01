import asyncHandler from "../middlewares/asyncHandler.js";
import { createReview, getProductReviews, getAllReviews, updateReviewStatus } from "../service/reviewService.js";
import { SUCCESS } from "../utils/httpStatusText.js";

const createReviewController = asyncHandler(
  async (req, res) => {
    const { rating, comment } = req.body;
    const { productId } = req.params;
    const userId = req.currentUser.id;

    const review = await createReview(productId, userId, rating, comment);

    res.status(201).json({
      status: SUCCESS,
      data: {
        review,
      },
    });
  }
);

const getProductReviewsController = asyncHandler(
    async (req, res) => {
      const { productId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const result = await getProductReviews(productId, Number(page), Number(limit));

      res.status(200).json({
        status: SUCCESS,
        results: result.reviews.length,
        data: result,
      });
    }
  );

const getAllReviewsController = asyncHandler(
    async (req, res) => {
      const { page = 1, limit = 10, product } = req.query;

      const result = await getAllReviews({ page: Number(page), limit: Number(limit), product });

      res.status(200).json({
        status: SUCCESS,
        results: result.reviews.length,
        data: result,
      });
    }
  );

const updateReviewStatusController = asyncHandler(
    async (req, res) => {
      const { reviewId } = req.params;
      const { isActive } = req.body;

      const review = await updateReviewStatus(reviewId, isActive);

      res.status(200).json({
        status: SUCCESS,
        message: isActive ? "Review restored successfully" : "Review archived successfully",
        data: {
          review,
        },
      });
    }
  );

export {
  createReviewController,
  getProductReviewsController,
  getAllReviewsController,
  updateReviewStatusController,
};