import { Tag, BadgeCheck, CalendarClock, History, TrendingUp } from "lucide-react";
import { StatCard } from "@/index";
import { useTranslations } from "next-intl";

export default function OffersStats({ stats }) {
  const t = useTranslations("Admin.offers");

  return (
    <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label={t("stats.total")}
        value={stats.total}
        note={
          <span className="inline-flex items-center gap-1">
            <TrendingUp size={12} /> +{stats.addedThisMonth} {t("stats.addedThisMonth")}
          </span>
        }
        icon={Tag}
        accent="green"
      />
      <StatCard label={t("stats.active")} value={stats.active} note={t("stats.activeNote")} icon={BadgeCheck} accent="green" />
      <StatCard label={t("stats.scheduled")} value={stats.scheduled} note={t("stats.scheduledNote")} icon={CalendarClock} accent="gold" />
      <StatCard label={t("stats.expired")} value={stats.expired} note={t("stats.expiredNote")} icon={History} accent="red" />
    </section>
  );
}