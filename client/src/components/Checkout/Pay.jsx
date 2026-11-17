"use client"
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "../../lib/i18n/routing";
import { useCheckoutContext } from "../../Context/CheckoutProvider";
import { useUserContext } from "../../Context/UserProvider";
import { useAlertContext } from "../../Context/AlertProvider";
import { PaymentForm, PaymentSummary, PaymentTestNotice } from "../../index"; 
import { getBackendOrderById, getBackendOrderItems, verifyBackendPayment } from "../../helper/fetchApi";

export default function Pay() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { currentOrderId, clearCheckout, setOrders } = useCheckoutContext();

    const { user, loading } = useUserContext();
    const { showAlert } = useAlertContext();

    const [order, setOrder] = useState(null);    
    const [loadingPay, setLoadingPay] = useState(true);

    const paymentId = searchParams.get("id") || searchParams.get("payment_id");
    const orderIdFromUrl = searchParams.get("order_id");

    useEffect(() => {
        if (loading) return;

        if (!user) {
            setLoadingPay(false);
            showAlert("You must log in to purchase products.", "danger");
            router.push("/");
            return;
        }

        const targetOrderId = orderIdFromUrl || currentOrderId;

        if (!targetOrderId) {
            setLoadingPay(false);
            showAlert("You cannot access this page without selecting an order.", "danger");
            router.push("/user");
            return;
        }

        let cancelled = false;

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
                    items: itemsData.items || itemsData || [],
                };

                if (cancelled) return;

                setOrder(fullOrder);

                if (paymentId) {
                    const verification = await verifyBackendPayment(paymentId, targetOrderId, token);

                    if (cancelled) return;

                    if (verification.verified === true) {
                        const verifiedOrder = verification.order || {
                            ...fullOrder,
                            paymentStatus: "paid",
                            orderStatus: verification.orderStatus || "onHold",
                            paymentId,
                        };

                        setOrder(verifiedOrder);

                        setOrders((previousOrders) =>
                            (previousOrders || []).map((item) =>
                                String(item._id || item.id) === String(targetOrderId)
                                    ? { ...item, ...verifiedOrder }
                                    : item
                            )
                        );

                        clearCheckout();

                        showAlert("Payment successful! Your order is awaiting administrative review.", "success");

                        router.replace("/user");
                        return;
                    }

                    const refreshedOrderData = await getBackendOrderById(targetOrderId, token);

                    if (cancelled) return;

                    setOrder({
                        ...(refreshedOrderData.order || refreshedOrderData),
                        items: itemsData.items || itemsData || [],
                    });

                    showAlert(verification.paymentStatus === "failed" ? "Payment failed. You can try again." : "Payment has not been confirmed yet. Please check again.", "danger");
                }
            } catch (error) {
                console.error("Pay page error:", error);

                if (!cancelled) {
                    showAlert(error.message || "Could not load or verify the order.", "danger");
                }
            } finally {
                if (!cancelled) {
                    setLoadingPay(false);
                }
            }
        };

        processPayPage();

        return () => {
            cancelled = true;
        };
    }, [loading, user, currentOrderId, paymentId, orderIdFromUrl, setOrders, clearCheckout, showAlert, router,]);

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