"use client";
import { PanelLeft } from "lucide-react";
import { QuickNavItems } from "./QuickNavItems";
import { FulfillmentHubCard } from "@/index";
import { useAdminContext } from "@/Context/Adminprovider";

export default function QuickNavRail() {
  const { activeSection, setActiveSection } = useAdminContext();

  return (
    <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-56">
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
        <div className="flex items-center justify-between px-1.5 pb-2">
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted-2)]">
            Quick Navigation
          </span>
          <PanelLeft size={14} className="text-[var(--color-muted-3)]" />
        </div>

        <nav className="flex flex-col gap-0.5">
          {QuickNavItems.map(({ key, label, icon: Icon }) => {
            const isActive = key === activeSection;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveSection(key)}
                className={
                  isActive
                    ? "flex items-center gap-2.5 rounded-lg bg-[var(--color-green)] px-2.5 py-2 text-sm font-medium text-white"
                    : "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-[var(--color-soft-2)] hover:bg-[var(--color-sand)]"
                }
              >
                <Icon size={16} strokeWidth={2} className="shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <FulfillmentHubCard />
    </aside>
  );
}