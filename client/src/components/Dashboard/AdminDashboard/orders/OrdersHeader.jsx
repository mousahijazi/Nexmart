"use client";
import { Download, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useAdminContext } from "@/Context/Adminprovider";

export default function OrdersHeader() {
  const t = useTranslations("Admin.orders");
  const locale = useLocale();

  const { orders, ordersLoading } = useAdminContext();

  const exportOrders = () => {
    if (!orders.length || ordersLoading) return;

    const columns = [
      t("export.orderNumber"),
      t("export.customer"),
      t("export.phone"),
      t("export.total"),
      t("export.paymentStatus"),
      t("export.orderStatus"),
      t("export.createdAt"),
    ];

    const rows = orders.map((order) => {
      const shippingInfo = order.shippingInfo || {};

      const customer = [
        shippingInfo.firstName,
        shippingInfo.lastName,
      ].filter(Boolean).join(" ");

      return [
        order._id,
        customer,
        shippingInfo.phone || "",
        order.totalPrice,
        order.paymentStatus,
        order.orderStatus,
        order.createdAt,
      ];
    });

    const escapeCSV = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [columns, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `nexmart-orders-${locale}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

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
              {t("header.title")}
            </h1>
          </div>

          <p className="mt-2 max-w-[650px] text-[11px] leading-[1.45] text-[var(--color-soft-2)] sm:text-[13px]">
            {t("header.description")}
          </p>
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center gap-2 xl:w-auto">
        <button
          type="button"
          onClick={exportOrders}
          disabled={ordersLoading || orders.length === 0}
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-[11px] font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-sand)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download size={16} />
          {t("header.export")}
        </button>
      </div>
    </section>
  );
}
