import { OrderTableRow } from "@/index";
const COLUMNS = ["Order ID", "Customer & Location", "SKU Items", "Status"];

export default function OrdersTable({ orders }) {
  if (orders.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-[var(--color-muted-2)]">
        No orders match the current filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] text-left">
            {COLUMNS.map((col) => (
              <th key={col} className="py-2.5 pr-4 text-xs font-medium uppercase tracking-wide text-[var(--color-muted-2)]">
                {col}
              </th>
            ))}
            <th className="py-2.5 pl-0 text-right text-xs font-medium uppercase tracking-wide text-[var(--color-muted-2)]">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderTableRow key={order.id} order={order} />
          ))}
        </tbody>
      </table>
    </div>
  );
}