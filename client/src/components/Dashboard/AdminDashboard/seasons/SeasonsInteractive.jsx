"use client";
import { useMemo, useState } from "react";
import { SeasonsFilters, SeasonsTable } from "@/index";
import { useAdminContext } from "@/Context/Adminprovider";

export default function SeasonsInteractive() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Statuses");
  const { seasons, seasonsLoading } = useAdminContext();

  const filteredSeasons = useMemo(() => {
    const value = search.trim().toLowerCase();

    return (seasons || []).filter((season) => {
      const matchesSearch =
        !value ||
        season.name?.en?.toLowerCase().includes(value) ||
        season.name?.ar?.includes(value);

      const matchesStatus = status === "All Statuses" || season.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [seasons, search, status]);

  const resetFilters = () => {
    setSearch("");
    setStatus("All Statuses");
  };

  return (
    <>
      <SeasonsFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        onReset={resetFilters}
      />

      {seasonsLoading ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-[12px] text-[var(--color-soft)]">Loading seasons...</p>
        </div>
      ) : (
        <SeasonsTable seasons={filteredSeasons} />
      )}
    </>
  );
}