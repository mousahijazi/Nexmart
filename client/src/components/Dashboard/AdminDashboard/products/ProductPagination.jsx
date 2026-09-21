"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

const LIMIT_OPTIONS = [5, 10, 25, 50];

function getPageNumbers(current, total) {
  const pages = new Set([1, total, current, current - 1, current + 1]);
  return [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
}

export default function ProductPagination({ page, totalPages, totalCount, limit, onPageChange, onLimitChange }) {
  const safeTotalPages = Math.max(1, totalPages || 1);
  const start = totalCount === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, totalCount);
  const pageNumbers = getPageNumbers(page, safeTotalPages);

  return (
    <>
      <div className="hidden flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between md:flex">
        <p className="text-[10px] text-[var(--color-soft-2)]">
          Showing{" "}
          <span className="font-semibold text-[var(--color-ink)]">
            {start}–{end}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-[var(--color-ink)]">
            {totalCount.toLocaleString("en-US")}
          </span>{" "}
          products
        </p>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-[10px] text-[var(--color-soft-2)]">
            Rows per page:
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="h-7 rounded-[6px] border border-[var(--color-border)] bg-[var(--color-cream)] px-2 text-[10px] text-[var(--color-ink)] outline-none"
            >
              {LIMIT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="flex h-7 w-7 items-center justify-center rounded-[7px] text-[var(--color-muted)] transition hover:bg-[var(--color-surface)] disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>

            {pageNumbers.map((num, idx) => {
              const prev = pageNumbers[idx - 1];
              const showEllipsis = prev !== undefined && num - prev > 1;
              return (
                <span key={num} className="flex items-center">
                  {showEllipsis && (
                    <span className="px-1 text-[10px] text-[var(--color-muted)]">...</span>
                  )}
                  <button
                    type="button"
                    onClick={() => onPageChange(num)}
                    className={`flex h-7 min-w-7 items-center justify-center rounded-[7px] px-1 text-[10px] font-medium ${
                      num === page
                        ? "bg-[var(--color-green-dark)] text-white"
                        : "text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
                    }`}
                  >
                    {num.toLocaleString("en-US")}
                  </button>
                </span>
              );
            })}

            <button
              type="button"
              onClick={() => onPageChange(Math.min(safeTotalPages, page + 1))}
              disabled={page === safeTotalPages}
              className="flex h-7 w-7 items-center justify-center rounded-[7px] text-[var(--color-muted)] transition hover:bg-[var(--color-surface)] disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="mt-3 flex flex-col gap-3 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-cream)] p-3 md:hidden">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] text-[var(--color-soft-2)]">
            Showing{" "}
            <span className="font-semibold text-[var(--color-ink)]">
              {start}–{end}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[var(--color-ink)]">
              {totalCount.toLocaleString("en-US")}
            </span>
          </p>

          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="h-7 rounded-[6px] border border-[var(--color-border)] bg-[var(--color-cream)] px-2 text-[10px] text-[var(--color-ink)] outline-none"
          >
            {LIMIT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt} / page
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="flex h-8 w-8 items-center justify-center rounded-[7px] border border-[var(--color-border)] text-[var(--color-muted)] disabled:opacity-40"
          >
            <ChevronLeft size={14} />
          </button>

          <span className="px-2 text-[10px] text-[var(--color-soft-2)]">
            Page {page} of {safeTotalPages}
          </span>

          <button
            type="button"
            onClick={() => onPageChange(Math.min(safeTotalPages, page + 1))}
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