"use client";
import { useMemo, useState } from "react";
import { CategoriesFilters, CategoriesTable } from "@/index";
import { useAdminContext } from "@/Context/Adminprovider";
import { useTranslations } from "next-intl";

export default function CategoriesInteractive() {
  const t = useTranslations("Admin.categories");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const { categories = [], categoriesLoading } = useAdminContext();

  const filteredCategories = useMemo(() => {
    const value = search.trim().toLocaleLowerCase();

    return categories.filter((category) => {
      const englishName = category.name?.en || "";
      const arabicName = category.name?.ar || "";

      const matchesSearch =
        !value ||
        englishName.toLocaleLowerCase().includes(value) ||
        arabicName.includes(value);

      const categoryStatus = category.isActive ? "active" : "archived";

      const matchesStatus =
        status === "all" || categoryStatus === status;

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
            {t("loading")}
          </p>
        </div>
      ) : (
        <CategoriesTable categories={filteredCategories} />
      )}
    </>
  );
}