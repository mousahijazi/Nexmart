"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { getAdminOrders, getBackendAdminOrderItems, rejectBackendOrder, shipBackendOrder } from "@/helper/fetchApi";
import { useUserContext } from "../UserProvider";

const ORDERS_LIMIT = 10;
const ORDER_ITEMS_LIMIT = 10;
const SEARCH_DEBOUNCE_DELAY = 400;

const INITIAL_ORDERS_STATS = {
  total: 0,
  pending: 0,
  confirmed: 0,
  onHold: 0,
  shipped: 0,
  delivered: 0,
  cancelled: 0,
  paid: 0,
  failed: 0,
  refunded: 0,
  shippingPending: 0,
  shippingRejected: 0,
  shippingApproved: 0,
};

export default function useAdminOrders({ showAlert, enabled = true }) {
  const { user, loading } = useUserContext();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);

  const [orderItems, setOrderItems] = useState({});
  const [orderItemsPagination, setOrderItemsPagination] = useState({});
  const [orderItemsLoading, setOrderItemsLoading] = useState({});

  const [ordersStats, setOrdersStats] = useState(INITIAL_ORDERS_STATS);

  const [ordersShippingDecisionFilter, setOrdersShippingDecisionFilter] = useState("");
  const [ordersSearch, setOrdersSearch] = useState("");
  const [debouncedOrdersSearch, setDebouncedOrdersSearch] = useState("");
  const [ordersStatusFilter, setOrdersStatusFilter] = useState("");
  const [ordersPaymentFilter, setOrdersPaymentFilter] = useState("");

  const [activeOnHoldOrder, setActiveOnHoldOrder] = useState(null);
  const [onHoldModalOpen, setOnHoldModalOpen] = useState(false);
  const [onHoldSubmitting, setOnHoldSubmitting] = useState(false);

  const ordersRequestId = useRef(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedOrdersSearch(ordersSearch.trim());
    }, SEARCH_DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [ordersSearch]);

  const fetchOrders = useCallback(async ({ page = 1, search = debouncedOrdersSearch, orderStatus = ordersStatusFilter, paymentStatus = ordersPaymentFilter, shippingDecision = ordersShippingDecisionFilter } = {}) => {
    // const token = localStorage.getItem("nexmart-token");

    // if (!token) {
    //   setOrders([]);
    //   setOrdersTotal(0);
    //   setOrdersTotalPages(1);
    //   setOrdersPage(1);
    //   setOrdersStats({ ...INITIAL_ORDERS_STATS });
    //   setOrdersLoading(false);

    //   showAlert("You are not authenticated", "danger");

    //   return { success: false };
    // }

    const requestId = ++ordersRequestId.current;

    setOrdersLoading(true);

    try {
      const result = await getAdminOrders({
        page,
        limit: ORDERS_LIMIT,
        search,
        orderStatus,
        paymentStatus,
        shippingDecision,
      });

      if (requestId !== ordersRequestId.current) {
        return { success: false, stale: true };
      }

      setOrders(result.orders || []);

      setOrdersPage(result.pagination?.page || page);
      setOrdersTotal(result.pagination?.total ?? 0);
      setOrdersTotalPages(result.pagination?.totalPages || 1);

      setOrdersStats({
        total: result.stats?.total ?? 0,
        pending: result.stats?.pending ?? 0,
        confirmed: result.stats?.confirmed ?? 0,
        onHold: result.stats?.onHold ?? 0,
        shipped: result.stats?.shipped ?? 0,
        delivered: result.stats?.delivered ?? 0,
        cancelled: result.stats?.cancelled ?? 0,
        paid: result.stats?.paid ?? 0,
        failed: result.stats?.failed ?? 0,
        refunded: result.stats?.refunded ?? 0,
        shippingPending: result.stats?.shippingPending ?? 0,
        shippingRejected: result.stats?.shippingRejected ?? 0,
        shippingApproved: result.stats?.shippingApproved ?? 0,
      });

      return { success: true, data: result };
    } catch (error) {
      if (requestId === ordersRequestId.current) {
        showAlert(error.message || "Failed to load orders", "danger");
      }

      return { success: false };
    } finally {
      if (requestId === ordersRequestId.current) {
        setOrdersLoading(false);
      }
    }
  }, [debouncedOrdersSearch, ordersStatusFilter, ordersPaymentFilter, ordersShippingDecisionFilter, showAlert]);


  useEffect(() => {
    if (!enabled) {
      setOrdersLoading(false);
      return;
    }

    if (loading) return;

    if (user?.role !== "ADMIN") {
      setOrdersLoading(false);
      return;
    }

    fetchOrders({ page: 1 });
  }, [fetchOrders, loading, user?.role, enabled]);

  const fetchOrderItems = useCallback(async (orderId, page = 1) => {
    const alreadyLoaded = Object.prototype.hasOwnProperty.call(orderItems, orderId);

    if (page === 1 && alreadyLoaded) {
      return {
        success: true,
        items: orderItems[orderId],
        pagination: orderItemsPagination[orderId],
      };
    }

    if (orderItemsLoading[orderId]) {
      return { success: false };
    }

    setOrderItemsLoading((current) => ({
      ...current,
      [orderId]: true,
    }));

    try {
      const result = await getBackendAdminOrderItems(orderId, { page, limit: ORDER_ITEMS_LIMIT });
      const newItems = result.items || [];

      setOrderItems((current) => ({
        ...current,
        [orderId]: page === 1
            ? newItems
            : [...(current[orderId] || []), ...newItems],
      }));

      setOrderItemsPagination((current) => ({
        ...current,
        [orderId]: result.pagination,
      }));

      return {
        success: true,
        items: newItems,
        pagination: result.pagination,
      };
    } catch (error) {
      showAlert(error.message || "Failed to load order items", "danger");
      return { success: false };
    } finally {
      setOrderItemsLoading((current) => ({
        ...current,
        [orderId]: false,
      }));
    }
  }, [orderItems, orderItemsPagination, orderItemsLoading, showAlert]);

  const loadMoreOrderItems = useCallback(async (orderId) => {
    const pagination = orderItemsPagination[orderId];

    if (!pagination?.hasNextPage || orderItemsLoading[orderId]) {
      return { success: false };
    }

    return fetchOrderItems(orderId, pagination.page + 1);
  }, [orderItemsPagination, orderItemsLoading, fetchOrderItems]);

  const openOnHoldModal = useCallback(async (order) => {
    if (!order?._id || order.orderStatus !== "onHold" || order.paymentStatus !== "paid" || onHoldSubmitting) {
      return { success: false };
    }

    setActiveOnHoldOrder(order);
    setOnHoldModalOpen(true);

    return fetchOrderItems(order._id, 1);
  }, [fetchOrderItems, onHoldSubmitting]);

  const closeOnHoldModal = useCallback(() => {
    if (onHoldSubmitting) return;

    setOnHoldModalOpen(false);
    setActiveOnHoldOrder(null);
  }, [onHoldSubmitting]);

  const submitOnHoldDecision = useCallback(async (reason, decision) => {
    const orderId = activeOnHoldOrder?._id;
    const cleanReason = typeof reason === "string" ? reason.trim() : "";

    if (!orderId || !cleanReason || onHoldSubmitting) {
      return { success: false };
    }

    if (activeOnHoldOrder.orderStatus !== "onHold" || activeOnHoldOrder.paymentStatus !== "paid") {
      showAlert("This order is no longer awaiting review", "danger");
      return { success: false };
    }

    setOnHoldSubmitting(true);

    try {
      if (decision === "approved") {
        await shipBackendOrder(orderId, cleanReason);
      } else if (decision === "rejected") {
        await rejectBackendOrder(orderId, cleanReason);
      } else {
        return { success: false };
      }

      showAlert(decision === "approved" ? "تم قبول الطلب بنجاح" : "تم رفض الطلب بنجاح", "success");

      setOrderItems((current) => {
        const updated = { ...current };
        delete updated[orderId];
        return updated;
      });

      setOrderItemsPagination((current) => {
        const updated = { ...current };
        delete updated[orderId];
        return updated;
      });

      setOnHoldModalOpen(false);
      setActiveOnHoldOrder(null);

      await fetchOrders({ page: ordersPage });

      return { success: true };
    } catch (error) {
      showAlert(error.message || "تعذر تنفيذ القرار على الطلب", "danger");

      return {
        success: false,
        message: error.message,
      };
    } finally {
      setOnHoldSubmitting(false);
    }
  }, [activeOnHoldOrder, onHoldSubmitting, showAlert, fetchOrders, ordersPage]);

  const approveOnHoldOrder = useCallback((reason) => {
    return submitOnHoldDecision(reason, "approved");
  }, [submitOnHoldDecision]);

  const rejectOnHoldOrder = useCallback((reason) => {
    return submitOnHoldDecision(reason, "rejected");
  }, [submitOnHoldDecision]);

  const changeOrdersPage = useCallback((page) => {
    if (page < 1 || page > ordersTotalPages || ordersLoading) return;

    fetchOrders({ page });
  }, [fetchOrders, ordersTotalPages, ordersLoading]);

  const searchOrders = useCallback((search) => {
    setOrdersSearch(search);
  }, []);

  const filterOrdersByStatus = useCallback((orderStatus) => {
    setOrdersStatusFilter(orderStatus);
  }, []);

  const filterOrdersByPaymentStatus = useCallback((paymentStatus) => {
    setOrdersPaymentFilter(paymentStatus);
  }, []);

  const filterOrdersByShippingDecision = useCallback((shippingDecision) => {
    setOrdersShippingDecisionFilter(shippingDecision);
  }, []);

  return {
    orders,
    ordersLoading,

    ordersPage,
    ordersLimit: ORDERS_LIMIT,
    ordersTotal,
    ordersTotalPages,
    changeOrdersPage,

    ordersSearch,
    searchOrders,

    ordersStats,
    setOrdersStats,

    ordersStatusFilter,
    filterOrdersByStatus,

    ordersShippingDecisionFilter,
    filterOrdersByShippingDecision,

    ordersPaymentFilter,
    filterOrdersByPaymentStatus,

    orderItems,
    orderItemsPagination,
    orderItemsLoading,
    fetchOrderItems,
    loadMoreOrderItems,

    activeOnHoldOrder,
    onHoldModalOpen,
    onHoldSubmitting,
    openOnHoldModal,
    closeOnHoldModal,
    approveOnHoldOrder,
    rejectOnHoldOrder,
  };
}