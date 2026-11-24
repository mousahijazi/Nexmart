"use client";
import dynamic from "next/dynamic";
import { Download, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAdminContext } from "@/Context/Adminprovider";

const ProductModal = dynamic(() => import("../products/productModal/ProductModal"), { ssr: false });

export default function OverviewHeroActions() {
  const t = useTranslations("Admin.dashboard");

  const { openProductModal, isProductModalOpen } = useAdminContext();

  return (
    <>
      <div className="flex shrink-0 flex-wrap items-center gap-2 md:flex-col">
        <button
          type="button"
          disabled
          className="flex items-center gap-1.5 rounded-lg border border-white/20 px-3.5 py-2 text-sm font-medium text-white opacity-50"
        >
          <Download size={15} aria-hidden="true" />
          {t("exportAudit")}
        </button>

        <button
          type="button"
          onClick={openProductModal}
          className="flex items-center gap-1.5 rounded-lg bg-[var(--color-gold)] px-4 py-2.5 text-sm font-semibold text-[var(--color-green-dark)] transition hover:brightness-105"
        >
          <Plus size={17} aria-hidden="true" />
          {t("addProduct")}
        </button>
      </div>

      {isProductModalOpen && <ProductModal />}
    </>
  );
}