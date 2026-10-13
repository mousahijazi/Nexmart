import { bone, pulse, TextBone, TablePaginationSkeleton } from "../shared/TableSkeletonParts";

const COLS = "grid grid-cols-[minmax(260px,1.7fr)_minmax(150px,1fr)_100px_110px_45px] gap-3";

function BrandRowSkeleton() {
  return (
    <div className={`${COLS} items-center border-b border-[var(--color-divider)] px-4 py-3`}>
      <div className="flex min-w-0 items-center gap-3">
        <div className={`h-6 w-6 shrink-0 rounded-md ${bone}`} />
        <div className={`h-9 w-9 shrink-0 rounded-lg ${bone}`} />
        <div className="min-w-0 flex-1">
          <p className="text-[14px]"><TextBone w="w-2/3" /></p>
          <p className="mt-1 text-[9px]"><TextBone w="w-1/3" /></p>
        </div>
      </div>

     <div className="text-[11px]"><TextBone w="w-20" /></div>

      <div className="text-[13px]"><TextBone w="w-8" /></div>

      <div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold ${bone}`}>
          <span className="h-1.5 w-1.5 shrink-0" />
          <span className="invisible">Archived</span>
        </span>
      </div>

      <div className="flex items-center justify-end gap-1">
        <div className={`h-7 w-7 rounded-lg ${bone}`} />
        <div className={`h-7 w-7 rounded-lg ${bone}`} />
      </div>
    </div>
  );
}

export default function BrandsTableSkeleton({ rows = 6, label }) {
  return (
    <section
      aria-busy="true"
      className="grid w-full grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <span className="sr-only" role="status">{label}</span>

      <div className="min-w-0 overflow-x-auto scrollbar-thin">
        <div className="min-w-[780px] w-full">
          <div className={`${COLS} bg-[var(--color-sand)] px-4 py-3 text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--color-soft)]`}>
            <span>Category</span>
            <span>Parent Category</span>
            <span>Products</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          <div aria-hidden="true" className={pulse}>
            {Array.from({ length: rows }).map((_, i) => (
              <BrandRowSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>

      <TablePaginationSkeleton />
    </section>
  );
}