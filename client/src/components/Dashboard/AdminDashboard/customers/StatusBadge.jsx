const STATUS_COLORS = {
  pending: "var(--color-gold)",
  confirmed: "var(--color-green-light)",
  shipped: "var(--color-green-light)",
  delivered: "var(--color-green)",
  cancelled: "var(--color-red)",

  paid: "var(--color-green)",
  failed: "var(--color-red)",
  refunded: "var(--color-muted)",
};

export default function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] ?? "var(--color-muted)";
  const label = status.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ color, backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
