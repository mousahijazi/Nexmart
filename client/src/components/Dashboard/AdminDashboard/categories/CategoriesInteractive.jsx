"use client";
import { useMemo, useState } from "react";
import { CategoriesFilters, CategoriesTable } from "@/index";
import { useAdminContext } from "@/Context/Adminprovider";

export default function CategoriesInteractive() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Statuses");
  const { categories, categoriesLoading } = useAdminContext();

  const filteredCategories = useMemo(() => {
    const value = search.trim().toLowerCase();

    return (categories || []).filter((category) => {
      const matchesSearch =
        !value ||
        category.name.en.toLowerCase().includes(value) ||
        category.name.ar.toLowerCase().includes(value);

      const matchesStatus =
        status === "All Statuses" || category.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, status]);

  return (
    <>
      <CategoriesFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
      />

      {categoriesLoading ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-[12px] text-[var(--color-soft)]">
            جاري تحميل الفئات...
          </p>
        </div>
      ) : (
        <CategoriesTable categories={filteredCategories} />
      )}
    </>
  );
}