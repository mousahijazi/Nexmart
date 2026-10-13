"use client";
import { Search, RotateCcw } from "lucide-react";
import { FilterSelect } from "@/index";
import { seasonStatusOptions } from "./seasonsData";

export default function SeasonsFilters({ search, setSearch, status, setStatus, onReset }) {
  return (
    <section className="mb-5 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-2)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search season name (EN/AR)..."
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-field)] py-2.5 pl-9 pr-3 text-[12px] text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted-2)] focus:border-[var(--color-green-light)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect label="Status" value={status} onChange={setStatus} options={seasonStatusOptions} />

          <button
            type="button"
            onClick={onReset}
            aria-label="Reset filters"
            className="flex h-[40px] w-[40px] items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-soft)] transition hover:bg-[var(--color-sand)]"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}