"use client";
import { Search, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

function StatusSelect({ value, onChange }) {
  const t = useTranslations("Admin.brands");

  return (
    <div className="relative flex h-[40px] min-w-0 items-center rounded-[9px] bg-[var(--color-surface)]">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-full w-full cursor-pointer appearance-none bg-transparent px-3 pr-9 text-[11px] font-medium text-[var(--color-soft)] outline-none"
      >
        <option value="all">{t("toolbar.allStatuses")}</option>
        <option value="active">{t("status.active")}</option>
        <option value="archived">{t("status.archived")}</option>
      </select>

      <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-soft)]" />
    </div>
  );
}

export default function BrandsToolbar({ search, setSearch, status, setStatus }) {
  const t = useTranslations("Admin.brands");

  return (
    <section className="mb-4 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 sm:p-4">
      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-[minmax(0,1fr)_180px]">
        <label className="relative block min-w-0">
          <span className="sr-only">
            {t("toolbar.searchLabel")}
          </span>

          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("toolbar.searchPlaceholder")}
            className="h-[40px] w-full rounded-[9px] bg-[var(--color-cream)] pl-9 pr-3 text-[11px] text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)] focus:ring-1 focus:ring-[var(--color-gold)]"
          />
        </label>

        <StatusSelect value={status} onChange={setStatus} />
      </div>
    </section>
  );
}