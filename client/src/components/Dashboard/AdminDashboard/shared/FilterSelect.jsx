"use client";
import { ChevronDown } from "lucide-react";

export default function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="relative min-w-[150px] flex-1 sm:flex-none">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="w-full appearance-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 pl-3 pr-8 text-[12px] font-medium text-[var(--color-ink)] outline-none transition focus:border-[var(--color-green-light)]"
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {label}: {option}
          </option>
        ))}
      </select>

      <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-muted-2)]" />
    </div>
  );
}