"use client";
import { useMemo, useState } from "react";
import { SeasonsFilters, SeasonsTable } from "@/index";
import { useAdminContext } from "@/Context/Adminprovider";
import SeasonsTableSkeleton from "./SeasonsTableSkeleton";

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
        <SeasonsTableSkeleton />
      ) : (
        <SeasonsTable seasons={filteredSeasons} />
      )}
    </>
  );
}