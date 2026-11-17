"use client";
import { Search, RotateCcw, PauseCircle } from "lucide-react";
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

export default function OrdersFilters({ search, setSearch, toggleOnHoldFilter, isOnHoldActive, ordersStats, status, setStatus, paymentStatus, setPaymentStatus, onReset }) {
  const t = useTranslations("Admin.orders");

  const orderStatusLabels = {
    "All Statuses": t("filters.allOrderStatuses"),
    pending: t("statuses.order.pending"),
    onHold: t("statuses.order.onHold"),
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
      <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-center">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={toggleOnHoldFilter}
            aria-pressed={isOnHoldActive}
            className={`inline-flex min-h-[40px] w-full shrink-0 items-center justify-center gap-2 rounded-xl border px-4 text-[11px] font-semibold transition sm:w-auto ${
              isOnHoldActive
                ? "border-[var(--color-green-dark)] bg-[var(--color-green-dark)] text-white"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-sand)]"
            }`}
          >
            <PauseCircle size={15} />
            <span>{t("statuses.order.onHold")}</span>
            <span className="rounded-full bg-black/10 px-2 py-0.5 text-[10px]">
              {ordersStats?.onHold ?? 0}
            </span>
          </button>

          <div className="relative min-w-0 flex-1">
            <Search size={15} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-2)]" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("filters.searchPlaceholder")}
              aria-label={t("filters.searchLabel")}
              className="w-full min-w-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-field)] py-2.5 pe-3 ps-9 text-[12px] text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted-2)] focus:border-[var(--color-green-light)]"
            />
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto] xl:flex xl:shrink-0 xl:items-center">
          <div className="min-w-0">
            <FilterSelect
              label={t("filters.orderStatus")}
              value={translateOrderOption(status)}
              onChange={(value) => setStatus(orderLabelMap[value] ?? "")}
              options={orderOptions}
            />
          </div>

          <div className="min-w-0">
            <FilterSelect
              label={t("filters.paymentStatus")}
              value={translatePaymentOption(paymentStatus)}
              onChange={(value) => setPaymentStatus(paymentLabelMap[value] ?? "")}
              options={paymentOptions}
            />
          </div>

          <button
            type="button"
            onClick={onReset}
            aria-label={t("filters.reset")}
            title={t("filters.reset")}
            className="flex h-[40px] w-full shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-soft)] transition hover:bg-[var(--color-sand)] sm:w-[40px]"
          >
            <RotateCcw size={15} />
          </button>
        </div>

      </div>
    </section>
  );
}