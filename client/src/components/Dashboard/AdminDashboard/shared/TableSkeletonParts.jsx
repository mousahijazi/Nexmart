export const bone = "bg-black/[0.07] dark:bg-white/10";
export const pulse = "motion-safe:animate-pulse";

export function TextBone({ w = "w-full" }) {
  return (
    <span className={`inline-block h-[0.75em] ${w} align-middle rounded ${bone}`} />
  );
}

export function TablePaginationSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col gap-3 border-t border-[var(--color-divider)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className={`text-[10px] text-[var(--color-soft)] ${pulse}`}>
        <TextBone w="w-36" />
      </p>

      <div className={`flex items-center gap-1 ${pulse}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`h-8 w-8 rounded-lg ${bone}`} />
        ))}
      </div>

      <div className="flex items-center gap-2 text-[10px] text-[var(--color-soft)]">
        <span>Rows per page:</span>
        <select disabled defaultValue="6" className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-[10px] outline-none opacity-60">
          <option value="6">6</option>
          <option value="12">12</option>
          <option value="24">24</option>
        </select>
      </div>
    </div>
  );
}