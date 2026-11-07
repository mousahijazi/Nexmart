"use client";
import { useAdminContext } from "@/Context/Adminprovider";
import { BrandsToolbar, BrandsTable } from "@/index";
import BrandsTableSkeleton from "./BrandsTableSkeleton";

export default function BrandsInteractive() {
  const { brands, brandsLoading, brandsSearch, setBrandsSearch, brandsStatus, setBrandsStatus } = useAdminContext();

  return (
    <>
      <BrandsToolbar
        search={brandsSearch}
        setSearch={setBrandsSearch}
        status={brandsStatus}
        setStatus={setBrandsStatus}
      />

      {brandsLoading ? (
        <BrandsTableSkeleton />
      ) : (
        <BrandsTable brands={brands} />
      )}
    </>
  );
}