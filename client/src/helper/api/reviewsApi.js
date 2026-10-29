const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProductReviews(productId, page = 1, limit = 10) {
  try {
    const response = await fetch(`${API_URL}/api/v1/reviews/products/${productId}/reviews?page=${page}&limit=${limit}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      reviews: result.data?.reviews || [],
      total: result.data?.total || 0,
      page: result.data?.page || page,
      limit: result.data?.limit || limit,
      totalPages: result.data?.totalPages || 0,
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
      message: "Something went wrong",
    };
  }
}

export async function createReview(productId, rating, comment, token) {
  try {
    const response = await fetch(`${API_URL}/api/v1/reviews/products/${productId}/reviews`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating,
          comment,
        }),
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok || result.status !== "success") {
      return {
        success: false,
        message: result.message || "Failed to create review",
      };
    }

    return {
      success: true,
      review: result.data?.review,
    };
  } catch (error) {
    console.error("createReview:", error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}