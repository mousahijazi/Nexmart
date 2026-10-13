"use client";
import { useCallback, useEffect, useState } from "react";
import { getOffers, createOffer, updateOffer } from "@/helper/fetchApi";

export default function useAdminOffers({ showAlert }) {
  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);

  const [offersPage, setOffersPage] = useState(1);
  const [offersLimit, setOffersLimit] = useState(10);
  const [offersTotal, setOffersTotal] = useState(0);
  const [offersTotalPages, setOffersTotalPages] = useState(0);

  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerModalMode, setOfferModalMode] = useState("create");
  const [editingOffer, setEditingOffer] = useState(null);

  const fetchOffers = useCallback(async (page, limit) => {
    setOffersLoading(true);
    const token = localStorage.getItem("nexmart-token");

    try {
      if (!token) {
        setOffers([]);
        setOffersTotal(0);
        setOffersTotalPages(0);
        return;
      }

      const result = await getOffers(limit, page, token);

      if (!result.success) {
        setOffers([]);
        setOffersTotal(0);
        setOffersTotalPages(0);
        showAlert(result.message || "Failed to fetch offers", "danger");
        return;
      }

      setOffers(result.offers);
      setOffersTotal(result.total);
      setOffersTotalPages(result.totalPages);
    } catch (error) {
      console.error("fetchOffers:", error);
      setOffers([]);
      setOffersTotal(0);
      setOffersTotalPages(0);
      showAlert("Failed to fetch offers", "danger");
    } finally {
      setOffersLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchOffers(offersPage, offersLimit);
  }, [offersPage, offersLimit, fetchOffers]);

  const openOfferModal = () => {
    setOfferModalMode("create");
    setEditingOffer(null);
    setIsOfferModalOpen(true);
  };

  const openEditOffer = (offer) => {
    setOfferModalMode("edit");
    setEditingOffer(offer);
    setIsOfferModalOpen(true);
  };

  const closeOfferModal = () => {
    setIsOfferModalOpen(false);
    setEditingOffer(null);
    setOfferModalMode("create");
  };

  const addOffer = async (payload) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      showAlert("You are not authenticated", "danger");
      return { success: false };
    }

    const result = await createOffer(payload, token);
    if (result.success) {
      fetchOffers(offersPage, offersLimit);
      showAlert("Offer created successfully", "success");
    } else {
      showAlert(result.message || "Failed to create offer", "danger");
    }

    return result;
  };

  const editOffer = async (offerId, payload) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      showAlert("You are not authenticated", "danger");
      return { success: false };
    }

    const result = await updateOffer(offerId, payload, token);
    if (result.success) {
      fetchOffers(offersPage, offersLimit);
      showAlert("Offer updated successfully", "success");
    } else {
      showAlert(result.message || "Failed to update offer", "danger");
    }

    return result;
  };

  return {
    offers,
    offersLoading,
    offersPage,
    setOffersPage,
    offersLimit,
    setOffersLimit,
    offersTotal,
    offersTotalPages,
    fetchOffers,
    
    isOfferModalOpen,
    offerModalMode,
    editingOffer,
    openOfferModal,
    openEditOffer,
    closeOfferModal,
    addOffer,
    editOffer,
  };
}