"use client";
import { Download, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAdminContext } from "@/Context/Adminprovider";
import { AdminAddButton } from "@/index";

export default function SeasonsHeader() {
  const t = useTranslations("Admin.seasons");
  const { openSeasonModal } = useAdminContext();

  return (
    <section className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[var(--color-green-dark)] text-white">
          <Sun size={22} />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[25px] font-medium leading-none tracking-[-0.035em] text-[var(--color-ink)] sm:text-[29px]">
              {t("header.title")}
            </h1>

            <span className="rounded-full bg-[var(--color-gold-light)] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.08em] text-[var(--color-green-dark)]">
              {t("header.badge")}
            </span>
          </div>

          <p className="mt-2 max-w-[650px] text-[11px] leading-[1.45] text-[var(--color-soft-2)] sm:text-[13px]">
            {t("header.description")}
          </p>
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center gap-2 xl:w-auto">
        <button
          type="button"
          disabled
          title={t("header.exportUnavailable")}
          className="flex min-h-[44px] cursor-not-allowed items-center justify-center gap-2 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-[11px] font-semibold text-[var(--color-muted)] opacity-60"
        >
          <Download size={16} />
          {t("header.export")}
        </button>

        <AdminAddButton label={t("header.addSeason")} onClick={openSeasonModal} />
      </div>
    </section>
  );
}