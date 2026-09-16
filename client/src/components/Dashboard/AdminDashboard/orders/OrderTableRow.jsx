import { OrderPriorityIcon, StatusBadge } from "@/index";

function formatSAR(amount) {
  return `SAR ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function OrderTableRow({ order }) {
  return (
    <tr className="border-b border-[var(--color-divider)] last:border-b-0 transition-colors hover:bg-[var(--color-sand)]">
      <td className="py-3.5 pr-4 align-top">
        <div className="flex items-center gap-2">
          <OrderPriorityIcon priority={order.priority} />
          <span className="font-medium text-[var(--color-ink)]">#{order.id}</span>
        </div>
      </td>

      <td className="py-3.5 pr-4 align-top">
        <div className="font-medium text-[var(--color-ink)]">{order.customer}</div>
        <div className="mt-0.5 text-xs text-[var(--color-muted-2)]">
          {order.phone} &middot; {order.location}
        </div>
      </td>

      <td className="max-w-[260px] py-3.5 pr-4 align-top">
        <p className="truncate text-soft-2">{order.skuSummary}</p>
      </td>

      <td className="py-3.5 pr-4 align-top">
        <StatusBadge status={order.status} />
      </td>

      <td className="whitespace-nowrap py-3.5 pl-0 text-right align-top font-medium text-[var(--color-ink)]">
        {formatSAR(order.total)}
      </td>
    </tr>
  );
}