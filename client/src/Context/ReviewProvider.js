"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getProductReviews, createReview, getCurrentUser } from "@/helper/fetchApi";

const ReviewContext = createContext();
const TOKEN_KEY = "nexmart-token";

export default function ReviewProvider({ children }) {
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const getToken = () => {
    if (typeof window === "undefined") {
      return null;
    }

    return localStorage.getItem(TOKEN_KEY);
  };

  const getReviews = async (productId, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);

    const result = await getProductReviews(productId, page, limit);

    if (result.success) {
      setReviews(result.reviews);
      setTotal(result.total);
    } else {
      setReviews([]);
      setTotal(0);
      setError(result.message);
    }

    setLoading(false);
    return result;
  };

  const loadCurrentUser = async () => {
    const token = getToken();

    if (!token) {
      setCurrentUser(null);
      return null;
    }

    const result = await getCurrentUser(token);

    if (result.success) {
      setCurrentUser(result.user);
      return result.user;
    }

    setCurrentUser(null);
    return null;
  };

  const submitReview = async (productId, rating, comment) => {
    const token = getToken();

    if (!token) {
      return {
        success: false,
        message: "You must login first",
      };
    }

    setSubmitting(true);

    const result = await createReview(productId, rating, comment, token);

    if (result.success) {
      setReviews((prevReviews) => [
        result.review,
        ...prevReviews,
      ]);

      setTotal((prevTotal) => prevTotal + 1);
    }

    setSubmitting(false);
    return result;
  };

  const hasUserReviewed = () => {
    if (!currentUser) {
      return false;
    }

    return reviews.some((review) => review.user?.email === currentUser.email);
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const value = {
    reviews,
    total,
    currentUser,

    loading,
    submitting,
    error,

    getReviews,
    submitReview,
    hasUserReviewed,
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReview() {
  return useContext(ReviewContext);
}