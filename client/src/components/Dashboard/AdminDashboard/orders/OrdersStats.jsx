"use client";
import { ShoppingBag, Clock3, CheckCircle2, Wallet } from "lucide-react";
import { StatCard } from "@/index";
import { useAdminContext } from "@/Context/Adminprovider";
import { useTranslations } from "next-intl";

export default function OrdersStats() {
  const { ordersStats } = useAdminContext();
  const t = useTranslations("Admin.orders");

  return (
    <section className="mb-5 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label={t("stats.total")}
        value={ordersStats?.total}
        note={t("stats.totalNote")}
        icon={ShoppingBag}
        accent="green"
      />

      <StatCard
        label={t("stats.pending")}
        value={ordersStats?.pending}
        note={t("stats.pendingNote")}
        icon={Clock3}
        accent="gold"
      />

      <StatCard
        label={t("stats.confirmed")}
        value={ordersStats?.confirmed}
        note={t("stats.confirmedNote")}
        icon={CheckCircle2}
        accent="green"
      />

      <StatCard
        label={t("stats.paid")}
        value={ordersStats?.paid}
        note={t("stats.paidNote")}
        icon={Wallet}
        accent="green"
      />
    </section>
  );
}