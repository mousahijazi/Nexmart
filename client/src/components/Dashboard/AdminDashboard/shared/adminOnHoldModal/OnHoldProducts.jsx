"use client";
import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { getImageUrl } from "@/helper/getImage";

function getProductTitle(productTitle, locale, fallback) {
    if (typeof productTitle === "string") return productTitle;

    if (productTitle && typeof productTitle === "object") {
        return locale.startsWith("ar")
            ? productTitle.ar || productTitle.en || fallback
            : productTitle.en || productTitle.ar || fallback;
    }

    return fallback;
}

function getProductId(item) {
    const product = item?.product;

    if (product && typeof product === "object") {
        return product._id || product.id || null;
    }

    return product || item?.productId || null;
}

export default function OnHoldProducts({ items = [], loading = false, pagination, onLoadMore, totalItems }) {
    const t = useTranslations("Admin.orders");
    const locale = useLocale();

    return (
        <section className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--color-ink)]">
                    <Package size={16} />
                    {t("onHold.products")}
                </h3>

                <span className="rounded-full bg-[var(--color-sand)] px-3 py-1 text-[10px] font-bold text-[var(--color-green-dark)]">
                    {totalItems ?? pagination?.total ?? items.length}
                </span>
            </div>

            {loading && items.length === 0 ? (
                <p className="py-5 text-center text-xs text-[var(--color-muted)]">
                    {t("row.loadingItems")}
                </p>
            ) : items.length === 0 ? (
                <p className="py-5 text-center text-xs text-[var(--color-muted)]">
                    {t("row.noItems")}
                </p>
            ) : (
                <div className="space-y-2">
                    {items.map((item) => {
                        const productId = getProductId(item);
                        const title = getProductTitle(item.productTitle, locale, t("row.unnamedProduct"));
                        const imageUrl = item.mainImage ? getImageUrl(item.mainImage) : null;

                        return (
                            <div key={item._id} className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-[var(--color-divider)] bg-[var(--color-cream)] p-3">
                                <div className="flex min-w-0 items-center gap-3">
                                    {imageUrl ? (
                                        productId ? (
                                            <Link href={`/products/${productId}`} className="shrink-0">
                                                <Image
                                                    src={imageUrl}
                                                    alt={title}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-lg object-cover"
                                                />
                                            </Link>
                                        ) : (
                                            <Image
                                                src={imageUrl}
                                                alt={title}
                                                width={48}
                                                height={48}
                                                className="shrink-0 rounded-lg object-cover"
                                            />
                                        )
                                    ) : (
                                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--color-sand)]">
                                            <Package size={19} className="text-[var(--color-muted)]" />
                                        </span>
                                    )}

                                    <div className="min-w-0">
                                        <p className="break-words text-xs font-semibold text-[var(--color-ink)]">
                                            {title}
                                        </p>

                                        <p className="mt-1 text-[10px] text-[var(--color-muted)]">
                                            {t("row.quantity", { count: item.quantity })}
                                        </p>
                                    </div>
                                </div>

                                <p className="shrink-0 text-xs font-bold text-[var(--color-green-dark)]">
                                    {new Intl.NumberFormat(locale, {
                                        style: "currency",
                                        currency: item.currency || "SAR",
                                    }).format(Number(item.subtotal || 0))}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}

            {pagination?.hasNextPage && (
                <button
                    type="button"
                    onClick={onLoadMore}
                    disabled={loading}
                    className="mt-3 min-h-10 w-full rounded-xl border border-[var(--color-border)] px-3 py-2 text-xs font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-sand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? t("row.loading") : t("row.loadMoreItems")}
                </button>
            )}
        </section>
    );
}