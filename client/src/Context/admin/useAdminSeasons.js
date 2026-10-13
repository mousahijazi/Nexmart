"use client";
import { useCallback, useEffect, useState } from "react";
import { getSeasons } from "@/helper/fetchApi";

export default function useAdminSeasons({ showAlert }) {
  const [seasons, setSeasons] = useState([]);
  const [seasonsLoading, setSeasonsLoading] = useState(true);

  const [seasonsPage, setSeasonsPage] = useState(1);
  const [seasonsLimit, setSeasonsLimit] = useState(10);
  const [seasonsTotal, setSeasonsTotal] = useState(0);
  const [seasonsTotalPages, setSeasonsTotalPages] = useState(0);

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
  };
}