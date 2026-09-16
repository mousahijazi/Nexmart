import { OverviewStatCard } from "@/index";
import { overviewStats } from "./Stats";

export default function OverviewStatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {overviewStats.map((stat) => (
        <OverviewStatCard key={stat.key} {...stat} />
      ))}
    </div>
  );
}