import { ClipboardList, Search } from "lucide-react";

export default function OrdersPanelHeader({ searchValue, onSearchChange }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-sand)] text-[var(--color-green)]">
          <ClipboardList size={18} strokeWidth={2} />
        </span>
        <div>
          <h2 className="text-base font-semibold text-[var(--color-ink)]">
            Recent Platform Orders &amp; Transactions
          </h2>
          <p className="mt-0.5 text-sm text-[var(--color-muted-2)]">
            Real-time settlement verification, logistics assignment, and customer dispatch status
          </p>
        </div>
      </div>

      <div className="relative w-full sm:w-72">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-2)]"
        />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter order #, buyer, phone..."
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-field)] py-2 pl-9 pr-3 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted-3)] focus:outline-none focus:ring-2 focus:ring-[var(--color-green-light)]"
        />
      </div>
    </div>
  );
}