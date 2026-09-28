export default function BrandStatCard({ title, value, icon: Icon, variant = "default", description }) {
  const variants = {
    default: {
      icon: "text-[var(--color-soft)]",
      value: "text-[var(--color-ink)]",
      description: "bg-[var(--color-mint)] text-[var(--color-green-dark)]",
    },

    warning: {
      icon: "text-[var(--color-gold-dark)]",
      value: "text-[var(--color-ink)]",
      description: "bg-[var(--color-gold-light)] text-[var(--color-gold-dark)]",
    },

    danger: {
      icon: "text-[var(--color-red)]",
      value: "text-[var(--color-ink)]",
      description: "bg-red-50 text-red-600",
    },
  };

  const style = variants[variant] || variants.default;

  return (
    <div className="relative overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between">
        <p className="max-w-[150px] text-[10px] font-bold uppercase leading-[1.3] tracking-[0.08em] text-[var(--color-ink)]">
          {title}
        </p>

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-sand)]">
          <Icon size={17} className={style.icon} />
        </div>
      </div>

      <p className={`text-[30px] font-medium leading-none tracking-[-0.04em] ${style.value}`}>
        {value}
      </p>

      {description && (
        <div className={`mt-3 inline-flex rounded-md px-2 py-1 text-[9px] font-semibold ${style.description}`}>
          {description}
        </div>
      )}
    </div>
  );
}