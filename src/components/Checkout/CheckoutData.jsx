"use client"
import { useCheckoutContext } from "@/Context/CheckoutProvider";
import { Text } from "@/index";
import { useLocale, useTranslations } from "next-intl";

export default function CheckoutData() {
  const {subtotal, shippingPrice, taxes, discountAmount, grandTotal, totalItems, coupon, setCoupon, needShipping, setNeedShipping} = useCheckoutContext();
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
        <div className="py-5 text-gray-600 dark:text-zinc-300">
            <h1 className="text-xl font-bold text-[#5B3A21] dark:text-[#A68A64]">{t("checkout.addressPage.data.title")}</h1>
            <div className="mt-3 flex flex-col gap-3">
                {ItemsData.map((ele) => {
                    if (ele.type === "shipping") {
                        return (
                            <div key={ele.text} className="py-3 flex max-[480px]:flex-col min-[480px]:items-center justify-between gap-3">
                                <div>
                                    <p className="font-semibold">{t("checkout.addressPage.data.itemsData.shipping.title")}</p>
                                    <p className="text-xs text-gray-500">{t("checkout.addressPage.data.itemsData.shipping.Desc")}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span>${ele.value}</span>
                                    <div className="flex items-center gap-3">
                                        <label htmlFor={ele.text} className="text-sm font-bold tracking-widest text-[#5B3A21]/90 dark:text-[#A68A64] uppercase">{t("checkout.addressPage.data.itemsData.shipping.label")}</label>
                                        <input
                                            id={ele.text}
                                            type="checkbox"
                                            checked={needShipping}
                                            className="w-5 h-5 rounded accent-[#5B3A21] cursor-pointer"
                                            onChange={(e) => setNeedShipping(e.target.checked)}
                                        />
                                    </div>  
                                </div>
                            </div>
                        );
                    }

                    if (ele.type === "coupon") {
                        return (
                            <div key={ele.text} className="min-[480px]:w-fit flex flex-col gap-3">
                                <label className="text-sm font-bold tracking-widest text-[#5B3A21]/90 dark:text-[#A68A64] uppercase">{t("checkout.addressPage.data.itemsData.coupon.title")}</label>
                                <input 
                                    type="text" 
                                    placeholder={t("checkout.addressPage.data.itemsData.coupon.title").toUpperCase()}
                                    value={coupon}
                                    onChange={(e) => setCoupon(e.target.value)}
                                    className="dark:bg-[#f3f3f3] border-2 border-[#5B3A21] dark:border-zinc-700 rounded-lg px-3 py-2 text-[18px] text-gray-700 dark:text-zinc-700 font-semibold outline shadow-lg" 
                                />
                                {discountAmount > 0 && (
                                    <p className="text-green-600 dark:text-[#A68A64] tracking-wider sm:text-[17px]">{t("checkout.addressPage.data.itemsData.coupon.taxesRemoved", {Removed: discountAmount.toFixed(2)})}</p>
                                )}
                            </div>
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
        <div className="pt-5 border-t-2 border-t-gray-400 flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#5B3A21] dark:text-[#A68A64]">{t("checkout.addressPage.data.itemsData.total")}</h1>
            <p className="text-gray-600 dark:text-zinc-300">${grandTotal.toFixed(2)}</p>
        </div>
        <div className="hidden lg:block mt-12">
            <Text />
        </div>
    </div>
  )
}
