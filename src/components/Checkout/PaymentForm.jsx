"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/Context/UserProvider";
import { useAlertContext } from "@/Context/AlertProvider";
import { useCheckoutContext } from "@/Context/CheckoutProvider";
import { updateOrderPaymentStatus, createMoyasarPayment } from "@/helper/fetchApi";
import { Lock } from "lucide-react";

export default function PaymentForm({ order, loading }) {
    const { user } = useUserContext();
    const {clearCheckout} = useCheckoutContext();
    const { showAlert } = useAlertContext();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const formatCardNumber = (value) => {
        return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    };

    const handleCardNumberInput = (e) => {
        e.target.value = formatCardNumber(e.target.value);
    };

    const validateCardFields = (data) => {
        const cardNumber = data.number.replace(/\s/g, "");
        const month = data.month;
        const year = data.year;
        const cvc = data.cvc;
        
        if (cardNumber.length < 15 || cardNumber.length > 16) {
            return "Card number must be 15-16 digits";
        }
        if (!month || month.length !== 2 || Number(month) < 1 || Number(month) > 12) {
            return "Please enter a valid month (01-12)";
        }
        if (!year || year.length !== 2) {
            return "Please enter a valid year";
        }
        if (!cvc || cvc.length < 3 || cvc.length > 4) {
            return "CVC must be 3 or 4 digits";
        }
        return null;
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMessage("");

        try {
            const form = e.target;
            const rawData = Object.fromEntries(new FormData(form));

            const validationError = validateCardFields(rawData);
            if (validationError) {
                setSubmitting(false);
                setErrorMessage(validationError);
                return;
            }

            const paymentResult = await createMoyasarPayment({
                amount: Math.round(order.total_price * 100),
                currency: "USD",
                description: `Nexmart Order #${order.id.slice(0, 8)}`,
                callback_url: `${window.location.origin}/checkout?mode=pay&order_id=${order.id}`,
                "source[type]": "creditcard",
                "source[name]": rawData.name,
                "source[number]": rawData.number.replace(/\s/g, ""),
                "source[month]": rawData.month,
                "source[year]": rawData.year,
                "source[cvc]": rawData.cvc,
            });

            if (!paymentResult.success) {
                setErrorMessage(paymentResult.message || "Payment could not be started.");
                showAlert("Payment failed. Please review the details below.", "danger");
                await updateOrderPaymentStatus(order.id, user.id, "failed", null);
                setSubmitting(false);
                return;
            }

            const paymentData = paymentResult.payment;

            if (paymentData.status === "initiated" && paymentData.source?.transaction_url) {
                window.location.href = paymentData.source.transaction_url;
                return; 
            }

            if (paymentData.status === "paid") {
                await updateOrderPaymentStatus(order.id, user.id, "paid", paymentData.id);
                showAlert("Payment successful! Your order is confirmed.", "success");
                router.push("/user");
            } else {
                await updateOrderPaymentStatus(order.id, user.id, "failed", paymentData.id);
                setErrorMessage(paymentData.source?.message || "Payment was declined.");
                showAlert("Payment failed. Please try another card.", "danger");
            }
        } catch (error) {
            console.error("Payment Process Error:", error);
            setErrorMessage("An unexpected error occurred during processing. Please try again.");
            showAlert("An unexpected error occurred. Please try again.", "danger");
        } finally {
            setSubmitting(false);
        }
    };

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
            action: handleCardNumberInput,
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

            <form onSubmit={handlePayment} className="mt-8 flex flex-col gap-4">
                {fields.map((ele) => (
                    <div key={ele.name}>
                        <label className="block mb-2 text-sm font-semibold text-[#5B3A21] dark:text-[#A68A64]">
                            {ele.label}
                        </label>
                        <input
                            type={ele.type}
                            name={ele.name}
                            required
                            onInput={ele.action}
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
                    <div className="flex flex-col gap-3">
                        <p className="text-red-600 text-sm font-semibold">{errorMessage}</p>
                        <button
                            type="button"
                            onClick={() => router.push("/user")}
                            className="text-sm font-semibold text-[#5B3A21] dark:text-[#A68A64] underline cursor-pointer w-fit"
                        >
                            Return to my account
                        </button>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 cursor-pointer px-7 py-3.5 text-center bg-[#5B3A21] text-white rounded-full font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    <Lock size={16} />
                    {submitting ? "Processing..." : loading ?  "Loading..." : order ? `Pay $${order.total_price.toFixed(2)}` : 0}
                </button>
            </form>
        </div>
    );
}