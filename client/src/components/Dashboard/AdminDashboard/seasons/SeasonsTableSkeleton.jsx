import { seasonGridCols, seasonTableMinWidth } from "./seasonsData";

function Bar({ className = "" }) {
  return <div className={`animate-pulse rounded-md bg-[var(--color-sand)] ${className}`} />;
}

export default function SeasonsTableSkeleton({ rows = 6 }) {
  return (
    <section className="grid w-full grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="min-w-0 overflow-x-auto scrollbar-thin">
        <div className={`${seasonTableMinWidth} w-full`}>
          <div className={`grid ${seasonGridCols} gap-3 bg-[var(--color-sand)] px-4 py-3 text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--color-soft)]`}>
            <span>Season</span>
            <span>Offers</span>
            <span>Start Date</span>
            <span>End Date</span>
            <span>Duration</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {Array.from({ length: rows }).map((_, index) => (
            <div
              key={index}
              className={`grid ${seasonGridCols} items-center gap-3 border-b border-[var(--color-divider)] px-4 py-3`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <Bar className="h-6 w-6 shrink-0" />
                <Bar className="h-10 w-10 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Bar className="h-3.5 w-3/4" />
                  <Bar className="h-2.5 w-1/2" />
                </div>
              </div>

              <Bar className="h-5 w-16 rounded-full" />
              <Bar className="h-3 w-20" />
              <Bar className="h-3 w-20" />
              <Bar className="h-3 w-12" />
              <Bar className="h-5 w-20 rounded-full" />
              <Bar className="ml-auto h-7 w-7 rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-[var(--color-divider)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Bar className="h-[15px] w-40" />
        <div className="flex items-center gap-1">
          <Bar className="h-8 w-8 rounded-lg" />
          <Bar className="h-8 w-8 rounded-lg" />
          <Bar className="h-8 w-8 rounded-lg" />
        </div>
        <Bar className="h-[26px] w-32" />
      </div>
    </section>
  );
}