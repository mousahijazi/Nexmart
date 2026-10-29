const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Seasons
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

// Offers
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