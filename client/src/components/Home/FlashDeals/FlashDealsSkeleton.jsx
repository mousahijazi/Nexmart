const onDark = "bg-white/10 dark:bg-black/10";
const onCard = "bg-black/10 dark:bg-white/10";
const pulse = "motion-safe:animate-pulse";
const CATEGORY_PRODUCTS_LIMIT = 4;

// todo
function FlashDealsSkeleton({ isProductOffer, label }) {
  return (
    <>
      <span className="sr-only" role="status">{label}</span>

      <div aria-hidden="true" className={pulse}>
        <div className={`h-[20px] w-28 rounded-md mb-[10px] ${onDark}`} />
        <div className={`h-[42px] w-4/5 rounded-lg mb-[10px] ${onDark}`} />

        <div className="mb-[22px]">
          <div className="h-[25px] flex items-center"><div className={`h-3.5 w-full rounded ${onDark}`} /></div>
          <div className="h-[25px] flex items-center"><div className={`h-3.5 w-2/3 rounded ${onDark}`} /></div>
        </div>

        <div className="flex flex-wrap gap-[10px]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`h-[77px] w-[68px] rounded-xl ${onDark}`} />
          ))}
        </div>
      </div>

      <div aria-hidden="true" className={pulse}>
        {isProductOffer ? <ProductOfferSkeleton /> : <CategoryGridSkeleton />}
      </div>
    </>
  );
}

function CategoryGridSkeleton() {
  return (
    <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-4 gap-[14px]">
      {Array.from({ length: CATEGORY_PRODUCTS_LIMIT }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-[var(--color-muted)] rounded-2xl p-[14px]">
          <div className={`h-[120px] rounded-xl ${onCard}`} />

          <div className="my-[11px] min-h-[41px] flex flex-col justify-center gap-2">
            <div className={`h-3.5 w-full rounded ${onCard}`} />
            <div className={`h-3.5 w-2/3 rounded ${onCard}`} />
          </div>

          <div className="h-6 flex items-center gap-2">
            <div className={`h-4 w-16 rounded ${onCard}`} />
            <div className={`h-3 w-10 rounded ${onCard}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductOfferSkeleton() {
  return (
    <div className="max-w-[560px] w-full mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 rounded-2xl bg-white dark:bg-[var(--color-muted)] p-4 md:p-5">
        <div className={`min-h-[220px] sm:min-h-[280px] rounded-xl ${onCard}`} />

        <div className="flex flex-col justify-center py-2">
          <div className={`h-3 w-24 rounded mb-2 ${onCard}`} />
          <div className={`h-6 w-full rounded mb-2 ${onCard}`} />
          <div className={`h-6 w-3/4 rounded ${onCard}`} />

          <div className="mt-2 space-y-2">
            <div className={`h-3.5 w-full rounded ${onCard}`} />
            <div className={`h-3.5 w-full rounded ${onCard}`} />
            <div className={`h-3.5 w-1/2 rounded ${onCard}`} />
          </div>

          <div className={`mt-5 h-6 w-28 rounded ${onCard}`} />
          <div className={`mt-5 h-[44px] w-32 rounded-xl ${onCard}`} />
        </div>
      </div>
    </div>
  );
}

export { 
    FlashDealsSkeleton,
}