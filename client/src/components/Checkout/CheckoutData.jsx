"use client"
import { useCheckoutContext } from "../../Context/CheckoutProvider";
import { Text, Coupon } from "../../index";
import { useLocale, useTranslations } from "next-intl";

export default function CheckoutData() {
  const {subtotal, shippingPrice, taxes, grandTotal, totalItems, needShipping, setNeedShipping} = useCheckoutContext();
  const locale = useLocale();
  const t = useTranslations();

  const ItemsData = [
    {
        type: "normal",
        text: t("checkout.addressPage.data.itemsData.items", {totalItems: totalItems}),
        value: subtotal.toFixed(2),
    },
    {
        type: "normal",
        text: t("checkout.addressPage.data.itemsData.taxes"),
        value: taxes.toFixed(2),
    },
    {
        type: "shipping",
        text: t("checkout.addressPage.data.itemsData.shipping.title"),
        value: shippingPrice.toFixed(2),
    },
    {
        type: "coupon",
        text: t("checkout.addressPage.data.itemsData.coupon.title"),
    },
  ];
    
  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="px-3 min-[480px]:px-6 py-8">
        <div className="py-5 text-[var(--color-soft-2)] dark:text-[var(--color-soft)]">
            <h1 className="text-xl font-bold text-[var(--color-green)] dark:text-[var(--color-gold)]">{t("checkout.addressPage.data.title")}</h1>
            <div className="mt-3 flex flex-col gap-3">
                {ItemsData.map((ele) => {
                    if (ele.type === "shipping") {
                        return (
                            <div key={ele.text} className="py-3 flex max-[480px]:flex-col min-[480px]:items-center justify-between gap-3">
                                <div>
                                    <p className="font-semibold">{t("checkout.addressPage.data.itemsData.shipping.title")}</p>
                                    {subtotal > 300 
                                        ? <p className="text-xs text-[var(--color-muted)]">{t("checkout.addressPage.data.itemsData.shipping.DescTwo")}</p>
                                        : <p className="text-xs text-[var(--color-muted)]">{t("checkout.addressPage.data.itemsData.shipping.Desc")}</p>
                                    }
                                </div>
                                <div className="flex items-center gap-4">
                                    <span>${ele.value}</span>
                                    <div className="flex items-center gap-3">
                                        <label htmlFor={ele.text} className="text-sm font-bold tracking-widest text-[var(--color-green)]/90 dark:text-[var(--color-gold)] uppercase">{t("checkout.addressPage.data.itemsData.shipping.label")}</label>
                                        <input
                                            id={ele.text}
                                            type="checkbox"
                                            disabled={subtotal > 300}
                                            checked={needShipping}
                                            className="w-5 h-5 rounded accent-[var(--color-green)] cursor-pointer"
                                            onChange={(e) => setNeedShipping(e.target.checked)}
                                        />
                                    </div>  
                                </div>
                            </div>
                        );
                    }

                    if (ele.type === "coupon") {
                        return (
                            <Coupon />
                        );
                    }

                    return (
                        <div key={ele.text} className="flex justify-between items-center">
                            <h2 className="font-semibold">{ele.text}</h2>
                            <p>${ele.value}</p>
                        </div>
                    );
                })}
            </div>
        </div>
        <div className="pt-5 border-t-2 border-t-[var(--color-muted-3)] flex items-center justify-between">
            <h1 className="text-xl font-bold text-[var(--color-green)] dark:text-[var(--color-gold)]">{t("checkout.addressPage.data.itemsData.total")}</h1>
            <p className="text-[var(--color-soft-2)] dark:text-[var(--color-soft)]">${grandTotal.toFixed(2)}</p>
        </div>
        <div className="hidden lg:block mt-12">
            <Text />
        </div>
    </div>
  )
}
