const ORDER_STATUS_COLOR = {
  Processing: "var(--color-gold)",
  Shipped: "var(--color-green-light)",
  Delivered: "var(--color-green)",
  "Pending Review": "var(--color-red)",
  Cancelled: "var(--color-muted)",
};

export default function StatusBadge({ status, colorMap = ORDER_STATUS_COLOR }) {
  const color = colorMap[status] ?? "var(--color-muted)";

  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium"
      style={{
        color,
        backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {status}
    </span>
  );
}