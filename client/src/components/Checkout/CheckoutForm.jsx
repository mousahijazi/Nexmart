"use client"
import { useCheckoutContext } from "../../Context/CheckoutProvider";
import { useUserContext } from "../../Context/UserProvider";
import { useAlertContext } from "../../Context/AlertProvider";
import { createBackendOrder } from "../../helper/fetchApi";
import { useProductContext } from "../../Context/CartProvider";
import { useRouter } from "../../lib/i18n/routing";
import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema } from "../../lib/schemas/paymentSchema";
import { RHFerrors } from "../../index";
import { useLocale, useTranslations } from "next-intl";

export default function CheckoutForm() {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({resolver: zodResolver(addressSchema)});
    const { checkoutItems, setCheckoutItems, currentOrderId, setCurrentOrderId, setOrders, coupon, serverPricing, checkoutPricingLoading, checkoutPricingError } = useCheckoutContext();
    const { user, loading } = useUserContext();
    const { setCart } = useProductContext();
    const { showAlert } = useAlertContext();

    const isProcessingRef = useRef(false);
    const placing = isSubmitting;

    const handlePlaceOrder = async (data) => {
        if (isProcessingRef.current) return;

        if (loading) {
            showAlert("Please wait while your account is loading.", "danger");
            return;
        }

        if (!user) {
            showAlert("You must log in before placing an order.", "danger");
            return;
        }

        if (!checkoutItems.length) {
            showAlert("Your checkout is empty.", "danger");
            return;
        }

        if (checkoutPricingLoading) {
            showAlert("Please wait while we calculate your order.", "danger");
            return;
        }

        if (checkoutPricingError || !serverPricing) {
            showAlert(checkoutPricingError || "Unable to verify the cart prices.", "danger");
            return;
        }

        isProcessingRef.current = true;

        try {
            const token = localStorage.getItem("nexmart-token");

            if (!token) {
                showAlert("Your login session has expired. Please log in again.", "danger");
                return;
            }

            const result = await createBackendOrder({
                token,
                shippingInfo: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phone: data.phone,
                    city: data.city,
                    address: data.address,
                    notes: data.notes || "",
                },
                items: checkoutItems.map((item) => ({
                    productId: item._id ?? item.productId ?? item.id,
                    quantity: Number(item.quantity || 1),
                })),
                coupon,
            });

            const createdOrder = result?.order;
            const createdItems = result?.items || [];

            if (!createdOrder?._id) {
                throw new Error("The server did not return a valid order.");
            }

            // todo
            setOrders((previousOrders) => [
                { ...createdOrder, items: createdItems },
                ...previousOrders.filter((order) => order._id !== createdOrder._id),
            ]);

            // todo
            setCart((previousCart) =>
                previousCart.filter((cartItem) => {
                    const cartProductId = String(cartItem._id ?? cartItem.productId ?? cartItem.id);

                    return !checkoutItems.some((checkoutItem) => {
                        const checkoutProductId = String(checkoutItem._id ?? checkoutItem.productId ?? checkoutItem.id);

                        return checkoutProductId === cartProductId;
                    });
                })
            );

            setCurrentOrderId(createdOrder._id);
            setCheckoutItems([]);
            showAlert("Your order has been created successfully.", "success");
            router.push("/checkout?mode=pay");
        } catch (error) {
            console.error("Create order error:", error);

            showAlert(error.message || "Unable to create your order. Please try again.", "danger");
        } finally {
            isProcessingRef.current = false;
        }
    };

    useEffect(() => {
        if (loading) return;

        if (!user) {
            showAlert("You must log in to purchase products.", "danger");
            router.push("/");
            return;
        };

        if(!checkoutItems || checkoutItems.length === 0) {
            showAlert("You must select products in order to purchase them and view this page.", "danger");
            router.push("/");
            return;
        }

        reset({
            firstName: user.user_metadata?.first_name || "",
            lastName: user.user_metadata?.last_name || "",
            phone: user.user_metadata?.phone || "",
            city: user.user_metadata?.city || "",
            address: user.user_metadata?.address || "",
            notes: user.user_metadata?.notes || "",
        });
    }, [user, loading, reset]);

    const checkoutFields = [
        {
            text: t("auth.form.firstName.label"),
            id: "FirstName",
            apiKey: "firstName",
            error: errors.firstName,
        },
        {
            text: t("auth.form.lastName.label"),
            id: "LastName",
            apiKey: "lastName",
            error: errors.lastName,
        },
        {
            text: t("profile.data.phoneLabel"),
            id: "PhoneNumber",
            apiKey: "phone",
            error: errors.phone,
        },
        {
            text: t("checkout.addressPage.form.cityLabel"),
            id: "City",
            apiKey: "city",
            error: errors.city,
        },
    ];

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="px-3 min-[480px]:px-6 py-8">
        <h1 className="pb-7 sm:pb-11 text-2xl sm:text-3xl font-extrabold text-[var(--color-green)] dark:text-[var(--color-gold)]">Shipping Address</h1>
        <form onSubmit={handleSubmit(handlePlaceOrder)}>
            <div className="grid min-[480px]:grid-cols-2 gap-4">
                {checkoutFields.map((ele) => (
                        <div key={ele.id}>
                            <label htmlFor={ele.id} className="block mb-2 pl-1.5 text-sm font-semibold text-[var(--color-green)] dark:text-[var(--color-gold)]">{ele.text}</label>
                            <input 
                            id={ele.id} 
                                name={ele.name}
                                {...register(ele.apiKey)}
                                type="text" 
                                placeholder={ele.text} 
                                className="
                                    w-full
                                    text-[var(--color-ink)] dark:text-[var(--color-ink)]
                                    dark:bg-[var(--color-field)]
                                    font-semibold
                                    px-4 py-3
                                    rounded-xl
                                    border-2 border-[var(--color-border)]
                                    outline-none
                                    focus:border-[var(--color-green)] dark:focus:border-[var(--color-gold)]
                                    transition
                                " 
                            />
                            <RHFerrors errors={ele.error} />
                        </div>
                ))}
            </div>
            <div className="mt-4 flex flex-col gap-4">
                <div>
                    <label htmlFor="address" className="block mb-2 pl-1.5 text-sm font-semibold text-[var(--color-green)] dark:text-[var(--color-gold)]">{t("checkout.addressPage.form.addressLabel")}</label>
                    <input 
                        id="address" 
                        name="address"
                        {...register("address")}
                        type="text" 
                        placeholder={t("checkout.addressPage.form.addressLabel")}
                        className="
                            w-full
                            text-[var(--color-ink)] dark:text-[var(--color-ink)]
                            dark:bg-[var(--color-field)]
                            font-semibold
                            px-4 py-3
                            rounded-xl
                            border-2 border-[var(--color-border)]
                            outline-none
                            focus:border-[var(--color-green)] dark:focus:border-[var(--color-gold)]
                            transition
                        " 
                    />
                    <RHFerrors errors={errors.address} />
                </div>
                <div>
                    <label className="block mb-2 pl-1.5 text-sm font-semibold text-[var(--color-green)] dark:text-[var(--color-gold)]">{t("checkout.addressPage.form.notes.label")}</label>
                    <textarea
                        rows={4}
                        name="notes"
                        {...register("notes")}
                        placeholder={t("checkout.addressPage.form.notes.placeholder")}
                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-border)] dark:border-[var(--color-border)] bg-[var(--color-cream)] dark:bg-[var(--color-field)] outline-none focus:border-[var(--color-green)] dark:focus:border-[var(--color-gold)] transition resize-none"
                    />
                    <RHFerrors errors={errors.notes} />
                </div>
            </div>
            <div className="pt-5">
                <div className="flex items-center gap-3">
                    <button type="button" aria-label="cancel" className="p-3 border border-[var(--color-border)] dark:border-[var(--color-border)] dark:bg-[var(--color-surface)] dark:text-[var(--color-ink)] rounded-xl min-[480px]:w-1/2 cursor-pointer" onClick={() => router.back()}>{t("profile.updateProfile.cancel")}</button>
                    <button type="submit" aria-label="Place Order" className="p-3 bg-[var(--color-green)] rounded-xl w-full cursor-pointer text-white" disabled={placing || isProcessingRef.current}>{isSubmitting || isProcessingRef.current ? t("checkout.addressPage.form.placingButton") : t("checkout.addressPage.form.placeButton")}</button>
                </div>
                <p className="mt-5 text-[var(--color-soft-2)] dark:text-[var(--color-soft)]">{t("checkout.addressPage.form.Desc")}</p>
            </div>
        </form>
    </div>
  )
}
