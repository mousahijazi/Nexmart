import Image from "next/image";
import { CatalogStatus, CategoryBadge, StockBadge } from "./ProductStatus";
import EditPoductsButton from "./EditPoductsButton";
import { getStockStatus, getCatalogStatus, getCategoryName, getBrandName, getDisplaySku } from "./Productdisplay";
import { getImageUrl } from "@/helper/getImage";
import { Link } from "@/lib/i18n/routing";

export default function ProductRow({ product, selected }) {
  const name = product.title?.en || product.title?.ar || "Untitled product";
  const arabicName = product.title?.ar || "";

  const stockStatus = getStockStatus(product.stock);
  const catalogStatus = getCatalogStatus(product.isActive);

  return (
    <div
      className={`grid grid-cols-[44px_minmax(280px,1.5fr)_110px_110px_90px_110px_90px] items-center border-b border-[var(--color-divider)] bg-[var(--color-cream)] px-4 py-[12px] ${
        selected ? "bg-[var(--color-surface)]" : ""
      }`}
    >
      <div className="flex flex-col items-center gap-1">
        <EditPoductsButton product={product} />

        <button
          type="button"
          aria-label={`Archive ${name}`}
          title="Archive Product"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-300 bg-transparent text-red-600 transition-colors hover:bg-red-50"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="21 8 21 21 3 21 3 8" />
            <rect x="1" y="3" width="22" height="5" />
            <line x1="10" y1="12" x2="14" y2="12" />
          </svg>
        </button>
      </div>

      <div className="flex min-w-0 items-center gap-3">
        <Link href={`/products/${product._id}`} className="relative h-[58px] w-[58px] shrink-0 overflow-hidden rounded-[8px] bg-[var(--color-surface)]">
          <Image
            src={getImageUrl(product.mainImage)}
            alt={name}
            fill
            sizes="58px"
            className="object-cover"
          />
        </Link>

        <div className="min-w-0">
          <p className="truncate text-[15px] font-medium leading-[1.15] tracking-[-0.02em] text-[var(--color-ink)]">
            {name}
          </p>

          {arabicName && (
            <p
              dir="rtl"
              className="mt-1 truncate text-right text-[9px] leading-none text-[var(--color-muted)]"
            >
              {arabicName}
            </p>
          )}

          <p className="mt-1 text-[9px] font-semibold tracking-[0.08em] text-[#806B32]">
            SKU-{getDisplaySku(product)}
          </p>
        </div>
      </div>

      <div className="px-1">
        <CategoryBadge category={getCategoryName(product)} />
      </div>

      <div className="pr-2 text-[11px] font-medium leading-[1.25] text-[var(--color-soft)]">
        {getBrandName(product)}
      </div>

      <div className="text-[12px] font-medium leading-[1.35] text-[var(--color-ink)]">
        <span>SAR</span>
        <br />
        <span className="text-[13px]">{Number(product.price).toLocaleString()}</span>
      </div>

      <div>
        <StockBadge status={stockStatus} stock={product.stock} />
      </div>

      <div>
        <CatalogStatus status={catalogStatus} />
      </div>
    </div>
  );
}