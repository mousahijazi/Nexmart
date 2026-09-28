"use client";
import { useMemo, useState } from "react";
import { BrandsToolbar, BrandsTable, BrandsPagination } from "@/index";
import { useLocale } from "next-intl";

export default function BrandsInteractive({brands}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Statuses");
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

      <BrandsTable brands={filteredBrands} />
      <BrandsPagination />
    </>
  );
}
