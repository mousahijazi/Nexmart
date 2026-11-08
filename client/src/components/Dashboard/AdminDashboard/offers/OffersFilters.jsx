"use client";
import { Search, RotateCcw } from "lucide-react";
import { FilterSelect } from "@/index";
import { offerStatusOptions, offerTargetOptions } from "./offersData";
import { useTranslations } from "next-intl";

export default function OffersFilters({ search, setSearch, status, setStatus, target, setTarget, season, setSeason, seasonOptions, onReset }) {
  const t = useTranslations("Admin.offers");

  const translateOptions = (options, type) =>
    options.map((option) => {
      const value = typeof option === "object" && option !== null ? option.value : option;
      const normalizedValue = String(value).toLowerCase();
      const key = normalizedValue === "all statuses" || normalizedValue === "all targets" ? "all" : normalizedValue;
      return {
        value,
        label: t(`filters.options.${type}.${key}`),
      };
    });

  return (
    <section className="mb-5 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-2)]" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("filters.searchPlaceholder")}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-field)] py-2.5 pl-9 pr-3 text-[12px] text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted-2)] focus:border-[var(--color-green-light)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect
            label={t("filters.status")}
            value={status}
            onChange={setStatus}
            options={translateOptions(offerStatusOptions, "status")}
          />

          <FilterSelect
            label={t("filters.target")}
            value={target}
            onChange={setTarget}
            options={translateOptions(offerTargetOptions, "target")}
          />

          <FilterSelect
            label={t("filters.season")}
            value={season}
            onChange={setSeason}
            options={seasonOptions}
          />

          <button
            type="button"
            onClick={onReset}
            aria-label={t("filters.reset")}
            className="flex h-[40px] w-[40px] items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-soft)] transition hover:bg-[var(--color-sand)]"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}