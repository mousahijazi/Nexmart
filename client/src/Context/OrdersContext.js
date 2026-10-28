"use client";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
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

  const refreshOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem("nexmart-token");
      if (!token) return;

      const result = await getBackendMyOrders(token);
      setOrders(result.orders || []);
    } catch (err) {
      console.error("Failed to refresh orders:", err);
    }
  }, [setOrders]);

  const closeOrderModal = useCallback(() => {
    setActiveOrder(null);
    setModalMode(null);
    setOrderItems([]);
    setError("");
  }, []);

  const openShippingModal = useCallback((order) => {
    setError("");
    setActiveOrder(order);
    setModalMode("shipping");
    setOrderItems([]);
  }, []);

  const openItemsModal = useCallback(async (order) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
        throw new Error("You must log in to view your orders");
    }

    if (loadingItems || submitting) return;

    setError("");
    setActiveOrder(order);
    setModalMode("items");
    setOrderItems([]);
    setLoadingItems(true);

    try {
        const result = await getBackendOrderItems(order._id, token);

        const items = Array.isArray(result) ? result : result?.items ?? result?.data?.items;

        if (!Array.isArray(items)) {
            throw new Error("تعذر تحميل عناصر الطلب.");
        }

        setOrderItems(items);
    } catch (err) {
        setError(err.message || "تعذر تحميل عناصر الطلب.");
    } finally {
        setLoadingItems(false);
    }
  }, [loadingItems, submitting]);

  const saveShippingInfo = useCallback(async (shippingInfo) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
        throw new Error("You must log in to manage orders");
    }

    if (!activeOrder?._id || submitting) {
        return { success: false };
    }

    setSubmitting(true);
    setError("");

    try {
        await updateBackendOrder(activeOrder._id, shippingInfo, token);

        showAlert("تم تحديث بيانات الشحن بنجاح", "success");
        closeOrderModal();
        await refreshOrders();

        return { success: true };
    } catch (err) {
        const message = err.message || "تعذر تحديث بيانات الشحن.";

        setError(message);
        showAlert(message, "danger");

        return { success: false, message };
    } finally {
        setSubmitting(false);
    }
  }, [activeOrder, submitting, showAlert, closeOrderModal, refreshOrders]);

  const saveOrderItems = useCallback(async ({ items, coupon }) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
        throw new Error("You must log in to manage orders");
    }

    if (!activeOrder?._id || submitting) {
        return { success: false };
    }

    if (!Array.isArray(items) || items.length === 0) {
        const message = "لا يمكن حفظ طلب بلا منتجات. استخدم إلغاء الطلب بدلًا من ذلك.";

        setError(message);
        return { success: false, message };
    }

    setSubmitting(true);
    setError("");

    try {
        const result = await replaceBackendOrderItems(activeOrder._id, items, coupon, token);
        const updatedOrder = result?.order ?? result?.data?.order;
        const updatedItems = result?.items ?? result?.data?.items;

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

        setError(message);
        showAlert(message, "danger");

        return { success: false, message };
    } finally {
        setSubmitting(false);
    }
  }, [activeOrder, submitting, showAlert, closeOrderModal, refreshOrders]);

  const cancelOrder = useCallback(async (order) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
        throw new Error("You must log in to manage orders");
    }

    if (!order?._id || submitting || cancellingOrderId) {
        return { success: false };
    }

    if (order.orderStatus !== "pending" || order.paymentStatus !== "pending") {
        const message = "لا يمكن إلغاء هذا الطلب في حالته الحالية.";

        showAlert(message, "danger");
        return { success: false, message };
    }

    // todo
    const confirmed = window.confirm("هل أنت متأكد من إلغاء الطلب؟ ستتم إعادة الكميات المحجوزة إلى المخزون.");
    if (!confirmed) return { success: false };

    setCancellingOrderId(order._id);
    setError("");

    try {
        await cancelBackendOrder(order._id, token);
        showAlert("تم إلغاء الطلب بنجاح", "success");
        await refreshOrders();

        return { success: true };
    } catch (err) {
        const message = err.message || "تعذر إلغاء الطلب.";

        setError(message);
        showAlert(message, "danger");

        return { success: false, message };
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