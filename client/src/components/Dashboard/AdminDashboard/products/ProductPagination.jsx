"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

const LIMIT_OPTIONS = [5, 10, 25, 50];

function getPageNumbers(current, total) {
  const pages = new Set([1, total, current, current - 1, current + 1]);

  return [...pages]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);
}

export default function ProductPagination({ page, totalPages, totalCount, limit, onPageChange, onLimitChange }) {
  const t = useTranslations("Admin.products.pagination");
  const locale = useLocale();

  const numberFormat = new Intl.NumberFormat(locale);

  const safeTotalPages = Math.max(1, totalPages || 1);
  const start = totalCount === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, totalCount);

  const pageNumbers = getPageNumbers(page, safeTotalPages);

  const rangeText = (
    <>
      {t("showing")}{" "}
      <span className="font-semibold text-[var(--color-ink)]">
        {numberFormat.format(start)}–{numberFormat.format(end)}
      </span>{" "}
      {t("of")}{" "}
      <span className="font-semibold text-[var(--color-ink)]">
        {numberFormat.format(totalCount)}
      </span>{" "}
      {t("products")}
    </>
  );

  const limitSelect = (
    <select
      value={limit}
      onChange={(event) => onLimitChange(Number(event.target.value))}
      className="h-7 rounded-[6px] border border-[var(--color-border)] bg-[var(--color-cream)] px-2 text-[10px] text-[var(--color-ink)] outline-none"
    >
      {LIMIT_OPTIONS.map((option) => (
        <option key={option} value={option}>
          {numberFormat.format(option)}
        </option>
      ))}
    </select>
  );

  return (
    <>
      <div className="hidden flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between md:flex">
        <p className="text-[10px] text-[var(--color-soft-2)]">
          {rangeText}
        </p>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-[10px] text-[var(--color-soft-2)]">
            {t("rowsPerPage")}
            {limitSelect}
          </label>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Previous page"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="flex h-7 w-7 items-center justify-center rounded-[7px] text-[var(--color-muted)] transition hover:bg-[var(--color-surface)] disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>

            {pageNumbers.map((num, index) => {
              const previous = pageNumbers[index - 1];
              const showEllipsis =
                previous !== undefined && num - previous > 1;

              return (
                <span key={num} className="flex items-center">
                  {showEllipsis && (
                    <span className="px-1 text-[10px] text-[var(--color-muted)]">
                      ...
                    </span>
                  )}

                  <button
                    type="button"
                    aria-label={`Page ${num}`}
                    aria-current={num === page ? "page" : undefined}
                    onClick={() => onPageChange(num)}
                    className={`flex h-7 min-w-7 items-center justify-center rounded-[7px] px-1 text-[10px] font-medium ${
                      num === page
                        ? "bg-[var(--color-green-dark)] text-white"
                        : "text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
                    }`}
                  >
                    {numberFormat.format(num)}
                  </button>
                </span>
              );
            })}

            <button
              type="button"
              aria-label="Next page"
              onClick={() =>
                onPageChange(Math.min(safeTotalPages, page + 1))
              }
              disabled={page === safeTotalPages}
              className="flex h-7 w-7 items-center justify-center rounded-[7px] text-[var(--color-muted)] transition hover:bg-[var(--color-surface)] disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-3 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-cream)] p-3 md:hidden">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] text-[var(--color-soft-2)]">
            {rangeText}
          </p>

          {limitSelect}
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            aria-label="Previous page"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="flex h-8 w-8 items-center justify-center rounded-[7px] border border-[var(--color-border)] text-[var(--color-muted)] disabled:opacity-40"
          >
            <ChevronLeft size={14} />
          </button>

          <span className="px-2 text-[10px] text-[var(--color-soft-2)]">
            {t("page", {
              current: numberFormat.format(page),
              total: numberFormat.format(safeTotalPages),
            })}
          </span>

          <button
            type="button"
            aria-label="Next page"
            onClick={() =>
              onPageChange(Math.min(safeTotalPages, page + 1))
            }
            disabled={page === safeTotalPages}
            className="flex h-8 w-8 items-center justify-center rounded-[7px] border border-[var(--color-border)] text-[var(--color-muted)] disabled:opacity-40"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </>
  );
}
