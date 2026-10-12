"use client";
import { useMemo, useState } from "react";
import { SeasonsFilters, SeasonsTable } from "@/index";

export default function SeasonsInteractive({ seasons }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Statuses");
  const [timing, setTiming] = useState("All Periods");

  const filteredSeasons = useMemo(() => {
    const value = search.trim().toLowerCase();

    return seasons.filter((season) => {
      const matchesSearch = !value || season.nameEn.toLowerCase().includes(value) || season.nameAr.includes(value);
      const matchesStatus = status === "All Statuses" || season.status === status.toLowerCase();
      const matchesTiming = timing === "All Periods" || season.timing === timing.toLowerCase();

      return matchesSearch && matchesStatus && matchesTiming;
    });
  }, [seasons, search, status, timing]);

  const resetFilters = () => {
    setSearch("");
    setStatus("All Statuses");
    setTiming("All Periods");
  };

  return (
    <>
      <SeasonsFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        timing={timing}
        setTiming={setTiming}
        onReset={resetFilters}
      />

      <SeasonsTable seasons={filteredSeasons} />
    </>
  );
}