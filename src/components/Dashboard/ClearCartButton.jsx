"use client"
import { useProductContext } from "@/Context/CartProvider";

export default function ClearCartButton() {
    const {setCart} = useProductContext();

  return (
    <button className="w-full sm:w-1/2 bg-[#5B3A21] text-white px-6 py-3 rounded-2xl hover:opacity-90 transition duration-200 cursor-pointer" onClick={() => setCart([])}>Clear Cart</button>
  )
}
