"use client";
import { Search, RotateCcw } from "lucide-react";
import { FilterSelect } from "@/index";

const STATUS_OPTIONS = [
  "All Statuses",
  "Active",
  "Archived",
];

const STATUS_VALUE_MAP = {
  "All Statuses": "",
  Active: "active",
  Archived: "archived",
};

export default function CategoriesFilters({ search, setSearch, status, setStatus, onReset }) {
  const statusLabel = status === "active" ? "Active" : status === "archived" ? "Archived" : "All Statuses";

  return (
    <section className="mb-5 min-w-0 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-2)]" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search categories..."
            className="w-full min-w-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-field)] py-2.5 pl-9 pr-3 text-[12px] text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted-2)] focus:border-[var(--color-green-light)]"
          />
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <FilterSelect
            label="Category Status"
            value={statusLabel}
            onChange={(value) =>
              setStatus(STATUS_VALUE_MAP[value] ?? "")
            }
            options={STATUS_OPTIONS}
          />

          <button
            type="button"
            onClick={onReset}
            aria-label="Reset filters"
            className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-soft)] transition hover:bg-[var(--color-sand)]"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}