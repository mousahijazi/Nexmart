"use client";
import { useTranslations } from "next-intl";
import { ProductRow } from "@/index";

export default function ProductTable({ products, onToggleActive, onEdit }) {
  const t = useTranslations("Admin.products.table");

  return (
    <section className="grid w-full grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-cream)]">
      <div className="min-w-0 overflow-x-auto scrollbar-thin">
        <div className="min-w-[950px] w-full">
          <div className="grid grid-cols-[44px_minmax(280px,1.5fr)_110px_110px_90px_110px_90px] items-center bg-[var(--color-surface)] px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--color-soft)]">
            <div />
            <div>{t("productDetail")}</div>
            <div>{t("category")}</div>
            <div>{t("brand")}</div>
            <div>{t("unitPrice")}</div>
            <div>{t("stockLevel")}</div>
            <div>{t("catalogStatus")}</div>
          </div>

          {products.length > 0 ? (
            products.map((product) => (
              <ProductRow
                key={product._id}
                product={product}
                onToggleActive={onToggleActive}
                onEdit={onEdit}
              />
            ))
          ) : (
            <div className="flex min-h-[180px] items-center justify-center text-[12px] text-[var(--color-muted)]">
              {t("empty")}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}