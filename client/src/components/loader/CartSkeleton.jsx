export default function CartSkeleton({ count = 4 }) {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 xs:grid-cols-[80px_1fr_auto] sm:grid-cols-[96px_1fr_auto] gap-[18px] p-5 border-b border-[var(--color-divider)] items-center">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex flex-col items-center gap-3 xs:contents px-2.5 py-3 rounded-2xl">
            <div className="relative w-[180px] h-[120px] xs:w-full xs:h-full rounded-2xl bg-[var(--color-surface)] animate-pulse overflow-hidden" />

            <div className="w-full">
              <div className="h-3 w-20 bg-[var(--color-surface)] rounded animate-pulse mb-[5px]" />
              
              <div className="h-5 w-3/4 bg-[var(--color-surface)] rounded animate-pulse my-[5px]" />

              <div className="flex items-center gap-1.5 mt-3 text-[13px]">
                <div className="w-6 h-6 rounded-md bg-[var(--color-surface)] animate-pulse" />
                <div className="w-6 h-6 rounded-md bg-[var(--color-surface)] animate-pulse" />
              </div>
            </div>

            <div className="text-end flex flex-col items-end gap-[14px]">
              <div className="h-6 w-20 bg-[var(--color-surface)] rounded animate-pulse" />

              <div className="flex items-center border border-[var(--color-field)] rounded-[10px] overflow-hidden">
                <div className="w-9 h-[34px] bg-[var(--color-surface)] animate-pulse" />
                <div className="w-10 h-[34px] border-x border-[var(--color-field)] bg-[var(--color-surface)] animate-pulse" />
                <div className="w-9 h-[34px] bg-[var(--color-surface)] animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 mx-5">
        <div className="h-4 w-28 bg-[var(--color-surface)] rounded animate-pulse" />
      </div>
    </div>
  );
}