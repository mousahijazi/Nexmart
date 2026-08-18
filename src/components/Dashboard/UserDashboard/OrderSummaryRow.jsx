import { useLocale, useTranslations } from "next-intl";

export default function OrderSummaryRow({isPaid, isPending, isFailed, order}) {
    const t = useTranslations("profile.orders");
    const locale = useLocale();

  return (
    <>
        <div className="text-[var(--color-muted)] dark:text-gray-400">
            {new Date(order.created_at).toLocaleDateString(
                locale === "ar" ? "ar" : "en-US"
            )}
        </div>
        <div>
            {isPaid && (
                <span className="inline-block text-[12.5px] rounded-lg px-[11px] py-[5px] bg-[#E7F0EC] text-[var(--color-green-dark)] dark:bg-[#16382e] dark:text-[#A7D0BF]">
                    {t("tabs.delivered")}
                </span>
            )}

            {isPending && (
                <button
                    type="button"
                    onClick={() => goToPayment(order.id)}
                    className="
                        inline-block
                        text-[12.5px]
                        rounded-lg
                        px-[11px]
                        py-[5px]
                        bg-[#EEF2FA]
                        text-[#4B638F]
                        dark:bg-[#1D293D]
                        dark:text-[#AFC4E8]
                        cursor-pointer
                        hover:opacity-80
                        transition
                    "
                >
                    {t("tabs.processing")}
                </button>
            )}

            {isFailed && (
                <button
                    type="button"
                    onClick={() => goToPayment(order.id)}
                    className="
                        inline-block
                        text-[12.5px]
                        rounded-lg
                        px-[11px]
                        py-[5px]
                        bg-[#FDECEA]
                        text-[#C85C4C]
                        dark:bg-[#3A211E]
                        dark:text-[#F09A8C]
                        cursor-pointer
                        hover:opacity-80
                        transition
                    "
                >
                    {t("tabs.returned")}
                </button>
            )}
        </div>
        <div className="font-bold text-[var(--color-green-dark)] dark:text-[var(--color-gold)]">
            {order.total_price.toFixed(2)} 
            <span className={`text-xs ${locale === "ar" ? "mr-2" : "ml-2"}`}>ر.س</span>
        </div>
    </>
  )
}
