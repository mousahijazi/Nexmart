const bone = "bg-black/10 dark:bg-white/10";
const pulse = "motion-safe:animate-pulse";

export function NewArrivalsBannerSkeleton({ count = 3, label }) {
  return (
    <>
      <span className="sr-only" role="status">{label}</span>

      <div aria-hidden="true" className={`p-2 min-[480px]:p-8 md:p-11 ${pulse}`}>
        <div className="h-5 mb-3 flex items-center">
          <div className={`h-3 w-28 rounded ${bone}`} />
        </div>

        <div className="h-[45px] mb-[14px] flex items-center">
          <div className={`h-8 w-3/4 max-w-[300px] rounded-lg ${bone}`} />
        </div>

        <div className="mb-6 max-w-[380px]">
          <div className="h-[27.75px] flex items-center">
            <div className={`h-3.5 w-full rounded ${bone}`} />
          </div>
          <div className="h-[27.75px] flex items-center">
            <div className={`h-3.5 w-11/12 rounded ${bone}`} />
          </div>
          <div className="h-[27.75px] flex items-center">
            <div className={`h-3.5 w-2/3 rounded ${bone}`} />
          </div>
        </div>

        <div className={`h-12 w-[150px] rounded-[11px] ${bone}`} />
      </div>

      <div aria-hidden="true" className={`grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-3 gap-3 p-6 ${pulse}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-[var(--color-muted)] rounded-[14px] p-3">
            <div className={`h-[120px] mb-5 rounded-xl ${bone}`} />

            <div className="h-[38px] flex flex-col justify-center gap-1.5">
              <div className={`h-3 w-full rounded ${bone}`} />
              <div className={`h-3 w-2/3 rounded ${bone}`} />
            </div>

            <div className="h-[19.5px] flex items-center">
              <div className={`h-3.5 w-16 rounded ${bone}`} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}