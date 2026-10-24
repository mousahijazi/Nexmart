import { ordersGridCols, ordersTableMinWidth } from "./ordersData";

function Bar({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-md bg-[var(--color-sand)] ${className}`} />
  );
}

export default function OrdersTableSkeleton({ rows = 6 }) {
  return (
    <section className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="min-w-0 overflow-x-auto scrollbar-thin">
        <div className={`${ordersTableMinWidth} w-full`}>
          <div className={`grid ${ordersGridCols} gap-3 bg-[var(--color-sand)] px-4 py-3 text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--color-soft)]`}>
            <span />
            <span>Order ID</span>
            <span>Customer</span>
            <span>Items</span>
            <span>Order Date</span>
            <span>Total</span>
            <span>Payment</span>
            <span>Order Status</span>
            <span />
          </div>

          {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className={`grid ${ordersGridCols} items-center gap-3 border-b border-[var(--color-divider)] px-4 py-3`}>
              <Bar className="h-6 w-6 rounded-full" />

              <div className="space-y-2">
                <Bar className="h-3 w-20" />
                <Bar className="h-2 w-24" />
              </div>

              <div className="space-y-2">
                <Bar className="h-3 w-28" />
                <Bar className="h-2 w-24" />
              </div>

              <Bar className="h-5 w-10 rounded-full" />
              <Bar className="h-3 w-20" />
              <Bar className="h-3 w-20" />
              <Bar className="h-5 w-16 rounded-full" />
              <Bar className="h-5 w-20 rounded-full" />
              <Bar className="ml-auto h-6 w-6" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-[var(--color-divider)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Bar className="h-[15px] w-40" />
        <div className="flex items-center gap-1">
          <Bar className="h-8 w-8 rounded-lg" />
          <Bar className="h-8 w-8 rounded-lg" />
          <Bar className="h-8 w-8 rounded-lg" />
        </div>
        <Bar className="h-[26px] w-32" />
      </div>
    </section>
  );
}
