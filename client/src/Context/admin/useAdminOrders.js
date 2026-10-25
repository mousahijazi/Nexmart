"use client";
import { useCallback, useEffect, useState } from "react";
import { getAdminOrders, getBackendAdminOrderItems } from "@/helper/fetchApi";
import { useUserContext } from "../UserProvider";

const ORDERS_LIMIT = 10;
const ORDER_ITEMS_LIMIT = 10;

export default function useAdminOrders({ showAlert }) {
  const { user, loading } = useUserContext();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);

  const [orderItems, setOrderItems] = useState({});
  const [orderItemsPagination, setOrderItemsPagination] = useState({});
  const [orderItemsLoading, setOrderItemsLoading] = useState({});

  const [ordersSearch, setOrdersSearch] = useState("");
  const [ordersStatusFilter, setOrdersStatusFilter] = useState("");
  const [ordersPaymentFilter, setOrdersPaymentFilter] = useState("");

  const fetchOrders = useCallback(async ({ page = 1, search = ordersSearch, orderStatus = ordersStatusFilter, paymentStatus = ordersPaymentFilter } = {}) => {
      const token = localStorage.getItem("nexmart-token");

      if (!token) {
        setOrders([]);
        setOrdersTotal(0);
        setOrdersTotalPages(1);
        setOrdersLoading(false);
        showAlert("You are not authenticated", "danger");

        return { success: false };
      }

      setOrdersLoading(true);

      try {
        const result = await getAdminOrders({ token, page, limit: ORDERS_LIMIT, search, orderStatus, paymentStatus });

        setOrders(result.orders || []);
        setOrdersPage(result.pagination?.page || page);
        setOrdersTotal(result.pagination?.total || 0);
        setOrdersTotalPages(result.pagination?.totalPages || 1);

        return { success: true, data: result };
      } catch (error) {
        showAlert(error.message || "Failed to load orders", "danger");
        return { success: false };
      } finally {
        setOrdersLoading(false);
      }
    }, [ordersSearch, ordersStatusFilter, ordersPaymentFilter, showAlert]
  );

  useEffect(() => {
    if (loading) return;

    if (user.role === "ADMIN") {
      fetchOrders({ page: 1 });
    }
  }, [fetchOrders]);

  const fetchOrderItems = useCallback(async (orderId, page = 1) => {
    const alreadyLoaded = Object.prototype.hasOwnProperty.call(orderItems, orderId);

    if (page === 1 && alreadyLoaded) {
      return {
        success: true,
        items: orderItems[orderId],
      };
    }

    if (orderItemsLoading[orderId]) {
      return { success: false };
    }

    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      showAlert("You are not authenticated", "danger");
      return { success: false };
    }

    setOrderItemsLoading((current) => ({
      ...current,
      [orderId]: true,
    }));

    try {
      const result = await getBackendAdminOrderItems(orderId, token, { page, limit: ORDER_ITEMS_LIMIT });
      const newItems = result.items || [];

      setOrderItems((current) => ({
        ...current,
        [orderId]:
            page === 1
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
  }, [orderItems, orderItemsLoading, showAlert]);

  const loadMoreOrderItems = useCallback(async (orderId) => {
    const pagination = orderItemsPagination[orderId];

    if (!pagination?.hasNextPage || orderItemsLoading[orderId]) {
        return { success: false };
    }

    return fetchOrderItems(orderId, pagination.page + 1);
  }, [orderItemsPagination, orderItemsLoading, fetchOrderItems]);

  const changeOrdersPage = useCallback((page) => {
    if (page < 1 || page > ordersTotalPages || ordersLoading) {
        return;
    }

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
    ordersStatusFilter,
    filterOrdersByStatus,
    ordersPaymentFilter,
    filterOrdersByPaymentStatus,

    orderItems,
    orderItemsPagination,
    orderItemsLoading,
    fetchOrderItems,
    loadMoreOrderItems,
  };
}
