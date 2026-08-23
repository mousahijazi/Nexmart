"use client"
import { useProductContext } from "@/Context/CartProvider"

export default function CartTotal() {
    const {totalPrice} = useProductContext();

  return (
    <div className="flex justify-between items-baseline pt-4 mt-[10px] border-t border-[var(--color-divider)]">
        <span className="text-[15px] font-semibold">الإجمالي</span>
        <span className="text-2xl font-bold text-[var(--color-green-dark)]">{totalPrice.toFixed(2)} <small className="text-[13px]">ر.س</small></span>
    </div>
  )
}
