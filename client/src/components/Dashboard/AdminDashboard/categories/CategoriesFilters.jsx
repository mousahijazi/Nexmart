"use client";
import { Search, ChevronDown } from "lucide-react";

function SelectBox({ value, options, onChange }) {
  return (
    <div className="relative flex h-[40px] min-w-0 items-center rounded-[9px] bg-[var(--color-surface)]">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="
          h-full w-full
          cursor-pointer
          appearance-none
          bg-transparent
          px-3 pr-9
          text-[11px]
          font-medium
          text-[var(--color-soft)]
          outline-none
        "
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-soft)]" />
    </div>
  );
}

export default function CategoriesFilters({ search, setSearch, status, setStatus }) {
  return (
    <section className="mb-4 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 sm:p-4">
      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-[minmax(0,1fr)_180px]">
        <label className="relative block min-w-0">
          <span className="sr-only">
            Search categories
          </span>

          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search category name (EN/AR)..."
            className="
              h-[40px] w-full
              rounded-[9px]
              bg-[var(--color-cream)]
              pl-9 pr-3
              text-[11px] text-[var(--color-ink)]
              outline-none
              placeholder:text-[var(--color-muted)]
              focus:ring-1 focus:ring-[var(--color-gold)]
            "
          />
        </label>

        <SelectBox
          value={status}
          onChange={setStatus}
          options={[
            "All Statuses",
            "Active",
            "Draft",
            "Archived",
          ]}
        />
      </div>
    </section>
  );
}