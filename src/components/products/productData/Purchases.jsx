"use client"
import { useState } from "react";
import { QuantityButton } from "@/index";

export default function Purchases({productPrice, stock, discount}) {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    if (quantity < stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const totalPrice = (productPrice * quantity).toFixed(2);
  const totalDiscount = (discount * quantity).toFixed(2);

  return (
    <div className="flex flex-col items-center max-[360px]:items-start gap-4">
        <div className="flex max-[400px]:flex-col max-[360px]:items-start items-center gap-4">
            <div className="flex items-center max-[300px]:flex-col max-[300px]:items-start gap-3">
                <QuantityButton Text="-" action={handleDecrement} />
                <p className="text-sm text-gray-500 dark:text-[#e5ded8]">
                    {quantity} of {stock} selected
                </p>
                <QuantityButton Text="+" action={handleIncrement} />
            </div>
            {quantity > 1 && (
                <button className="rounded-2xl p-2 cursor-pointer text-white bg-red-500" onClick={() => setQuantity(1)}>
                    Reset
                </button>
            )}
        </div>
        <div className="text-lg font-semibold tracking-wide flex max-[360px]:flex-col max-[360px]:items-start items-center gap-2">
            <span className="text-gray-600 dark:text-[#e5ded8]">Total: </span>
            <span className="text-[#5B3A21] dark:text-[#A68A64]">${totalPrice}</span>
            <span className="text-gray-800 dark:text-zinc-400 text-[17px] line-through">${totalDiscount}</span>
        </div>
    </div>
  )
}
