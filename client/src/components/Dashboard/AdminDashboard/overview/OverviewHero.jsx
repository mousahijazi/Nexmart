"use client";
import { Clock, CalendarDays, Download } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { heroStats } from "./Stats";
import { AdminAddButton, ProductModal } from "@/index";
import { useAdminContext } from "@/Context/Adminprovider";

export default function OverviewHero({ adminName = "Eng. Tariq Al-Mansoor", dateLabel, onExport, onAddProduct }) {
  const t = useTranslations("Admin.dashboard");
  const locale = useLocale();
  const { openProductModal } = useAdminContext();

  const formattedDate =
    dateLabel ||
    new Intl.DateTimeFormat(
      locale === "ar" ? "ar-SA-u-ca-islamic-umalqura" : "en",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    ).format(new Date());

  const heroStatKeys = {
    "Daily GMV": "dailyGmv",
    "Fulfillment SLA": "fulfillmentSla",
    "Active Cart Sessions": "activeCartSessions",
  };

  return (
    <div className="rounded-2xl bg-[var(--color-green-dark)] p-6 text-white sm:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-white/60">
          <Clock size={13} aria-hidden="true" />
          {t("consoleTitle")}
        </span>

        <span className="inline-flex items-center gap-1.5 text-xs text-white/60">
          <CalendarDays size={13} aria-hidden="true" />
          {formattedDate}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold sm:text-[28px]">
            {t("greeting", { name: adminName })}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">
            {t("description")}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 md:flex-col">
          <button
            type="button"
            onClick={onExport}
            disabled={!onExport}
            className="flex items-center gap-1.5 rounded-lg border border-white/20 px-3.5 py-2 text-sm font-medium text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={15} aria-hidden="true" />
            {t("exportAudit")}
          </button>

          <AdminAddButton label={t("addProduct")} onClick={onAddProduct || openProductModal} />
        </div>
      </div>

      <ProductModal />

      <div className="mt-5 flex flex-wrap gap-2">
        {heroStats.map(({ icon: Icon, label, value }) => {
          const translationKey = heroStatKeys[label];

          return (
            <span key={label} className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white">
              <Icon size={13} aria-hidden="true" className="text-[var(--color-gold-light)]" />

              <span className="text-white/60">
                {translationKey ? t(`heroStats.${translationKey}`) : label} :
              </span>

              <span className="font-medium">{value}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}