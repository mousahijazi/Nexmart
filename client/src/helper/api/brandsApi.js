const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getBrand( limit, page = 1, token = null, filters = {}) {
  try {
    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const params = new URLSearchParams();

    if (limit) {
      params.set("limit", limit);
      params.set("page", page);
    }

    const search = filters.search?.trim();

    if (search) {
      params.set("search", search);
    }

    if (filters.status && filters.status !== "all") {
      params.set("status", filters.status);
    }

    const queryString = params.toString();

    const url = `${API_URL}/api/v1/brands${ queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();

    return {
      brands: json.data?.brands || [],
      total: json.data?.total || 0,
      page: json.data?.page || 1,
      limit: json.data?.limit || limit || 10,
      totalPages: json.data?.totalPages || 0,
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

export async function createBrand(formData, token) {
  try {
    const res = await fetch(`${API_URL}/api/v1/brands`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const json = await res.json();

    if (!res.ok || json.status !== "success") {
      return {
        success: false,
        message: json.message || "Failed to create brand",
      };
    }

    return {
      success: true,
      brand: json.data?.brand,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function updateBrand(brandId, formData, token) {
  try {
    const response = await fetch(`${API_URL}/api/v1/brands/${brandId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok || result.status !== "success") {
      return {
        success: false,
        message: result.message || "Failed to update brand",
      };
    }

    return {
      success: true,
      brand: result.data?.brand,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function updateBrandStatus(brandId, isActive, token) {
  try {
    const res = await fetch(`${API_URL}/api/v1/brands/${brandId}/status`,
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
        message: result.message || "Failed to update brand status",
      };
    }

    return {
      success: true,
      brand: result.data?.brand,
    };
  } catch (error) {
    console.error("updateBrandStatus:", error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}