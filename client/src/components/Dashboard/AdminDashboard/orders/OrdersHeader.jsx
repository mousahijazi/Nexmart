"use client";
import { Download, ShoppingBag } from "lucide-react";
import { mockOrders } from "./ordersData";

export default function OrdersHeader() {
  const exportOrders = () => {
    const columns = [
      "Order Number",
      "Customer",
      "Phone",
      "Total",
      "Payment Status",
      "Order Status",
      "Created At",
    ];

    const rows = mockOrders.map((order) => [
      order.orderNumber,
      order.customer,
      order.phone,
      order.totalPrice,
      order.paymentStatus,
      order.orderStatus,
      order.createdAt,
    ]);

    // todo
    const escapeCSV = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

    // todo
    const csv = [ columns, ...rows].map((row) => row.map(escapeCSV).join(",")).join("\r\n");

    // todo
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    // todo
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    // todo
    link.href = url;
    link.download = "nexmart-orders-demo.csv";
    link.click();

    // todo
    URL.revokeObjectURL(url);
  };

  return (
    <section className="mb-6 flex min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[var(--color-green-dark)] text-white">
          <ShoppingBag size={22} />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[25px] font-medium leading-none tracking-[-0.035em] text-[var(--color-ink)] sm:text-[29px]">
              Orders Management
            </h1>
          </div>

          <p className="mt-2 max-w-[650px] text-[11px] leading-[1.45] text-[var(--color-soft-2)] sm:text-[13px]">
            Review customer orders, monitor payment statuses, and track fulfillment.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center gap-2 xl:w-auto">
        <button
          type="button"
          onClick={exportOrders}
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-[11px] font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-sand)]"
        >
          <Download size={16} />
          Export Orders CSV
        </button>
      </div>
    </section>
  );
}
