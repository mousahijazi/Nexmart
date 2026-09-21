"use client"
import { OverviewStatCard } from "@/index";
import { getOverviewStats } from "./Stats";
import { useAdminContext } from "@/Context/Adminprovider";

export default function OverviewStatsGrid() {
  const { usersCount } = useAdminContext();

  const stats = getOverviewStats(usersCount);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <OverviewStatCard key={index} {...stat} />
      ))}
    </div>
  );
}