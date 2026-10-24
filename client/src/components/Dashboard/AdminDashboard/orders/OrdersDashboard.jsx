import { OrdersHeader, OrdersStats, OrdersInteractive } from "@/index";
import { ordersStats } from "./ordersData";

export default function OrdersDashboard() {
  return (
    <div className="min-w-0 bg-[var(--color-cream)] text-[var(--color-ink)]">
      <div className="mx-auto w-full max-w-[1120px] py-5 lg:py-3">
        <OrdersHeader />
        <OrdersStats stats={ordersStats} />
        <OrdersInteractive />
      </div>
    </div>
  );
}
