"use client";
import { useState } from "react";
import { CategoryRow } from "@/index";
import { useAdminContext } from "@/Context/Adminprovider";
import { useTranslations } from "next-intl";
import { categoriesGridCols, categoriesTableMinWidth } from "./categoriesData";

export default function CategoriesTable({ categories, page, limit, total, totalPages, onPageChange, onLimitChange }) {
  const t = useTranslations("Admin.categories.table");
  const [openCategories, setOpenCategories] = useState([]);
  const { categoryProducts, fetchCategoryProducts, loadMoreCategoryProducts } = useAdminContext();

  const toggleCategory = async (category) => {
    const categoryId = category._id;

    const isOpen = openCategories.includes(categoryId);

    setOpenCategories((current) =>
      isOpen
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId]
    );

    if (!isOpen && !categoryProducts[categoryId]?.loaded) {
      await fetchCategoryProducts(categoryId, category.slug, 1, 10);
    }
  };

  return (
    <section className="grid w-full grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="min-w-0 overflow-x-auto scrollbar-thin">
        <div className={`${categoriesTableMinWidth} w-full`}>
          <div className={`grid ${categoriesGridCols} gap-3 bg-[var(--color-sand)] px-4 py-3 text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--color-soft)]`}>
            <span>{t("category")}</span>
            <span>{t("parentCategory")}</span>
            <span>{t("products")}</span>
            <span>{t("status")}</span>
            <span>{t("actions")}</span>
          </div>

          <div>
            {categories.length === 0 ? (
              <div className="py-12 text-center text-[12px] text-[var(--color-soft)]">
                {t("empty")}
              </div>
            ) : (
              categories.map((category) => (
                <CategoryRow
                  key={category._id}
                  category={category}
                  isExpanded={openCategories.includes(category._id)}
                  onToggle={() => toggleCategory(category)}
                  productsData={categoryProducts[category._id]}
                  onLoadMore={() =>
                    loadMoreCategoryProducts(category._id, category.slug)
                  }
                />
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-[var(--color-border)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-[11px] text-[var(--color-soft)]">
          <span>Rows per page:</span>

          <select
            value={limit}
            onChange={(event) =>
              onLimitChange(Number(event.target.value))
            }
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-field)] px-2 py-1.5 text-[11px] text-[var(--color-ink)] outline-none"
          >
            {[5, 10, 25, 50].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>

          <span>
            {total === 0
              ? "0 results"
              : `${(page - 1) * limit + 1}-${Math.min(page * limit, total)} of ${total}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-[11px] text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-[11px] text-[var(--color-soft)]">
            Page {page} of {Math.max(totalPages, 1)}
          </span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-[11px] text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}