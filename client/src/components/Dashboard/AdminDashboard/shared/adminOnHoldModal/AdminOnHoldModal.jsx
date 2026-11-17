"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ClipboardList } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { OnHoldOrderInfo, OnHoldCustomerInfo, OnHoldProducts, OnHoldPriceSummary, OnHoldDecisionForm } from "@/index";

export default function AdminOnHoldModal({ order, items = [], pagination, loading = false, onLoadMore, onClose, onApprove, onReject, submitting = false }) {
    const t = useTranslations("Admin.orders");
    const locale = useLocale();

    useEffect(() => {
        if (!order) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape" && !submitting) onClose();
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [order, onClose, submitting]);

    if (!order || typeof document === "undefined") return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-3 backdrop-blur-sm sm:p-5"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !submitting) onClose();
            }}
            dir={locale === "ar" ? "rtl" : "ltr"}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="on-hold-modal-title"
                className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[22px] border border-[var(--color-border)] bg-[var(--color-cream)] shadow-2xl"
            >
                <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--color-divider)] bg-[var(--color-green-dark)] px-4 py-4 text-white sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[var(--color-gold-light)]">
                            <ClipboardList size={20} />
                        </span>

                        <div className="min-w-0">
                            <h2 id="on-hold-modal-title" className="truncate text-base font-bold sm:text-lg">
                                {t("onHold.title")}
                            </h2>

                            <p className="mt-1 text-xs text-white/65">
                                #{String(order._id || "").slice(-8)}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        aria-label={t("onHold.close")}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] disabled:opacity-50"
                    >
                        <X size={19} />
                    </button>
                </header>

                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
                    <OnHoldOrderInfo order={order} />

                    <OnHoldCustomerInfo shippingInfo={order.shippingInfo} />

                    <OnHoldProducts
                        items={items}
                        loading={loading}
                        pagination={pagination}
                        onLoadMore={onLoadMore}
                        totalItems={order.totalItems}
                    />

                    <OnHoldPriceSummary order={order} />

                    <OnHoldDecisionForm
                        submitting={submitting}
                        onApprove={onApprove}
                        onReject={onReject}
                    />
                </div>
            </section>
        </div>,
        document.body
    );
}