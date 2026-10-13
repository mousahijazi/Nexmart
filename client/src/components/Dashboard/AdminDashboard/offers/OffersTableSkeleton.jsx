import { bone, pulse, TextBone, TablePaginationSkeleton } from "../shared/TableSkeletonParts";

const COLS = "grid grid-cols-[minmax(240px,1.6fr)_minmax(200px,1.3fr)_110px_170px_130px_100px_45px] gap-3";

function OfferRowSkeleton() {
  return (
    <div className={`${COLS} items-center border-b border-[var(--color-divider)] px-4 py-3`}>
      <div className="flex min-w-0 items-center gap-3">
        <div className={`h-6 w-6 shrink-0 rounded-md ${bone}`} />
        <div className="min-w-0 flex-1">
          <p className="text-[14px]"><TextBone w="w-3/4" /></p>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-2.5">
        <div className={`h-10 w-10 shrink-0 rounded-lg ${bone}`} />
        <div className="min-w-0 flex-1">
          <p className="text-[12px]"><TextBone w="w-2/3" /></p>
          <span className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] ${bone}`}>
            <span className="invisible">category</span>
          </span>
        </div>
      </div>

      <div>
        <span className={`inline-block rounded-lg px-2.5 py-1.5 text-[11px] font-bold ${bone}`}>
          <span className="invisible">-00%</span>
        </span>
      </div>

      <div className="min-w-0">
        <span className={`inline-flex max-w-full items-center gap-1.5 rounded-full border border-transparent px-2.5 py-1 text-[10px] font-medium ${bone}`}>
          <span className="h-[11px] w-[11px] shrink-0" />
          <span className="invisible truncate">Season name</span>
        </span>
      </div>

      <div className="text-[11px] leading-[1.4]">
        <p><TextBone w="w-20" /></p>
        <p><TextBone w="w-24" /></p>
      </div>

      <div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold ${bone}`}>
          <span className="h-1.5 w-1.5 shrink-0" />
          <span className="invisible">Scheduled</span>
        </span>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <div className={`h-7 w-7 rounded-md ${bone}`} />
      </div>
    </div>
  );
}

export default function OffersTableSkeleton({ rows = 6, label }) {
  return (
    <section
      aria-busy="true"
      className="grid w-full grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <span className="sr-only" role="status">{label}</span>

      <div className="min-w-0 overflow-x-auto scrollbar-thin">
        <div className="min-w-[1050px] w-full">
          <div className={`${COLS} bg-[var(--color-sand)] px-4 py-3 text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--color-soft)]`}>
            <span>Offer Name &amp; Code</span>
            <span>Target</span>
            <span>Discount</span>
            <span>Season</span>
            <span>Validity Period</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          <div aria-hidden="true" className={pulse}>
            {Array.from({ length: rows }).map((_, i) => (
              <OfferRowSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>

      <TablePaginationSkeleton />
    </section>
  );
}