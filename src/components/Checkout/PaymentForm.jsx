"use client"
import { useState } from "react";
import { useRouter } from "@/lib/i18n/routing";
import { useUserContext } from "@/Context/UserProvider";
import { useAlertContext } from "@/Context/AlertProvider";
import { updateOrderPaymentStatus, createMoyasarPayment } from "@/helper/fetchApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema } from "@/lib/schemas/paymentSchema";
import { useLocale, useTranslations } from "next-intl";
import { RHFerrors } from "@/index";
import { Lock } from "lucide-react";

export default function PaymentForm({ order, loading }) {
    const locale = useLocale();
    const t = useTranslations();
    const {register, handleSubmit, formState: { errors, isSubmitting }} = useForm({resolver: zodResolver(paymentSchema),});
    const { user } = useUserContext();
    const { showAlert } = useAlertContext();
    const router = useRouter();
    const submitting = isSubmitting;
    const [errorMessage, setErrorMessage] = useState("");

    const formatCardNumber = (value) => {
        return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    };

    const handleCardNumberInput = (e) => {
        e.target.value = formatCardNumber(e.target.value);
    };

    const handlePayment = async (data) => {
        setErrorMessage("");

        try {
            const paymentResult = await createMoyasarPayment({
                amount: Math.round(order.total_price * 100),
                currency: "USD",
                description: `Nexmart Order #${order.id.slice(0, 8)}`,
                callback_url: `${window.location.origin}/${locale}/checkout?mode=pay&order_id=${order.id}`,
                "source[type]": "creditcard",
                "source[name]": data.name,
                "source[number]": data.number.replace(/\s/g, ""),
                "source[month]": data.month,
                "source[year]": data.year,
                "source[cvc]": data.cvc,
            });

            if (!paymentResult.success) {
                setErrorMessage(paymentResult.message || "Payment could not be started.");
                showAlert("Payment failed. Please review the details below.", "danger");
                await updateOrderPaymentStatus(order.id, user.id, "failed", null);
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
        }
    };

    const fields = [
        { 
          label: t("checkout.payPage.form.card.nameLabel"),
          type: "text", 
          placeholder: "MOUSA HIJAZI", 
          apiKey: "name",
          error: errors.name,
        },
        {
            label: t("checkout.payPage.form.card.numberLabel"), 
            type: "text", 
            placeholder: "0000 0000 0000 0000", 
            action: handleCardNumberInput,
            apiKey: "number",
            error: errors.number,
        },
    ];

    const Data = [
        {
            label: t("checkout.payPage.form.card.monthLabel"),
            type: "text", 
            placeholder: "MM", 
            apiKey: "month",
            error: errors.month,
        },
        {
            label: t("checkout.payPage.form.card.yearLabel"),
            type: "text", 
            placeholder: "YY", 
            apiKey: "year",
            error: errors.year,
        },
        {
            label: "CVC",
            type: "text", 
            placeholder: "123", 
            apiKey: "cvc",
            error: errors.cvc,
        },
    ];

    return (
        <div dir={locale === "ar" ? "rtl" : "ltr"} className="px-3 min-[480px]:px-6 py-8">
            <span className="text-xs font-bold tracking-widest uppercase text-[#5B3A21]/80 dark:text-[#A68A64]/70">
                {t("checkout.payPage.form.title")}
            </span>
            <h1 className="mt-3 max-[360px]:text-[21px] text-2xl sm:text-3xl font-extrabold text-[#5B3A21] dark:text-[#A68A64]">
                {t("checkout.payPage.form.secondTitle")}
            </h1>
            <p className="mt-3 text-gray-500 dark:text-[#e5ded8]">
                {t("checkout.payPage.form.Desc")}
            </p>

            <form onSubmit={handleSubmit(handlePayment)} className="mt-8 flex flex-col gap-4">
                {fields.map((ele) => (
                    <div key={ele.apiKey}>
                        <label className="block mb-2 text-sm font-semibold text-[#5B3A21] dark:text-[#A68A64]">
                            {ele.label}
                        </label>
                        <input
                            {...register(ele.apiKey)}
                            dir="ltr"
                            type={ele.type}
                            onInput={ele.action}
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
                        <RHFerrors errors={ele.error}/>
                    </div>
                ))}

                <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-3">
                    {Data.map((ele) => (
                        <div key={ele.apiKey}>
                            <label className="block mb-2 text-sm font-semibold text-[#5B3A21] dark:text-[#A68A64]">
                                {ele.label}
                            </label>
                            <input
                                type={ele.type} 
                                dir="ltr"
                                {...register(ele.apiKey)}
                                placeholder={ele.placeholder}
                                className="w-full text-[#5B3A21] dark:text-zinc-700 dark:bg-[#f2f2f2] font-semibold px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-[#5B3A21] dark:focus:border-zinc-700 transition"
                            />
                            <RHFerrors errors={ele.error}/>
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
                            {t("checkout.payPage.form.card.return")}
                        </button>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 cursor-pointer px-7 py-3.5 text-center bg-[#5B3A21] text-white rounded-full font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    <Lock size={16} />
                    {submitting ? t("checkout.payPage.form.payingButton") : loading ? t("element.loadingButton") : order ? t("checkout.payPage.form.payButton", {total: order.total_price.toFixed(2)}) : 0}
                </button>
            </form>
        </div>
    );
}