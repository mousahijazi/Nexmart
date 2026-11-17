"use client";
import { OverviewStatCard } from "@/index";
import { getOverviewStats } from "./Stats";
import { useAdminContext } from "@/Context/Adminprovider";

export default function OverviewStatsGrid() {
  const { usersCount, productsTotal, ordersStats } = useAdminContext();
  const stats = getOverviewStats({ usersCount, productsTotal, ordersStats });

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat) => (
        <OverviewStatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}