"use client";
import { useMemo, useState } from "react";
import { OrderRow, TablePagination } from "@/index";
import { ordersGridCols, ordersTableMinWidth } from "./ordersData";

export default function OrdersTable({ orders }) {
  const [openOrders, setOpenOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const totalPages = Math.max(1, Math.ceil(orders.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);

  const visibleOrders = useMemo(() => {
    const start = (safePage - 1) * rowsPerPage;
    return orders.slice(start, start + rowsPerPage);
  }, [orders, safePage, rowsPerPage]);

  // todo 
  const toggleOrder = (id) => {
    setOpenOrders((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  return (
    <section className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="min-w-0 overflow-x-auto scrollbar-thin">
        <div className={`${ordersTableMinWidth} w-full`}>
          <div className={`grid ${ordersGridCols} gap-3 bg-[var(--color-sand)] px-4 py-3 text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--color-soft)]`}>
            <span aria-label="Expand order" />
            <span>Order ID</span>
            <span>Customer</span>
            <span>Items</span>
            <span>Order Date</span>
            <span>Total</span>
            <span>Payment</span>
            <span>Order Status</span>
            <span>Actions</span>
          </div>

          {visibleOrders.length > 0 ? (
            visibleOrders.map((order) => (
              <OrderRow
                key={order._id}
                order={order}
                isExpanded={openOrders.includes(order._id)}
                onToggle={() => toggleOrder(order._id)}
              />
            ))
          ) : (
            <div className="flex min-h-[180px] items-center justify-center px-4 text-center text-[12px] text-[var(--color-muted)]">
              No orders found.
            </div>
          )}
        </div>
      </div>

      <TablePagination
        page={safePage}
        totalPages={totalPages}
        total={orders.length}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsChange={(value) => {
          setRowsPerPage(value);
          setPage(1);
        }}
        noun="orders"
      />
    </section>
  );
}
