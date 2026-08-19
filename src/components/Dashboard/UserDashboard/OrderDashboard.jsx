"use client";

import { useState } from "react";
import { useUserContext } from "@/Context/UserProvider";
import { useCheckoutContext } from "@/Context/CheckoutProvider";
import { useRouter } from "@/lib/i18n/routing";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { OrderDashboardButton, OrderSummaryRow } from "@/index";
import { useTranslations, useLocale } from "next-intl";

const ORDERS_PER_PAGE = 5;

export default function OrderDashboardData() {
    const t = useTranslations("profile.orders");
    const locale = useLocale();
    const { user, loading } = useUserContext();
    const { orders, setCurrentOrderId, ordersLoading } = useCheckoutContext();
    const router = useRouter();
    const [expandedOrders, setExpandedOrders] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("all");

    const toggleOrder = (orderId) => {
        setExpandedOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    const goToPayment = (orderId) => {
        setCurrentOrderId(orderId);
        router.push("/checkout?mode=pay");
    };

    const orderTabs = [
        { id: "all", label: t("tabs.all") },
        { id: "processing", label: t("tabs.processing") },
        { id: "delivered", label: t("tabs.delivered") },
        { id: "returned", label: t("tabs.returned") },
    ];

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setCurrentPage(1);
    };

    const filteredOrders = orders.filter((order) => {
        if (activeTab === "all") return true;

        if (activeTab === "processing") {
            return order.payment_status === "pending";
        } else if (activeTab === "delivered") {
            return order.payment_status === "paid";
        } else if (activeTab === "returned") {
            return order.payment_status === "failed";
        }

        return true;
    });

    const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);

    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * ORDERS_PER_PAGE,
        currentPage * ORDERS_PER_PAGE
    );

    if (ordersLoading || loading) {
        return (
            <div className="bg-white dark:bg-[#18221f] border border-[var(--color-border)] dark:border-[#22332e] rounded-2xl overflow-hidden animate-pulse">
                <div className="px-6 py-[22px] flex items-center justify-between border-b border-[var(--color-divider)] dark:border-[#22332e] flex-wrap gap-[10px]">
                    <div className="h-[27px] w-20 bg-gray-200 dark:bg-[#22332e] rounded-md"></div>
                    <div className="flex gap-[7px] flex-wrap">
                        {orderTabs.map((_, index) => (
                            <div key={index} className="h-[33.5px] w-[78px] bg-gray-200 dark:bg-[#22332e] rounded-full"></div>
                        ))}
                    </div>
                </div>

                <div className="hidden md:grid grid-cols-[1.1fr_1fr_1fr_1fr_0.8fr] px-6 py-[13px] bg-[#FAF9F4] dark:bg-[#121a17] border-b border-[var(--color-divider)] dark:border-[#22332e]">
                    <div className="h-[18.75px] w-16 bg-gray-200 dark:bg-[#22332e] rounded-md"></div>
                    <div className="h-[18.75px] w-12 bg-gray-200 dark:bg-[#22332e] rounded-md"></div>
                    <div className="h-[18.75px] w-12 bg-gray-200 dark:bg-[#22332e] rounded-md"></div>
                    <div className="h-[18.75px] w-14 bg-gray-200 dark:bg-[#22332e] rounded-md"></div>
                    <div></div>
                </div>

                <div className="px-5">
                    <div className="py-5 flex flex-col gap-3">
                        {Array.from({ length: ORDERS_PER_PAGE }).map((_, index) => (
                            <div key={index}>
                                <div className="flex flex-col gap-2 justify-between md:items-center md:grid grid-cols-[1.1fr_1fr_1fr_1fr_0.8fr] py-4">
                                    <div className="h-[24px] w-28 bg-gray-200 dark:bg-[#22332e] rounded-md"></div>

                                    <div className="flex flex-wrap items-center gap-3 md:contents">
                                        <div className="h-[20px] w-24 bg-gray-200 dark:bg-[#22332e] rounded-md"></div>
                                        <div className="h-[24px] w-20 bg-gray-200 dark:bg-[#22332e] rounded-full"></div>
                                        <div className="h-[20px] w-16 bg-gray-200 dark:bg-[#22332e] rounded-md"></div>
                                    </div>

                                    <div className="flex justify-start md:justify-end">
                                        <div className="h-[20px] w-16 bg-gray-200 dark:bg-[#22332e] rounded-md"></div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex items-center justify-center gap-4 mt-2 h-[38px]">
                            <div className="h-9 w-9 bg-gray-200 dark:bg-[#22332e] rounded-lg"></div>
                            <div className="h-5 w-10 bg-gray-200 dark:bg-[#22332e] rounded-md"></div>
                            <div className="h-9 w-9 bg-gray-200 dark:bg-[#22332e] rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return <p className="py-8 text-center text-gray-500">{t("loginRequired")}</p>;
    }

    if (orders.length === 0) {
        return <p className="py-8 text-center text-gray-500">{t("noOrders")}</p>;
    }

    return (
        <div className="bg-white dark:bg-[#18221f] border border-[var(--color-border)] dark:border-[#22332e] rounded-2xl overflow-hidden">
            <div className="px-6 py-[22px] flex items-center justify-between border-b border-[var(--color-divider)] dark:border-[#22332e] flex-wrap gap-[10px]">
                <div className="font-bold text-lg dark:text-gray-100">{t("title")}</div>
                <div className="flex gap-[7px] flex-wrap">
                    {orderTabs.map((ele, index) => {
                        const isActive = activeTab === ele.id;

                        return (
                            <button
                                key={index}
                                type="button"
                                className={`rounded-full px-[15px] py-[6px] text-[13px] cursor-pointer border transition duration-200 ${
                                    isActive
                                        ? "bg-[#0E4D3A] text-white border-[#0E4D3A]"
                                        : "bg-white dark:bg-[#18221f] text-[#3C4A44] dark:text-gray-300 border-[#E2E0D5] dark:border-[#22332e] hover:border-[#0E4D3A]"
                                }`}
                                onClick={() => handleTabChange(ele.id)}
                            >
                                {ele.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="hidden md:grid grid-cols-[1.1fr_1fr_1fr_1fr_0.8fr] px-6 py-[13px] bg-[#FAF9F4] dark:bg-[#121a17] text-[12.5px] text-[var(--color-muted)] dark:text-gray-400 border-b border-[var(--color-divider)] dark:border-[#22332e]">
                <div>{t("table.orderNumber")}</div>
                <div>{t("table.date")}</div>
                <div>{t("table.status")}</div>
                <div>{t("table.total")}</div>
            </div>

            <div className="px-5">
                <div className="py-5 flex flex-col gap-3">
                    {paginatedOrders.map((order) => {
                        const isPending = order.payment_status === "pending";
                        const isFailed = order.payment_status === "failed";
                        const isPaid = order.payment_status === "paid";

                        return (
                            <div key={order.id}>
                                <div className="flex flex-col gap-2 justify-between md:items-center md:grid grid-cols-[1.1fr_1fr_1fr_1fr_0.8fr] py-4">
                                    <p className="font-semibold text-[#5B3A21] dark:text-[#F5EBE6]">
                                        NX-{order.id.slice(0, 8)}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-3 md:contents">
                                        <OrderSummaryRow goToPayment={goToPayment} isPaid={isPaid} isFailed={isFailed} isPending={isPending} order={order} />
                                    </div>
                                    <div className="text-start md:text-end">
                                        {isPaid ? (
                                            <button
                                                type="button"
                                                onClick={() => toggleOrder(order.id)}
                                                className="
                                                    text-[13.5px]
                                                    text-[var(--color-green-dark)]
                                                    dark:text-[var(--color-gold)]
                                                    font-semibold
                                                    cursor-pointer
                                                    hover:opacity-70
                                                    transition
                                                "
                                            >
                                                {t("details")}
                                                <span className={locale === "ar" ? "mr-1 inline-block" : "ml-1 inline-block rotate-180"}>
                                                    ←
                                                </span>
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => goToPayment(order.id)}
                                                className="
                                                    text-[13.5px]
                                                    text-[var(--color-green-dark)]
                                                    dark:text-[var(--color-gold)]
                                                    font-semibold
                                                    cursor-pointer
                                                    hover:opacity-70
                                                    transition
                                                "
                                            >
                                                {t("completePayment")}
                                                <span className={locale === "ar" ? "mr-1 inline-block" : "ml-1 inline-block rotate-180"}>
                                                    ←
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {isPaid && expandedOrders[order.id] && (
                                    <div className="bg-[#FAF9F4] dark:bg-[#121a17] rounded-2xl mt-2 border-b border-[var(--color-divider)] dark:border-[#22332e] px-2 min-[480px]:px-6 py-5">
                                        <div className="flex flex-col gap-5">
                                            {order.order_items.map((item) => (
                                                <div key={item.id} className="flex max-[480px]:flex-col min-[480px]:items-center justify-between gap-2 text-sm">
                                                    <span className="text-[var(--color-muted)] dark:text-gray-300">
                                                        {item.product_title} × {item.quantity}
                                                    </span>

                                                    <span className={`font-semibold text-[var(--color-green-dark)] dark:text-[var(--color-gold)] ${locale === "ar" ? "mr-2" : "ml-2"}`}>
                                                        {item.subtotal.toFixed(2)} {t("currency")}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-2">
                            <OrderDashboardButton 
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                label={t("previousPage")}
                                icon={locale === "ar" ? <ChevronRight /> : <ChevronLeft />} 
                            />
                            <span className="text-sm text-gray-500 dark:text-zinc-400">
                                {currentPage} / {totalPages}
                            </span>
                            <OrderDashboardButton 
                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                label={t("nextPage")}
                                icon={locale === "ar" ? <ChevronLeft /> : <ChevronRight />} 
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}