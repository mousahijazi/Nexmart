"use client";
import { useTranslations } from "next-intl";
import { useAdminContext } from "@/Context/Adminprovider";
import { OrdersFilters, OrdersTable } from "@/index";
import OrdersTableSkeleton from "./OrdersTableSkeleton";

export default function OrdersInteractive() {
  const {
    orders,
    ordersLoading,
    ordersSearch,
    searchOrders,
    ordersStats,
    ordersStatusFilter,
    filterOrdersByStatus,
    ordersPaymentFilter,
    filterOrdersByPaymentStatus,
    ordersPage,
    ordersLimit,
    ordersTotal,
    ordersTotalPages,
    changeOrdersPage,
  } = useAdminContext();

  const t = useTranslations("Admin.orders");
  const isOnHoldActive = ordersStatusFilter === "onHold";

  const resetFilters = () => {
    searchOrders("");
    filterOrdersByStatus("");
    filterOrdersByPaymentStatus("");
  };

  const toggleOnHoldFilter = () => {
    filterOrdersByStatus(isOnHoldActive ? "" : "onHold");
  };

  return (
    <>
      <OrdersFilters
        search={ordersSearch}
        setSearch={searchOrders}
        toggleOnHoldFilter={toggleOnHoldFilter}
        ordersStats={ordersStats}
        isOnHoldActive={isOnHoldActive}
        status={ordersStatusFilter || "All Statuses"}
        setStatus={(value) => filterOrdersByStatus(value === "All Statuses" ? "" : value)}
        paymentStatus={ordersPaymentFilter || "All Payment Statuses"}
        setPaymentStatus={(value) => filterOrdersByPaymentStatus(value === "All Payment Statuses" ? "" : value)}
        onReset={resetFilters}
      />

      {ordersLoading ? (
        <OrdersTableSkeleton />
      ) : (
        <OrdersTable
          orders={orders}
          page={ordersPage}
          limit={ordersLimit}
          total={ordersTotal}
          totalPages={ordersTotalPages}
          onPageChange={changeOrdersPage}
        />
      )}
    </>
  );
}