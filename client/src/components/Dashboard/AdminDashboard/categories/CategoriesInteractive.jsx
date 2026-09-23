"use client";
import { useMemo, useState } from "react";
import { CategoriesFilters, CategoriesTable } from "@/index";

export default function CategoriesInteractive({ categories }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Statuses");

  const filteredCategories = useMemo(() => {
    const value = search.trim().toLowerCase();

    return categories.filter((category) => {
      const matchesSearch = !value || category.name.en.toLowerCase().includes(value) || category.name.ar.toLowerCase().includes(value);
      const matchesStatus = status === "All Statuses" || category.status === status;
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

      <CategoriesTable categories={filteredCategories} />
    </>
  );
}