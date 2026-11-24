"use client";
import { Clock, CalendarDays } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useUserContext } from "@/Context/UserProvider";
import OverviewHeroActions from "./OverviewHeroActions";

export default function OverviewHero() {
  const t = useTranslations("Admin.dashboard");
  const locale = useLocale();
  const { user } = useUserContext();

  const adminName = user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "";

  const formattedDate = new Intl.DateTimeFormat(
    locale === "ar" ? "ar-SA-u-ca-islamic-umalqura" : "en",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(new Date());

  return (
    <section className="rounded-2xl bg-[var(--color-green-dark)] p-6 text-white sm:p-7">
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

        <OverviewHeroActions />
      </div>
    </section>
  );
}