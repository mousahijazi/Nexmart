const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchCartPricing(items, coupon = "", signal) {
  const response = await fetch(`${API_URL}/api/v1/cart/price`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items,
      coupon,
    }),
    signal,
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.message || "Failed to calculate cart pricing");
  }

  if (!payload?.data) {
    throw new Error("Invalid cart pricing response");
  }

  return payload.data;
}

export async function getActiveSeasons(page = 1, limit = 1) {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      isActive: "true",
    });

    const res = await fetch(`${API_URL}/api/v1/seasons?${params.toString()}`, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Failed to fetch seasons: ${res.status}`);
    }

    const json = await res.json();
    const data = json?.data;
    const seasons = Array.isArray(data?.seasons) ? data.seasons : [];

    const now = Date.now();

    const activeSeasons = seasons.filter((season) => {
      if (season.isActive !== true) return false;

      const start = new Date(season.startDate).getTime();
      const end = new Date(season.endDate).getTime();

      return (Number.isFinite(start) && Number.isFinite(end) && start <= now && now < end);
    });

    return {
      season: activeSeasons[0],
      page: Number(data?.page ?? page),
      limit: Number(data?.limit ?? limit),
      total: Number(data?.total ?? seasons.length),
      totalPages: Number(data?.totalPages ?? Math.ceil(Number(data?.total ?? data?.totalSeasons ?? seasons.length) / limit)),
    };
  } catch (error) {
    console.error("getActiveSeasons:", error);

    return {
      season: null,
      page,
      limit,
      total: 0,
      totalPages: 0,
    };
  }
}

// todo
export async function getAdminSeasonOffers(seasonId, limit = 10, page = 1, token) {
  if (!seasonId) return { success: false, offers: [], total: 0 };

  try {
    const params = new URLSearchParams({
      season: String(seasonId),
      page: String(page),
      limit: String(limit),
    });

    const res = await fetch(`${API_URL}/api/v1/offers?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok || json.status !== "success") {
      return { success: false, offers: [], total: 0, message: json.message };
    }

    const data = json.data;

    return {
      success: true,
      offers: Array.isArray(data?.offers) ? json.data.offers : [],
      total: Number(data?.total ?? 0),
      page: Number(data?.page ?? page),
      limit: Number(data?.limit ?? limit),
      totalPages: Number(data?.totalPages ?? 0),
    };
  } catch (error) {
    console.error("getAdminSeasonOffers:", error);
    return { 
      success: false, 
      offers: [], 
      total: 0,
      page: page,
      limit: limit,
      totalPages: 0,
    };
  }
}

export async function getSeasonOffers(seasonId, limit = 10) {
  if (!seasonId) return [];

  try {
    const params = new URLSearchParams({
      season: String(seasonId),
      isActive: "true",
      page: "1",
      limit: limit,
    });

    const res = await fetch(`${API_URL}/api/v1/offers?${params.toString()}`, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Failed to fetch season offers: ${res.status}`);
    }

    const json = await res.json();
    const data = json?.data;
    const offers = Array.isArray(data?.offers) ? data.offers : [];

    const now = Date.now();

    return offers.filter((offer) => {
      const offerSeasonId = typeof offer.season === "object" ? offer.season?._id : offer.season;

      const start = new Date(offer.startDate).getTime();
      const end = new Date(offer.endDate).getTime();

      return (
        String(offerSeasonId) === String(seasonId) && offer.isActive === true && Number.isFinite(start) && Number.isFinite(end) && start <= now && now < end
      );
    });
  } catch (error) {
    console.error("getSeasonOffers:", error);
    return [];
  }
}

export async function getSeasonProducts(seasonId, limit = 3) {
  if (!seasonId) return [];

  try {
    const offers = await getSeasonOffers(seasonId);

    const products = [];
    const seenProductIds = new Set();

    for (const offer of offers) {
      if (products.length >= limit) break;

      if (offer.targetType === "product") {
        const product = await getOfferProducts(offer, 1).then((result) => result[0]);
        if (!product?._id) continue;

        const productId = String(product._id);
        if (seenProductIds.has(productId)) continue;

        seenProductIds.add(productId);

        products.push({
          ...product,
          seasonOffer: offer,
        });

        continue;
      }

      if (offer.targetType === "category") {
        const remaining = limit - products.length;
        const offerProducts = await getOfferProducts(offer, remaining);

        for (const product of offerProducts) {
          if (!product?._id) continue;

          const productId = String(product._id);

          if (seenProductIds.has(productId)) continue;

          seenProductIds.add(productId);

          products.push({
            ...product,
            seasonOffer: offer,
          });

          if (products.length >= limit) break;
        }
      }
    }

    return products;
  } catch (error) {
    console.error("getSeasonProducts:", error);
    return [];
  }
}

export async function getSeasons(limit = 10, page = 1, token = null) {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}/api/v1/seasons?${params.toString()}`,
      {
        headers,
        cache: "no-store",
      }
    );

    const json = await res.json();
    const data = json?.data;

    return { 
      success: true,
      seasons: Array.isArray(data?.seasons) ? data.seasons : [],
      total: Number(data?.total ?? 0),
      page: Number(data?.page ?? page),
      limit: Number(data?.limit ?? limit),
      totalPages: Number(data?.totalPages ?? 0),
    };
  } catch (error) {
    return { 
      success: true,
      seasons: [],
      message: error.message || "Failed to fetch seasons",
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }
}

export async function createSeason(payload, token) {
  try {
    const res = await fetch(`${API_URL}/api/v1/seasons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok || json.status !== "success") {
      return { success: false, message: json.message || "Failed to create season" };
    }

    const data = json.data;

    return { success: true, season: data?.season };
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}

export async function updateSeason(seasonId, payload, token) {
  try {
    const res = await fetch(`${API_URL}/api/v1/seasons/${seasonId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok || json.status !== "success") {
      return { success: false, message: json.message || "Failed to update season" };
    }

    const data = json.data;

    return { success: true, season: data?.season };
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}

export async function getOffers(limit = 10, page = 1, token = null) {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}/api/v1/offers?${params.toString()}`,
      {
        headers,
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch offers: ${res.status}`);
    }

    const json = await res.json();
    const data = json?.data;

    return {
      success: true,
      offers: Array.isArray(data?.offers) ? data.offers : [],
      total: Number(data?.total ?? 0),
      page: Number(data?.page ?? page),
      limit: Number(data?.limit ?? limit),
      totalPages: Number(data?.totalPages ?? 0),
    };
  } catch (error) {
    console.error("getOffers:", error);

    return {
      success: false,
      message: error.message || "Failed to fetch offers",
      offers: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }
}

export async function createOffer(payload, token) {
  try {
    const res = await fetch(`${API_URL}/api/v1/offers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    const data = json.data;

    if (!res.ok || json.status !== "success") {
      return { success: false, message: data.message || "Failed to create offer" };
    }
    

    return { success: true, offer: data?.offer };
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}

export async function updateOffer(offerId, payload, token) {
  try {
    const res = await fetch(`${API_URL}/api/v1/offers/${offerId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    const data = json.data;

    if (!res.ok || json.status !== "success") {
      return { success: false, message: data.message || "Failed to update offer" };
    }

    return { success: true, offer: data?.offer };
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}

export async function getActiveOffers(page = 1, limit = 1) {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      isActive: true
    });

    const res = await fetch(`${API_URL}/api/v1/offers?${params.toString()}`, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Failed to fetch offers: ${res.status}`);
    }

    const json = await res.json();
    const data = json.data;
    const offersArray = json?.data?.offers || [];
    const activeOffer = offersArray.find(offer => offer.isActive === true) || null;

    return {
      offer: activeOffer,
      page: data.page,
      limit: data.limit,
      total: data.total,
      totalPages: data.totalPages,
    };
  } catch (error) {
    console.error("getActiveOffers:", error);

    return {
      offer: null,
      page,
      limit,
      total: 0,
      totalPages: 0,
    };
  }
}

export async function getOfferProducts(offer, limit = 4) {
  if (!offer) return [];

  try {
    if (offer.targetType === "product") {
      if (offer.product && typeof offer.product === "object") {
        return [offer.product];
      }

      const productId = typeof offer.product === "object" ? offer.product?._id : offer.product;
      if (!productId) return [];

      const res = await fetch(`${API_URL}/api/v1/products/${productId}`, { cache: "no-store" });

      if (!res.ok) {
        throw new Error(`Failed to fetch product: ${res.status}`);
      }

      const json = await res.json();
      const product = json?.data?.product ?? json?.product ?? json?.data ?? json;
      if (!product || !product._id) return [];

      return [product];
    }

    if (offer.targetType === "category") {
      const categorySlug = offer.category.slug;
      if (!categorySlug) return [];

      const params = new URLSearchParams({
        categories: categorySlug,
        page: "1",
        limit: String(limit),
      });

      const res = await fetch(`${API_URL}/api/v1/products?${params.toString()}`, { cache: "no-store" });

      if (!res.ok) {
        throw new Error(`Failed to fetch category products: ${res.status}`);
      }

      const json = await res.json();
      const productsList = json.data?.products || [];
      const data = productsList.slice(0, limit);

      return data;
    }

    return [];
  } catch (error) {
    console.error("getOfferProducts:", error);
    return [];
  }
}

async function patchStatus(resource, id, isActive, token) {
  try {
    const res = await fetch(`${API_URL}/api/v1/${resource}/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isActive }),
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok || json.status !== "success") {
      return { success: false, message: json.message || `Failed to update ${resource} status` };
    }

    const data = json.data;

    return { success: true, data: data };
  } catch (error) {
    console.error(`patchStatus(${resource}):`, error);
    return { success: false, message: "Something went wrong" };
  }
}

export async function updateOfferStatus(offerId, isActive, token) {
  const result = await patchStatus("offers", offerId, isActive, token);
  return result.success ? { success: true, offer: result.data?.offer } : result;
}

export async function updateSeasonStatus(seasonId, isActive, token) {
  const result = await patchStatus("seasons", seasonId, isActive, token);
  return result.success ? { success: true, season: result.data?.season } : result;
}

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
``
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

// users
export async function getAllUsers(token) {
  try {
    const response = await fetch(`${API_URL}/api/v1/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await response.json();
    const { users } = json.data;
    return {status: "success", users};
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return { status: "error", users: [] };
  }
}

export const getCurrentUser = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to get current user",
      };
    }

    return {
      success: true,
      user: result.data.user,
      role: result.data.user.role,
      redirectTo: result.data.redirectTo,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

export async function updateUser(formData, token) {
  try {
    const res = await fetch(`${API_URL}/api/v1/users/me`, {
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
        message: result.message || "Failed to update profile",
      };
    }

    return {
      success: true,
      user: result.data?.user,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

// admin
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

// reviews
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

// auth
import { supabase } from "../lib/supabase";

// login
export async function loginUser(email, password) {
  try {
    const res = await fetch(`${API_URL}/api/v1/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok || result.status !== "success") {
      return { success: false, message: result.message || "Login failed" };
    }

    return { 
      success: true, 
      token: result.data?.user?.token, 
      user: result.data?.user,
      redirectTo: result.data?.redirectTo,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }
}

export async function registerUser(email, password, firstName, lastName, phoneNumber) {
  try {
    const res = await fetch(`${API_URL}/api/v1/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        firstName, 
        lastName, 
        email, 
        password, 
        phoneNumber: phoneNumber || "", 
      }),
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok || result.status !== "success") {
      return { success: false, message: result.message || "Registration failed" };
    }

    return { 
      success: true, 
      token: result.data?.user?.token, 
      user: result.data?.user,
      redirectTo: result.data?.redirectTo,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }
}

// logout
export const logoutApi = async (token) => {
  const response = await fetch("http://localhost:5000/api/users/logout", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to logout from server");
  }

  return await response.json();
};

// subscribeToNewsletter
export async function subscribeToNewsletter(email) {
  try {
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email }]);

    if (error) {
      if (error.code === "23505") {
        return { success: false, message: "هذا البريد الإلكتروني مُشترك بالفعل!" };
      }
      return { success: false, message: error.message };
    }

    return { success: true, order: data };
  } catch (err) {
    return { success: false, message: "حدث خطأ غير متوقع، يرجى المحاولة لاحقاً." };
  }
}

// checkout - order | payment
async function orderApiRequest(path, { method = "GET", token, body, signal } = {}) {
  if (!token) {
    throw new Error("You must log in to manage orders");
  }

  const response = await fetch(`${API_URL}${path}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal,
    }
  );

  let payload;

  try {
    payload = await response.json();
  } catch {
    throw new Error("The server returned an invalid response");
  }

  if (!response.ok) {
    throw new Error(payload?.message || payload?.data?.message || `Request failed with status ${response.status}`);
  }

  return payload?.data ?? payload;
}

export const getAdminOrders = ({ token, page = 1, limit = 10, search = "", orderStatus = "", paymentStatus = "" } = {}) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search.trim()) {
    params.set("search", search.trim());
  }

  if (orderStatus) {
    params.set("orderStatus", orderStatus);
  }

  if (paymentStatus) {
    params.set("paymentStatus", paymentStatus);
  }

  return orderApiRequest(`/api/v1/admin/orders?${params.toString()}`, { token, method: "GET" });
};

export async function getBackendAdminOrderItems(orderId, token, { page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return orderApiRequest(`/api/v1/admin/orders/${encodeURIComponent(orderId)}/items?${params.toString()}`, { token });
}

export async function createBackendOrder({ token, shippingInfo, items, coupon }) {
  return orderApiRequest("/api/v1/orders", {
    method: "POST",
    token,
    body: {
      shippingInfo,
      items: items.map((item) => ({
        productId: item.productId ?? item._id,
        quantity: item.quantity || 1,
      })),

      coupon: coupon?.trim().toLowerCase() || "",
    },
  });
}

export async function getBackendMyOrders(token, { page = 1, limit = 10 } = {}) {
  return orderApiRequest(`/api/v1/orders/my?page=${page}&limit=${limit}`, { token });
}

export async function getBackendOrderById(orderId, token) {
  return orderApiRequest(`/api/v1/orders/${encodeURIComponent(orderId)}`, { token });
}

export async function getBackendOrderItems(orderId, token) {
  return orderApiRequest(`/api/v1/orders/${encodeURIComponent(orderId)}/items`, { token });
}

export async function updateBackendOrder(orderId, shippingInfo, token) {
  return orderApiRequest(`/api/v1/orders/${encodeURIComponent(orderId)}`,
    {
      method: "PATCH",
      token,
      body: { shippingInfo },
    }
  );
}

export async function replaceBackendOrderItems(orderId, items, coupon, token) {
  return orderApiRequest(
    `/api/v1/orders/${encodeURIComponent(orderId)}/items`,
    {
      method: "PATCH",
      token,
      body: {
        items: items.map((item) => ({
          productId:
            typeof item.product === "object"
              ? item.product._id
              : item.productId ?? item.product ?? item._id,
          quantity: item.quantity,
        })),
        coupon: coupon?.trim().toLowerCase() || "",
      },
    }
  );
}

export async function cancelBackendOrder(orderId, token) {
  return orderApiRequest(`/api/v1/orders/${encodeURIComponent(orderId)}`, { method: "DELETE", token });
}

// payment 
async function readApiResponse(response) {
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message || result?.data?.message || "The request failed.");
  }

  return result?.data ?? result;
}

// export async function createBackendPaymentIntent(orderId, token, locale) {
//   const response = await fetch(`${API_URL}/api/v1/payments/intent`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({ orderId, locale }),
//     cache: "no-store",
//   });

//   return readApiResponse(response);
// }

// export async function fulfillMoyasarPayment(intent, cardData) {
//   const response = await fetch(`https://api.moyasar.com/v1/payment_intents/${encodeURIComponent(intent.intentId)}/fulfill`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Basic ${btoa(`${intent.publishableKey}:`)}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         client_secret: intent.clientSecret,
//         source: {
//           type: "creditcard",
//           name: cardData.name.trim(),
//           number: cardData.number.replace(/\s/g, ""),
//           month: cardData.month,
//           year: cardData.year,
//           cvc: cardData.cvc,
//         },
//       }),
//     }
//   );

//   const result = await response.json().catch(() => null);

//   if (!response.ok) {
//     throw new Error(result?.message || "Moyasar could not process this card.");
//   }

//   return result;
// }

export async function createMoyasarPayment(order, cardData, locale) {
  const publishableKey = process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error("Moyasar publishable key is not configured.");
  }

  if (!order?._id || !Number.isFinite(order.totalPrice)) {
    throw new Error("Invalid order details.");
  }

  const amount = Math.round(order.totalPrice * 100);

  const response = await fetch("https://api.moyasar.com/v1/payments", {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${publishableKey}:`)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      currency: "SAR",
      description: `Nexmart Order ${order._id}`,
      callback_url: `${window.location.origin}/${locale}/checkout?mode=pay&order_id=${order._id}`,
      source: {
        type: "creditcard",
        name: cardData.name.trim(),
        number: cardData.number.replace(/\s/g, ""),
        month: cardData.month,
        year: cardData.year,
        cvc: cardData.cvc,
      },
    }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || "Moyasar could not process this payment."
    );
  }

  return result;
}

export async function verifyBackendPayment(paymentId, orderId, token) {
  const response = await fetch(`${API_URL}/api/v1/payments/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ paymentId, orderId }),
    cache: "no-store",
  });

  return readApiResponse(response);
}
