"use client";
import { SeasonsFilters, SeasonsTable } from "@/index";
import { useAdminContext } from "@/Context/Adminprovider";
import SeasonsTableSkeleton from "./SeasonsTableSkeleton";

export default function SeasonsInteractive() {
  const { seasons, seasonsLoading, seasonsSearch, setSeasonsSearch, seasonsStatus, setSeasonsStatus } = useAdminContext();

  const resetFilters = () => {
    setSeasonsSearch("");
    setSeasonsStatus("All Statuses");
  };

  return (
    <>
      <SeasonsFilters
        search={seasonsSearch}
        setSearch={setSeasonsSearch}
        status={seasonsStatus}
        setStatus={setSeasonsStatus}
        onReset={resetFilters}
      />

      {seasonsLoading ? (
        <SeasonsTableSkeleton />
      ) : (
        <SeasonsTable seasons={seasons} />
      )}
    </>
  );
}