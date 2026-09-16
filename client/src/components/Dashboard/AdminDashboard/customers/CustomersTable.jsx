import {CustomerTableRow} from "@/index";

const COLUMNS = ["Customer", "Contact", "Segment", "Location", "Orders"];

export default function CustomersTable({ customers }) {
  if (customers.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-[var(--color-muted-2)]">
        No customers match the current filters.
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
            <th className="py-2.5 pr-4 text-right text-xs font-medium uppercase tracking-wide text-[var(--color-muted-2)]">
              Total Spent
            </th>
            <th className="py-2.5 pl-0 text-xs font-medium uppercase tracking-wide text-[var(--color-muted-2)]">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <CustomerTableRow key={customer.id} customer={customer} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
}