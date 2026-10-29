const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getBrand(limit, page = 1, token = null) {
    try {
      const headers = {};

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/api/v1/brands${limit ? `?page=${page}&limit=${limit}` : ""}`, {
        headers,
        cache: "no-store"
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();
      const brands = json.data?.brands|| [];

      return {brands};
    } catch (error) {
      console.log(error);
      return { brands: [] };
    }
}

export async function createBrand(formData, token) {
  try {
    const res = await fetch(`${API_URL}/api/v1/brands`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const json = await res.json();

    if (!res.ok || json.status !== "success") {
      return { success: false, message: json.message || "Failed to create category" };
    }

    return { success: true, brand: json.data?.brand };
  } catch (error) {
    return { success: false, message: "Something went wrong" };
  }
}

export async function updateBrand(brandId, formData, token) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/brands/${brandId}`,
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
      brand: result.data.brand,
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