import { apiFetch, readApiJson, getApiError } from "../apiFetch";

function getErrorMessage(json, fallback) {
  return (json?.message || json?.data?.message || fallback);
}

// -------------------- Seasons --------------------

export async function getActiveSeasons(page = 1, limit = 1) {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      status: "Active",
    });

    const response = await apiFetch(`/api/v1/seasons?${params}`);

    const result = await readApiJson(response);
    const data = result.data || {};
    const seasons = Array.isArray(data.seasons) ? data.seasons : [];

    return {
      season: seasons[0] || null,
      seasons,
      page: Number(data.page ?? page),
      limit: Number(data.limit ?? limit),
      total: Number(data.total ?? 0),
      totalPages: Number(data.totalPages ?? 0),
    };
  } catch (error) {
    console.error("getActiveSeasons:", error);

    return {
      season: null,
      seasons: [],
      page,
      limit,
      total: 0,
      totalPages: 0,
    };
  }
}

export async function getAdminSeasonOffers(seasonId, limit = 10, page = 1) {
  if (!seasonId) {
    return {
      success: false,
      offers: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
      message: "Season ID is required",
    };
  }

  try {
    const params = new URLSearchParams({
      season: String(seasonId),
      page: String(page),
      limit: String(limit),
    });

    const response = await apiFetch(`/api/v1/offers?${params}`);

    const result = await readApiJson(response);
    const data = result.data || {};

    return {
      success: true,
      offers: Array.isArray(data.offers) ? data.offers : [],
      total: Number(data.total ?? 0),
      page: Number(data.page ?? page),
      limit: Number(data.limit ?? limit),
      totalPages: Number(data.totalPages ?? 0),
    };
  } catch (error) {
    console.error("getAdminSeasonOffers:", error);

    return {
      success: false,
      offers: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
      message: getApiError(error, "Failed to fetch season offers"),
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
      limit: String(limit),
    });

    const response = await apiFetch(`/api/v1/offers?${params}`);

    const result = await readApiJson(response);
    const offers = Array.isArray(result.data?.offers) ? result.data.offers : [];

    const now = Date.now();

    return offers.filter((offer) => {
      const offerSeasonId = typeof offer.season === "object" ? offer.season?._id : offer.season;

      const start = new Date(offer.startDate).getTime();
      const end = new Date(offer.endDate).getTime();

      return (
        String(offerSeasonId) === String(seasonId) &&
        offer.isActive === true &&
        Number.isFinite(start) && Number.isFinite(end) &&
        start <= now && now < end
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
        const product = (await getOfferProducts(offer, 1))[0];

        if (!product?._id) continue;

        const productId = String(product._id);

        if (seenProductIds.has(productId)) continue;

        seenProductIds.add(productId);
        products.push({ ...product, seasonOffer: offer });

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
          products.push({ ...product, seasonOffer: offer });

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

export async function getSeasons(limit = 10, page = 1, filters = {}) {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    const search = String(filters.search || "").trim();

    if (search) params.set("search", search);

    const status = String(filters.status || "").trim();

    if (status && !["all", "All Statuses"].includes(status)) {
      params.set("status", status);
    }

    const response = await apiFetch(`/api/v1/seasons?${params}`);

    const result = await readApiJson(response);
    const data = result.data || {};

    return {
      success: true,
      seasons: Array.isArray(data.seasons) ? data.seasons : [],
      total: Number(data.total ?? 0),
      page: Number(data.page ?? page),
      limit: Number(data.limit ?? limit),
      totalPages: Number(data.totalPages ?? 0),
    };
  } catch (error) {
    console.error("getSeasons:", error);

    return {
      success: false,
      seasons: [],
      message: getApiError(error, "Failed to fetch seasons"),
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }
}

export async function createSeason(payload) {
  try {
    const response = await apiFetch("/api/v1/seasons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await readApiJson(response);

    return {
      success: true,
      season: result.data?.season ?? null,
    };
  } catch (error) {
    console.error("createSeason:", error);

    return {
      success: false,
      message: getApiError(error, "Failed to create season"),
    };
  }
}

export async function updateSeason(seasonId, payload) {
  try {
    const response = await apiFetch(
      `/api/v1/seasons/${encodeURIComponent(seasonId)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await readApiJson(response);

    return {
      success: true,
      season: result.data?.season ?? null,
    };
  } catch (error) {
    console.error("updateSeason:", error);

    return {
      success: false,
      message: getApiError(error, "Failed to update season"),
    };
  }
}

// -------------------- Offers --------------------

const normalizeOfferFilters = (filters = {}) => {
  const normalized = {};

  const search = filters.search?.trim();

  if (search) normalized.search = search;

  const status = filters.status;

  if (status && !["all", "All Statuses"].includes(status)) {
    normalized.status = status;
  }

  const target = filters.target?.toLowerCase();

  if (target && target !== "all" && target !== "all targets") {
    normalized.target = target;
  }

  const season = filters.season;

  if (season && season !== "all" && season !== "All Seasons") {
    normalized.season = season;
  }

  return normalized;
};

export async function getOffers(limit = 10, page = 1, filters = {}) {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    const normalizedFilters = normalizeOfferFilters(filters);

    Object.entries(normalizedFilters).forEach(([key, value]) => {
      params.set(key, String(value));
    });

    const response = await apiFetch(`/api/v1/offers?${params}`);

    const result = await readApiJson(response);
    const data = result.data || {};

    return {
      success: true,
      offers: Array.isArray(data.offers) ? data.offers : [],
      total: Number(data.total ?? 0),
      page: Number(data.page ?? page),
      limit: Number(data.limit ?? limit),
      totalPages: Number(data.totalPages ?? 0),
    };
  } catch (error) {
    console.error("getOffers:", error);

    return {
      success: false,
      message: getApiError(error, "Failed to fetch offers"),
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
    });

    const response = await apiFetch(`/api/v1/offers?${params}`);

    const result = await readApiJson(response);
    const data = result.data || {};
    const offers = Array.isArray(data.offers) ? data.offers : [];

    return {
      success: true,
      offer: offers[0] || null,
      offers,
      page: Number(data.page ?? page),
      limit: Number(data.limit ?? limit),
      total: Number(data.total ?? 0),
      totalPages: Number(data.totalPages ?? 0),
    };
  } catch (error) {
    console.error("getActiveOffers:", error);

    return {
      success: false,
      message: getApiError(error, "Failed to fetch active offers"),
      offer: null,
      offers: [],
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
      if (offer.product && typeof offer.product === "object" && offer.product._id) {
        return [offer.product];
      }

      const productId = typeof offer.product === "object" ? offer.product?._id : offer.product;

      if (!productId) return [];

      const response = await apiFetch(`/api/v1/products/${encodeURIComponent(productId)}`);

      const result = await readApiJson(response);
      const product = result?.data?.product ?? result?.product ?? result?.data;

      return product?._id ? [product] : [];
    }

    if (offer.targetType === "category") {
      const categorySlug = typeof offer.category === "object" ? offer.category?.slug : null;

      if (!categorySlug) return [];

      const params = new URLSearchParams({
        categories: categorySlug,
        page: "1",
        limit: String(limit),
      });

      const response = await apiFetch(`/api/v1/products?${params}`);

      const result = await readApiJson(response);
      const products = result.data?.products;

      return Array.isArray(products) ? products.slice(0, limit) : [];
    }

    return [];
  } catch (error) {
    console.error("getOfferProducts:", error);
    return [];
  }
}

export async function createOffer(payload) {
  try {
    const response = await apiFetch("/api/v1/offers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await readApiJson(response);

    return {
      success: true,
      offer: result.data?.offer ?? null,
    };
  } catch (error) {
    console.error("createOffer:", error);

    return {
      success: false,
      message: getApiError(error, "Failed to create offer"),
    };
  }
}

export async function updateOffer(offerId, payload) {
  try {
    const response = await apiFetch(
      `/api/v1/offers/${encodeURIComponent(offerId)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await readApiJson(response);

    return {
      success: true,
      offer: result.data?.offer ?? null,
    };
  } catch (error) {
    console.error("updateOffer:", error);

    return {
      success: false,
      message: getApiError(error, "Failed to update offer"),
    };
  }
}

async function patchStatus(resource, id, isActive) {
  try {
    const response = await apiFetch(
      `/api/v1/${resource}/${encodeURIComponent(id)}/status`,
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
      data: result.data,
    };
  } catch (error) {
    console.error(`patchStatus(${resource}):`, error);

    return {
      success: false,
      message: getApiError(error, `Failed to update ${resource} status`),
    };
  }
}

export async function updateOfferStatus(offerId, isActive, token) {
  const result = await patchStatus("offers", offerId, isActive, token);

  return result.success
    ? {
        success: true,
        offer: result.data?.offer ?? null,
      }
    : result;
}

export async function updateSeasonStatus(seasonId, isActive, token) {
  const result = await patchStatus("seasons", seasonId, isActive, token);

  return result.success
    ? {
        success: true,
        season: result.data?.season ?? null,
      }
    : result;
}