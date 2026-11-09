"use client";
import { CalendarDays, Zap, Clock, Tag, PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { StatCard } from "@/index";

export default function SeasonsStats({ stats }) {
  const t = useTranslations("Admin.seasons");

  return (
    <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label={t("stats.total")}
        value={stats.total}
        note={
          <span className="inline-flex items-center gap-1">
            <PlusCircle size={12} />
            {t("stats.plannedNextYear", {
              count: stats.plannedNextYear,
            })}
          </span>
        }
        icon={CalendarDays}
        accent="green"
      />

      <StatCard
        label={t("stats.active")}
        value={stats.active}
        note={t("stats.activeNote")}
        icon={Zap}
        accent="green"
      />

      <StatCard
        label={t("stats.upcoming")}
        value={stats.upcoming}
        note={t("stats.upcomingNote")}
        icon={Clock}
        accent="gold"
      />

      <StatCard
        label={t("stats.withOffers")}
        value={stats.withOffers}
        note={t("stats.withOffersNote", {
          percent: stats.withOffersPercent,
        })}
        icon={Tag}
        accent="green"
      />
    </section>
  );
}