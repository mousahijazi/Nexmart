const TREND_COLOR = {
  positive: "var(--color-green-light)",
  warning: "var(--color-gold)",
  negative: "var(--color-red)",
};

export default function OverviewStatCard({ icon: Icon, label, value, trend }) {
  const trendColor = TREND_COLOR[trend?.tone] ?? "var(--color-muted)";

  return (
    <div className="min-w-0 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted-2)]">
          {label}
        </p>

        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-send)] text-[var(--color-green)]">
          {Icon && <Icon size={15} strokeWidth={2} aria-hidden="true" />}
        </span>
      </div>

      <p className="mt-2 break-words text-xl font-semibold text-[var(--color-ink)]">
        {value}
      </p>

      {trend && (
        <p className="mt-1 text-xs font-medium" style={{ color: trendColor }}>
          {trend.text}
        </p>
      )}
    </div>
  );
}
