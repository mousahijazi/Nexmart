import { CreditCard } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function OnHoldPriceSummary({ order }) {
    const t = useTranslations("Admin.orders");
    const locale = useLocale();
    const currency = order.currency || "SAR";

    const money = (amount) => {
        try {
            return new Intl.NumberFormat(locale, {
                style: "currency",
                currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(Number(amount || 0));
        } catch {
            return `${currency} ${Number(amount || 0).toFixed(2)}`;
        }
    };

    const rows = [
        { label: t("row.subtotal"), value: order.subtotal },
        { label: t("row.tax"), value: order.tax },
        { label: t("row.shipping"), value: order.shipping },
        { label: t("row.discount"), value: order.discount },
    ];

    return (
        <section className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-[var(--color-ink)]">
                <CreditCard size={16} />
                {t("row.priceBreakdown")}
            </h3>

            <div className="space-y-3">
                {rows.map(({ label, value }) => (
                    <div key={label} className="flex justify-between gap-4 text-xs">
                        <span className="text-[var(--color-muted)]">{label}</span>
                        <span className="font-medium text-[var(--color-ink)]">{money(value)}</span>
                    </div>
                ))}

                <div className="flex justify-between gap-4 border-t border-[var(--color-divider)] pt-3 text-sm font-extrabold text-[var(--color-green-dark)]">
                    <span>{t("row.total")}</span>
                    <span>{money(order.totalPrice)}</span>
                </div>
            </div>
        </section>
    );
}