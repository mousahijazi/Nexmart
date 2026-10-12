"use client";

export default function TablePagination({ page, totalPages, total, rowsPerPage, onPageChange, onRowsChange, noun = "items" }) {
  const from = total === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const to = Math.min(page * rowsPerPage, total);

  const arrowClass = "flex h-8 w-8 items-center justify-center rounded-lg text-[11px] text-[var(--color-soft)] hover:bg-[var(--color-sand)] disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex flex-col gap-3 border-t border-[var(--color-divider)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[10px] text-[var(--color-soft)]">
        Showing {from} - {to} of {total} {noun}
      </p>

      <div className="flex items-center gap-1">
        <button type="button" disabled={page === 1} onClick={() => onPageChange(Math.max(1, page - 1))} className={arrowClass}>
          ‹
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
          <button
            key={number}
            type="button"
            onClick={() => onPageChange(number)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-semibold ${
              page === number
                ? "bg-[var(--color-green-dark)] text-white"
                : "text-[var(--color-soft)] hover:bg-[var(--color-sand)]"
            }`}
          >
            {number}
          </button>
        ))}

        <button type="button" disabled={page === totalPages} onClick={() => onPageChange(Math.min(totalPages, page + 1))} className={arrowClass}>
          ›
        </button>
      </div>

      <div className="flex items-center gap-2 text-[10px] text-[var(--color-soft)]">
        <span>Rows per page:</span>
        <select
          value={rowsPerPage}
          onChange={(e) => onRowsChange(Number(e.target.value))}
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-[10px] outline-none"
        >
          <option value="6">6</option>
          <option value="12">12</option>
          <option value="24">24</option>
        </select>
      </div>
    </div>
  );
}