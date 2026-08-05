import { ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function PaymentSummary({order, loading}) {
    // todo
    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center gap-8 min-[480px]:bg-[#F9F7F3] min-[480px]:dark:bg-[#1f1b17] px-3 min-[480px]:px-6 py-12">

                <div className="w-[200px] h-[200px] rounded-xl bg-gray-200 dark:bg-zinc-800 animate-pulse" />

                <div className="w-full max-w-md bg-white dark:bg-zinc-950 rounded-2xl shadow-md dark:shadow-black/60 p-6">

                    <div className="h-6 w-40 rounded bg-gray-200 dark:bg-zinc-800 animate-pulse mb-6" />

                    <div className="space-y-4">

                        <div className="flex justify-between items-center">
                            <div className="h-4 w-16 rounded bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                            <div className="h-4 w-28 rounded bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="h-4 w-16 rounded bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                            <div className="h-4 w-10 rounded bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="h-4 w-24 rounded bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                            <div className="h-4 w-20 rounded bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                        </div>

                    </div>

                    <div className="border-t-2 border-gray-100 dark:border-zinc-800 mt-6 pt-6 flex justify-between items-center">
                        <div className="h-5 w-16 rounded bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                        <div className="h-7 w-24 rounded bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                    </div>

                </div>

                <div className="text-xs h-4 w-72 rounded bg-gray-200 dark:bg-zinc-800 animate-pulse" />

            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <p className="text-lg font-bold text-red-600 dark:text-red-400">Order not found.</p>
                <p className="text-sm text-gray-500 mt-1">Please make sure you have selected a valid order.</p>
            </div>
        );
    }
    
    const orderData = [
        {
            text: "Order",
            value: `#${order.id.slice(0, 8)}`,
        },
        {
            text: "Items",
            value: order.order_items.length,
        },
        {
            text: "Shipping to",
            value: order.city,
        },
    ];

    return (
        <div className="flex flex-col justify-center items-center gap-8 min-[480px]:bg-[#F9F7F3] min-[480px]:dark:bg-[#1f1b17] px-3 min-[480px]:px-6 py-12">
            <Image
                src="/cart.svg"
                alt="secure payment"
                width={200}
                height={200}
                priority
                unoptimized
                className="opacity-10 dark:opacity-60"
            />

            <div className="w-full max-w-md bg-white dark:bg-zinc-950 rounded-2xl shadow-md dark:shadow-black/60 p-6 flex flex-col gap-4">
                <h2 className="text-lg font-bold text-[#5B3A21] dark:text-[#A68A64]">
                    Order Summary
                </h2>
                {orderData.map((ele, index) => (
                    <div key={index} className="flex justify-between text-sm text-gray-600 dark:text-zinc-300">
                        <span>{ele.text}</span>
                        <span>{ele.value}</span>
                    </div>
                ))}
                <div className="pt-4 border-t-2 border-t-gray-100 dark:border-t-zinc-800 flex justify-between items-center">
                    <span className="font-bold text-[#5B3A21] dark:text-[#A68A64]">Total</span>
                    <span className="text-xl font-extrabold text-[#5B3A21] dark:text-[#A68A64]">
                        ${order.total_price.toFixed(2)}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-400">
                <ShieldCheck size={16} />
                <span>Secured by Moyasar — Your card details never touch our servers</span>
            </div>
        </div>
    );
}