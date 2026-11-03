"use client";
import { useTranslations } from "next-intl";

export function CategoryBadge({ category }) {
  return (
    <span className="inline-flex rounded-full bg-[var(--color-surface)] px-2.5 py-1 text-[10px] font-medium leading-[1.1] text-[var(--color-soft)]">
      {category}
    </span>
  );
}

export function StockBadge({ status, stock }) {
  const t = useTranslations("Admin.products.stock");

  const styles = {
    outOfStock: "bg-[#F7D8D4] text-[var(--color-red)]",
    lowStock: "bg-[#F8D36C] text-[#70500A]",
    inStock: "bg-[#BDEEDB] text-[var(--color-green)]",
  };

  return (
    <div
      className={`inline-flex min-w-[77px] flex-col rounded-[7px] px-2 py-1.5 text-[10px] leading-[1.15] ${
        styles[status] || styles.inStock
      }`}
    >
      <span className="font-medium">{t(status)}</span>
      <span className="mt-0.5">
        {t("units", { count: stock ?? 0 })}
      </span>
    </div>
  );
}

export function CatalogStatus({ status }) {
  const t = useTranslations("Admin.products.catalogStatus");

  const isDraft = status === "draft";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold ${
        isDraft
          ? "bg-[#E1E2DD] text-[var(--color-soft)]"
          : "bg-[var(--color-green-dark)] text-white"
      }`}
    >
      {t(status)}
    </span>
  );
}