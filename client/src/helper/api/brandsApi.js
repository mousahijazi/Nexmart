import { apiFetch, readApiJson, getApiError } from "../apiFetch";

export async function getBrand(limit, page = 1, filters = {}) {
  try {
    const params = new URLSearchParams();

    if (limit) {
      params.set("limit", String(limit));
      params.set("page", String(page));
    }

    const search = filters.search?.trim();

    if (search) params.set("search", search);

    if (filters.status && filters.status !== "all") {
      params.set("status", filters.status);
    }

    const query = params.toString();

    const response = await apiFetch(`/api/v1/brands${query ? `?${query}` : ""}`);

    const result = await readApiJson(response);
    const data = result.data || {};

    return {
      brands: data.brands || [],
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || limit || 10,
      totalPages: data.totalPages || 0,
    };
  } catch (error) {
    console.error("getBrand:", error);

    return {
      brands: [],
      total: 0,
      page: 1,
      limit: limit || 10,
      totalPages: 0,
    };
  }
}

export async function createBrand(formData) {
  try {
    const response = await apiFetch("/api/v1/brands", {
      method: "POST",
      body: formData,
    });

    const result = await readApiJson(response);

    return {
      success: true,
      brand: result.data?.brand,
    };
  } catch (error) {
    return {
      success: false,
      message: getApiError(error, "Failed to create brand"),
    };
  }
}

export async function updateBrand(brandId, formData) {
  try {
    const response = await apiFetch(
      `/api/v1/brands/${encodeURIComponent(brandId)}`,
      {
        method: "PATCH",
        body: formData,
      }
    );

    const result = await readApiJson(response);

    return {
      success: true,
      brand: result.data?.brand,
    };
  } catch (error) {
    return {
      success: false,
      message: getApiError(error, "Failed to update brand"),
    };
  }
}

export async function updateBrandStatus(brandId, isActive) {
  try {
    const response = await apiFetch(
      `/api/v1/brands/${encodeURIComponent(brandId)}/status`,
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
      brand: result.data?.brand,
    };
  } catch (error) {
    console.error("updateBrandStatus:", error);

    return {
      success: false,
      message: getApiError(error, "Failed to update brand status"),
    };
  }
}