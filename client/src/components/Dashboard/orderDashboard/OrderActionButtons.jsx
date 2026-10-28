"use client";
import { useOrdersContext } from "@/Context/OrdersContext";
import { Truck, Edit3, Trash2, Loader2 } from "lucide-react";

export default function OrderActionButtons({ order }) {
  const { openShippingModal, openItemsModal, cancelOrder, cancellingOrderId } = useOrdersContext();

  const isPending = order.orderStatus === "pending" && order.paymentStatus === "pending";
  const isCancelling = cancellingOrderId === order._id;

  if (!isPending) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 flex-wrap">
      <button
        type="button"
        onClick={() => openShippingModal(order)}
        title="تعديل الشحن"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-sand)] text-[var(--color-ink)] transition hover:opacity-80 cursor-pointer"
      >
        <Truck size={15} />
      </button>

      <button
        type="button"
        onClick={() => openItemsModal(order)}
        title="تعديل المنتجات"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-sand)] text-[var(--color-ink)] transition hover:opacity-80 cursor-pointer"
      >
        <Edit3 size={15} />
      </button>

      <button
        type="button"
        onClick={() => cancelOrder(order)}
        disabled={isCancelling}
        title="إلغاء الطلب"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 dark:border-red-950 dark:bg-red-950/40 dark:text-red-400 transition hover:opacity-80 cursor-pointer disabled:opacity-50"
      >
        {isCancelling ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <Trash2 size={15} />
        )}
      </button>
    </div>
  );
}