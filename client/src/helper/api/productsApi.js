import { apiFetch, readApiJson, getApiError } from "../apiFetch";

export async function getProducts(limit = 20, skip = 0, filters = {}) {
  try {
    const page = Math.floor(skip / limit) + 1;

    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (filters.search?.trim()) {
      params.set("search", filters.search.trim());
    }

    if (filters.category && filters.category !== "all") {
      params.set("category", filters.category);
    }

    if (filters.brand && filters.brand !== "all") {
      params.set("brand", filters.brand);
    }

    if (filters.status && filters.status !== "all") {
      params.set("status", filters.status);
    }

    if (filters.stockStatus && filters.stockStatus !== "all") {
      params.set("stockStatus", filters.stockStatus);
    }

    if (filters.categories) {
      params.set("categories", filters.categories);
    }

    if (filters.brands) {
      params.set("brands", filters.brands);
    }

    const response = await apiFetch(`/api/v1/products?${params.toString()}`);

    const result = await readApiJson(response);
    const data = result.data || {};

    return {
      success: true,
      products: data.products || [],
      total: data.total || 0,
      totalPages: data.totalPages || 0,
      page: data.page || page,
      limit: data.limit || limit,
    };
  } catch (error) {
    console.error("Error fetching products:", error);

    return {
      success: false,
      products: [],
      total: 0,
      totalPages: 0,
      page: Math.floor(skip / limit) + 1,
      limit,
      message: getApiError(error, "Failed to fetch products"),
    };
  }
}

export async function getProduct(id) {
  try {
    const response = await apiFetch(`/api/v1/products/${encodeURIComponent(id)}`);

    const result = await readApiJson(response);

    return {
      product: result.data?.product || {},
    };
  } catch (error) {
    console.error("getProduct:", error);
    return { product: {} };
  }
}

export async function updateProduct(productId, formData) {
  try {
    const response = await apiFetch(
      `/api/v1/products/${encodeURIComponent(productId)}`,
      {
        method: "PATCH",
        body: formData,
      }
    );

    const result = await readApiJson(response);

    return {
      success: true,
      product: result.data?.product,
    };
  } catch (error) {
    console.error("updateProduct:", error);

    return {
      success: false,
      product: {},
      message: getApiError(error, "Failed to update product"),
    };
  }
}

export async function getCategoryProducts(categorySlug, limit = 10, page = 1) {
  try {
    const params = new URLSearchParams({
      categories: categorySlug,
      page: String(page),
      limit: String(limit),
    });

    const response = await apiFetch(`/api/v1/products?${params.toString()}`);

    const result = await readApiJson(response);
    const data = result.data || {};

    return {
      products: data.products || [],
      total: data.total || 0,
      page: data.page || page,
      limit: data.limit || limit,
      totalPages: data.totalPages || 0,
    };
  } catch (error) {
    console.error("getCategoryProducts:", error);

    return {
      products: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }
}

export async function getBrandProducts(brandSlug, limit = 10, page = 1) {
  try {
    const params = new URLSearchParams({
      brands: brandSlug,
      page: String(page),
      limit: String(limit),
    });

    const response = await apiFetch(`/api/v1/products?${params.toString()}`);

    const result = await readApiJson(response);
    const data = result.data || {};

    return {
      products: data.products || [],
      total: data.total || 0,
      page: data.page || page,
      limit: data.limit || limit,
      totalPages: data.totalPages || 0,
    };
  } catch (error) {
    console.error("getBrandProducts:", error);

    return {
      products: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }
}

export async function createProduct(formData) {
  try {
    const response = await apiFetch("/api/v1/products", {
      method: "POST",
      body: formData,
    });

    const result = await readApiJson(response);

    return {
      success: true,
      product: result.data?.product,
    };
  } catch (error) {
    console.error("createProduct:", error);

    return {
      success: false,
      message: getApiError(error, "Failed to create product"),
    };
  }
}

export async function updateProductStatus(productId, isActive) {
  try {
    const response = await apiFetch(
      `/api/v1/products/${encodeURIComponent(productId)}/status`,
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
      product: result.data?.product,
      message: result.message,
    };
  } catch (error) {
    console.error("updateProductStatus:", error);

    return {
      success: false,
      message: getApiError(error, "Failed to update product status"),
    };
  }
}