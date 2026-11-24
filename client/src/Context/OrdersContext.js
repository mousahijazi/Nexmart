"use client";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { getBackendOrderItems, updateBackendOrder, replaceBackendOrderItems, cancelBackendOrder, getBackendMyOrders } from "@/helper/fetchApi";
import { useAlertContext } from "@/Context/AlertProvider";
import { useCheckoutContext } from "./CheckoutProvider";

const OrdersContext = createContext(null);

export default function OrdersProvider({ children }) {
    const { showAlert } = useAlertContext();
    const { setOrders } = useCheckoutContext();

    const [activeOrder, setActiveOrder] = useState(null);
    const [modalMode, setModalMode] = useState(null);
    const [orderItems, setOrderItems] = useState([]);

    const [loadingItems, setLoadingItems] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [cancellingOrderId, setCancellingOrderId] = useState(null);
    const [error, setError] = useState("");

    const loadingItemsRef = useRef(false);

    const refreshOrders = useCallback(async () => {
        try {
            const result = await getBackendMyOrders();

            const orders = Array.isArray(result?.orders)
                ? result.orders
                : Array.isArray(result?.data?.orders) ? result.data.orders : [];

            setOrders(orders);

            return {
                success: true,
                orders,
            };
        } catch (err) {
            console.error("Failed to refresh orders:", err);

            return {
                success: false,
                message: err.message || "Failed to refresh orders",
            };
        }
    }, [setOrders]);

    const closeOrderModal = useCallback(() => {
        setActiveOrder(null);
        setModalMode(null);
        setOrderItems([]);
        setError("");

        loadingItemsRef.current = false;
        setLoadingItems(false);
    }, []);

    const openShippingModal = useCallback((order) => {
        setError("");
        setActiveOrder(order);
        setModalMode("shipping");
        setOrderItems([]);
    }, []);

    const openItemsModal = useCallback(async (order) => {
        if (!order?._id) {
            throw new Error("Invalid order");
        }

        if (loadingItemsRef.current || submitting) return;

        loadingItemsRef.current = true;

        setError("");
        setActiveOrder(order);
        setModalMode("items");
        setOrderItems([]);
        setLoadingItems(true);

        try {
            const result = await getBackendOrderItems(order._id);

            const items = Array.isArray(result) ? result : result?.items ?? result?.data?.items;

            if (!Array.isArray(items)) {
                throw new Error("تعذر تحميل عناصر الطلب.");
            }

            setOrderItems(items);
        } catch (err) {
            console.error("Failed to load order items:", err);

            setError(err.message || "تعذر تحميل عناصر الطلب.");
        } finally {
            loadingItemsRef.current = false;
            setLoadingItems(false);
        }
    }, [submitting]);

    const saveShippingInfo = useCallback(async (shippingInfo) => {
        if (!activeOrder?._id || submitting) {
            return { success: false };
        }

        setSubmitting(true);
        setError("");

        try {
            await updateBackendOrder(activeOrder._id, shippingInfo);

            showAlert("تم تحديث بيانات الشحن بنجاح", "success");

            closeOrderModal();

            await refreshOrders();

            return { success: true };
        } catch (err) {
            const message = err.message || "تعذر تحديث بيانات الشحن.";

            console.error("Failed to update shipping information:", err);

            setError(message);
            showAlert(message, "danger");

            return {
                success: false,
                message,
            };
        } finally {
            setSubmitting(false);
        }
    }, [activeOrder, submitting, showAlert, closeOrderModal, refreshOrders]);

    const saveOrderItems = useCallback(async ({ items, coupon }) => {
        if (!activeOrder?._id || submitting) {
            return { success: false };
        }

        if (!Array.isArray(items) || items.length === 0) {
            const message = "لا يمكن حفظ طلب بلا منتجات. استخدم إلغاء الطلب بدلًا من ذلك.";

            setError(message);

            return {
                success: false,
                message,
            };
        }

        setSubmitting(true);
        setError("");

        try {
            const result = await replaceBackendOrderItems(activeOrder._id, items, coupon);

            const updatedOrder = result?.order ?? result?.data?.order;
            const updatedItems =result?.items ?? result?.data?.items;

            if (!updatedOrder || !Array.isArray(updatedItems)) {
                throw new Error("استجابة الخادم لا تحتوي على الطلب وعناصره بالشكل المتوقع.");
            }

            setActiveOrder(updatedOrder);
            setOrderItems(updatedItems);

            showAlert("تم تحديث منتجات الطلب بنجاح", "success");

            closeOrderModal();

            await refreshOrders();

            return {
                success: true,
                order: updatedOrder,
                items: updatedItems,
            };
        } catch (err) {
            const message = err.message || "تعذر تعديل منتجات الطلب.";

            console.error("Failed to update order items:", err);

            setError(message);
            showAlert(message, "danger");

            return {
                success: false,
                message,
            };
        } finally {
            setSubmitting(false);
        }
    }, [activeOrder, submitting, showAlert, closeOrderModal, refreshOrders]);

    const cancelOrder = useCallback(async (order) => {
        if (!order?._id || submitting || cancellingOrderId) {
            return { success: false };
        }

        if (order.orderStatus !== "pending" || !["pending", "failed"].includes(order.paymentStatus)) {
            const message = "لا يمكن إلغاء هذا الطلب في حالته الحالية.";

            showAlert(message, "danger");

            return {
                success: false,
                message,
            };
        }

        const confirmed = window.confirm("هل أنت متأكد من إلغاء الطلب؟ ستتم إعادة الكميات المحجوزة إلى المخزون.");

        if (!confirmed) {
            return { success: false };
        }

        setCancellingOrderId(order._id);
        setError("");

        try {
            await cancelBackendOrder(order._id);

            showAlert("تم إلغاء الطلب بنجاح", "success");

            await refreshOrders();

            return { success: true };
        } catch (err) {
            const message = err.message || "تعذر إلغاء الطلب.";

            console.error("Failed to cancel order:", err);

            setError(message);
            showAlert(message, "danger");

            return {
                success: false,
                message,
            };
        } finally {
            setCancellingOrderId(null);
        }
    }, [submitting, cancellingOrderId, showAlert, refreshOrders]);

    const value = useMemo(() => ({
        activeOrder,
        modalMode,
        orderItems,
        loadingItems,
        submitting,
        cancellingOrderId,
        error,

        openShippingModal,
        openItemsModal,
        closeOrderModal,
        saveShippingInfo,
        saveOrderItems,
        cancelOrder,
    }), [activeOrder, modalMode, orderItems, loadingItems, submitting, cancellingOrderId, error, openShippingModal, openItemsModal, closeOrderModal, saveShippingInfo, saveOrderItems, cancelOrder]);

    return (
        <OrdersContext.Provider value={value}>
            {children}
        </OrdersContext.Provider>
    );
}

export function useOrdersContext() {
    return useContext(OrdersContext);
}