"use client";
import { useAdminContext } from "@/Context/Adminprovider";
import { OrdersFilters, OrdersTable } from "@/index";
import OrdersTableSkeleton from "./OrdersTableSkeleton";

export default function OrdersInteractive() {
  const { orders, ordersLoading, ordersSearch, searchOrders, ordersStatusFilter, filterOrdersByStatus, ordersPaymentFilter, filterOrdersByPaymentStatus, ordersPage, ordersLimit, ordersTotal, ordersTotalPages, changeOrdersPage } = useAdminContext();

  const resetFilters = () => {
    searchOrders("");
    filterOrdersByStatus("");
    filterOrdersByPaymentStatus("");
  };

  return (
    <>
      <OrdersFilters
          search={ordersSearch}
          setSearch={searchOrders}
          status={ordersStatusFilter || "All Statuses"}
          setStatus={(value) =>
            filterOrdersByStatus(value === "All Statuses" ? "" : value)
          }
          paymentStatus={ordersPaymentFilter || "All Payment Statuses"}
          setPaymentStatus={(value) =>
            filterOrdersByPaymentStatus(value === "All Payment Statuses" ? "" : value)
          }
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
