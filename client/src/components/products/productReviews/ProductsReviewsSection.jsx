"use client";
import { useEffect, useState } from "react";
import { useReview } from "@/Context/ReviewProvider";
import { ProductsReviews, Rating } from "@/index";

export default function ProductsReviewsSection({ product }) {
  const { reviews, total, currentUser, loading, submitting, error, getReviews, submitReview, hasUserReviewed } = useReview();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitError, setSubmitError] = useState("");

  const calculatedRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length
      : 0;

  useEffect(() => {
    if (!product?._id) {
      return;
    }

    getReviews(product._id);
  }, [product?._id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitError("");

    if (!rating) {
      setSubmitError("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      setSubmitError("Please write your review");
      return;
    }

    const result = await submitReview(
      product._id,
      rating,
      comment.trim()
    );

    if (!result.success) {
      setSubmitError(result.message || "Failed to submit review");

      return;
    }

    setRating(0);
    setComment("");
  };

  const userAlreadyReviewed = hasUserReviewed();

  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col">
        <div className="flex w-full justify-center">
          <Rating rating={ reviews.length > 0 ? calculatedRating : product?.rating || 0} />
        </div>

        <div className="w-full">
          <ProductsReviews
            reviews={reviews}
            loading={loading}
            error={error}
            total={total}
            currentUser={currentUser}
            userAlreadyReviewed={userAlreadyReviewed}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            onSubmit={handleSubmit}
            submitError={submitError}
            submitting={submitting}
          />
        </div>
      </div>
    </div>
  );
}