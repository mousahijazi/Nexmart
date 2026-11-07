"use client";
import { useTranslations, useLocale } from "next-intl";
import { Package, Download } from "lucide-react";
import { ProductModal, AdminAddButton, ProductsInteractive, ProductStats } from "@/index";
import { useAdminContext } from "@/Context/Adminprovider";

export default function ProductsDashboard() {
  const t = useTranslations("Admin.products");
  const locale = useLocale();
  const { openProductModal } = useAdminContext();

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="min-w-0 bg-[var(--color-cream)] text-[var(--color-ink)]">
      <div className="mx-auto w-full max-w-[1120px] py-5 lg:py-3">
        <section className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[var(--color-green-dark)] text-white">
              <Package aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="min-[400px]:text-[25px] text-[23px] font-medium leading-none tracking-[-0.035em] text-[var(--color-ink)] sm:text-[27px]">
                  {t("title")}
                </h1>

                <span className="rounded-full bg-[#F4D477] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.08em] text-[#6B5010]">
                  {t("catalogBadge")}
                </span>
              </div>

              <p className="mt-2 max-w-[650px] text-[11px] leading-[1.45] text-[var(--color-soft-2)] sm:text-[13px]">
                {t("description")}
              </p>
            </div>
          </div>

          <div className="flex w-full flex-row flex-wrap items-center gap-2 xl:w-auto">
            <button
              type="button"
              disabled
              title="Export is not connected yet"
              className="flex h-[44px] cursor-not-allowed items-center justify-center gap-2 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-cream)] px-4 text-[11px] font-semibold text-[var(--color-ink)] opacity-60"
            >
              <Download aria-hidden="true" />
              {t("exportCatalog")}
            </button>

            <AdminAddButton label={t("addProduct")} onClick={openProductModal} />
          </div>
        </section>

        <ProductModal />
        <ProductStats />
        <ProductsInteractive />
      </div>
    </div>
  );
}