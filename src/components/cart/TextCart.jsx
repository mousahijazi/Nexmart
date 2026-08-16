"use client"
import { CartProducts } from "@/index";
import { useProductContext } from "@/Context/CartProvider";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

export default function TextCart() {
    const t = useTranslations("cart");
    const locale = useLocale();
    const {cart} = useProductContext();

  return (
    <>
        <div className="text-[13px] text-[var(--color-muted)] mb-[18px]">{t("title")}</div>
        <h1 className="font-bold text-[30px] mb-6 text-[var(--color-green-dark)] dark:text-[var(--color-gold)]">{t("secondTitle")}<small className={`text-base text-[var(--color-muted)] font-normal ${locale === "ar" ? "mr-2" : "ml-2"}`}>{t("itemsCount", {count: cart.length})}</small></h1>
        <div dir="ltr">
            <CartProducts />
        </div>
        <div className="px-5 pt-12 flex justify-between items-center flex-wrap gap-2">
            <Link href="/products#products" className="text-sm text-[var(--color-green)] font-semibold cursor-pointer">{t("button")}</Link>
            <div className="text-[13px] text-[var(--color-muted)]">{t("Desc")}</div>
        </div>
    </>
  )
}