"use client"
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "../../lib/i18n/routing";
import { useCheckoutContext } from "../../Context/CheckoutProvider";
import { useUserContext } from "../../Context/UserProvider";
import { useAlertContext } from "../../Context/AlertProvider";
import { PaymentForm, PaymentSummary, PaymentTestNotice } from "../../index"; 
import { getBackendOrderById, getBackendOrderItems } from "../../helper/fetchApi";

export default function Pay() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { currentOrderId, clearCheckout, setOrders } = useCheckoutContext();
    const { user, loading } = useUserContext();
    const { showAlert } = useAlertContext();
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
            router.push("/user");
            return;
        }

        const processPayPage = async () => {
            setLoadingPay(true);

            try {
                const token = localStorage.getItem("nexmart-token");
                if (!token) {
                    throw new Error("Authentication token not found");
                }

                const orderData = await getBackendOrderById(targetOrderId, token);
                const itemsData = await getBackendOrderItems(targetOrderId, token);

                const fullOrder = {
                    ...(orderData.order || orderData),
                    items: itemsData.items || itemsData || []
                };

                setOrder(fullOrder);

                if (!fullOrder) {
                    showAlert("Order not found.", "danger");
                    router.push("/user");
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
                        
                        setOrders((prevOrders) =>
                            (prevOrders || []).map((ord) =>
                                (ord._id === targetOrderId || ord.id === targetOrderId)
                                    ? { ...ord, paymentStatus: "paid", paymentId: paymentId }
                                    : ord
                            )
                        );

                        clearCheckout();
                        showAlert("Payment successful! Your order is confirmed.", "success");
                        router.push("/user");
                        return;
                    } else {
                        hasFinishedRef.current = true;
                        showAlert("Payment verification failed or declined.", "danger");
                    }
                }
            } catch (err) {
                console.error("Pay page error:", err);
                showAlert("Could not load order details.", "danger");
            } finally {
                setLoadingPay(false);
            }
        };

        processPayPage();
    }, [loading, user, currentOrderId, paymentId, orderIdFromUrl, setOrders]);

  return (
    <>
        <div dir="ltr" className="grid grid-cols-1 lg:grid-cols-2">
            <PaymentForm order={order} loading={loadingPay} />
            <PaymentSummary order={order} loading={loadingPay} />
        </div>
        <div className="min-[480px]:bg-[var(--color-surface)] min-[480px]:dark:bg-[var(--color-surface)]">
            <PaymentTestNotice />
        </div>
    </>
  )
}