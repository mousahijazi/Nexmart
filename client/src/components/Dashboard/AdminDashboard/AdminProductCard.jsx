import Image from "next/image";
import { Link } from "@/lib/i18n/routing";
import { Package } from "lucide-react";
import { getImageUrl } from "@/helper/getImage";

export default function AdminProductCard({ product, locale }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)]">
        <Link href={`products/${product._id}`} className="relative block h-[110px] w-full bg-[var(--color-sand)]">
            {product.mainImage ? (
                <Image
                    src={getImageUrl(product.mainImage)}
                    alt={product.title[locale]}
                    fill
                    sizes="(max-width: 768px) 50vw, 180px"
                    className="object-cover"
                />
            ) : (
                <div className="flex h-full items-center justify-center">
                    <Package size={26} className="text-[var(--color-muted)]" />
                </div>
            )}
        </Link>

        <div className="p-2.5">
            <p className="truncate text-[10px] font-semibold text-[var(--color-ink)]">
                {product.title[locale]}
            </p>

            <p className="mt-1 text-[10px] font-bold text-[var(--color-gold-dark)]">
                SAR {Number(product.price).toLocaleString()}
            </p>

            <span
                className={`mt-2 inline-flex rounded-md px-1.5 py-1 text-[8px] font-semibold ${
                    Number(product.stock) > 0
                    ? "bg-[var(--color-mint)] text-[var(--color-green-dark)]"
                    : "bg-[var(--color-sand)] text-[var(--color-soft)]"
                }`}
                >
                {Number(product.stock) > 0 ? `In Stock (${product.stock} units)` : "Out of Stock"}
            </span>
        </div>
    </div>
  );
}