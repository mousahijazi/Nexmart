"use client"
import { useState } from "react";
import { useCheckoutContext } from "@/Context/CheckoutProvider";
import Link from "next/link";
import Image from "next/image";

const INITIAL_VISIBLE = 4;

export default function CheckoutItems() {
    const { checkoutItems } = useCheckoutContext();
    const [showAll, setShowAll] = useState(false);

    if (checkoutItems.length === 0) return null;

    const visibleItems = showAll ? checkoutItems : checkoutItems.slice(0, INITIAL_VISIBLE);
    const hasMore = checkoutItems.length > INITIAL_VISIBLE;

    return (
        <div className="px-3 min-[480px]:px-6 py-8 border-t-2 border-t-gray-200 dark:border-zinc-800">
            <h2 className="text-xl font-bold text-[#5B3A21] dark:text-[#A68A64] mb-5">
                Items in this order ({checkoutItems.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visibleItems.map((item) => (
                    <div key={item.id} className="relative flex items-center gap-3 bg-[#f7f7f7] dark:bg-[#1F1B17] rounded-xl p-3">
                        <Link href={`/products/${item.id}`} className="relative w-14 h-14 shrink-0 bg-white dark:bg-zinc-900 rounded-lg overflow-hidden">
                            <Image src={item.thumbnail} alt={item.title} fill className="object-contain p-1" />
                        </Link>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#5B3A21] dark:text-[#F5EBE6] line-clamp-1">
                                {item.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-zinc-400">
                                Qty: {item.quantity || 1}
                            </p>
                        </div>
                        <span className="text-sm font-bold text-[#5B3A21] dark:text-[#A68A64]">
                            ${item.price}
                        </span>
                    </div>
                ))}
            </div>

            {hasMore && (
                <button
                    onClick={() => setShowAll((prev) => !prev)}
                    className="mt-5 text-sm font-semibold text-[#5B3A21] dark:text-[#A68A64] underline cursor-pointer"
                >
                    {showAll ? "Show less" : `Show ${checkoutItems.length - INITIAL_VISIBLE} more`}
                </button>
            )}
        </div>
    );
}