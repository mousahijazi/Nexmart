import { apiFetch, readApiJson, getApiError } from "../apiFetch";

export async function getCategories(limit = 10, page = 1, { search = "", status = "" } = {}) {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (search.trim()) params.set("search", search.trim());
    if (status) params.set("status", status);

    const response = await apiFetch(`/api/v1/categories?${params.toString()}`);

    const result = await readApiJson(response);
    const data = result.data || {};

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
    console.error("getCategories:", error);

    return {
      success: false,
      categories: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
      stats: null,
      message: getApiError(error, "Failed to fetch categories"),
    };
  }
}

export async function createCategory(formData) {
  try {
    const response = await apiFetch("/api/v1/categories", {
      method: "POST",
      body: formData,
    });

    const result = await readApiJson(response);

    return {
      success: true,
      category: result.data?.category,
    };
  } catch (error) {
    return {
      success: false,
      message: getApiError(error, "Failed to create category"),
    };
  }
}

export async function updateCategory(categoryId, formData) {
  try {
    const response = await apiFetch(
      `/api/v1/categories/${encodeURIComponent(categoryId)}`,
      {
        method: "PATCH",
        body: formData,
      }
    );

    const result = await readApiJson(response);

    return {
      success: true,
      category: result.data?.category,
    };
  } catch (error) {
    return {
      success: false,
      message: getApiError(error, "Failed to update category"),
    };
  }
}

export async function updateCategoryStatus(categoryId, isActive) {
  try {
    const response = await apiFetch(
      `/api/v1/categories/${encodeURIComponent(categoryId)}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive }),
      }
    );

    const result = await readApiJson(response);

    return {
      success: true,
      category: result.data?.category,
    };
  } catch (error) {
    console.error("updateCategoryStatus:", error);

    return {
      success: false,
      message: getApiError(error, "Failed to update category status"),
    };
  }
}