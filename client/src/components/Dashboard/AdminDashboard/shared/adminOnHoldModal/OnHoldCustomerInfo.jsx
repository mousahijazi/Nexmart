import { MapPin, Phone, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";

function Detail({ icon: Icon, label, value }) {
    return (
        <div className="flex min-w-0 items-start gap-2">
            <Icon size={15} className="mt-0.5 shrink-0 text-[var(--color-muted)]" />

            <div className="min-w-0">
                <p className="text-[10px] text-[var(--color-muted)]">{label}</p>
                <p className="mt-1 break-words text-xs font-semibold text-[var(--color-ink)]">
                    {value || "—"}
                </p>
            </div>
        </div>
    );
}

export default function OnHoldCustomerInfo({ shippingInfo = {} }) {
    const t = useTranslations("Admin.orders");

    const customerName = [
        shippingInfo.firstName,
        shippingInfo.lastName,
    ].filter(Boolean).join(" ") || "—";

    const address = [
        shippingInfo.address,
        shippingInfo.city,
        shippingInfo.state,
        shippingInfo.postalCode,
        shippingInfo.country,
    ].filter(Boolean).join(", ");

    return (
        <section className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <h3 className="mb-4 text-sm font-bold text-[var(--color-ink)]">
                {t("onHold.customerInformation")}
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Detail icon={UserRound} label={t("onHold.customerName")} value={customerName} />
                <Detail icon={Phone} label={t("onHold.phone")} value={shippingInfo.phone} />
                <div className="sm:col-span-2">
                    <Detail icon={MapPin} label={t("onHold.shippingAddress")} value={address} />
                </div>
            </div>
        </section>
    );
}