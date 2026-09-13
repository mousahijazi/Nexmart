"use client"
import { useState } from "react";
import { useCheckoutContext } from "../../Context/CheckoutProvider";
import { Link } from "../../lib/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";

const INITIAL_VISIBLE = 4;

export default function CheckoutItems() {
    const t = useTranslations();
    const { checkoutItems } = useCheckoutContext();
    const [showAll, setShowAll] = useState(false);

    if (checkoutItems.length === 0) return null;

    const visibleItems = showAll ? checkoutItems : checkoutItems.slice(0, INITIAL_VISIBLE);
    const hasMore = checkoutItems.length > INITIAL_VISIBLE;

    return (
        <div className="px-3 min-[480px]:px-6 py-8 border-t-2 border-t-[var(--color-border)] dark:border-[var(--color-border)]">
            <h2 className="text-xl font-bold text-[var(--color-green)] dark:text-[var(--color-gold)] mb-5">
                {t("checkout.addressPage.items.title", {length: checkoutItems.length})}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visibleItems.map((item) => (
                    <div key={item.id} className="relative flex items-center gap-3 bg-[var(--color-surface)] dark:bg-[var(--color-sand)] rounded-xl p-3">
                        <Link href={`/products/${item.id}`} className="relative w-14 h-14 shrink-0 bg-[var(--color-cream)] dark:bg-[var(--color-field)] rounded-lg overflow-hidden">
                            <Image src={item.thumbnail} alt={item.title} fill className="object-contain p-1" />
                        </Link>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[var(--color-green-deep)] dark:text-[var(--color-ink)] line-clamp-1">
                                {item.title}
                            </p>
                            <p className="text-xs text-[var(--color-muted)] dark:text-[var(--color-muted)]">
                                {t("checkout.addressPage.items.quantity", {quantity: item.quantity || 1})}
                            </p>
                        </div>
                        <span className="text-sm font-bold text-[var(--color-green)] dark:text-[var(--color-gold)]">
                            ${item.price}
                        </span>
                    </div>
                ))}
            </div>

            {hasMore && (
                <button
                    onClick={() => setShowAll((prev) => !prev)}
                    className="mt-5 text-sm font-semibold text-[var(--color-green)] dark:text-[var(--color-gold)] underline cursor-pointer"
                >
                    {showAll ? "Show less" : `Show ${checkoutItems.length - INITIAL_VISIBLE} more`}
                </button>
            )}
        </div>
    );
}