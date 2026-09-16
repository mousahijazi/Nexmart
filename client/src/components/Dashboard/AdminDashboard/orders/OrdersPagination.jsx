import { ChevronLeft, ChevronRight } from "lucide-react";

function getPageNumbers(current, total) {
  const pages = new Set([1, total, current, current - 1, current + 1]);
  return [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
}

export default function OrdersPagination({page, pageSize, totalCount, onPageChange, onPageSizeChange, pageSizeOptions = [5, 10, 25, 50]}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="flex flex-col gap-3 border-t border-[var(--color-divider)] pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm text-[var(--color-muted-2)]">
        <span> Showing {start}-{end} of {totalCount.toLocaleString("en-US")} orders </span>
        <span className="text-[var(--color-muted-3)]">&middot;</span>
        <label className="flex items-center gap-1.5">
          Rows per page:
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-1.5 py-1 text-sm text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-green-light)]"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-muted-2)] enabled:hover:bg-[var(--color-sand)] disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </button>

        {pageNumbers.map((num, idx) => {
          const prev = pageNumbers[idx - 1];
          const showEllipsis = prev !== undefined && num - prev > 1;
          return (
            <span key={num} className="flex items-center">
              {showEllipsis && <span className="px-1.5 text-sm text-[var(--color-muted-3)]">&hellip;</span>}
              <button
                type="button"
                onClick={() => onPageChange(num)}
                className={
                  num === page
                    ? "flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-green)] text-sm font-medium text-white"
                    : "flex h-8 w-8 items-center justify-center rounded-md text-sm text-[var(--color-soft-2)] hover:bg-[var(--color-sand)]"
                }
              >
                {num}
              </button>
            </span>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-muted-2)] enabled:hover:bg-[var(--color-sand)] disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}