"use client";
import { useUserContext } from "@/Context/UserProvider";
import { useCheckoutContext } from "@/Context/CheckoutProvider";
import { Package } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AccountDashboard() {
    const { user } = useUserContext();
    const { orders, ordersLoading } = useCheckoutContext();
    const t = useTranslations("profile");
    const tDash = useTranslations("profile.accountDashboard");

    const firstName =
        user?.user_metadata?.first_name ||
        user?.user_metadata?.firstName ||
        user?.email?.split("@")[0] ||
        t("guest");

    return (
        <div className="flex flex-col gap-5">
            <div className="relative overflow-hidden rounded-2xl bg-[var(--color-green-dark)] dark:bg-[#0f2e25] text-white p-7 border border-transparent dark:border-[#22332e] shadow-sm">
                <div className="relative z-10 p-6">
                    <div className="text-[var(--color-gold)] text-xs font-bold tracking-[0.12em] mb-2">
                        {tDash("badge")}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold">
                        {tDash("welcome", { name: firstName })}
                    </h1>
                    <p className="mt-2 text-sm leading-7 text-[#C7D5D0] max-w-xl">
                        {tDash("subtitle")}
                    </p>
                </div>

                <div className="absolute -left-12 -bottom-16 w-40 h-40 rounded-full border border-[var(--color-gold)]/20" />
                <div className="absolute -left-5 -bottom-9 w-24 h-24 rounded-full bg-[var(--color-gold)]/5" />
            </div>

            <div className="bg-white dark:bg-[#18221f] border border-[var(--color-border)] dark:border-[#22332e] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="font-bold text-[17px] dark:text-gray-100">
                            {tDash("recentOrdersTitle")}
                        </h2>
                        <p className="text-xs text-[var(--color-muted)] dark:text-gray-400 mt-1">
                            {tDash("recentOrdersDesc")}
                        </p>
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-[#EEF4F1] dark:bg-[#122A23] flex items-center justify-center">
                        <Package size={18} className="text-[var(--color-green-dark)] dark:text-[var(--color-gold)]" />
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="py-8 text-center text-sm text-[var(--color-muted)] dark:text-gray-400">
                        {tDash("noOrders")}
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {orders.slice(0, 3).map((order) => (
                            <div key={order.id} className=" flex items-center justify-between gap-4 py-4 border-b last:border-b-0 border-[var(--color-divider)] dark:border-[#22332e]">
                                <div>
                                    <p className="font-semibold text-sm text-[#5B3A21] dark:text-gray-100">
                                        NX-{order.id.slice(0, 8)}
                                    </p>

                                    <p className="text-xs text-[var(--color-muted)] dark:text-gray-400 mt-1">
                                        {tDash("productsCount", { count: order.order_items?.length || 0 })}
                                    </p>
                                </div>

                                <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full
                                        ${
                                            order.payment_status === "paid"
                                                ? "bg-[#E7F2EC] text-[#0E4D3A] dark:bg-[#15382E] dark:text-[#D4A94A]"
                                                : order.payment_status === "pending"
                                                ? "bg-[#F8F1DD] text-[#8A6B1F] dark:bg-[#352D17] dark:text-[#D4A94A]"
                                                : "bg-[#F7E8E6] text-[#9B4038] dark:bg-[#3A211F] dark:text-[#E7A39C]"
                                        }
                                    `}
                                >
                                    {order.payment_status === "paid"
                                        ? tDash("statusPaid")
                                        : order.payment_status === "pending"
                                        ? tDash("statusPending")
                                        : tDash("statusFailed")}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}