"use client";
import { useEffect, useState } from "react";
import { CategoriesFilters, CategoriesTable, CategoriesTableSkeleton } from "@/index";
import { useAdminContext } from "@/Context/Adminprovider";

export default function CategoriesInteractive() {
  const { categories, categoriesLoading, categoriesSearch, searchCategories, categoriesStatusFilter, filterCategoriesByStatus, resetCategoriesFilters, categoriesPage, categoriesLimit, categoriesTotal, categoriesTotalPages, changeCategoriesPage, setCategoriesLimit } = useAdminContext();
  const [searchInput, setSearchInput] = useState(categoriesSearch);

  useEffect(() => {
    setSearchInput(categoriesSearch);
  }, [categoriesSearch]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput !== categoriesSearch) {
        searchCategories(searchInput);
      }
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [searchInput, categoriesSearch, searchCategories]);

  const handleReset = () => {
    setSearchInput("");
    resetCategoriesFilters();
  };

  return (
    <>
      <CategoriesFilters
        search={searchInput}
        setSearch={setSearchInput}
        status={categoriesStatusFilter || "All Statuses"}
        setStatus={(value) =>
          filterCategoriesByStatus(value === "All Statuses" ? "" : value.toLowerCase())
        }
        onReset={handleReset}
      />

      {categoriesLoading ? (
        <CategoriesTableSkeleton rows={categoriesLimit} />
      ) : (
        <CategoriesTable
          categories={categories}
          page={categoriesPage}
          limit={categoriesLimit}
          total={categoriesTotal}
          totalPages={categoriesTotalPages}
          onPageChange={changeCategoriesPage}
          onLimitChange={setCategoriesLimit}
        />
      )}
    </>
  );
}