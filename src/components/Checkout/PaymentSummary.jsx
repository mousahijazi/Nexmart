import { ShieldCheck } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/i18n/routing";

export default function PaymentSummary({order, loading}) {
    const t = useTranslations();
    const locale = useLocale();

    if (loading) {
        return (
            <div dir={locale === "ar" ? "rtl" : "ltr"} className="flex flex-col justify-center items-center gap-8 min-[480px]:bg-[var(--color-cream)] min-[480px]:dark:bg-[var(--color-cream)] px-3 min-[480px]:px-6 py-12">
                <div className="w-full max-w-md h-[246px] bg-[var(--color-surface)] dark:bg-[var(--color-surface)] rounded-2xl shadow-md dark:shadow-black/60 p-6 flex flex-col gap-4">

                    <div className="h-7 w-40 rounded bg-[var(--color-border)] dark:bg-[var(--color-border)] animate-pulse mb-6" />

                    <div className="space-y-4">

                        <div className="flex justify-between items-center">
                            <div className="h-5 w-16 rounded bg-[var(--color-border)] dark:bg-[var(--color-border)] animate-pulse" />
                            <div className="h-5 w-28 rounded bg-[var(--color-border)] dark:bg-[var(--color-border)] animate-pulse" />
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="h-5 w-16 rounded bg-[var(--color-border)] dark:bg-[var(--color-border)] animate-pulse" />
                            <div className="h-5 w-10 rounded bg-[var(--color-border)] dark:bg-[var(--color-border)] animate-pulse" />
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="h-5 w-24 rounded bg-[var(--color-border)] dark:bg-[var(--color-border)] animate-pulse" />
                            <div className="h-5 w-20 rounded bg-[var(--color-border)] dark:bg-[var(--color-border)] animate-pulse" />
                        </div>

                    </div>

                    <div className="border-t-2 border-[var(--color-divider)] dark:border-[var(--color-divider)] pt-4 flex justify-between items-center">
                        <div className="h-5 w-16 rounded bg-[var(--color-border)] dark:bg-[var(--color-border)] animate-pulse" />
                        <div className="h-5 w-24 rounded bg-[var(--color-border)] dark:bg-[var(--color-border)] animate-pulse" />
                    </div>

                </div>

                <div className="text-xs h-4 w-72 rounded bg-[var(--color-border)] dark:bg-[var(--color-border)] animate-pulse" />

            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <p className="text-lg font-bold text-[var(--color-red)] dark:text-[var(--color-red)]">Order not found.</p>
                <p className="text-sm text-[var(--color-muted)] mt-1">Please make sure you have selected a valid order.</p>
            </div>
        );
    }
    
    const orderData = [
        {
            text: t("profile.orders.data.order"),
            value: `#${order.id.slice(0, 8)}`,
        },
        {
            text: t("checkout.payPage.data.itemsLabel"),
            value: order.order_items.length,
        },
        {
            text: t("checkout.payPage.data.shippingTo"),
            value: order.city,
        },
    ];

    return (
        <div dir={locale === "ar" ? "rtl" : "ltr"} className="flex flex-col justify-center items-center gap-8 min-[480px]:bg-[var(--color-cream)] min-[480px]:dark:bg-[var(--color-cream)] px-3 min-[480px]:px-6 py-12">
            <div className="w-full max-w-md bg-[var(--color-surface)] dark:bg-[var(--color-surface)] rounded-2xl shadow-md dark:shadow-black/60 p-6 flex flex-col gap-4">
                <h2 className="text-lg font-bold text-[var(--color-green)] dark:text-[var(--color-gold-light)]">
                    {t("checkout.addressPage.data.title")}
                </h2>
                {orderData.map((ele, index) => (
                    <div key={index} className="flex justify-between text-sm text-[var(--color-muted)] dark:text-[var(--color-soft-2)]">
                        <span>{ele.text}</span>
                        <span>{ele.value}</span>
                    </div>
                ))}
                <div className="pt-4 border-t-2 border-t-[var(--color-divider)] dark:border-t-[var(--color-divider)] flex justify-between items-center">
                    <span className="font-bold text-[var(--color-green)] dark:text-[var(--color-gold-light)]">{t("checkout.addressPage.data.itemsData.total")}</span>
                    <span className="text-xl font-extrabold text-[var(--color-green)] dark:text-[var(--color-gold-light)]">
                        ${order.total_price.toFixed(2)}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[var(--color-muted)] dark:text-[var(--color-soft-2)]">
                <ShieldCheck size={16} />
                <span>
                    {t.rich("checkout.payPage.data.securedBy", {
                        Moyasar: (chunks) => (
                        <Link
                            href="https://moyasar.com/en/"
                            className="font-bold text-[var(--color-green)] dark:text-[var(--color-gold-light)]"
                        >
                            {chunks}
                        </Link>
                        ),
                    })}
                </span>
            </div>
        </div>
    );
}