"use client";
import Image from "next/image";
import { ChevronDown, ChevronRight, Package, ArrowRight, Loader2, Archive, RotateCcw } from "lucide-react";
import { AdminProductCard, AdminEditButton } from "@/index";
import { useAdminContext } from "@/Context/Adminprovider";
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
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive ? "bg-[var(--color-green)]" : "bg-[var(--color-muted)]"
        }`}
      />

      {status}
    </span>
  );
}

export default function BrandRow({ brand, isExpanded, onToggle, onLoadMore, productsData }) {
  const { openEditBrand, toggleBrandActive } = useAdminContext();

  const locale = useLocale();

  const products = productsData?.products || [];
  const isLoading = productsData?.loading || false;
  const hasMore = (productsData?.page || 1) < (productsData?.totalPages || 0);

  const brandName = brand.name?.[locale] || brand.name?.en || brand.name?.ar || "Brand";
  const secondaryName = locale === "ar" ? brand.name?.en : brand.name?.ar;
  const productsCount = typeof brand.productsCount === "number" ? brand.productsCount : 0;

  return (
    <>
      <div className="grid grid-cols-[minmax(260px,1.7fr)_minmax(150px,1fr)_100px_110px_70px] items-center gap-3 border-b border-[var(--color-divider)] px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onToggle}
            aria-label={ isExpanded ? "Collapse brand" : "Expand brand" }
            aria-expanded={isExpanded}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[var(--color-soft)] hover:bg-[var(--color-sand)]"
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
                alt={brandName}
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
              {brandName}
            </p>

            {secondaryName && (
              <p dir="auto" className="mt-1 truncate text-[9px] text-[var(--color-muted)]">
                {secondaryName}
              </p>
            )}
          </div>

        </div>

        <div className="truncate text-[11px] text-[var(--color-soft)]">
          {brand.slug || "—"}
        </div>

        <div className="text-[13px] font-medium text-[var(--color-ink)]">
          {productsCount.toLocaleString()}
        </div>

        <div>
          <StatusBadge status={brand.isActive ? "Active" : "Archived"} />
        </div>

        <div className="flex items-center justify-end gap-1">
          <AdminEditButton name={brandName} onClick={() => openEditBrand(brand)} />

          <button
            type="button"
            onClick={() => toggleBrandActive(brand._id, !brand.isActive)}
            aria-label={ brand.isActive ? `Archive ${brandName}` : `Restore ${brandName}` }
            title={ brand.isActive ? "Archive brand" : "Restore brand" }
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
          {isLoading && products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Loader2 size={22} className="animate-spin text-[var(--color-soft)]" />

              <p className="mt-3 text-[11px] text-[var(--color-soft)]">
                Loading products...
              </p>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--color-soft)]">
                  Featured Catalog Listings In This Brand
                </p>

                <button
                  type="button"
                  className="flex items-center gap-1 text-[10px] font-semibold text-[var(--color-green-dark)]"
                >
                  Manage all {productsCount.toLocaleString()} products
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
                {products.map((product) => (
                  <AdminProductCard
                    key={product._id}
                    product={product}
                    locale={locale}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={onLoadMore}
                    disabled={isLoading}
                    className="
                      flex items-center gap-2
                      rounded-lg
                      border border-[var(--color-border)]
                      bg-[var(--color-surface)]
                      px-4 py-2
                      text-[10px]
                      font-semibold
                      text-[var(--color-green-dark)]
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                      hover:bg-[var(--color-sand)]
                    "
                  >
                    {isLoading && (
                      <Loader2 size={13} className="animate-spin" />
                    )}

                    {isLoading ? "Loading..." : "Load More Products"}
                  </button>
                </div>
              )}
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

              <button
                type="button"
                className="mt-4 rounded-lg bg-[var(--color-green-dark)] px-4 py-2 text-[10px] font-bold text-white"
              >
                Assign Catalog SKUs
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}