"use client";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { OrderRow } from "@/index";
import { useAdminContext } from "@/Context/Adminprovider";
import { ordersGridCols, ordersTableMinWidth } from "./ordersData";

export default function OrdersTable({ orders, page, limit = 10, total, totalPages, onPageChange }) {
  const t = useTranslations("Admin.orders");
  const locale = useLocale();

  const [openOrders, setOpenOrders] = useState([]);

  const { orderItems, orderItemsPagination, orderItemsLoading, fetchOrderItems, loadMoreOrderItems } = useAdminContext();

  const numberFormat = new Intl.NumberFormat(locale);

  const toggleOrder = async (orderId) => {
    const isOpen = openOrders.includes(orderId);

    setOpenOrders((current) =>
      isOpen
        ? current.filter((id) => id !== orderId)
        : [...current, orderId]
    );

    if (!isOpen && !Object.prototype.hasOwnProperty.call(orderItems, orderId)) {
      await fetchOrderItems(orderId);
    }
  };

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <section className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="min-w-0 overflow-x-auto scrollbar-thin">
        <div className={`${ordersTableMinWidth} w-full`}>
          <div className={`grid ${ordersGridCols} gap-3 bg-[var(--color-sand)] px-4 py-3 text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--color-soft)]`}>
            <span aria-label={t("table.expandOrder")} />

            <span>{t("table.orderId")}</span>
            <span>{t("table.customer")}</span>
            <span>{t("table.items")}</span>
            <span>{t("table.orderDate")}</span>
            <span>{t("table.total")}</span>
            <span>{t("table.payment")}</span>
            <span>{t("table.orderStatus")}</span>
            <span>{t("table.actions")}</span>
          </div>

          {orders.length > 0 ? (
            orders.map((order) => (
              <OrderRow
                key={order._id}
                order={order}
                isExpanded={openOrders.includes(order._id)}
                onToggle={() => toggleOrder(order._id)}
                productsData={{
                  items: orderItems[order._id] || [],
                  pagination: orderItemsPagination[order._id],
                  loading: !!orderItemsLoading[order._id],
                }}
                onLoadMore={() => loadMoreOrderItems(order._id)}
              />
            ))
          ) : (
            <div className="flex min-h-[180px] items-center justify-center px-4 text-center text-[12px] text-[var(--color-muted)]">
              {t("table.empty")}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-[var(--color-divider)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] text-[var(--color-soft)]">
          {t("table.showing", {
            start: numberFormat.format(start),
            end: numberFormat.format(end),
            total: numberFormat.format(total),
          })}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-[10px] disabled:opacity-40"
          >
            {t("pagination.previous")}
          </button>

          <span className="text-[10px] text-[var(--color-soft)]">
            {numberFormat.format(page)} / {numberFormat.format(totalPages)}
          </span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-[10px] disabled:opacity-40"
          >
            {t("pagination.next")}
          </button>
        </div>
      </div>
    </section>
  );
}