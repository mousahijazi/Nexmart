const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProducts(limit = 20, skip = 0, token = null) {
  try {
    const page = Math.floor(skip / limit) + 1;
    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
 
    const res = await fetch(`${API_URL}/api/v1/products?page=${page}&limit=${limit}`, {
      headers,
      cache: "no-store",
    });
 
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
 
    const json = await res.json();
    const { products, total, totalPages } = json.data;

    return {products, total, totalPages};
  } catch (error) {
    console.log(error);
    return { products: [], total: 0, totalPages: 0 };
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