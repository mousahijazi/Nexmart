"use client"
import { useCheckoutContext } from "@/Context/CheckoutProvider";
import { useUserContext } from "@/Context/UserProvider";
import { useAlertContext } from "@/Context/AlertProvider";
import { createOrder } from "@/helper/fetchApi";
import { useProductContext } from "@/Context/CartProvider";
import { createOrderItems } from "@/helper/fetchApi";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { RHFerrors } from "@/index";

export default function CheckoutForm() {
    const {user, loading} = useUserContext();
    const {setCart} = useProductContext();
    const {showAlert} = useAlertContext();
    const {checkoutItems, setCheckoutItems, grandTotal, needShipping, setCurrentOrderId} = useCheckoutContext();
    const {register, handleSubmit, reset, formState: { errors, isSubmitting }} = useForm();
    const router = useRouter();
    const placing = isSubmitting;

    const handlePlaceOrder = async (data) => {
        if (!user) {
            showAlert("Please log in to place an order", "danger");
            return;
        }
        if (checkoutItems.length === 0) {
            showAlert("Please return to your cart and checkout !", "danger");
            return;
        }

        const orderResult = await createOrder({ userId: user.id, shippingInfo: data, needShipping, grandTotal, checkoutItems });
        if (!orderResult.success) {
            showAlert(orderResult.message, "danger");
            return;
        }

        const itemsResult = await createOrderItems(orderResult.order.id, checkoutItems);
        if (!itemsResult.success) {
            showAlert(itemsResult.message, "danger");
            return;
        }

        setCart((prevCart) => {
            return prevCart.filter(
                (cartItem) => !checkoutItems.some((checkoutItem) => checkoutItem.id === cartItem.id)
            );
        });

        setCurrentOrderId(orderResult.order.id);
        setCheckoutItems([]);
        router.push("/checkout?mode=pay");
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
            text: "First Name",
            id: "FirstName",
            apiKey: "firstName",
            validation: { required: "First name is required" },
            error: errors.firstName,
        },
        {
            text: "Last Name",
            id: "LastName",
            apiKey: "lastName",
            validation: { required: "Last name is required" },
            error: errors.lastName,
        },
        {
            text: "Phone number",
            id: "PhoneNumber",
            apiKey: "phone",
            validation: { 
                required: "Phone number is required",
            },
            error: errors.phone,
        },
        {
            text: "City",
            id: "City",
            apiKey: "city",
            validation: { required: "City is required" },
            error: errors.city,
        },
    ];

  return (
    <div className="px-3 min-[480px]:px-6 py-8">
        <h1 className="pb-7 sm:pb-11 text-2xl sm:text-3xl font-extrabold text-[#5B3A21] dark:text-[#A68A64]">Shipping Address</h1>
        <form onSubmit={handleSubmit(handlePlaceOrder)}>
            <div className="grid min-[480px]:grid-cols-2 gap-4">
                {checkoutFields.map((ele) => (
                        <div key={ele.id}>
                            <label htmlFor={ele.id} className="block mb-2 pl-1.5 text-sm font-semibold text-[#5B3A21] dark:text-[#A68A64]">{ele.text}</label>
                            <input 
                               id={ele.id} 
                                name={ele.name}
                                {...register(ele.apiKey, ele.validation)}
                                type="text" 
                                placeholder={ele.text} 
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
                            <RHFerrors errors={ele.error} />
                        </div>
                ))}
            </div>
            <div className="mt-4 flex flex-col gap-4">
                <div>
                    <label htmlFor="address" className="block mb-2 pl-1.5 text-sm font-semibold text-[#5B3A21] dark:text-[#A68A64]">Address</label>
                    <input 
                        id="address" 
                        name="address"
                        {...register("address", {
                            required: "Address is required"
                        })}
                        type="text" 
                        placeholder="Address" 
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
                    <RHFerrors errors={errors.address} />
                </div>
                <div>
                    <label className="block mb-2 pl-1.5 text-sm font-semibold text-[#5B3A21] dark:text-[#A68A64]">Message</label>
                    <textarea
                        rows={4}
                        name="notes"
                        {...register("notes", {
                            maxLength: {
                                value: 200,
                                message: "The text must be less than 200 words"
                            }
                        })}
                        placeholder="Write your message here..."
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-zinc-800 bg-[#fcfbf9] dark:bg-[#f2f2f2] outline-none focus:border-[#5B3A21] dark:focus:border-zinc-600 transition resize-none"
                    />
                    <RHFerrors errors={errors.notes} />
                </div>
            </div>
            <div className="pt-5">
                <div className="flex items-center gap-3">
                    <button type="button" aria-label="cancel" className="p-3 border border-black dark:border-zinc-200 dark:bg-zinc-900 dark:text-white rounded-xl min-[480px]:w-1/2 cursor-pointer" onClick={() => router.back()}>cancel</button>
                    <button type="submit" aria-label="Place Order" className="p-3 bg-[#5B3A21] rounded-xl w-full cursor-pointer text-white" disabled={placing}>{placing ? "Placing Order..." : "Place Order"}</button>
                </div>
                <p className="mt-5 text-gray-600 dark:text-zinc-300">By placing your order, you agree to our company Privacy policy and Conditions of use.</p>
            </div>
        </form>
    </div>
  )
}
