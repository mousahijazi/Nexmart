import { ChevronDown } from "lucide-react";

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-2 pl-3 pr-8 text-sm text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-green-light)]"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {`${label}: ${opt}`}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-muted-2)]" />
    </div>
  );
}

export default function CustomersFilters({segment, onSegmentChange, segments, status, onStatusChange, statuses}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterSelect label="Segment" value={segment} options={segments} onChange={onSegmentChange} />
      <FilterSelect label="Status" value={status} options={statuses} onChange={onStatusChange} />
    </div>
  );
}