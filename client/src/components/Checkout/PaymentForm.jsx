"use client"
import { useState } from "react";
import { useRouter } from "../../lib/i18n/routing";
import { useAlertContext } from "../../Context/AlertProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema } from "../../lib/schemas/paymentSchema";
import { useLocale, useTranslations } from "next-intl";
import { RHFerrors } from "../../index";
import { Lock } from "lucide-react";
import { createMoyasarPayment, verifyBackendPayment } from "../../helper/fetchApi";

export default function PaymentForm({ order, loading }) {
    const locale = useLocale();
    const t = useTranslations();
    const {register, handleSubmit, formState: { errors, isSubmitting }} = useForm({resolver: zodResolver(paymentSchema),});
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
            if (!order?._id) {
                throw new Error("Order not found.");
            }

            const token = localStorage.getItem("nexmart-token");

            if (!token) {
                throw new Error("Authentication token not found.");
            }

            // const intent = await createBackendPaymentIntent(order._id, token, locale);
            // const payment = await fulfillMoyasarPayment(intent, data);
            const payment = await createMoyasarPayment(order, data);

            if (payment.status === "initiated" && payment.source?.transaction_url) {
                window.location.assign(payment.source.transaction_url);
                return;
            }

            if (payment.id) {
                const verification = await verifyBackendPayment(payment.id, order._id, token);

                if (verification.verified === true) {
                    showAlert("Payment successful! Your order is confirmed.", "success");

                    router.push("/user");
                    return;
                }

                if (verification.paymentStatus === "failed") {
                    setErrorMessage("The card was declined. You can try another card.");

                    showAlert("Payment failed. You can try again.", "danger");
                    return;
                }

                setErrorMessage("Payment has not been confirmed yet. Please check again.");

                showAlert("Payment is not confirmed yet.", "danger");
                return;
            }

            setErrorMessage(payment.message || payment.source?.message ||"Moyasar could not complete the payment. Please try again.");
            showAlert("Payment was not completed. Please try again.", "danger");
        } catch (error) {
            console.error("Payment Process Error:", error);

            setErrorMessage(error.message || "An unexpected error occurred during processing.");
            showAlert("The payment could not be completed. Please try again.", "danger");
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
            <span className="text-xs font-bold tracking-widest uppercase text-[var(--color-green)]/80 dark:text-[var(--color-gold-light)]/70">
                {t("checkout.payPage.form.title")}
            </span>
            <h1 className="mt-3 max-[360px]:text-[21px] text-2xl sm:text-3xl font-extrabold text-[var(--color-green)] dark:text-[var(--color-gold-light)]">
                {t("checkout.payPage.form.secondTitle")}
            </h1>
            <p className="mt-3 text-[var(--color-muted)] dark:text-[var(--color-soft)]">
                {t("checkout.payPage.form.Desc")}
            </p>

            <form onSubmit={handleSubmit(handlePayment)} className="mt-8 flex flex-col gap-4">
                {fields.map((ele) => (
                    <div key={ele.apiKey}>
                        <label className="block mb-2 text-sm font-semibold text-[var(--color-green)] dark:text-[var(--color-gold-light)]">
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
                                text-[var(--color-ink)] dark:text-[var(--color-ink)]
                                bg-[var(--color-cream)] dark:bg-[var(--color-field)]
                                font-semibold
                                px-4 py-3
                                rounded-xl
                                border-2 border-[var(--color-border)]
                                outline-none
                                focus:border-[var(--color-green)] dark:focus:border-[var(--color-gold)]
                                transition
                            "
                        />
                        <RHFerrors errors={ele.error}/>
                    </div>
                ))}

                <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-3">
                    {Data.map((ele) => (
                        <div key={ele.apiKey}>
                            <label className="block mb-2 text-sm font-semibold text-[var(--color-green)] dark:text-[var(--color-gold-light)]">
                                {ele.label}
                            </label>
                            <input
                                type={ele.type} 
                                dir="ltr"
                                {...register(ele.apiKey)}
                                placeholder={ele.placeholder}
                                className="w-full text-[var(--color-ink)] dark:text-[var(--color-ink)] bg-[var(--color-cream)] dark:bg-[var(--color-field)] font-semibold px-4 py-3 rounded-xl border-2 border-[var(--color-border)] outline-none focus:border-[var(--color-green)] dark:focus:border-[var(--color-gold)] transition"
                            />
                            <RHFerrors errors={ele.error}/>
                        </div>
                    ))}
                </div>

                {errorMessage && (
                    <div className="flex flex-col gap-3">
                        <p className="text-[var(--color-red)] text-sm font-semibold">{errorMessage}</p>
                        <button
                            type="button"
                            onClick={() => router.push("/user")}
                            className="text-sm font-semibold text-[var(--color-green)] dark:text-[var(--color-gold-light)] underline cursor-pointer w-fit"
                        >
                            {t("checkout.payPage.form.card.return")}
                        </button>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 cursor-pointer px-7 py-3.5 text-center bg-[var(--color-green)] dark:bg-[var(--color-green)] text-white rounded-full font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    <Lock size={16} />
                    {submitting ? t("checkout.payPage.form.payingButton") : loading ? t("element.loadingButton") : order ? t("checkout.payPage.form.payButton", {total: order.totalPrice.toFixed(2)}) : 0}
                </button>
            </form>
        </div>
    );
}