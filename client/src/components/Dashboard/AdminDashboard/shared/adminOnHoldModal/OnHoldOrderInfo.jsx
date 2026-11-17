import { CalendarDays, Hash, CreditCard } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

function formatDate(value, locale) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

export default function OnHoldOrderInfo({ order }) {
    const t = useTranslations("Admin.orders");
    const locale = useLocale();

    const details = [
        { icon: Hash, label: t("onHold.orderId"), value: order._id || "—" },
        { icon: CalendarDays, label: t("onHold.createdAt"), value: formatDate(order.createdAt, locale) },
        { icon: CreditCard, label: t("onHold.paymentId"), value: order.paymentId || "—" },
    ];

    return (
        <section className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <h3 className="mb-3 text-sm font-bold text-[var(--color-ink)]">
                {t("onHold.orderInformation")}
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {details.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="min-w-0">
                        <p className="flex items-center gap-2 text-[11px] text-[var(--color-muted)]">
                            <Icon size={14} />
                            {label}
                        </p>

                        <p className="mt-1 break-all text-xs font-semibold text-[var(--color-ink)]">
                            {value}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}