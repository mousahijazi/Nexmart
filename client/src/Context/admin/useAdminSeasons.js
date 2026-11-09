"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { getSeasons, createSeason, updateSeason, updateSeasonStatus, getAdminSeasonOffers } from "@/helper/fetchApi";

const SEASON_OFFERS_LIMIT = 10;
const SEARCH_DEBOUNCE_DELAY = 350;

export default function useAdminSeasons({ showAlert, enabled }) {
  const [seasons, setSeasons] = useState([]);
  const [seasonsLoading, setSeasonsLoading] = useState(true);

  const [seasonsTotal, setSeasonsTotal] = useState(0);
  const [seasonsTotalPages, setSeasonsTotalPages] = useState(0);

  const [seasonsPage, setSeasonsPageState] = useState(1);
  const [seasonsLimit, setSeasonsLimitState] = useState(10);

  const setSeasonsLimit = useCallback((limit) => {
    setSeasonsLimitState(limit);
    setSeasonsPageState(1);
  }, []);

  const [seasonsSearch, setSeasonsSearchState] = useState("");
  const [seasonsStatus, setSeasonsStatusState] = useState("All Statuses");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [seasonOffers, setSeasonOffers] = useState({});

  const [isSeasonModalOpen, setIsSeasonModalOpen] = useState(false);
  const [seasonModalMode, setSeasonModalMode] = useState("create");
  const [editingSeason, setEditingSeason] = useState(null);

  const seasonsRequestId = useRef(0);

  const setSeasonsPage = useCallback((page) => {
    setSeasonsPageState(page);
  }, []);

  const setSeasonsSearch = useCallback((value) => {
    setSeasonsSearchState(value);
    setSeasonsPageState(1);
  }, []);

  const setSeasonsStatus = useCallback((value) => {
    setSeasonsStatusState(value);
    setSeasonsPageState(1);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(seasonsSearch.trim());
    }, SEARCH_DEBOUNCE_DELAY);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [seasonsSearch]);

  const fetchSeasons = useCallback(async(page = seasonsPage, limit = seasonsLimit) => {
    const requestId = ++seasonsRequestId.current;

    setSeasonsLoading(true);

    try {
      const token = localStorage.getItem("nexmart-token");

      if (!token) {
        if (requestId !== seasonsRequestId.current) return;

        setSeasons([]);
        setSeasonsTotal(0);
        setSeasonsTotalPages(0);
        setSeasonOffers({});

        return {
          success: false,
          message: "You are not authenticated",
        };
      }

      const result = await getSeasons(limit, page, token, { search: debouncedSearch, status: seasonsStatus });

      if (requestId !== seasonsRequestId.current) {
        return result;
      }

      if (!result.success) {
        setSeasons([]);
        setSeasonsTotal(0);
        setSeasonsTotalPages(0);
        setSeasonOffers({});

        showAlert(result.message || "Failed to fetch seasons", "danger");

        return result;
      }

      setSeasons(result.seasons);
      setSeasonsTotal(result.total);
      setSeasonsTotalPages(result.totalPages);

      setSeasonOffers({});

      return result;
    } catch (error) {
      console.error("fetchSeasons:", error);

      if (requestId !== seasonsRequestId.current) {
        return {
          success: false,
        };
      }

      setSeasons([]);
      setSeasonsTotal(0);
      setSeasonsTotalPages(0);
      setSeasonOffers({});

      showAlert("Failed to fetch seasons", "danger");

      return {
        success: false,
        message: error.message,
      };
    } finally {
      if (requestId === seasonsRequestId.current) {
        setSeasonsLoading(false);
      }
    }
  }, [seasonsPage, seasonsLimit, debouncedSearch, seasonsStatus, showAlert]);

  useEffect(() => {
    if (!enabled) return;

    if (seasonsSearch.trim() !== debouncedSearch) {
      return;
    }

    fetchSeasons(seasonsPage, seasonsLimit);
  }, [enabled, seasonsPage, seasonsLimit, seasonsSearch, debouncedSearch, fetchSeasons]);

  const openSeasonModal = useCallback(() => {
    setSeasonModalMode("create");
    setEditingSeason(null);
    setIsSeasonModalOpen(true);
  }, []);

  const openEditSeason = useCallback((season) => {
    setSeasonModalMode("edit");
    setEditingSeason(season);
    setIsSeasonModalOpen(true);
  }, []);

  const closeSeasonModal = useCallback(() => {
    setIsSeasonModalOpen(false);
    setEditingSeason(null);
    setSeasonModalMode("create");
  }, []);

  const addSeason = async (payload) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      showAlert("You are not authenticated", "danger");

      return {
        success: false,
      };
    }

    const result = await createSeason(payload, token);

    if (result.success) {
      await fetchSeasons(seasonsPage, seasonsLimit);

      showAlert("Season created successfully", "success");
    } else {
      showAlert(result.message || "Failed to create season", "danger");
    }

    return result;
  };

  const editSeason = async (seasonId, payload) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      showAlert("You are not authenticated", "danger");

      return {
        success: false,
      };
    }

    const result = await updateSeason(seasonId, payload, token);

    if (result.success) {
      await fetchSeasons(seasonsPage, seasonsLimit);

      showAlert("Season updated successfully", "success");
    } else {
      showAlert(result.message || "Failed to update season", "danger");
    }

    return result;
  };

  const fetchSeasonOffers = useCallback(async (seasonId, page = 1) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      showAlert("You are not authenticated", "danger");

      return {
        success: false,
      };
    }

    setSeasonOffers((current) => ({
      ...current,
      [seasonId]: {
        ...(current[seasonId] || { offers: [] }),
        loading: true,
      },
    }));

    const result = await getAdminSeasonOffers(seasonId, SEASON_OFFERS_LIMIT, page, token);

    if (!result.success) {
      showAlert(result.message || "Failed to load season offers", "danger");
    }

    setSeasonOffers((current) => {
      const previous = current[seasonId] || { offers: [] };

      if (!result.success) {
        return {
          ...current,
          [seasonId]: {
            ...previous,
            loading: false,
          },
        };
      }

      return {
        ...current,
        [seasonId]: {
          offers:
            page > 1
              ? [...previous.offers, ...result.offers]
              : result.offers,

          loading: false,
          page: result.page,
          total: result.total,
          totalPages: result.totalPages,
        },
      };
    });

    return result;
  }, [showAlert]);

  const loadMoreSeasonOffers = useCallback((seasonId) => {
    const current = seasonOffers[seasonId];

    if (!current || current.loading) return;

    if (current.page >= current.totalPages) {
      return;
    }

    fetchSeasonOffers(seasonId, current.page + 1);
  }, [seasonOffers, fetchSeasonOffers]);

  const toggleSeasonActive = async (seasonId, isActive) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      showAlert("You are not authenticated", "danger");

      return {
        success: false,
      };
    }

    const result = await updateSeasonStatus(seasonId, isActive, token);

    if (!result.success) {
      showAlert(result.message || "Failed to update season status", "danger");

      return result;
    }

    await fetchSeasons(seasonsPage, seasonsLimit);

    showAlert(isActive ? "Season restored successfully!" : "Season archived successfully!", "success");

    return result;
  };

  return {
    seasons,
    seasonsLoading,

    seasonsPage,
    setSeasonsPage,
    seasonsLimit,
    setSeasonsLimit,
    seasonsTotal,
    seasonsTotalPages,

    seasonsSearch,
    setSeasonsSearch,
    seasonsStatus,
    setSeasonsStatus,

    fetchSeasons,

    isSeasonModalOpen,
    seasonModalMode,
    editingSeason,
    openSeasonModal,
    openEditSeason,
    closeSeasonModal,

    addSeason,
    editSeason,

    seasonOffers,
    fetchSeasonOffers,
    loadMoreSeasonOffers,

    toggleSeasonActive,
  };
}