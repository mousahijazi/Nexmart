"use client";
import { useMemo, useState } from "react";
import { BrandsToolbar, BrandsTable } from "@/index";
import { useLocale } from "next-intl";
import { useAdminContext } from "@/Context/Adminprovider";
import BrandsTableSkeleton from "./BrandsTableSkeleton";

export default function BrandsInteractive() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Statuses");
  const { brands, brandsLoading } = useAdminContext();
  const locale = useLocale();

  const filteredBrands = useMemo(() => {
    const value = search.trim().toLowerCase();

    return (brands || []).filter((brand) => {
      const matchesSearch = !value || brand.name?.[locale]?.toLowerCase().includes(value);

      const matchesStatus = status === "All Statuses" ||
        (status === "Active" && brand.isActive) ||
        (status === "Draft" && !brand.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [brands, search, status]);

  return (
    <>
      <BrandsToolbar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
      />
      {brandsLoading ? (
          <BrandsTableSkeleton />
        ) : (
          <>
            <BrandsTable brands={filteredBrands} />
          </>
        )}
    </>
  );
}
