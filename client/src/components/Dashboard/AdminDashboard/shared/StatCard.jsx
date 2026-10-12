const accents = {
  green: "border-t-[var(--color-green)]",
  gold: "border-t-[var(--color-gold)]",
  red: "border-t-[var(--color-red)]",
};

export default function StatCard({ label, value, note, icon: Icon, accent = "green" }) {
  return (
    <div className={`min-w-0 rounded-[14px] border border-[var(--color-border)] border-t-[3px] bg-[var(--color-surface)] p-4 ${accents[accent]}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-soft)]">
          {label}
        </p>

        {Icon && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-sand)] text-[var(--color-soft)]">
            <Icon size={15} />
          </span>
        )}
      </div>

      <p className="mt-3 text-[30px] font-medium leading-none tracking-[-0.03em] text-[var(--color-ink)]">
        {value}
      </p>

      <p className="mt-2 text-[11px] text-[var(--color-soft-2)]">{note}</p>
    </div>
  );
}