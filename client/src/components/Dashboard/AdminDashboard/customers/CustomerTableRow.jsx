// todo
import CustomerAvatar from "./CustomerAvatar";
import CustomerSegmentBadge from "./CustomerSegmentBadge";
import { StatusBadge } from "@/index";

const CUSTOMER_STATUS_COLOR = {
  Active: "var(--color-green-light)",
  Suspended: "var(--color-red)",
};

function formatSAR(amount) {
  return `SAR ${amount.toLocaleString("en-US")}`;
}

export default function CustomerTableRow({ customer, index }) {
  return (
    <tr className="border-b border-[var(--color-divider)] last:border-b-0 transition-colors hover:bg-[var(--color-sand)]">
      <td className="py-3.5 pr-4 align-top">
        <div className="flex items-center gap-3">
          <CustomerAvatar name={customer.name} status={customer.status} index={index} />
          <span className="font-medium text-[var(--color-ink)]">{customer.name}</span>
        </div>
      </td>

      <td className="py-3.5 pr-4 align-top">
        <div className="text-[var(--color-ink)]">{customer.email}</div>
        <div className="mt-0.5 text-xs text-[var(--color-muted-2)]">{customer.phone}</div>
      </td>

      <td className="py-3.5 pr-4 align-top">
        <CustomerSegmentBadge segment={customer.segment} />
      </td>

      <td className="py-3.5 pr-4 align-top text-[var(--color-soft-2)]">{customer.location}</td>

      <td className="py-3.5 pr-4 align-top text-[var(--color-soft-2)]">{customer.orders} orders</td>

      <td className="whitespace-nowrap py-3.5 pr-4 align-top text-right font-medium text-[var(--color-ink)]">
        {formatSAR(customer.totalSpent)}
      </td>

      <td className="py-3.5 pl-0 align-top">
        <StatusBadge status={customer.status} colorMap={CUSTOMER_STATUS_COLOR} />
      </td>
    </tr>
  );
}