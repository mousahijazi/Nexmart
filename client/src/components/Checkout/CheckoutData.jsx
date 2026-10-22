"use client"
import { useCheckoutContext } from "../../Context/CheckoutProvider";
import { Text, Coupon } from "../../index";
import { useLocale, useTranslations } from "next-intl";

export default function CheckoutData() {
  const { subtotal, shippingPrice, taxes, discountAmount, grandTotal, totalItems, checkoutPricingLoading, checkoutPricingError } = useCheckoutContext();
  const locale = useLocale();
  const t = useTranslations();

  const ItemsData = [
    {
        id: "subtotal-item",
        type: "normal",
        text: t("checkout.addressPage.data.itemsData.items", {totalItems: totalItems}),
        value: subtotal.toFixed(2),
    },
    {
        id: "taxes-item",
        type: "normal",
        text: t("checkout.addressPage.data.itemsData.taxes"),
        value: taxes.toFixed(2),
    },
    {
        id: "shipping-item",
        type: "shipping",
        text: t("checkout.addressPage.data.itemsData.shipping.title"),
        value: shippingPrice.toFixed(2),
    },
    {
        id: "coupon-item",
        type: "coupon",
        text: t("checkout.addressPage.data.itemsData.coupon.title"),
    },
    {
        id: "discount-item",
        type: "normal",
        text: "Discount amount",
        value: discountAmount.toFixed(2),
    },
  ];
    
  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="px-3 min-[480px]:px-6 py-8">
        <div className="py-5 text-[var(--color-soft-2)] dark:text-[var(--color-soft)]">
            <h1 className="text-xl font-bold text-[var(--color-green)] dark:text-[var(--color-gold)]">{t("checkout.addressPage.data.title")}</h1>
            
            {checkoutPricingError && (
                <p className="mt-2 text-xs text-red-500">{checkoutPricingError}</p>
            )}
            
            <div className="mt-3 flex flex-col gap-3">
                {ItemsData.map((ele) => {
                    if (ele.type === "shipping") {
                        return (
                            <div key={ele.id} className="py-3 flex max-[480px]:flex-col min-[480px]:items-center justify-between gap-3">
                                <div>
                                    <p className="font-semibold">{t("checkout.addressPage.data.itemsData.shipping.title")}</p>
                                    {subtotal > 200 
                                        ? <p className="text-xs text-[var(--color-muted)]">{t("checkout.addressPage.data.itemsData.shipping.DescTwo")}</p>
                                        : <p className="text-xs text-[var(--color-muted)]">{t("checkout.addressPage.data.itemsData.shipping.Desc")}</p>
                                    }
                                </div>
                                <div className="flex items-center gap-4">
                                    {checkoutPricingLoading ? (
                                        <div className="w-16 h-5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                                    ) : (
                                        <span>${ele.value}</span>
                                    )}
                                </div>
                            </div>
                        );
                    }

                    if (ele.type === "coupon") {
                        return (
                            <div key={ele.id}>
                                <Coupon />
                            </div>
                        );
                    }

                    return (
                        <div key={ele.id} className="flex justify-between items-center">
                            <h2 className="font-semibold">{ele.text}</h2>
                            {checkoutPricingLoading ? (
                                <div className="w-16 h-5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                            ) : (
                                <p>${ele.value}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
        <div className="pt-5 border-t-2 border-t-[var(--color-muted-3)] flex items-center justify-between">
            <h1 className="text-xl font-bold text-[var(--color-green)] dark:text-[var(--color-gold)]">{t("checkout.addressPage.data.itemsData.total")}</h1>
            {checkoutPricingLoading ? (
                <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            ) : (
                <p className="text-[var(--color-soft-2)] dark:text-[var(--color-soft)] font-bold">
                    {grandTotal.toFixed(2)} {" "} ر.س
                </p>
            )}
        </div>
        <div className="hidden lg:block mt-12">
            <Text />
        </div>
    </div>
  )
}