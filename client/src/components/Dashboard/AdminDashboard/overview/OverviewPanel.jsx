import { OverviewHero, OverviewStatsGrid } from "@/index";

export default function OverviewPanel() {
  return (
    <div className="flex flex-col gap-5">
      <OverviewHero />
      <OverviewStatsGrid />
    </div>
  );
}