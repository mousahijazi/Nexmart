"use client"
import { useProductContext } from "../../Context/CartProvider"
import { useTranslations } from "next-intl";

export default function CartTotal() {
    const {totalPrice} = useProductContext();
    const t = useTranslations("checkout.addressPage.data.itemsData");

  return (
    <div className="flex justify-between items-baseline pt-4 mt-[10px] border-t border-[var(--color-divider)]">
        <span className="text-[15px] font-semibold">{t("total")}</span>
        <span className="text-2xl font-bold text-[var(--color-green-dark)]">{totalPrice.toFixed(2)} <small className="text-[13px]">ر.س</small></span>
    </div>
  )
}
