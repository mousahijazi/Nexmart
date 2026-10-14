"use client";
import { useMemo, useState } from "react";
import { OffersFilters, OffersTable } from "@/index";
import { useAdminContext } from "@/Context/Adminprovider";
import { useLocale } from "next-intl";
import OffersTableSkeleton from "./OffersTableSkeleton";

export default function OffersInteractive() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Statuses");
  const [target, setTarget] = useState("All Targets");
  const [season, setSeason] = useState("All Seasons");
  const { offers, offersLoading } = useAdminContext();
  const locale = useLocale();

  const seasonOptions = useMemo(() => ["All Seasons", ...new Set(offers.map((offer) => offer.season?.name?.[locale]))], [offers, locale]);

  const filteredOffers = useMemo(() => {
    const value = search.trim().toLowerCase();

    return offers.filter((offer) => {
      const matchesSearch = !value || offer.name[locale].toLowerCase().includes(value);
      const matchesStatus = status === "All Statuses" || offer.status === status;
      const matchesTarget = target === "All Targets" || offer.targetType?.toLowerCase() === target?.toLowerCase();
      const matchesSeason = season === "All Seasons" || offer.season?.name?.[locale] === season;

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

      {offersLoading ? (
        <OffersTableSkeleton />
      ) : (
        <>
          <OffersTable offers={filteredOffers} />
        </>
      )}
    </>
  );
}