export default function FulfillmentHubCard({value = "99.4%", label = "Riyadh Central Cluster"}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted-2)]">
        Fulfillment Hub
      </p>
      <p className="mt-1.5 text-2xl font-semibold text-[var(--color-ink)]">{value}</p>
      <p className="mt-0.5 text-xs text-[var(--color-muted-2)]">{label}</p>
    </div>
  );
}