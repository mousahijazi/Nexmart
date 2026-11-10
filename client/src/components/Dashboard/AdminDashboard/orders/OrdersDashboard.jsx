import { OrdersHeader, OrdersStats, OrdersInteractive } from "@/index";

export default function OrdersDashboard() {
  return (
    <div className="min-w-0 bg-[var(--color-cream)] text-[var(--color-ink)]">
      <div className="mx-auto w-full max-w-[1120px] py-5 lg:py-3">
        <OrdersHeader />
        <OrdersStats />
        <OrdersInteractive />
      </div>
    </div>
  );
}
