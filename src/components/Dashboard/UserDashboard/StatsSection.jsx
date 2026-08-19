"use client"
import { useUserContext } from "@/Context/UserProvider";
import { useCheckoutContext } from "@/Context/CheckoutProvider";
import { useTranslations } from "next-intl";

export default function StatsSection() {
    const t = useTranslations("profile");
    const tStats = useTranslations("profile.statsSection");
    const { user } = useUserContext();
    const { orders, ordersLoading } = useCheckoutContext();

    const activeOrdersCount = orders?.filter(
        (order) => order.payment_status === "pending" || order.payment_status === "paid"
    ).length || 0;

    const totalOrdersCount = orders?.length || 0;

    const stats = [
        { label: tStats("activeOrders"), value: activeOrdersCount },
        { label: tStats("totalOrders"), value: totalOrdersCount },
        { label: tStats("loyaltyPoints"), value: user?.loyalty_points || 0 },
        { label: tStats("availableCoupons"), value: user?.coupons?.length || 0 },
    ];

    if (ordersLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px]">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="bg-white dark:bg-[#18221f] border border-[var(--color-border)] dark:border-[#22332e] rounded-2xl p-5 animate-pulse">
                        <div className="h-5 text-[13px] bg-gray-200 dark:bg-[#22332e] rounded-md w-20"></div>
                        <div className="h-8 text-2xl bg-gray-200 dark:bg-[#22332e] rounded-md w-16 mt-3"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!user) {
        return <p className="py-8 text-center text-gray-500">{t("userUndifinde")}</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[14px]">
            {stats.map((ele, index) => (
                <div key={index} className="bg-white dark:bg-[#18221f] border border-[var(--color-border)] dark:border-[#22332e] rounded-2xl p-5">
                    <div className="text-[13px] text-[var(--color-muted)] dark:text-gray-400">{ele.label}</div>
                    <div className="font-bold text-2xl text-[var(--color-green-dark)] dark:text-[var(--color-gold)] mt-2">{ele.value}</div>
                </div>
            ))}
        </div>
    );
}