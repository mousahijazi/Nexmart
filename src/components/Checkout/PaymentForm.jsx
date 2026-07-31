"use client"
import { useCheckoutContext } from "@/Context/CheckoutProvider";
import { useState, useEffect } from "react";
import { Lock } from "lucide-react";

export default function PaymentForm() {
    const { currentOrderId } = useCheckoutContext();
    const [orderTotal, setOrderTotal] = useState(0);

    useEffect(() => {
        if (!currentOrderId) return;
    }, [currentOrderId]);
    
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const fields = [
        { 
          label: "Cardholder Name",
          name: "name", 
          type: "text", 
          placeholder: "MOUSA HIJAZI", 
          maxLength: 26,
        },
        {
            label: "Card Number",
            name: "number", 
            type: "text", 
            placeholder: "0000 0000 0000 0000", 
            maxLength: 19, 
        },
    ];

    const Data = [
        {
            label: "Month",
            name: "month", 
            type: "text", 
            placeholder: "MM", 
            maxLength: 2, 
        },
        {
            label: "Year",
            name: "year", 
            type: "text", 
            placeholder: "YY", 
            maxLength: 2, 
        },
        {
            label: "CVC",
            name: "cvc", 
            type: "text", 
            placeholder: "123", 
            maxLength: 3, 
        },
    ]

    return (
        <div className="px-3 min-[480px]:px-6 py-8">
            <span className="text-xs font-bold tracking-widest uppercase text-[#5B3A21]/80 dark:text-[#A68A64]/70">
                Final Step
            </span>
            <h1 className="mt-3 max-[360px]:text-[21px] text-2xl sm:text-3xl font-extrabold text-[#5B3A21] dark:text-[#A68A64]">
                Payment Details
            </h1>
            <p className="mt-3 text-gray-500 dark:text-[#e5ded8]">
                Enter your card information to complete the purchase.
            </p>

            <form className="mt-8 flex flex-col gap-4">
                {fields.map((ele) => (
                    <div key={ele.name}>
                        <label className="block mb-2 text-sm font-semibold text-[#5B3A21] dark:text-[#A68A64]">
                            {ele.label}
                        </label>
                        <input
                            type={ele.type}
                            name={ele.name}
                            required
                            maxLength={ele.maxLength}
                            placeholder={ele.placeholder}
                            className="
                                w-full
                                text-[#5B3A21] dark:text-zinc-700
                                dark:bg-[#f2f2f2]
                                font-semibold
                                px-4 py-3
                                rounded-xl
                                border-2 border-gray-200
                                outline-none
                                focus:border-[#5B3A21] dark:focus:border-zinc-700
                                transition
                            "
                        />
                    </div>
                ))}

                <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-3">
                    {Data.map((ele, index) => (
                        <div key={index}>
                            <label className="block mb-2 text-sm font-semibold text-[#5B3A21] dark:text-[#A68A64]">
                                {ele.label}
                            </label>
                            <input
                                type={ele.type} name={ele.name} required maxLength={ele.maxLength} placeholder={ele.placeholder}
                                className="w-full text-[#5B3A21] dark:text-zinc-700 dark:bg-[#f2f2f2] font-semibold px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-[#5B3A21] dark:focus:border-zinc-700 transition"
                            />
                        </div>
                    ))}
                </div>

                {errorMessage && (
                    <p className="text-red-600 text-sm font-semibold">{errorMessage}</p>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 cursor-pointer px-7 py-3.5 text-center bg-[#5B3A21] text-white rounded-full font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    <Lock size={16} />
                    {submitting ? "Processing..." : `Pay $${orderTotal.toFixed(2)}`}
                </button>
            </form>
        </div>
    );
}