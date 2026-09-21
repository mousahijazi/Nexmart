import { Clock, CalendarDays, Download } from "lucide-react";
import { heroStats } from "./Stats";
import { AddProductsButton, ProductModal } from "@/index";

export default function OverviewHero({adminName = "Eng. Tariq Al-Mansoor", dateLabel = "Wednesday, 24 Sha'ban 1446 AH / March 2025", onExport, onAddProduct}) {
  return (
    <div className="rounded-2xl bg-[var(--color-green-dark)] p-6 text-white sm:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-white/60">
          <Clock size={13} />
          Platform Administration Console
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-white/60">
          <CalendarDays size={13} />
          {dateLabel}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold sm:text-[28px]">Marhaban, {adminName}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">
            Real-time supervisory control of the Nexmart Saudi marketplace. Monitor
            multi-vendor order fulfillment, payments via Mada &amp; Apple Pay, inventory
            velocity, and merchant compliance across all Kingdom distribution corridors.
          </p>
        </div>

        <div className="flex md:flex-col flex-wrap shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onExport}
            className="flex items-center gap-1.5 rounded-lg border border-white/20 px-3.5 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            <Download size={15} />
            Export Financial Audit CSV
          </button>
          <AddProductsButton />
        </div>
      </div>

      <ProductModal />

      <div className="mt-5 flex flex-wrap gap-2">
        {heroStats.map(({ key, icon: Icon, label, value }) => (
          <span key={key} className="inline-flex flex-wrap items-center gap-2 rounded-2xl xs:rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white">
            <Icon size={13} className="text-[var(--color-gold-light)]" />
            <span className="text-white/60">{label}:</span>
            <span className="font-medium">{value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}