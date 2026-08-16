"use client" 
import { useProductContext } from "@/Context/CartProvider"; 
import { useTranslations } from "next-intl"; 
 
export default function ClearCartButton() { 
    const t = useTranslations(); 
    const {setCart} = useProductContext(); 
 
  return ( 
    <button className="w-full sm:w-1/2 bg-[var(--color-green-dark)] dark:bg-[#0f2e25] text-white px-6 py-3 rounded-2xl hover:opacity-90 transition duration-200 cursor-pointer border border-transparent dark:border-[#22332e]" aria-label="clear cart" onClick={() => setCart([])}>{t("cart.cartDashboard.clearButton")}</button> 
  ) 
}