"use client";
import { useMemo, useState } from "react";
import { OrdersFilters, OrdersTable } from "@/index";
import OrdersTableSkeleton from "./OrdersTableSkeleton";
import { mockOrders, orderStatusOptions, paymentStatusOptions } from "./ordersData";

export default function OrdersInteractive() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Statuses");
  const [paymentStatus, setPaymentStatus] = useState("All Payment Statuses");

  const orders = mockOrders;
  const ordersLoading = false;

  const filteredOrders = useMemo(() => {
    const value = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !value ||
        order.orderNumber.toLowerCase().includes(value) ||
        order.customer.toLowerCase().includes(value) ||
        order.phone.toLowerCase().includes(value);

      const matchesStatus = status === "All Statuses" || order.orderStatus === status;
      const matchesPayment = paymentStatus === "All Payment Statuses" || order.paymentStatus === paymentStatus;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, search, status, paymentStatus]);

  const resetFilters = () => {
    setSearch("");
    setStatus("All Statuses");
    setPaymentStatus("All Payment Statuses");
  };

  return (
    <>
      <OrdersFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        paymentStatus={paymentStatus}
        setPaymentStatus={setPaymentStatus}
        onReset={resetFilters}
      />

      {ordersLoading ? (
        <OrdersTableSkeleton />
      ) : (
        <OrdersTable orders={filteredOrders} />
      )}
    </>
  );
}
