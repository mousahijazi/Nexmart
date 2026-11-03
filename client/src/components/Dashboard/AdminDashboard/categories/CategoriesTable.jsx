"use client";
import { useEffect, useMemo, useState } from "react";
import { CategoryRow } from "@/index";
import { useAdminContext } from "@/Context/Adminprovider";
import { useTranslations } from "next-intl";

export default function CategoriesTable({ categories = [] }) {
  const t = useTranslations("Admin.categories.table");
  const [openCategories, setOpenCategories] = useState(() => new Set());
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const { categoryProducts, fetchCategoryProducts, loadMoreCategoryProducts } = useAdminContext();

  const totalPages = Math.max(1, Math.ceil(categories.length / rowsPerPage));

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const visibleCategories = useMemo(() => {
    const start = (page - 1) * rowsPerPage;

    return categories.slice(start, start + rowsPerPage);
  }, [categories, page, rowsPerPage]);

  const toggleCategory = (category) => {
    const categoryId = category._id;
    const isOpen = openCategories.has(categoryId);

    setOpenCategories((current) => {
      const updated = new Set(current);

      if (isOpen) {
        updated.delete(categoryId);
      } else {
        updated.add(categoryId);
      }

      return updated;
    });

    const productsData = categoryProducts[categoryId];

    if (!isOpen && !productsData) {
      fetchCategoryProducts(categoryId, category.slug, 1, 10);
    }
  };

  const startItem = categories.length === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const endItem = Math.min(page * rowsPerPage, categories.length);

  return (
    <section className="grid w-full grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="min-w-0 overflow-x-auto scrollbar-thin">
        <div className="min-w-[780px] w-full">
          <div className="grid grid-cols-[minmax(260px,1.7fr)_minmax(150px,1fr)_100px_110px_45px] gap-3 bg-[var(--color-sand)] px-4 py-3 text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--color-soft)]">
            <span>{t("category")}</span>
            <span>{t("parentCategory")}</span>
            <span>{t("products")}</span>
            <span>{t("status")}</span>
            <span>{t("actions")}</span>
          </div>

          <div>
            {visibleCategories.map((category) => (
              <CategoryRow
                key={category._id}
                category={category}
                isExpanded={openCategories.has(category._id)}
                productsData={categoryProducts[category._id]}
                onLoadMore={() =>
                  loadMoreCategoryProducts(category._id, category.slug)
                }
                onToggle={() => toggleCategory(category)}
              />
            ))}

            {visibleCategories.length === 0 && (
              <div className="py-12 text-center text-[12px] text-[var(--color-soft)]">
                {t("empty")}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-[var(--color-divider)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] text-[var(--color-soft)]">
          {t("showing", {
            start: startItem,
            end: endItem,
            total: categories.length,
          })}
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={t("previousPage")}
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[11px] text-[var(--color-soft)] disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[var(--color-sand)]"
          >
            ‹
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (number) => (
              <button
                key={number}
                type="button"
                aria-label={t("goToPage", { page: number })}
                aria-current={page === number ? "page" : undefined}
                onClick={() => setPage(number)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-semibold ${
                  page === number
                    ? "bg-[var(--color-green-dark)] text-white"
                    : "text-[var(--color-soft)] hover:bg-[var(--color-sand)]"
                }`}
              >
                {number}
              </button>
            )
          )}

          <button
            type="button"
            aria-label={t("nextPage")}
            disabled={page === totalPages}
            onClick={() =>
              setPage((current) => Math.min(totalPages, current + 1))
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[11px] text-[var(--color-soft)] disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[var(--color-sand)]"
          >
            ›
          </button>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[var(--color-soft)]">
          <label htmlFor="category-rows-per-page">
            {t("rowsPerPage")}
          </label>

          <select
            id="category-rows-per-page"
            value={rowsPerPage}
            onChange={(event) => {
              setRowsPerPage(Number(event.target.value));
              setPage(1);
            }}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-[10px] outline-none"
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
        </div>
      </div>
    </section>
  );
}