// todo
"use client";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { couponSchema } from "@/lib/schemas/paymentSchema";
import { useCheckoutContext } from "@/Context/CheckoutProvider";

export default function Coupon() {
    const t = useTranslations();
    const { discountAmount, setCoupon, coupon } = useCheckoutContext();

    const {register, handleSubmit, formState: { errors, isSubmitting }} = useForm(
        {resolver: zodResolver(couponSchema),
            defaultValues: {
                coupon: "",
            },
        });

    const handleApplyCoupon = async (data) => {
        const code = data.coupon.trim().toLowerCase();
        if (code !== "mousa") {
            return;
        }
        setCoupon(code);
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
                    disabled={isSubmitting}
                    className="bg-[var(--color-surface)] border border-[var(--color-field)] rounded-[10px] px-[18px] py-[11px] text-[13.5px] cursor-pointer hover:bg-[#E9E7DD]"
                >
                    {isSubmitting ? "...جاري التطبيق": "تطبيق"}
                </button>
            </form>

            {errors.coupon && (
                <p className="text-red-500 text-sm mb-3">
                    {errors.coupon.message}
                </p>
            )}

            {coupon && discountAmount > 0 && (
                <p className="text-[var(--color-green)] dark:text-[var(--color-gold)]">
                    تم تطبيق الكوبون: {coupon.toUpperCase()}
                </p>
            )}
        </>
    );
}