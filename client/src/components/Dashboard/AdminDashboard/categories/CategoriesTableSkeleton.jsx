"use client";
import { categoriesGridCols, categoriesTableMinWidth } from "./categoriesData";

function Bar({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-md bg-[var(--color-sand)] ${className}`} />
  );
}

export default function CategoriesTableSkeleton({ rows = 10 }) {
  return (
    <section className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="min-w-0 overflow-x-auto scrollbar-thin">
        <div className={`${categoriesTableMinWidth} w-full`}>
          <div className={`grid ${categoriesGridCols} gap-3 bg-[var(--color-sand)] px-4 py-3 text-[9px] font-bold uppercase tracking-[0.08em]`}>
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          {Array.from({ length: rows }).map((_, index) => (
            <div
              key={index}
              className={`grid ${categoriesGridCols} min-h-[66px] items-center gap-3 border-b border-[var(--color-divider)] px-4 py-3`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <Bar className="h-9 w-9 shrink-0 rounded-lg" />

                <div className="min-w-0 flex-1 space-y-2">
                  <Bar className="h-3 w-28 max-w-full" />
                  <Bar className="h-2 w-20 max-w-full" />
                </div>
              </div>

              <div className="space-y-2">
                <Bar className="h-3 w-24 max-w-full" />
                <Bar className="h-2 w-16 max-w-full" />
              </div>

              <div className="flex items-center">
                <Bar className="h-5 w-10 rounded-full" />
              </div>

              <div className="flex items-center">
                <Bar className="h-5 w-16 rounded-full" />
              </div>

              <div className="flex items-center justify-center">
                <Bar className="h-6 w-6 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-[var(--color-divider)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Bar className="h-[15px] w-24" />
          <Bar className="h-7 w-12 rounded-lg" />
          <Bar className="h-[15px] w-20" />
        </div>

        <div className="flex items-center gap-2">
          <Bar className="h-8 w-[72px] rounded-lg" />
          <Bar className="h-[15px] w-20" />
          <Bar className="h-8 w-[72px] rounded-lg" />
        </div>
      </div>
    </section>
  );
}