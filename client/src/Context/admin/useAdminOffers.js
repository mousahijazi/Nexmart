"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { getOffers, createOffer, updateOffer, updateOfferStatus } from "@/helper/fetchApi";

export default function useAdminOffers({ showAlert, enabled }) {
  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);

  const [offersTotal, setOffersTotal] = useState(0);
  const [offersTotalPages, setOffersTotalPages] = useState(0);

  const [offersPage, setOffersPage] = useState(1);
  const [offersLimit, setOffersLimitState] = useState(10);

  const [search, setSearchState] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [status, setStatusState] = useState("All Statuses");
  const [target, setTargetState] = useState("All Targets");
  const [season, setSeasonState] = useState("all");

  const setSearch = useCallback((value) => {
    setSearchState(value);
    setOffersPage(1);
  }, []);

  const setStatus = useCallback((value) => {
    setStatusState(value);
    setOffersPage(1);
  }, []);

  const setTarget = useCallback((value) => {
    setTargetState(value);
    setOffersPage(1);
  }, []);

  const setSeason = useCallback((value) => {
    setSeasonState(value);
    setOffersPage(1);
  }, []);

  const setOffersLimit = useCallback((value) => {
    setOffersLimitState(value);
    setOffersPage(1);
  }, []);

  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerModalMode, setOfferModalMode] = useState("create");
  const [editingOffer, setEditingOffer] = useState(null);

  const requestIdRef = useRef(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const fetchOffers = useCallback(async (options = {}, legacyLimit) => {
    const page = typeof options === "number" ? options : options.page ?? offersPage;
    const limit = typeof options === "number" ? legacyLimit ?? offersLimit : options.limit ?? offersLimit;

    if (!enabled) return;

    const requestId = ++requestIdRef.current;
    setOffersLoading(true);

    const token = localStorage.getItem("nexmart-token");

    try {
      if (!token) {
        setOffers([]);
        setOffersTotal(0);
        setOffersTotalPages(0);
        return;
      }

      const result = await getOffers(limit, page, token, { search: debouncedSearch, status, target, season });

      if (requestId !== requestIdRef.current) return;

      if (!result.success) {
        setOffers([]);
        setOffersTotal(0);
        setOffersTotalPages(0);

        showAlert?.(result.message || "Failed to fetch offers", "danger");

        return;
      }

      setOffers(result.offers);
      setOffersTotal(result.total);
      setOffersTotalPages(result.totalPages);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;

      console.error("fetchOffers:", error);

      setOffers([]);
      setOffersTotal(0);
      setOffersTotalPages(0);

      showAlert?.("Failed to fetch offers", "danger");
    } finally {
      if (requestId === requestIdRef.current) {
        setOffersLoading(false);
      }
    }
  }, [enabled, offersPage, offersLimit, debouncedSearch, status, target, season, showAlert]);

  useEffect(() => {
    if (!enabled) {
      requestIdRef.current += 1;
      setOffersLoading(false);
      return;
    }

    fetchOffers();
  }, [enabled, fetchOffers]);

  const refreshOffers = useCallback(async () => {
    if (offersPage !== 1) {
      setOffersPage(1);
      return;
    }

    await fetchOffers({ page: 1 });
  }, [offersPage, fetchOffers]);

  const openOfferModal = useCallback(() => {
    setOfferModalMode("create");
    setEditingOffer(null);
    setIsOfferModalOpen(true);
  }, []);

  const openEditOffer = useCallback((offer) => {
    setOfferModalMode("edit");
    setEditingOffer(offer);
    setIsOfferModalOpen(true);
  }, []);

  const closeOfferModal = useCallback(() => {
    setIsOfferModalOpen(false);
    setEditingOffer(null);
    setOfferModalMode("create");
  }, []);

  const addOffer = useCallback(async (payload) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      showAlert?.("You are not authenticated", "danger");
      return { success: false };
    }

    const result = await createOffer(payload, token);

    if (!result.success) {
      showAlert?.(result.message || "Failed to create offer", "danger");

      return result;
    }

    showAlert?.("Offer created successfully", "success");
    await refreshOffers();

    return result;
  }, [showAlert, refreshOffers]);

  const editOffer = useCallback(async (offerId, payload) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      showAlert?.("You are not authenticated", "danger");
      return { success: false };
    }

    const result = await updateOffer(offerId, payload, token);

    if (!result.success) {
      showAlert?.(result.message || "Failed to update offer", "danger");

      return result;
    }

    showAlert?.("Offer updated successfully", "success");

    await refreshOffers();

    return result;
  }, [showAlert, refreshOffers]);

  const toggleOfferActive = useCallback(async (offerId, isActive) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      showAlert?.("You are not authenticated", "danger");
      return { success: false };
    }

    const result = await updateOfferStatus(offerId, isActive, token);

    if (!result.success) {
      showAlert?.(result.message || "Failed to update offer status", "danger");

      return result;
    }

    showAlert?.(isActive ? "Offer activated successfully" : "Offer deactivated successfully", "success");

    await refreshOffers();

    return result;
  }, [showAlert, refreshOffers]);

  const resetOfferFilters = useCallback(() => {
    setSearchState("");
    setDebouncedSearch("");
    setStatusState("All Statuses");
    setTargetState("All Targets");
    setSeasonState("all");
    setOffersPage(1);
  }, []);

  return {
    offers,
    offersLoading,

    offersPage,
    setOffersPage,
    offersLimit,
    setOffersLimit,
    offersTotal,
    offersTotalPages,

    search,
    setSearch,
    status,
    setStatus,
    target,
    setTarget,
    season,
    setSeason,
    resetOfferFilters,

    fetchOffers,

    isOfferModalOpen,
    offerModalMode,
    editingOffer,
    openOfferModal,
    openEditOffer,
    closeOfferModal,

    addOffer,
    editOffer,
    toggleOfferActive,
  };
}