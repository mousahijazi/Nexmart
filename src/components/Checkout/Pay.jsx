"use client"
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCheckoutContext } from "@/Context/CheckoutProvider";
import { useUserContext } from "@/Context/UserProvider";
import { useAlertContext } from "@/Context/AlertProvider";
import { PaymentForm, PaymentSummary } from "@/index"; 
import { getOrderById, updateOrderPaymentStatus } from "@/helper/fetchApi";

export default function Pay() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { currentOrderId, clearCheckout } = useCheckoutContext();
    const { user, loading } = useUserContext();
    const {showAlert} = useAlertContext();
    const [order, setOrder] = useState(null);
    const [loadingPay, setLoadingPay] = useState(true);
    const hasFinishedRef = useRef(false);

    const paymentId = searchParams.get("id");
    const orderIdFromUrl = searchParams.get("order_id");

    useEffect(() => {
        if (hasFinishedRef.current) return;
        if (loading) return;

        if (!user) {
            setLoadingPay(false);
            showAlert("You must log in to purchase products.", "danger");
            router.push("/");
            return;
        }

        const targetOrderId = currentOrderId || orderIdFromUrl;

        if (!targetOrderId) {
            setLoadingPay(false);
            showAlert("You cannot access this page without selecting an order.", "danger");
            router.push(user ? "/user" : "/");
            return;
        }

        const processPayPage = async () => {
            setLoadingPay(true);
            try {
                const orderResult = await getOrderById(targetOrderId, user.id);
                const currentOrderData = orderResult.success ? orderResult.order : null;
                setOrder(currentOrderData);

                if (!currentOrderData) {
                    showAlert("Order not found.", "danger");
                    router.push(user ? "/user" : "/");
                    return;
                }

                if (paymentId) {
                    const verifyResponse = await fetch("/api/initiate-payment", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ paymentId, orderId: targetOrderId }),
                    });
                    const verifyResult = await verifyResponse.json();

                    if (verifyResult.success && verifyResult.payment?.status === "paid") {
                        hasFinishedRef.current = true;
                        await updateOrderPaymentStatus(targetOrderId, user.id, "paid", paymentId);
                        clearCheckout();
                        showAlert("Payment successful! Your order is confirmed.", "success");
                        router.push("/user");
                        return;
                    } else {
                        hasFinishedRef.current = true;
                        await updateOrderPaymentStatus(targetOrderId, user.id, "failed", paymentId);
                        showAlert("Payment verification failed or declined.", "danger");
                    }
                }
            } catch (err) {
                console.error("Pay page error:", err);
            } finally {
                setLoadingPay(false);
            }
        };

        processPayPage();
    }, [loading, user, currentOrderId, paymentId, orderIdFromUrl]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
        <PaymentForm order={order} loading={loadingPay} />
        <PaymentSummary order={order} loading={loadingPay} />
    </div>
  )
}