"use client";
import { Search, ChevronDown, Zap, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

function SelectBox({ value, options, onChange, ariaLabel, isLoading }) {
  return (
    <div className="relative flex h-[40px] min-w-0 items-center rounded-[9px] bg-[var(--color-surface)]">
      <select
        value={value}
        aria-label={ariaLabel}
        disabled={isLoading}
        onChange={(event) => onChange(event.target.value)}
        className="h-full w-full cursor-pointer appearance-none bg-transparent px-3 pe-9 text-[11px] font-medium text-[var(--color-soft)] outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-[var(--color-soft)]">
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <ChevronDown size={16} />
        )}
      </div>
    </div>
  );
}

export default function ProductFilters({ search, setSearch, category, setCategory, brand, setBrand, stock, setStock, status, setStatus, categories, brands, categoriesLoading, brandsLoading }) {
  const t = useTranslations("Admin.products");

  const categoryOptions = [
    { 
      value: "all", 
      label: categoriesLoading ? t("categories.loading") : t("allCategories") 
    },
    ...categories,
  ];

  const brandOptions = [
    { 
      value: "all", 
      label: brandsLoading ? t("brands.loading") : t("allBrands") 
    },
    ...brands,
  ];

  const stockOptions = [
    { value: "all", label: t("allStockLevels") },
    { value: "inStock", label: t("stock.inStock") },
    { value: "lowStock", label: t("stock.lowStock") },
    { value: "outOfStock", label: t("stock.outOfStock") },
  ];

  const statusOptions = [
    { value: "all", label: t("allStatuses") },
    { value: "active", label: t("status.active") },
    { value: "archived", label: t("status.archived") },
  ];

  return (
    <section className="mb-4 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-cream)] p-3.5 sm:p-4">
      <div className="grid grid-cols-1 gap-2.5 min-[1200px]:grid-cols-[minmax(260px,1.3fr)_minmax(150px,0.8fr)_minmax(150px,0.8fr)]">
        <label className="relative block min-w-0">
          <span className="sr-only">{t("searchLabel")}</span>

          <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
            <Search size={16} />
          </span>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("search")}
            className="h-[40px] w-full rounded-[9px] bg-[var(--color-surface)] ps-9 pe-3 text-[11px] text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)] focus:ring-1 focus:ring-[var(--color-gold)]"
          />
        </label>

        <SelectBox
          value={category}
          options={categoryOptions}
          onChange={setCategory}
          ariaLabel={t("table.category")}
          isLoading={categoriesLoading}
        />

        <SelectBox
          value={brand}
          options={brandOptions}
          onChange={setBrand}
          ariaLabel={t("table.brand")}
          isLoading={brandsLoading}
        />
      </div>

      <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:w-[63%]">
        <SelectBox
          value={stock}
          options={stockOptions}
          onChange={setStock}
          ariaLabel={t("allStockLevels")}
        />

        <SelectBox
          value={status}
          options={statusOptions}
          onChange={setStatus}
          ariaLabel={t("allStatuses")}
        />
      </div>

      <div className="mt-2.5 flex h-[40px] w-full items-center rounded-[9px] bg-[var(--color-surface)] px-3 text-[11px] font-medium text-[var(--color-soft)] opacity-60 sm:w-[63%]">
        <Zap size={16} className="me-2" />
        {t("actions.bulk")}
        <span className="ms-auto text-[10px]">
          {t("actions.comingSoon")}
        </span>
      </div>
    </section>
  );
}