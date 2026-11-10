"use client";
import { Search, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { FilterSelect } from "@/index";
import { orderStatusOptions, paymentStatusOptions } from "./ordersData";

function formatOption(option) {
  if (option === "All Statuses" || option === "All Payment Statuses") {
    return option;
  }

  return option
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function OrdersFilters({ search, setSearch, status, setStatus, paymentStatus, setPaymentStatus, onReset }) {
  const t = useTranslations("Admin.orders");

  const orderStatusLabels = {
    "All Statuses": t("filters.allOrderStatuses"),
    pending: t("statuses.order.pending"),
    confirmed: t("statuses.order.confirmed"),
    shipped: t("statuses.order.shipped"),
    delivered: t("statuses.order.delivered"),
    cancelled: t("statuses.order.cancelled"),
  };

  const paymentStatusLabels = {
    "All Payment Statuses": t("filters.allPaymentStatuses"),
    pending: t("statuses.payment.pending"),
    paid: t("statuses.payment.paid"),
    failed: t("statuses.payment.failed"),
    refunded: t("statuses.payment.refunded"),
  };

  const translateOrderOption = (value) => orderStatusLabels[value] ?? formatOption(value);
  const translatePaymentOption = (value) => paymentStatusLabels[value] ?? formatOption(value);
  const orderOptions = orderStatusOptions.map(translateOrderOption);
  const paymentOptions = paymentStatusOptions.map(translatePaymentOption);

  const orderLabelMap = Object.fromEntries(
    orderStatusOptions.map((value) => [
      translateOrderOption(value),
      value,
    ])
  );

  const paymentLabelMap = Object.fromEntries(
    paymentStatusOptions.map((value) => [
      translatePaymentOption(value),
      value,
    ])
  );

  return (
    <section className="mb-5 min-w-0 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-2)]" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("filters.searchPlaceholder")}
            aria-label={t("filters.searchLabel")}
            className="w-full min-w-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-field)] py-2.5 pl-9 pr-3 text-[12px] text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted-2)] focus:border-[var(--color-green-light)]"
          />
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <FilterSelect
            label={t("filters.orderStatus")}
            value={translateOrderOption(status)}
            onChange={(value) => setStatus(orderLabelMap[value] ?? "")}
            options={orderOptions}
          />

          <FilterSelect
            label={t("filters.paymentStatus")}
            value={translatePaymentOption(paymentStatus)}
            onChange={(value) => setPaymentStatus(paymentLabelMap[value] ?? "")}
            options={paymentOptions}
          />

          <button
            type="button"
            onClick={onReset}
            aria-label={t("filters.reset")}
            title={t("filters.reset")}
            className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-soft)] transition hover:bg-[var(--color-sand)]"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}