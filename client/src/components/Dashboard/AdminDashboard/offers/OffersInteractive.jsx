"use client";
import { useMemo, useState } from "react";
import { OffersFilters, OffersTable } from "@/index";

export default function OffersInteractive({ offers }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Statuses");
  const [target, setTarget] = useState("All Targets");
  const [season, setSeason] = useState("All Seasons");

  const seasonOptions = useMemo(() => ["All Seasons", ...new Set(offers.map((offer) => offer.season))], [offers]);

  const filteredOffers = useMemo(() => {
    const value = search.trim().toLowerCase();

    return offers.filter((offer) => {
      const matchesSearch = !value || offer.name.toLowerCase().includes(value) || offer.code.toLowerCase().includes(value) || offer.target.name.toLowerCase().includes(value);
      const matchesStatus = status === "All Statuses" || offer.status === status;
      const matchesTarget = target === "All Targets" || offer.target.type === target;
      const matchesSeason = season === "All Seasons" || offer.season === season;

      return matchesSearch && matchesStatus && matchesTarget && matchesSeason;
    });
  }, [offers, search, status, target, season]);

  const resetFilters = () => {
    setSearch("");
    setStatus("All Statuses");
    setTarget("All Targets");
    setSeason("All Seasons");
  };

  return (
    <>
      <OffersFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        target={target}
        setTarget={setTarget}
        season={season}
        setSeason={setSeason}
        seasonOptions={seasonOptions}
        onReset={resetFilters}
      />

      <OffersTable offers={filteredOffers} />
    </>
  );
}