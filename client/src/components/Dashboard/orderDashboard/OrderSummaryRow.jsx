"use client";
import { useLocale, useTranslations } from "next-intl";
import { OrderActionButtons } from "@/index";

const PAYMENT_PERIOD = 14 * 24 * 60 * 60 * 1000;

function getRemainingTime(createdAt, currentTime, t) {
    if (!createdAt || currentTime === null) {
        return null;
    }

    const createdTime = new Date(createdAt).getTime();

    if (Number.isNaN(createdTime)) {
        return null;
    }

    const expiresAt = createdTime + PAYMENT_PERIOD;
    const remaining = expiresAt - currentTime;

    if (remaining <= 0) {
        return {
            expired: true,
            label: t("countdown.expired"),
        };
    }

    const totalMinutes = Math.ceil(remaining / (60 * 1000));

    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    const parts = [];

    if (days > 0) {
        parts.push(`${days} ${t("countdown.days")}`);
    }

    if (hours > 0) {
        parts.push(`${hours} ${t("countdown.hours")}`);
    }

    if (minutes > 0 || parts.length === 0) {
        parts.push(`${minutes} ${t("countdown.minutes")}`);
    }

    return {
        expired: false,
        urgent: remaining <= 24 * 60 * 60 * 1000,
        label: parts.join(" "),
    };
}

export default function OrderSummaryRow({ isPaid, isPending, isFailed, order, goToPayment, currentTime }) {
    const t = useTranslations("profile.orders");
    const locale = useLocale();

    const orderStatus = order.orderStatus;

    let statusLabel = t("tabs.processing");

    if (orderStatus === "delivered") {
        statusLabel = t("tabs.delivered");
    } else if (order.paymentStatus === "failed") {
        statusLabel = t("tabs.returned");
    } else if (order.paymentStatus === "pending") {
        statusLabel = t("tabs.processing");
    }

    const shouldShowCountdown = (isPending || isFailed) && orderStatus !== "cancelled";
    const remainingTime = shouldShowCountdown ? getRemainingTime(order.createdAt, currentTime, t) : null;

    return (
        <>
            <div className="text-[var(--color-muted)] dark:text-gray-400">
                {new Date(order.createdAt).toLocaleDateString(
                    locale === "ar" ? "ar" : "en-US"
                )}
            </div>

            <div>
                {isPaid && (
                    <span
                        className={`inline-block text-[12.5px] rounded-lg px-[11px] py-[5px] ${
                            orderStatus === "delivered"
                                ? "bg-[#E7F0EC] text-[var(--color-green-dark)] dark:bg-[#16382e] dark:text-[#A7D0BF]"
                                : "bg-[#EEF2FA] text-[#4B638F] dark:bg-[#1D293D] dark:text-[#AFC4E8]"
                        }`}
                    >
                        {statusLabel}
                    </span>
                )}

                {isPending && (
                    <button
                        type="button"
                        onClick={() => goToPayment(order._id)}
                        className="inline-block text-[12.5px] rounded-lg px-[11px] py-[5px] bg-[#EEF2FA] text-[#4B638F] dark:bg-[#1D293D] dark:text-[#AFC4E8] cursor-pointer hover:opacity-80 transition"
                    >
                        {t("tabs.processing")}
                    </button>
                )}

                {isFailed && (
                    <button
                        type="button"
                        onClick={() => goToPayment(order._id)}
                        className="inline-block text-[12.5px] rounded-lg px-[11px] py-[5px] bg-[#FDECEA] text-[#C85C4C] dark:bg-[#3A211E] dark:text-[#F09A8C] cursor-pointer hover:opacity-80 transition"
                    >
                        {t("tabs.returned")}
                    </button>
                )}
            </div>

            <div className="min-w-0">
                {remainingTime ? (
                    <span
                        title={remainingTime.label}
                        className={`inline-flex whitespace-nowrap rounded-lg px-2 py-[5px] text-[11px] font-semibold ${
                            remainingTime.expired || remainingTime.urgent
                                ? "bg-[#FDECEA] text-[#C85C4C] dark:bg-[#3A211E] dark:text-[#F09A8C]"
                                : "bg-[#FFF5DF] text-[#946B22] dark:bg-[#352D1D] dark:text-[#E6C477]"
                        }`}
                    >
                        {remainingTime.label}
                    </span>
                ) : (
                    <span className="text-[var(--color-muted)] dark:text-gray-500">
                        —
                    </span>
                )}
            </div>

            <div className="font-bold text-[var(--color-green-dark)] dark:text-[var(--color-gold)]">
                {Number(order.totalPrice || 0).toFixed(2)}

                <span className={`text-xs ${locale === "ar" ? "mr-2" : "ml-2"}`}>
                    ر.س
                </span>
            </div>

            <div>
                {order.orderStatus === "pending" && order.paymentStatus === "pending" 
                    ? <OrderActionButtons order={order} />
                    : (
                        <span className="text-[var(--color-muted)] dark:text-gray-500">
                            —
                        </span>
                    )
                }
            </div>
        </>
    );
}