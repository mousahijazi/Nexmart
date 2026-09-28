import { PackageOpen } from "lucide-react";
import { AdminProductCard } from "@/index";

export default function BrandExpandedPanel({ brand }) {
  const products = brand.featuredProducts || [];

  return (
    <div className="border-t border-[var(--color-divider)] bg-[var(--color-soft)] px-5 py-5">
      {products.length > 0 ? (
        <>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <PackageOpen size={14} className="text-[var(--color-green-dark)]" />

              <p className="text-[10px] font-bold uppercase tracking-[0.07em] text-[var(--color-green-dark)]">
                Featured catalog listings from this brand
              </p>
            </div>

            <button type="button" className="text-left text-[10px] font-semibold text-[var(--color-green-dark)] hover:underline sm:text-right">
              Manage all {brand.productCount} products →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <AdminProductCard
                key={product._id}
                product={product}
                locale="en"
              />
            ))}

            {brand.productCount > 4 && (
              <div className="hidden min-h-[180px] items-center justify-center rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] lg:flex">
                <div className="text-center">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-soft)]">
                    <PackageOpen
                      size={16}
                      className="text-[var(--color-muted)]"
                    />
                  </div>

                  <p className="mt-2 text-[10px] font-semibold text-[var(--color-muted)]">
                    +{Math.max(brand.productCount - 4, 0)} more
                  </p>

                  <p className="text-[9px] text-[var(--color-muted)]">
                    products from brand
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="mx-auto max-w-[560px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-10 text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-soft)]">
            <PackageOpen size={21} className="text-[var(--color-muted)]" />
          </div>

          <h3 className="mt-4 text-sm font-bold text-[var(--color-ink)]">
            No products from this brand yet.
          </h3>

          <p className="mx-auto mt-2 max-w-[380px] text-[10px] leading-5 text-[var(--color-muted)]">
            This brand is currently onboarded without any active catalog
            SKUs. Link existing catalog inventory or invite the brand vendor
            to upload products.
          </p>

          <button
            type="button"
            className="mt-5 rounded-lg bg-[var(--color-green-dark)] px-4 py-2.5 text-[10px] font-bold text-[var(--color-surface)] transition hover:opacity-90"
          >
            + Assign Catalog SKUs
          </button>
        </div>
      )}
    </div>
  );
}

// import { ArrowRight, Archive } from "lucide-react";
// import { AdminProductCard } from "@/index";
// import { useLocale } from "next-intl";

// export default function BrandExpandedPanel({ brand, productsData, onLoadMore }) {
//   const locale = useLocale();
//   const products = productsData?.products || [];
//   const isLoading = productsData?.loading || false;

//   const page = productsData?.page || 1;
//   const totalPages = productsData?.totalPages || 1;
//   const hasMore = page < totalPages;

//   return (
//     <div className="border-b border-[var(--color-divider)] bg-[var(--color-cream)] px-5 py-4">
//       {isLoading && products.length === 0 ? (
//         // todo
//         <div className="flex flex-col items-center justify-center py-10">
//           <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-green-dark)]" />

//           <p className="mt-3 text-[11px] text-[var(--color-soft)]">
//             Loading products...
//           </p>
//         </div>
//       ) : products.length > 0 ? (
//         <>
//           <div className="mb-3 flex items-center justify-between gap-3">
//             <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--color-soft)]">
//               Featured Catalog Listings From This Brand
//             </p>

//             <button type="button" className="flex items-center gap-1 text-[10px] font-semibold text-[var(--color-green-dark)]">
//               Manage all {Number(brand.productCount || productsData.total || 0).toLocaleString()} products

//               <ArrowRight size={13} />
//             </button>
//           </div>

//           <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
//             {products.map((product) => (
//               <AdminProductCard key={product._id} product={product} locale={locale} />
//             ))}
//           </div>

//           {hasMore && (
//             <div className="mt-4 flex justify-center">
//               <button
//                 type="button"
//                 onClick={onLoadMore}
//                 disabled={isLoading}
//                 className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-[10px] font-semibold text-[var(--color-green-dark)] transition hover:bg-[var(--color-sand)] disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 {isLoading ? "Loading..." : "Load More Products"}
//               </button>
//             </div>
//           )}
//         </>
//       ) : (
//         <div className="flex flex-col items-center justify-center py-10 text-center">
//           <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-sand)]">
//             <Archive size={20} className="text-[var(--color-soft)]" />
//           </div>

//           <h3 className="mt-3 text-[13px] font-semibold text-[var(--color-ink)]">
//             No products from this brand yet.
//           </h3>

//           <p className="mt-1 max-w-[420px] text-[10px] leading-5 text-[var(--color-muted)]">
//             This brand currently has no catalog assignments.
//             Link existing catalog inventory or invite the brand
//             vendor to upload products.
//           </p>

//           <button type="button" className="mt-4 rounded-lg bg-[var(--color-green-dark)] px-4 py-2 text-[10px] font-bold text-white">
//             Assign Catalog SKUs
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }