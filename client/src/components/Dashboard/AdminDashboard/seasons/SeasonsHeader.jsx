"use client"
import { Download, Sun } from "lucide-react";
import { useAdminContext } from "@/Context/Adminprovider";
import { AdminAddButton } from "@/index";

export default function SeasonsHeader() {
  const { openSeasonModal } = useAdminContext();

  return (
    <section className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[var(--color-green-dark)] text-white">
          <Sun size={22} />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[25px] font-medium leading-none tracking-[-0.035em] text-[var(--color-ink)] sm:text-[29px]">
              Seasons Management
            </h1>
            <span className="rounded-full bg-[var(--color-gold-light)] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.08em] text-[var(--color-green-dark)]">
              GCC Engine
            </span>
          </div>

          <p className="mt-2 max-w-[650px] text-[11px] leading-[1.45] text-[var(--color-soft-2)] sm:text-[13px]">
            Plan seasonal campaigns, manage their schedules, and organize associated offers.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center gap-2 xl:w-auto">
        <button type="button" className="flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-[11px] font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-sand)]">
          <Download size={16} />
          Export Seasons CSV
        </button>

        <AdminAddButton label="Add New Season" onClick={openSeasonModal} />
      </div>
    </section>
  );
}