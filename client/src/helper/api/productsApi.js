const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProducts(limit = 20, skip = 0, token = null, filters = {}) {
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

    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}/api/v1/products?${params.toString()}`,
      {
        headers,
        cache: "no-store",
      }
    );

    const json = await res.json();

    if (!res.ok || json.status !== "success") {
      throw new Error(json.message || `HTTP error! status: ${res.status}`);
    }

    const { products, total, totalPages, page: currentPage, limit: currentLimit } = json.data;

    return {
      success: true,
      products: products || [],
      total: total || 0,
      totalPages: totalPages || 0,
      page: currentPage || page,
      limit: currentLimit || limit,
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
      message: error.message || "Failed to fetch products",
    };
  }
}

export async function getProduct(id, token = null) {
  try {
    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const res = await fetch(`${API_URL}/api/v1/products/${id}`, { 
      headers,
      cache: "no-store" 
    });
 
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
 
    const json = await res.json();
    const { product } = json.data;

    return {product};
  } catch (error) {
    console.log(error);
    return { product: {} };
  }
}

export async function updateProduct(productId, formData, token) {
  try {
    const res = await fetch(`${API_URL}/api/v1/products/${productId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        cache: "no-store",
      }
    );

    const result = await res.json();

    if (!res.ok || result.status !== "success") {
      return {
        success: false,
        message: result.message || "Failed to update product",
      };
    }

    const { product } = result.data;
    
    return {
      success: true,
      product: product,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      product: {},
      message: "Something went wrong",
    };
  }
}

export async function getCategoryProducts( categorySlug, limit = 10, page = 1, token = null) {
  try {
    const url = `${API_URL}/api/v1/products?categories=${categorySlug}&page=${page}&limit=${limit}`;
    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    return {
      products: json.data?.products || [],
      total: json.data?.total || 0,
      page: json.data?.page || page,
      limit: json.data?.limit || limit,
      totalPages: json.data?.totalPages || 0,
    };
  } catch (error) {
    console.error("Error to get category products:", error);

    return {
      products: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }
}

export async function getBrandProducts( brandSlug, limit = 10, page = 1, token = null) {
  try {
    const url = `${API_URL}/api/v1/products?brands=${brandSlug}&page=${page}&limit=${limit}`;
    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    return {
      products: json.data?.products || [],
      total: json.data?.total || 0,
      page: json.data?.page || page,
      limit: json.data?.limit || limit,
      totalPages: json.data?.totalPages || 0,
    };
  } catch (error) {
    console.error("Error to get brand products:", error);

    return {
      products: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }
}

export async function createProduct(formData, token) {
  try {
    const res = await fetch(`${API_URL}/api/v1/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (!res.ok || result.status !== "success") {
      return {
        success: false,
        message: result.message || "Failed to create product",
      };
    }

    return {
      success: true,
      product: result.data.product,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function updateProductStatus(productId, isActive, token) {
  try {
    const res = await fetch(`${API_URL}/api/v1/products/${productId}/status`,
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
        message: result.message ||"Failed to update product status",
      };
    }

    return {
      success: true,
      product: result.data?.product,
      message: result.message,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}