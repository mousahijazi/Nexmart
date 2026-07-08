"use client"
import { useProductContext } from "@/Context/CartProvider";
import { useState } from "react";

export default function DashboardData() {
    const {cart} = useProductContext();
    const [coupon, setCoupon] = useState("");
    const [discount, setDiscount] = useState(0);
    const handleCouponChange = (e) => {
        const val = e.target.value;
        setCoupon(val);
        if(val.toLowerCase().trim() === "mousa") {
            setDiscount(0.5); 
        } else {
            setDiscount(0); 
        }
    }

    // todo Filter categories and show their total number
    const categoriesCount = new Set(
        cart.map(product => product.category)
    ).size;

    // Discounts, taxes, and final total
    let totalPrice = cart.reduce((total, product) => total + product.price, 0);
    let taxes = totalPrice * 0.10;

    let discountAmount = (totalPrice + taxes) * discount;
    let total = (totalPrice + taxes) - discountAmount;

    const data = [
        {
            title: "products",
            value: cart.length,
        },
        {
            title: "price",
            value: `${totalPrice.toFixed(2)}$`,
        },
        {
            title: "taxes",
            value: `${taxes.toFixed(2)}$`,
        },
        {
            title: "categories",
            value: categoriesCount,
        },
        {
            title: "total",
            value: `${total.toFixed(2)}$`,
        },
    ];
    
  return (
    <div className="grid gap-7 grid-cols-1 sm:grid-cols-2 w-full">
        <div className="flex flex-col justify-center gap-6">
            {data.map((ele, index) => (
                <p key={index} className="text-gray-600 tracking-wider ">{ele.title}: <span className="text-[#5B3A21] font-semibold text-sm">{ele.value}</span></p>
            ))}
        </div>
        {cart.length > 0 && (
            <div className="flex flex-col gap-3">
                <label className="text-sm font-bold tracking-widest text-[#5B3A21]/90 uppercase">Coubon</label>
                <input 
                    type="text" 
                    placeholder="COUBON"
                    value={coupon}
                    onChange={handleCouponChange}
                    className="border-2 border-gray-[#5B3A21] rounded-lg px-3 py-2 text-[18px] text-gray-700 font-semibold shadow-lg" 
                />
                {discount > 0 && (
                    <p className="text-green-600 tracking-wider sm:text-[17px]">Discount ({(discount * 100)}%): <span className="font-semibold text-sm">-{discountAmount.toFixed(2)}$</span></p>
                )}
            </div>
        )}
    </div>
  )
}
