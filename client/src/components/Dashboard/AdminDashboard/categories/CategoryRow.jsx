"use client";
import Image from "next/image";
import { ChevronDown, ChevronRight, MoreVertical, Package, ArrowRight } from "lucide-react";

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

function ProductCard({ product }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="relative h-[110px] w-full bg-[var(--color-sand)]">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 180px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package size={26} className="text-[var(--color-muted)]" />
          </div>
        )}
      </div>

      <div className="p-2.5">
        <p className="truncate text-[10px] font-semibold text-[var(--color-ink)]">
          {product.name}
        </p>

        <p className="mt-1 text-[10px] font-bold text-[var(--color-gold-dark)]">
          SAR {Number(product.price).toLocaleString()}
        </p>

        <span className="mt-2 inline-flex rounded-md bg-[var(--color-mint)] px-1.5 py-1 text-[8px] font-semibold text-[var(--color-green-dark)]">
          In Stock ({product.stock} units)
        </span>
      </div>
    </div>
  );
}

export default function CategoryRow({ category, isExpanded, onToggle }) {
  const hasProducts = category.productsCount > 0;

  return (
    <>
      <div className="grid grid-cols-[minmax(260px,1.7fr)_minmax(150px,1fr)_100px_110px_45px] items-center gap-3 border-b border-[var(--color-divider)] px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onToggle}
            aria-label={
              isExpanded
                ? "Collapse category"
                : "Expand category"
            }
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

          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[var(--color-sand)]">
            {category.image ? (
              <Image
                src={category.image}
                alt={category.name.en}
                fill
                sizes="40px"
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
              {category.name.en}
            </p>

            <p dir="rtl" className="mt-1 truncate text-left text-[9px] text-[var(--color-muted)]">
              {category.name.ar}
            </p>
          </div>
        </div>

        <div className="text-[11px] text-[var(--color-soft)]">
          {category.parent || "— (Root)"}
        </div>

        <div className="text-[13px] font-medium text-[var(--color-ink)]">
          {category.productsCount.toLocaleString()}
        </div>

        <div>
          <StatusBadge status={category.status} />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            aria-label="Category actions"
            className="
              flex h-7 w-7
              items-center justify-center
              rounded-md
              text-[var(--color-soft)]
              hover:bg-[var(--color-sand)]
            "
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-b border-[var(--color-divider)] bg-[var(--color-cream)] px-5 py-4">
          {hasProducts ? (
            <>
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--color-soft)]">
                  Featured Catalog Listings In This Category
                </p>

                <button type="button" className="flex items-center gap-1 text-[10px] font-semibold text-[var(--color-green-dark)]">
                  Manage all {category.productsCount.toLocaleString()} products
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
                {category.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}

                <div className="hidden min-h-[190px] items-center justify-center rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] md:flex">
                  <div className="text-center">
                    <Package size={24} className="mx-auto text-[var(--color-soft)]" />

                    <p className="mt-2 text-[12px] font-semibold text-[var(--color-ink)]">
                      +{Math.max(category.productsCount - 4, 0).toLocaleString()} more
                    </p>

                    <p className="mt-1 text-[9px] text-[var(--color-muted)]">
                      products in category
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-sand)]">
                <Package size={20} className="text-[var(--color-soft)]" />
              </div>

              <h3 className="mt-3 text-[13px] font-semibold text-[var(--color-ink)]">
                No products in this category yet.
              </h3>

              <p className="mt-1 max-w-[420px] text-[10px] leading-5 text-[var(--color-muted)]">
                This category currently has no catalog
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