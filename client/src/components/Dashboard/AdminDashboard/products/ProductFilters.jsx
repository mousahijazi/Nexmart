"use client";
import { Search, ChevronDown, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

function SelectBox({ value, options, onChange, ariaLabel }) {
  return (
    <div className="relative flex h-[40px] min-w-0 items-center rounded-[9px] bg-[var(--color-surface)]">
      <select
        value={value}
        aria-label={ariaLabel}
        onChange={(event) => onChange(event.target.value)}
        className="h-full w-full cursor-pointer appearance-none bg-transparent px-3 pe-9 text-[11px] font-medium text-[var(--color-soft)] outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-[var(--color-soft)]">
        <ChevronDown size={16} />
      </div>
    </div>
  );
}

export default function ProductFilters({ search, setSearch, category, setCategory, brand, setBrand, stock, setStock, categories, brands }) {
  const t = useTranslations("Admin.products");

  const categoryOptions = [
    { value: "all", label: t("allCategories") },
    ...categories,
  ];

  const brandOptions = [
    { value: "all", label: t("allBrands") },
    ...brands,
  ];

  const stockOptions = [
    { value: "all", label: t("allStockLevels") },
    { value: "inStock", label: t("stock.inStock") },
    { value: "lowStock", label: t("stock.lowStock") },
    { value: "outOfStock", label: t("stock.outOfStock") },
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
        />

        <SelectBox
          value={brand}
          options={brandOptions}
          onChange={setBrand}
          ariaLabel={t("table.brand")}
        />
      </div>

      <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:w-[63%]">
        <SelectBox
          value={stock}
          options={stockOptions}
          onChange={setStock}
          ariaLabel={t("allStockLevels")}
        />

        <div className="relative flex h-[40px] min-w-0 items-center rounded-[9px] bg-[var(--color-surface)]">
          <div className="absolute start-3 text-[var(--color-soft)]">
            <Zap size={16} />
          </div>

          <select
            disabled
            aria-label={t("actions.bulk")}
            className="h-full w-full cursor-not-allowed appearance-none bg-transparent ps-9 pe-9 text-[11px] font-medium text-[var(--color-soft)] opacity-60 outline-none"
          >
            <option>{t("actions.bulk")}</option>
            <option>{t("actions.updateStock")}</option>
            <option>{t("actions.changeCategory")}</option>
            <option>{t("actions.changeStatus")}</option>
          </select>

          <div className="pointer-events-none absolute end-3">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>
    </section>
  );
}
