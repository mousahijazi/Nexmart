"use client";
import { useCallback, useEffect, useState } from "react";
import { getSeasons, createSeason, updateSeason } from "@/helper/fetchApi";

export default function useAdminSeasons({ showAlert }) {
  const [seasons, setSeasons] = useState([]);
  const [seasonsLoading, setSeasonsLoading] = useState(true);

  const [seasonsPage, setSeasonsPage] = useState(1);
  const [seasonsLimit, setSeasonsLimit] = useState(10);
  const [seasonsTotal, setSeasonsTotal] = useState(0);
  const [seasonsTotalPages, setSeasonsTotalPages] = useState(0);

  const [isSeasonModalOpen, setIsSeasonModalOpen] = useState(false);
  const [seasonModalMode, setSeasonModalMode] = useState("create");
  const [editingSeason, setEditingSeason] = useState(null);

  const fetchSeasons = useCallback(async (page, limit) => {
    setSeasonsLoading(true);
    const token = localStorage.getItem("nexmart-token");

    try {
      if (!token) {
        setSeasons([]);
        setSeasonsTotal(0);
        setSeasonsTotalPages(0);
        return;
      }

      const result = await getSeasons(limit, page, token);

      if (!result.success) {
        setSeasons([]);
        setSeasonsTotal(0);
        setSeasonsTotalPages(0);
        showAlert(result.message || "Failed to fetch seasons", "danger");
        return;
      }

      setSeasons(result.seasons);
      setSeasonsTotal(result.total);
      setSeasonsTotalPages(result.totalPages);
    } catch (error) {
      console.error("fetchSeasons:", error);
      
      setSeasons([]);
      setSeasonsTotal(0);
      setSeasonsTotalPages(0);
      showAlert("Failed to fetch seasons", "danger");
    } finally {
      setSeasonsLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchSeasons(seasonsPage, seasonsLimit);
  }, [seasonsPage, seasonsLimit, fetchSeasons]);

  const openSeasonModal = () => {
    setSeasonModalMode("create");
    setEditingSeason(null);
    setIsSeasonModalOpen(true);
  };

  const openEditSeason = (season) => {
    setSeasonModalMode("edit");
    setEditingSeason(season);
    setIsSeasonModalOpen(true);
  };

  const closeSeasonModal = () => {
    setIsSeasonModalOpen(false);
    setEditingSeason(null);
    setSeasonModalMode("create");
  };

  const addSeason = async (payload) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      showAlert("You are not authenticated", "danger");
      return { success: false };
    }

    const result = await createSeason(payload, token);

    if (result.success) {
      fetchSeasons(seasonsPage, seasonsLimit);
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
      return { success: false };
    }

    const result = await updateSeason(seasonId, payload, token);

    if (result.success) {
      fetchSeasons(seasonsPage, seasonsLimit);
      showAlert("Season updated successfully", "success");
    } else {
      showAlert(result.message || "Failed to update season", "danger");
    }

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
    fetchSeasons,

    isSeasonModalOpen,
    seasonModalMode,
    editingSeason,
    openSeasonModal,
    openEditSeason,
    closeSeasonModal,
    addSeason,
    editSeason,
  };
}