"use client"
import { useState, useEffect } from "react";
import { useCheckoutContext } from "@/Context/CheckoutProvider";
import { useUserContext } from "@/Context/UserProvider";
import { getOrderById } from "@/helper/fetchApi";
import { ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function PaymentSummary() {
    const { currentOrderId } = useCheckoutContext();
    const { user } = useUserContext();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentOrderId || !user) {
            setLoading(false);
            return;
        }

        getOrderById(currentOrderId, user.id)
        .then((result) => {
            setOrder(result.success ? result.order : null);
            setLoading(false);
        });
    }, [currentOrderId, user]);

    // todo
    if (loading) {
        return <p className="text-center py-20">Loading order summary...</p>;
    }

    // todo
    if (!order) {
        return <p className="text-center py-20 text-red-600">Order not found.</p>;
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
                width={180}
                height={180}
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