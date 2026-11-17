"use client";
import { ClipboardList } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function AdminOrderButton({ order, onOpen }) {
    const t = useTranslations("Admin.orders");
    const locale = useLocale();

    if (order?.orderStatus !== "onHold" || order?.paymentStatus !== "paid") {
        return null;
    }

    return (
        <button
            type="button"
            onClick={() => onOpen(order)}
            aria-label={t("onHold.openDetails")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-gold)]/40 bg-[var(--color-sand)] px-3 py-2 text-xs font-semibold text-[var(--color-green-dark)] transition-colors hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2"
            dir={locale === "ar" ? "rtl" : "ltr"}
        >
            <ClipboardList size={15} aria-hidden="true" />
            <span>{t("onHold.reviewOrder")}</span>
        </button>
    );
}