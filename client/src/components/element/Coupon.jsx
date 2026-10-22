"use client";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { couponSchema } from "../../lib/schemas/paymentSchema";
import { useCheckoutContext } from "../../Context/CheckoutProvider";

export default function Coupon() {
    const t = useTranslations();
    const { discountAmount, coupon, setCoupon, checkoutPricingLoading, checkoutPricingError, serverPricing } = useCheckoutContext();
    
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(couponSchema),
        defaultValues: { coupon: coupon || "" }
    });

    const handleApplyCoupon = (data) => {
        const trimmedCoupon = data.coupon ? data.coupon.trim().toLowerCase() : "";
        setCoupon(trimmedCoupon);
    };

    return (
        <>
            <form onSubmit={handleSubmit(handleApplyCoupon)} className="flex gap-2 mb-[18px]">
                <input
                    type="text"
                    placeholder={t("checkout.addressPage.data.itemsData.coupon.title").toUpperCase()}
                    {...register("coupon")}
                    className="flex-1 border border-[var(--color-field)] rounded-[10px] px-[14px] py-[11px] text-[13.5px] outline-none"
                />

                <button
                    type="submit"
                    disabled={isSubmitting || checkoutPricingLoading}
                    className="bg-[var(--color-surface)] border border-[var(--color-field)] rounded-[10px] px-[18px] py-[11px] text-[13.5px] cursor-pointer hover:bg-[#E9E7DD]"
                >
                    {checkoutPricingLoading ? "...جاري التطبيق" : "تطبيق"}
                </button>
            </form>

            {checkoutPricingLoading && <p className="text-xs text-gray-500 mb-2">Checking coupon...</p>}

            {checkoutPricingError && (
                <p role="alert" className="text-xs text-red-500 mb-2">{checkoutPricingError}</p>
            )}

            {/* {!checkoutPricingLoading && serverPricing?.coupon && (
                <p className="text-xs text-green-600 mb-2">Coupon applied successfully.</p>
            )} */}

            {errors.coupon && (
                <p className="text-red-500 text-sm mb-3">
                    {errors.coupon.message}
                </p>
            )}

            {coupon && discountAmount > 0 && (
                <p className="text-[var(--color-green)] dark:text-[var(--color-gold)] text-sm">
                    {/* تم تطبيق الكوبون: {coupon.toUpperCase()} */}
                    لم يتم عمل هذه الميزة بعد
                </p>
            )}
        </>
    );
}