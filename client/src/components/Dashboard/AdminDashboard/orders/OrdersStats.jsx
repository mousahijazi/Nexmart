import { ShoppingBag, Clock3, CheckCircle2, Wallet } from "lucide-react";
import { StatCard } from "@/index";

export default function OrdersStats({ stats }) {
  return (
    <section className="mb-5 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Orders"
        value={stats.total}
        note="Orders in demo dataset"
        icon={ShoppingBag}
        accent="green"
      />

      <StatCard
        label="Pending Orders"
        value={stats.pending}
        note="Awaiting order confirmation"
        icon={Clock3}
        accent="gold"
      />

      <StatCard
        label="Confirmed Orders"
        value={stats.confirmed}
        note="Confirmed and awaiting fulfillment"
        icon={CheckCircle2}
        accent="green"
      />

      <StatCard
        label="Paid Orders"
        value={stats.paid}
        note="Orders with paid payment status"
        icon={Wallet}
        accent="green"
      />
    </section>
  );
}
