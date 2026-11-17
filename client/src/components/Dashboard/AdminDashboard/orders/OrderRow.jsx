"use client";
import { ChevronDown, ChevronRight, ShoppingBag, UserRound, MapPin, CreditCard, Package } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useAdminContext } from "@/Context/Adminprovider";
import { AdminOnHoldModal, AdminOrderButton } from "@/index"
import { ordersGridCols } from "./ordersData";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/helper/getImage";

const orderStatusStyles = {
  pending: "bg-[var(--color-gold-light)] text-[var(--color-green-dark)]",
  onHold: "bg-[var(--color-red-light)] text-[var(--color-red)]",
  confirmed: "bg-[var(--color-green-light)] text-[var(--color-gold-light)]",
  shipped: "bg-[var(--color-gold-light)] text-[var(--color-green-dark)]",
  delivered: "bg-[var(--color-green)] text-white",
  cancelled: "bg-[var(--color-sand)] text-[var(--color-muted)]",
};

const paymentStatusStyles = {
  pending: "bg-[var(--color-gold-light)] text-[var(--color-green-dark)]",
  paid: "bg-[var(--color-green-light)] text-[var(--color-gold-light)]",
  failed: "bg-[var(--color-red-light)] text-[var(--color-red)]",
  refunded: "bg-[var(--color-sand)] text-[var(--color-muted)]",
};

const shippingDecisionStyles = {
  pending: "bg-[var(--color-gold-light)] text-[var(--color-green-dark)]",
  approved: "bg-[var(--color-green-light)] text-[var(--color-gold-light)]",
  rejected: "bg-[var(--color-red-light)] text-[var(--color-red)]",
};

function formatStatus(status) {
    if (!status) return "Unknown";

    return status
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStatusLabel(status, type, t) {
  if (!status) {
    return t("statuses.unknown");
  }

  const knownStatuses = {
    order: {
      pending: "statuses.order.pending",
      onHold: "statuses.order.onHold",
      confirmed: "statuses.order.confirmed",
      shipped: "statuses.order.shipped",
      delivered: "statuses.order.delivered",
      cancelled: "statuses.order.cancelled",
    },

    payment: {
      pending: "statuses.payment.pending",
      paid: "statuses.payment.paid",
      failed: "statuses.payment.failed",
      refunded: "statuses.payment.refunded",
    },

    shippingDecision: {
      pending: "statuses.shippingDecision.pending",
      approved: "statuses.shippingDecision.approved",
      rejected: "statuses.shippingDecision.rejected",
    },
  };

  const translationKey = knownStatuses[type]?.[status];

  return translationKey ? t(translationKey) : formatStatus(status);
}

function StatusBadge({ status, styles, label }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[9px] font-bold ${
        styles[status] ||
        "bg-[var(--color-sand)] text-[var(--color-muted)]"
      }`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
      {label}
    </span>
  );
}

function InfoBlock({ label, children }) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--color-muted)]">
        {label}
      </p>

      <div className="mt-1 break-words text-[12px] font-medium text-[var(--color-ink)]">
        {children}
      </div>
    </div>
  );
}

function formatDate(value, locale) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatMoney(amount, currency = "SAR", locale = "en") {
  const numericAmount = Number(amount || 0);

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch {
    return `${currency} ${numericAmount.toFixed(2)}`;
  }
}

function getProductTitle(productTitle, locale, fallback) {
  if (typeof productTitle === "string") {
    return productTitle;
  }

  if (productTitle && typeof productTitle === "object") {
    if (locale.startsWith("ar")) {
      return (productTitle.ar || productTitle.en || fallback);
    }

    return (productTitle.en || productTitle.ar || fallback);
  }

  return fallback;
}

function getProductId(item) {
  const product = item?.product;

  if (product && typeof product === "object") {
    return product._id || product.id || null;
  }

  return (product || item?.productId || null);
}

export default function OrderRow({ order, isExpanded, onToggle, productsData, onLoadMore }) {
  const t = useTranslations("Admin.orders");
  const locale = useLocale();
  const { activeOnHoldOrder, onHoldModalOpen, onHoldSubmitting, openOnHoldModal, closeOnHoldModal, approveOnHoldOrder, rejectOnHoldOrder, orderItems, orderItemsPagination, orderItemsLoading, loadMoreOrderItems } = useAdminContext();

  const isCurrentOnHoldOrder = activeOnHoldOrder?._id === order._id;

  const shippingInfo = order.shippingInfo || {};

  const customerName = [
    shippingInfo.firstName,
    shippingInfo.lastName,
  ].filter(Boolean).join(" ") || "—";

  const items = productsData?.items || [];
  const pagination = productsData?.pagination;
  const loading = productsData?.loading || false;
  const itemsCount = pagination?.total;

  const paymentStatusLabel = getStatusLabel(order.paymentStatus, "payment", t);
  const orderStatusLabel = getStatusLabel(order.orderStatus, "order", t);

  const shippingDecision = order.paymentStatus === "paid" ? order.shippingDecision : null;
  const shippingDecisionLabel = shippingDecision ? getStatusLabel(shippingDecision, "shippingDecision", t) : null;

  const money = (amount) => formatMoney(amount, order.currency || "SAR", locale);
  const date = (value) => formatDate(value, locale);

  return (
    <>
      <div className={`grid ${ordersGridCols} items-center gap-3 border-b border-[var(--color-divider)] px-4 py-3 transition-colors hover:bg-[var(--color-cream)]`}>
        <div>
          <button
            type="button"
            onClick={onToggle}
            aria-label={
              isExpanded ? t("row.collapseOrder") : t("row.expandOrder")
            }
            aria-expanded={isExpanded}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[var(--color-soft)] hover:bg-[var(--color-sand)]"
          >
            {isExpanded ? (
              <ChevronDown size={15} />
            ) : (
              <ChevronRight size={15} />
            )}
          </button>
        </div>

        <div className="min-w-0">
          <p className="truncate text-[12px] font-semibold text-[var(--color-ink)]">
            #{String(order._id || "").slice(-8) || "—"}
          </p>

          <p className="mt-1 truncate text-[9px] text-[var(--color-muted)]">
            {order.paymentId || t("row.noPaymentId")}
          </p>
        </div>

        <div className="min-w-0">
          <p className="truncate text-[12px] font-semibold text-[var(--color-ink)]">
            {customerName}
          </p>

          <p className="mt-1 truncate text-[10px] text-[var(--color-muted)]">
            {shippingInfo.phone || "—"}
          </p>

          <p className="truncate text-[10px] text-[var(--color-muted)]">
            {shippingInfo.city || "—"}
          </p>
        </div>

        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-sand)] px-2 py-1 text-[9px] font-bold text-[var(--color-green-dark)]">
            <Package size={10} />
            {order.totalItems ?? "—"}
          </span>
        </div>

        <div className="text-[10px] text-[var(--color-soft)]">
          {date(order.createdAt)}
        </div>

        <div className="text-[11px] font-semibold text-[var(--color-ink)]">
          {money(order.totalPrice)}
        </div>

        <div>
          <StatusBadge
            status={order.paymentStatus}
            styles={paymentStatusStyles}
            label={paymentStatusLabel}
          />
        </div>

        <div>
          <StatusBadge
            status={order.orderStatus}
            styles={orderStatusStyles}
            label={orderStatusLabel}
          />
        </div>

        <div>
          {shippingDecision ? (
            <StatusBadge
              status={shippingDecision}
              styles={shippingDecisionStyles}
              label={shippingDecisionLabel}
            />
          ) : (
            <span className="text-[11px] text-[var(--color-muted)]">
              —
            </span>
          )}
        </div>

        <div className="flex justify-center">
          <AdminOrderButton
            order={order}
            onOpen={openOnHoldModal}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="border-b border-[var(--color-divider)] bg-[var(--color-cream)] px-4 py-4 sm:px-5">
          <div className="grid min-w-0 grid-cols-1 gap-3 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:grid-cols-2 xl:grid-cols-3">
            <InfoBlock label={t("row.orderId")}>
              {order._id || "—"}
            </InfoBlock>

            <InfoBlock label={t("row.createdAt")}>
              {date(order.createdAt)}
            </InfoBlock>

            <InfoBlock label={t("row.paymentId")}>
              {order.paymentId || t("row.notAvailable")}
            </InfoBlock>

            <InfoBlock label={t("row.customerContact")}>
              <div className="flex items-start gap-2">
                <UserRound size={14} className="mt-0.5 shrink-0" />

                <div>
                  <p>{customerName}</p>

                  <p className="mt-1 text-[11px] text-[var(--color-muted)]">
                    {shippingInfo.phone || "—"}
                  </p>
                </div>
              </div>
            </InfoBlock>

            <InfoBlock label={t("row.shippingAddress")}>
              <div className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0" />

                <span>
                  {[shippingInfo.address, shippingInfo.city].filter(Boolean).join(", ") || "—"}
                </span>
              </div>
            </InfoBlock>

            <InfoBlock label={t("row.paymentOrderStatus")}>
              <div className="flex flex-wrap gap-2">
                <StatusBadge
                  status={order.paymentStatus}
                  styles={paymentStatusStyles}
                  label={paymentStatusLabel}
                />

                <StatusBadge
                  status={order.orderStatus}
                  styles={orderStatusStyles}
                  label={orderStatusLabel}
                />
              </div>
            </InfoBlock>

            <InfoBlock label={t("row.shippingDecision")}>
              {shippingDecision ? (
                <StatusBadge
                  status={shippingDecision}
                  styles={shippingDecisionStyles}
                  label={shippingDecisionLabel}
                />
              ) : (
                <span className="text-[11px] text-[var(--color-muted)]">
                  —
                </span>
              )}
            </InfoBlock>
          </div>

          <div className="mt-3 grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.5fr)_minmax(220px,1fr)]">
            <div className="min-w-0 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <h3 className="mb-3 flex items-center gap-2 text-[12px] font-semibold text-[var(--color-ink)]">
                <ShoppingBag size={15} />

                {t("row.orderItems", { count: itemsCount ?? items.length })}
              </h3>

              {loading && items.length === 0 ? (
                <p className="py-4 text-[11px] text-[var(--color-muted)]">
                  {t("row.loadingItems")}
                </p>
              ) : items.length === 0 ? (
                <p className="py-4 text-[11px] text-[var(--color-muted)]">
                  {t("row.noItems")}
                </p>
              ) : (
                  <div className="space-y-2">
                      {items.map((item) => {
                        const productId = getProductId(item);
                        const productTitle = getProductTitle(item.productTitle, locale, t("row.unnamedProduct"));
                        const imageUrl = item.mainImage ? getImageUrl(item.mainImage) : null;

                        return (
                            <div key={item._id} className="flex min-w-0 items-center justify-between gap-3 rounded-[10px] border border-[var(--color-divider)] bg-[var(--color-cream)] px-3 py-2.5">
                            <div className="flex min-w-0 items-start gap-2">
                              {imageUrl ? (
                                productId ? (
                                  <Link href={`/products/${productId}`} className="shrink-0">
                                    <Image
                                      src={imageUrl}
                                      alt={productTitle}
                                      width={40}
                                      height={40}
                                      className="rounded-md cursor-pointer object-cover hover:scale-105 transition duration-300"
                                    />
                                  </Link>
                                ) : (
                                  <Image
                                    src={imageUrl}
                                    alt={productTitle}
                                    width={40}
                                    height={40}
                                    className="shrink-0 rounded-md object-cover"
                                  />
                                )
                              ) : (
                                <Package size={15} className="mt-0.5 shrink-0 text-[var(--color-muted)]" />
                              )}

                                <div className="min-w-0">
                                    <p className="break-words text-[11px] font-semibold text-[var(--color-ink)]">
                                      {productTitle}
                                    </p>

                                    <p className="mt-1 text-[10px] text-[var(--color-muted)]">
                                      {t("row.quantity", { count: item.quantity })}
                                    </p>
                                </div>
                            </div>

                              <p className="shrink-0 text-[11px] font-semibold text-[var(--color-ink)]">
                                {money(item.subtotal)}
                              </p>
                          </div>
                      );
                    })}
                  </div>
                )}

                {pagination?.hasNextPage && (
                  <button
                    type="button"
                    onClick={onLoadMore}
                    disabled={loading}
                    className="mt-3 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-[11px] font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-sand)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? t("row.loading") : t("row.loadMoreItems")}
                  </button>
                )}
            </div>

            <div className="min-w-0 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <h3 className="mb-3 flex items-center gap-2 text-[12px] font-semibold text-[var(--color-ink)]">
                <CreditCard size={15} />
                {t("row.priceBreakdown")}
              </h3>

              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between gap-3">
                  <span className="text-[var(--color-muted)]">
                    {t("row.subtotal")}
                  </span>

                  <span>
                    {money(order.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-[var(--color-muted)]">
                    {t("row.tax")}
                  </span>

                  <span>
                    {money(order.tax)}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-[var(--color-muted)]">
                    {t("row.shipping")}
                  </span>

                  <span>
                    {money(order.shipping)}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                    <span className="text-[var(--color-muted)]">
                      {t("row.discount")}
                    </span>

                    <span>
                      {money(order.discount)}
                    </span>
                </div>

                <div className="flex justify-between gap-3 border-t border-[var(--color-divider)] pt-3 text-[13px] font-bold text-[var(--color-green-dark)]">
                  <span>
                    {t("row.total")}
                  </span>

                  <span>
                    {money(order.totalPrice)}
                  </span>
                </div>
              </div>
              </div>
          </div>
        </div>
      )}
      {isCurrentOnHoldOrder && onHoldModalOpen && (
        <AdminOnHoldModal
          order={activeOnHoldOrder}
          items={orderItems[activeOnHoldOrder._id] || []}
          pagination={orderItemsPagination[activeOnHoldOrder._id]}
          loading={Boolean(orderItemsLoading[activeOnHoldOrder._id])}
          submitting={onHoldSubmitting}
          onClose={closeOnHoldModal}
          onApprove={approveOnHoldOrder}
          onReject={rejectOnHoldOrder}
          onLoadMore={() => loadMoreOrderItems(activeOnHoldOrder._id)}
        />
      )}
    </>
  );
}