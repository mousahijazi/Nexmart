"use client"
import { useProductContext } from "../../Context/CartProvider";
import { useTranslations } from "next-intl";

export default function CartAmount() {
    const t = useTranslations("cart");
    const {totalPrice} = useProductContext();

    const targetAmount = 300;
    const remainingAmount = targetAmount - totalPrice;

  return (
    <>
        {totalPrice < targetAmount && totalPrice > 0 && (
            <div className="bg-[var(--color-sand)] rounded-2xl px-5 py-[18px] text-[13.5px] text-[var(--color-soft-2)] leading-[1.8]">
                {t.rich("freeShippingNotice", {
                    amount: remainingAmount,
                    b: (chunks) => <b className="text-[var(--color-green-dark)]">{chunks}</b>
                })}
            </div>
        )}
    </>
  )
}
