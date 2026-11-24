import { apiFetch, readApiJson, getApiError } from "../apiFetch";

export async function getProductReviews(productId, page = 1, limit = 10) {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    const response = await apiFetch(`/api/v1/reviews/products/${encodeURIComponent(productId)}/reviews?${params}`);

    const result = await readApiJson(response);
    const data = result.data || {};

    return {
      success: true,
      reviews: data.reviews || [],
      total: data.total || 0,
      page: data.page || page,
      limit: data.limit || limit,
      totalPages: data.totalPages || 0,
    };
  } catch (error) {
    console.error("getProductReviews:", error);

    return {
      success: false,
      reviews: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
      message: getApiError(error),
    };
  }
}

export async function createReview(productId, rating, comment) {
  try {
    const response = await apiFetch(
      `/api/v1/reviews/products/${encodeURIComponent(productId)}/reviews`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, comment }),
      }
    );

    const result = await readApiJson(response);

    return {
      success: true,
      review: result.data?.review,
    };
  } catch (error) {
    console.error("createReview:", error);

    return {
      success: false,
      message: getApiError(error, "Failed to create review"),
    };
  }
}