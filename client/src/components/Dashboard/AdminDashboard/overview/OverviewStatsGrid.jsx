"use client";
import { useLocale, useTranslations } from "next-intl";
import { OverviewStatCard } from "@/index";
import { getOverviewStats } from "./Stats";
import { useAdminContext } from "@/Context/Adminprovider";

export default function OverviewStatsGrid() {
  const t = useTranslations("Admin.dashboard");
  const locale = useLocale();
  const { usersCount, productsTotal, ordersStats } = useAdminContext();

  const stats = getOverviewStats({ usersCount, productsTotal, ordersStats, t, locale });

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat, index) => (
        <OverviewStatCard key={index} {...stat} />
      ))}
    </div>
  );
}