import Review from "../model/Review.js";
import Product from "../model/Product.js";
import AppError from "../utils/AppError.js";
import { FAIL } from "../utils/httpStatusText.js";
import mongoose from "mongoose";

const getProductByIdForReview = async (productId) => {
  return await Product.findOne({
    _id: productId,
    isActive: true,
    archivedByCategory: false,
    archivedByBrand: false,
  });
};

// todo
const updateProductRating = async (productId) => {
  const result = await Review.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
        isActive: true,
      },
    },
    {
      $group: {
        _id: "$product",
        averageRating: {
          $avg: "$rating",
        },
        ratingsCount: {
          $sum: 1,
        },
      },
    },
  ]);

  if (result.length === 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      ratingsCount: 0,
    });

    return;
  }

  await Product.findByIdAndUpdate(productId, {
    rating: Number(result[0].averageRating.toFixed(1)),
    ratingsCount: result[0].ratingsCount,
  });
};

const createReview = async (productId, userId, rating, comment) => {
  const product = await getProductByIdForReview(productId);

  if (!product) {
    throw AppError.create("Product not found", 404, FAIL);
  }

  const existingReview = await Review.findOne({user: userId, product: productId});

  if (existingReview) {
    throw AppError.create("You have already reviewed this product", 409, FAIL);
  }

  const review = await Review.create({
    user: userId,
    product: productId,
    rating,
    comment,
  });

  await updateProductRating(productId);

  return await Review.findById(review._id)
    .populate("user", "firstName lastName avatar")
    .populate("product", "title");
};

const getProductReviews = async (productId, page = 1, limit = 10) => {
  const product = await getProductByIdForReview(productId);

  if (!product) {
    throw AppError.create("Product not found", 404, FAIL);
  }

  const skip = (page - 1) * limit;

  const filter = {
    product: productId,
    isActive: true,
  };

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate("user", "firstName lastName avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Review.countDocuments(filter),
  ]);

  return {
    reviews,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getAllReviews = async ({ page = 1, limit = 10, product }) => {
  const skip = (page - 1) * limit;
  const filter = {};

  if (product) {
    filter.product = product;
  }

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate("user", "firstName lastName email avatar")
      .populate("product", "title mainImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Review.countDocuments(filter),
  ]);

  return {
    reviews,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const updateReviewStatus = async (reviewId, isActive) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw AppError.create("Review not found", 404, FAIL);
  }

  review.isActive = isActive;
  await review.save();

  await updateProductRating(review.product);

  return review;
};

export {
  createReview,
  getProductReviews,
  getAllReviews,
  updateReviewStatus,
};