const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCategories(limit = 10, page = 1, token, { search = "", status = "" } = {}) {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (status) {
      params.set("status", status);
    }

    const response = await fetch(`${API_URL}/api/v1/categories?${params.toString()}`,
      {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      }
    );

    const json = await response.json();

    if (!response.ok || json.status !== "success") {
      throw new Error(json.message || "Failed to fetch categories");
    }

    const data = json.data || {};

    return {
      success: true,
      categories: data.categories || [],
      total: data.total ?? 0,
      page: data.page ?? page,
      limit: data.limit ?? limit,
      totalPages: data.totalPages ?? 0,
      stats: data.stats ?? null,
    };
  } catch (error) {
    console.error("Get categories error:", error);

    return {
      success: false,
      categories: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
      stats: null,
      message: error.message || "Failed to fetch categories",
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