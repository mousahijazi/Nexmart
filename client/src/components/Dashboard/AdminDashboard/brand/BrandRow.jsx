// import { ChevronDown, MoreVertical, Package } from "lucide-react";
// import Image from "next/image";
// import { getImageUrl } from "@/helper/getImage";
// import BrandExpandedPanel from "./BrandExpandedPanel";

// export default function BrandRow({ brand, isOpen, onToggle }) {
//   return (
//     <>
//       <div className="border-b border-[var(--color-divider)] bg-[var(--color-surface)]">
//         <div className="grid cursor-pointer grid-cols-[44px_minmax(300px,1fr)_140px_140px_60px] items-center px-4 py-3 transition hover:bg-[var(--color-soft)]" onClick={onToggle}>
//           <div className="flex items-center">
//             <ChevronDown size={15} className={`text-[var(--color-muted)] transition-transform ${ isOpen ? "rotate-180" : "" }`} />
//           </div>

//           <div className="flex min-w-0 items-center gap-3">
//             <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--color-sand)]">
//               {brand.logo ? (
//                 <Image
//                   src={getImageUrl(brand.logo)}
//                   alt={brand.name.en}
//                   fill
//                   sizes="36px"
//                   className="object-cover"
//                 />
//               ) : (
//                 <Package size={17} className="text-[var(--color-muted)]" />
//               )}
//             </div>

//             <div className="min-w-0">
//               <p className="truncate text-xs font-bold text-[var(--color-ink)]">
//                 {brand.name.en}
//               </p>

//               <p className="truncate text-[10px] text-[var(--color-muted)]">
//                 {brand.name.ar}
//               </p>
//             </div>
//           </div>

//           <div className="text-xs font-medium text-[var(--color-ink)]">
//             {brand.productCount}
//           </div>

//           <div>
//             <span
//               className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-semibold ${
//                 brand.isActive
//                   ? "bg-[var(--color-green-light)] text-[var(--color-green-dark)]"
//                   : "bg-[var(--color-soft)] text-[var(--color-muted)]"
//               }`}
//             >
//               <span className="mr-1.5">●</span>
//               {brand.isActive ? "Active" : "Draft"}
//             </span>
//           </div>

//           <div className="flex justify-center">
//             <button
//               type="button"
//               onClick={(event) => { event.stopPropagation()}}
//               className="rounded-md p-1.5 text-[var(--color-muted)] transition hover:bg-[var(--color-soft)] hover:text-[var(--color-ink)]"
//               aria-label="Brand actions"
//             >
//               <MoreVertical size={16} />
//             </button>
//           </div>
//         </div>

//         {isOpen && (
//           <BrandExpandedPanel brand={brand} />
//         )}
//       </div>
//     </>
//   );
// }

"use client";
import Image from "next/image";
import { ChevronDown, ChevronRight, Package, ArrowRight, Loader2, Archive, RotateCcw, Pencil } from "lucide-react";
import { AdminProductCard } from "@/index";
import { getImageUrl } from "@/helper/getImage";
import { useLocale } from "next-intl";

function StatusBadge({ status }) {
  const isActive = status === "Active";

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full
        px-2.5 py-1
        text-[9px]
        font-bold
        ${
          isActive
            ? "bg-[var(--color-mint)] text-[var(--color-green-dark)]"
            : "bg-[var(--color-sand)] text-[var(--color-soft)]"
        }
      `}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-[var(--color-green)]" : "bg-[var(--color-muted)]"}`} />
      {status}
    </span>
  );
}

export default function CategoryRow({ brand, isExpanded, onToggle }) {
  const locale = useLocale();
  const products = brand?.featuredProducts || [];

  return (
    <>
      <div className="grid grid-cols-[minmax(260px,1.7fr)_minmax(150px,1fr)_100px_110px_45px] items-center gap-3 border-b border-[var(--color-divider)] px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onToggle}
            aria-label={isExpanded ? "Collapse category" : "Expand category"}
            className="
              flex h-6 w-6 shrink-0
              items-center justify-center
              rounded-md
              text-[var(--color-soft)]
              hover:bg-[var(--color-sand)]
            "
          >
            {isExpanded ? (
              <ChevronDown size={15} />
            ) : (
              <ChevronRight size={15} />
            )}
          </button>

          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--color-sand)]">
            {brand.logo ? (
              <Image
                src={getImageUrl(brand.logo)}
                alt={brand.name.en}
                fill
                sizes="36px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package size={18} className="text-[var(--color-muted)]" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-[var(--color-ink)]">
              {brand.name[locale]}
            </p>

            <p dir="rtl" className="mt-1 truncate text-left text-[9px] text-[var(--color-muted)]">
              {brand.name[locale]}
            </p>
          </div>
        </div>

        <div className="text-[11px] text-[var(--color-soft)]">
          {brand.parent || "— (Root)"}
        </div>

        <div className="text-[13px] font-medium text-[var(--color-ink)]">
          {brand.productsCount.toLocaleString()}
        </div>

        <div>
          <StatusBadge status={brand.isActive ? "Active" : "Archived"} />
        </div>

        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            aria-label={`Edit ${brand.name[locale]}`}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] transition-colors hover:border-[var(--color-green-light)] hover:bg-[var(--color-sand)] hover:text-[var(--color-green)]"
          >
            <Pencil size={14} />
          </button>

          <button
            type="button"
            aria-label={
              brand.isActive
                ? `Archive ${brand.name?.en || "brand"}`
                : `Restore ${brand.name?.en || "brand"}`
            }
            title={brand.isActive ? "Archive brand" : "Restore brand"}
            className="
              flex h-7 w-7
              items-center justify-center
              rounded-lg
              border border-[var(--color-border)]
              text-[var(--color-muted)]
              transition-colors
              hover:border-[var(--color-red)]
              hover:bg-[var(--color-sand)]
              hover:text-[var(--color-red)]
            "
          >
            {brand.isActive ? (
              <Archive size={14} />
            ) : (
              <RotateCcw size={14} />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-b border-[var(--color-divider)] bg-[var(--color-cream)] px-5 py-4">
          {products.length > 0 ? (
            <>
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--color-soft)]">
                  Featured Catalog Listings In This Brand
                </p>

                <button type="button" className="flex items-center gap-1 text-[10px] font-semibold text-[var(--color-green-dark)]">
                  Manage all {brand.productsCount.toLocaleString()} products
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
                {products.map((product) => (
                  <AdminProductCard key={product._id} product={product} locale={locale} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-sand)]">
                <Package size={20} className="text-[var(--color-soft)]" />
              </div>

              <h3 className="mt-3 text-[13px] font-semibold text-[var(--color-ink)]">
                No products in this brand yet.
              </h3>

              <p className="mt-1 max-w-[420px] text-[10px] leading-5 text-[var(--color-muted)]">
                This brand currently has no catalog
                assignments. Assign SKUs or connect a merchant
                inventory feed.
              </p>

              <button type="button" className="mt-4 rounded-lg bg-[var(--color-green-dark)] px-4 py-2 text-[10px] font-bold text-white">
                Assign Catalog SKUs
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// import Image from "next/image";
// import { ChevronDown, ChevronRight, MoreVertical, Package } from "lucide-react";
// import { getImageUrl } from "@/helper/getImage";
// import { BrandExpandedPanel } from "@/index";

// function StatusBadge({ isActive }) {
//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold ${
//         isActive
//           ? "bg-[var(--color-mint)] text-[var(--color-green-dark)]"
//           : "bg-[var(--color-sand)] text-[var(--color-soft)]"
//       }`}
//     >
//       <span className={`h-1.5 w-1.5 rounded-full ${
//           isActive
//             ? "bg-[var(--color-green)]"
//             : "bg-[var(--color-muted)]"
//         }`}
//       />
//       {isActive ? "Active" : "Draft"}
//     </span>
//   );
// }

// export default function BrandRow({ brand, isExpanded, productsData, onToggle, onLoadMore }) {
//   return (
//     <>
//       <div className="grid grid-cols-[minmax(300px,1.8fr)_120px_120px_45px] items-center gap-3 border-b border-[var(--color-divider)] bg-[var(--color-surface)] px-4 py-3">
//         <div className="flex min-w-0 items-center gap-3">
//           <button
//             type="button"
//             onClick={onToggle}
//             aria-label={ isExpanded ? "Collapse brand" : "Expand brand" }
//             className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[var(--color-soft)] hover:bg-[var(--color-sand)]"
//           >
//             {isExpanded ? (
//               <ChevronDown size={15} />
//             ) : (
//               <ChevronRight size={15} />
//             )}
//           </button>

//           <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[var(--color-sand)]">
//             {brand.logo ? (
//               <Image
//                 src={getImageUrl(brand.logo)}
//                 alt={brand.name?.en || "Brand"}
//                 fill
//                 sizes="40px"
//                 className="object-cover"
//               />
//             ) : (
//               <div className="flex h-full items-center justify-center">
//                 <Package size={18} className="text-[var(--color-muted)]" />
//               </div>
//             )}
//           </div>

//           <div className="min-w-0">
//             <p className="truncate text-[13px] font-semibold text-[var(--color-ink)]">
//               {brand.name?.en || "Unnamed Brand"}
//             </p>

//             <p dir="rtl" className="mt-1 truncate text-left text-[9px] text-[var(--color-muted)]">
//               {brand.name?.ar || "—"}
//             </p>
//           </div>
//         </div>

//         <div className="text-[11px] font-medium text-[var(--color-ink)]">
//           {Number(brand.productCount || 0).toLocaleString()}
//         </div>

//         <div>
//           <StatusBadge isActive={brand.isActive} />
//         </div>

//         <div className="flex items-center justify-end">
//           <button
//             type="button"
//             aria-label={`Actions for ${brand.name?.en || "brand"}`}
//             className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--color-muted)] transition hover:bg-[var(--color-sand)] hover:text-[var(--color-ink)]"
//           >
//             <MoreVertical size={15} />
//           </button>
//         </div>
//       </div>

//       {isExpanded && (
//         <BrandExpandedPanel
//           brand={brand}
//           productsData={productsData}
//           onLoadMore={onLoadMore}
//         />
//       )}
//     </>
//   );
// }