import { CalendarDays, Zap, Clock, Tag, PlusCircle } from "lucide-react";
import { StatCard } from "@/index";

export default function SeasonsStats({ stats }) {
  return (
    <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Seasons"
        value={stats.total}
        note={
          <span className="inline-flex items-center gap-1">
            <PlusCircle size={12} /> +{stats.plannedNextYear} planned for 2025
          </span>
        }
        icon={CalendarDays}
        accent="green"
      />
      <StatCard label="Active Seasons" value={stats.active} note="Currently running campaigns" icon={Zap} accent="green" />
      <StatCard label="Upcoming Seasons" value={stats.upcoming} note="Scheduled for future dates" icon={Clock} accent="gold" />
      <StatCard label="Seasons With Offers" value={stats.withOffers} note={`${stats.withOffersPercent}% campaigns configured`} icon={Tag} accent="green" />
    </section>
  );
}