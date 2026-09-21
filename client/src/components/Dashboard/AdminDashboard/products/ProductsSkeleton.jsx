function Bone({ className = "" }) {
  return <div className={`animate-pulse rounded-md bg-[var(--color-sand)] ${className}`} />;
}

function StatsSkeleton() {
  return (
    <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-cream)] p-4">
          <Bone className="h-3 w-20" />
          <Bone className="mt-3 h-5 w-16" />
        </div>
      ))}
    </div>
  );
}

function FiltersSkeleton() {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <Bone className="h-9 w-full sm:w-64" />
      <Bone className="h-9 w-32" />
      <Bone className="h-9 w-32" />
      <Bone className="h-9 w-32" />
    </div>
  );
}

const ROW_COLS = "grid-cols-[44px_minmax(280px,1.5fr)_110px_110px_90px_110px_90px]";

function TableSkeleton({ rows }) {
  return (
    <section className="grid w-full grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-cream)]">
      <div className="min-w-0 overflow-x-auto scrollbar-thin">
        <div className="min-w-[950px] w-full">
          <div className={`grid ${ROW_COLS} items-center bg-[var(--color-surface)] px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--color-soft)]`}>
            <div />
            <div>Product Detail</div>
            <div>Category</div>
            <div>Brand</div>
            <div>Unit Price</div>
            <div>Stock Level</div>
            <div>Catalog Status</div>
          </div>

          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className={`grid ${ROW_COLS} items-center border-b border-[var(--color-divider)] px-4 py-[12px] last:border-b-0`}
            >
              <Bone className="h-4 w-4" />

              <div className="flex items-center gap-3">
                <Bone className="h-[58px] w-[58px] shrink-0 rounded-[8px]" />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <Bone className="h-3.5 w-3/4" />
                  <Bone className="h-2.5 w-1/2" />
                  <Bone className="h-2.5 w-1/3" />
                </div>
              </div>

              <Bone className="h-5 w-16 rounded-full" />
              <Bone className="h-3 w-14" />
              <Bone className="h-3 w-12" />
              <Bone className="h-5 w-16 rounded-full" />
              <Bone className="h-5 w-14 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PaginationSkeleton() {
  return (
    <div className="mt-3 hidden items-center justify-between px-4 py-3.5 md:flex">
      <Bone className="h-3 w-40" />
      <div className="flex items-center gap-1">
        <Bone className="h-7 w-7" />
        <Bone className="h-7 w-7" />
        <Bone className="h-7 w-7" />
        <Bone className="h-7 w-7" />
      </div>
    </div>
  );
}

export default function ProductsPageSkeleton({ rows = 5 }) {
  return (
    <div>
      <StatsSkeleton />
      <FiltersSkeleton />
      <TableSkeleton rows={rows} />
      <PaginationSkeleton />
    </div>
  );
}