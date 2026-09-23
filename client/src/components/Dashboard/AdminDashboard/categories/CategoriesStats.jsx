import { FolderOpen, CheckCircle2, ShoppingCart, AlertCircle } from "lucide-react";

function StatCard({ title, value, icon: Icon, variant = "default", description }) {
  const variants = {
    default: {
      icon: "text-[var(--color-soft)]",
      value: "text-[var(--color-green-dark)]",
      description: "bg-[var(--color-mint)] text-[var(--color-green-dark)]",
    },

    warning: {
      icon: "text-[var(--color-gold-dark)]",
      value: "text-[var(--color-green-dark)]",
      description: "bg-[var(--color-gold-light)] text-[var(--color-gold-dark)]",
    },

    danger: {
      icon: "text-red-500",
      value: "text-[var(--color-green-dark)]",
      description: "bg-red-50 text-red-600",
    },
  };

  const style = variants[variant] || variants.default;

  return (
    <div className="relative overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between">
        <p className="max-w-[150px] text-[10px] font-bold uppercase tracking-[0.08em] leading-[1.3] text-[var(--color-ink)]">
          {title}
        </p>

        <Icon size={20} className={style.icon} />
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

export default function CategoriesStats({ stats }) {
  return (
    <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Categories"
        value={stats.total}
        icon={FolderOpen}
        description="+3 added this month"
      />

      <StatCard
        title="Categories With Products"
        value={stats.withProducts}
        icon={CheckCircle2}
        description="87.5% catalog coverage"
      />

      <StatCard
        title="Empty Categories"
        value={stats.empty}
        icon={ShoppingCart}
        variant="warning"
        description="Action required: assign SKUs"
      />

      <StatCard
        title="Uncategorized Products"
        value={stats.uncategorized}
        icon={AlertCircle}
        variant="danger"
        description="Requires classification"
      />
    </section>
  );
}