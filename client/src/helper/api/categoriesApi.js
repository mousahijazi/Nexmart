const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCategories(limit = 10, page = 1, token = null) {
  try {
    const url = `${API_URL}/api/v1/categories?page=${page}&limit=${limit}`;
    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      headers,
      cache: "no-store" 
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    return {
      categories: json.data?.categories || [],
      total: json.data?.total || 0,
      page: json.data?.page || page,
      limit: json.data?.limit || limit,
      totalPages: json.data?.totalPages || 0,
    };
  } catch (error) {
    console.error("getCategories:", error);

    return {
      categories: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }
}

export async function createCategory(formData, token) {
  try {
    const res = await fetch(`${API_URL}/api/v1/categories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const json = await res.json();

    if (!res.ok || json.status !== "success") {
      return { success: false, message: json.message || "Failed to create category" };
    }

    return { success: true, category: json.data?.category };
  } catch (error) {
    return { success: false, message: "Something went wrong" };
  }
}

export const updateCategory = async (categoryId, formData, token) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/categories/${categoryId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to update category",
      };
    }

    return {
      success: true,
      category: result.data.category,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

export async function updateCategoryStatus(categoryId, isActive, token) {
  try {
    const res = await fetch(`${API_URL}/api/v1/categories/${categoryId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive }),
        cache: "no-store",
      }
    );

    const result = await res.json();

    if (!res.ok || result.status !== "success") {
      return {
        success: false,
        message: result.message || "Failed to update category status",
      };
    }

    return {
      success: true,
      category: result.data?.category,
    };
  } catch (error) {
    console.error("updateCategoryStatus:", error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}