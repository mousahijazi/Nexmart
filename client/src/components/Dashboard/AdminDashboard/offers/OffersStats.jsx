import { Tag, BadgeCheck, CalendarClock, History, TrendingUp } from "lucide-react";
import { StatCard } from "@/index";

export default function OffersStats({ stats }) {
  return (
    <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Offers"
        value={stats.total}
        note={
          <span className="inline-flex items-center gap-1">
            <TrendingUp size={12} /> +{stats.addedThisMonth} added this month
          </span>
        }
        icon={Tag}
        accent="green"
      />
      <StatCard label="Active Offers" value={stats.active} note="Currently live across catalog" icon={BadgeCheck} accent="green" />
      <StatCard label="Scheduled Offers" value={stats.scheduled} note="Starts within next 14 days" icon={CalendarClock} accent="gold" />
      <StatCard label="Expired Offers" value={stats.expired} note="Archived / completed campaigns" icon={History} accent="red" />
    </section>
  );
}