"use client";
import { useState } from "react";
import { useUserContext } from "../../../Context/UserProvider";
import { useCheckoutContext } from "../../../Context/CheckoutProvider";
import { useRouter } from "../../../lib/i18n/routing";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { OrderDashboardButton, OrderSummaryRow } from "../../../index";
import { useTranslations, useLocale } from "next-intl";
import { getBackendOrderItems } from "../../../helper/fetchApi";

const ORDERS_PER_PAGE = 5;
const orderGridCols = "grid-cols-[1.2fr_1fr_1fr_1fr_1fr]";
const orderTableMinWidth = "min-w-[850px]";

export default function OrderDashboardData() {
    const t = useTranslations("profile.orders");
    const locale = useLocale();
    const router = useRouter();
    const { user, loading } = useUserContext();
    const { orders, setCurrentOrderId, ordersLoading } = useCheckoutContext();

    const [orderItemsMap, setOrderItemsMap] = useState({});
    const [itemsLoadingMap, setItemsLoadingMap] = useState({});

    const [expandedOrders, setExpandedOrders] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("all");

    const toggleOrder = async (orderId) => {
        const isCurrentlyExpanded = !!expandedOrders[orderId];

        setExpandedOrders((prev) => ({
            ...prev,
            [orderId]: !isCurrentlyExpanded,
        }));

        if (!isCurrentlyExpanded && !orderItemsMap[orderId]) {
            try {
                setItemsLoadingMap((prev) => ({ ...prev, [orderId]: true }));

                const token = localStorage.getItem("nexmart-token");
                const response = await getBackendOrderItems(orderId, token);
                
                setOrderItemsMap((prev) => ({
                    ...prev,
                    [orderId]: response.items || [],
                }));
            } catch (error) {
                console.error("Failed to fetch order items:", error);
            } finally {
                setItemsLoadingMap((prev) => ({ ...prev, [orderId]: false }));
            }
        }
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
        if (activeTab === "processing") return order.paymentStatus === "pending";
        if (activeTab === "delivered") return order.paymentStatus === "paid";
        if (activeTab === "returned") return order.paymentStatus === "failed";
        return true;
    });

    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);

    const paginatedOrders = filteredOrders.slice(
        (safePage - 1) * ORDERS_PER_PAGE,
        safePage * ORDERS_PER_PAGE
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
        <section className="grid w-full grid-cols-[minmax(0,1fr)] overflow-hidden rounded-2xl border border-[var(--color-border)] dark:border-[#22332e] bg-white dark:bg-[#18221f]">
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

            <div className="min-w-0 overflow-x-auto scrollbar-thin">
                <div className={`${orderTableMinWidth} w-full`}>                    
                    <div className={`grid ${orderGridCols} px-6 py-[13px] bg-[#FAF9F4] dark:bg-[#121a17] text-[12.5px] font-bold uppercase tracking-[0.08em] text-[var(--color-muted)] dark:text-gray-400 border-b border-[var(--color-divider)] dark:border-[#22332e]`}>
                        <div>{t("table.orderNumber")}</div>
                        <div>{t("table.date")}</div>
                        <div>{t("table.status")}</div>
                        <div>{t("table.total")}</div>
                        <div className="text-start md:text-end">{t("details") || "Action"}</div>
                    </div>

                    <div className="px-5">
                        <div className="py-5 flex flex-col gap-3">
                            {paginatedOrders.map((order) => {
                                const isPending = order.paymentStatus === "pending";
                                const isFailed = order.paymentStatus === "failed";
                                const isPaid = order.paymentStatus === "paid";
                                const isExpanded = expandedOrders[order._id];
                                const items = orderItemsMap[order._id] || [];
                                const isLoadingItems = itemsLoadingMap[order._id];

                                return (
                                    <div key={order._id} className="border-b border-[var(--color-divider)] dark:border-[#22332e] pb-3">
                                        <div className={`grid ${orderGridCols} items-center py-4`}>
                                            <p className="font-semibold text-[#5B3A21] dark:text-[#F5EBE6]">
                                                NX-{order._id.slice(0, 8)}
                                            </p>
                                            
                                            <OrderSummaryRow goToPayment={goToPayment} isPaid={isPaid} isFailed={isFailed} isPending={isPending} order={order} />
                                            
                                            <div className="text-start md:text-end">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleOrder(order._id)}
                                                    className="text-[13.5px] text-[var(--color-green-dark)] dark:text-[var(--color-gold)] font-semibold cursor-pointer hover:opacity-70 transition"
                                                >
                                                    {t("details")}
                                                    <span className={locale === "ar" ? "mr-1 inline-block" : "ml-1 inline-block rotate-180"}>
                                                        ←
                                                    </span>
                                                </button>
                                                {/* {isPaid ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleOrder(order._id)}
                                                        className="text-[13.5px] text-[var(--color-green-dark)] dark:text-[var(--color-gold)] font-semibold cursor-pointer hover:opacity-70 transition"
                                                    >
                                                        {t("details")}
                                                        <span className={locale === "ar" ? "mr-1 inline-block" : "ml-1 inline-block rotate-180"}>
                                                            ←
                                                        </span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => goToPayment(order._id)}
                                                        className="text-[13.5px] text-[var(--color-green-dark)] dark:text-[var(--color-gold)] font-semibold cursor-pointer hover:opacity-70 transition"
                                                    >
                                                        {t("completePayment")}
                                                        <span className={locale === "ar" ? "mr-1 inline-block" : "ml-1 inline-block rotate-180"}>
                                                            ←
                                                        </span>
                                                    </button>
                                                )} */}
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="bg-[#FAF9F4] dark:bg-[#121a17] rounded-2xl mt-2 border-b border-[var(--color-divider)] dark:border-[#22332e] px-4 py-5">
                                                {isLoadingItems ? (
                                                    <div className="flex items-center justify-center py-4">
                                                        <Loader2 className="animate-spin text-[var(--color-green-dark)] dark:text-[var(--color-gold)]" size={20} />
                                                    </div>
                                                ) : items.length === 0 ? (
                                                    <p className="text-sm text-center text-gray-500">لا توجد منتجات في هذا الطلب.</p>
                                                ) : (
                                                    <div className="flex flex-col gap-3">
                                                        {items.map((item) => (
                                                            <div key={item._id} className="flex max-[480px]:flex-col min-[480px]:items-center justify-between gap-2 text-sm">
                                                                <span className="text-[var(--color-muted)] dark:text-gray-300">
                                                                    {item.productTitle?.[locale]} × {item.quantity}
                                                                </span>
                                                                <span className={`font-semibold text-[var(--color-green-dark)] dark:text-[var(--color-gold)] ${locale === "ar" ? "mr-2" : "ml-2"}`}>
                                                                    {item.subtotal.toFixed(2)} {t("currency") || "ر.س"}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 py-4 border-t border-[var(--color-divider)] dark:border-[#22332e]">
                    <OrderDashboardButton 
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={safePage === 1}
                        label={t("previousPage")}
                        icon={locale === "ar" ? <ChevronRight /> : <ChevronLeft />} 
                    />
                    <span className="text-sm text-gray-500 dark:text-zinc-400">
                        {safePage} / {totalPages}
                    </span>
                    <OrderDashboardButton 
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={safePage === totalPages}
                        label={t("nextPage")}
                        icon={locale === "ar" ? <ChevronLeft /> : <ChevronRight />} 
                    />
                </div>
            )}
        </section>
    );
}