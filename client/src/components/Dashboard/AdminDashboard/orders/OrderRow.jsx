"use client";
import { ChevronDown, ChevronRight, ShoppingBag, UserRound, MapPin, CreditCard, Package } from "lucide-react";
import { ordersGridCols } from "./ordersData";

const orderStatusStyles = {
  pending: "bg-[var(--color-gold-light)] text-[var(--color-green-dark)]",
  confirmed: "bg-[var(--color-green-light)] text-[var(--color-green-dark)]",
  shipped: "bg-[var(--color-gold-light)] text-[var(--color-green-dark)]",
  delivered: "bg-[var(--color-green)] text-white",
  cancelled: "bg-[var(--color-sand)] text-[var(--color-muted)]",
};

const paymentStatusStyles = {
  pending: "bg-[var(--color-gold-light)] text-[var(--color-green-dark)]",
  paid: "bg-[var(--color-green-light)] text-[var(--color-green-dark)]",
  failed: "bg-[var(--color-red-light)] text-[var(--color-red)]",
  refunded: "bg-[var(--color-sand)] text-[var(--color-muted)]",
};

// todo
function formatStatus(status) {
    if (!status) return "Unknown";

    return status
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function StatusBadge({ status, styles }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[9px] font-bold ${
          styles[status] ||
          "bg-[var(--color-sand)] text-[var(--color-muted)]"
      }`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
      {formatStatus(status)}
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

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
  });
}

function formatMoney(amount, currency = "SAR") {
  return `${currency} ${Number(amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getProductTitle(productTitle) {
  if (typeof productTitle === "string") {
    return productTitle;
  }

  if (productTitle && typeof productTitle === "object") {
    return productTitle.en || productTitle.ar || "Unnamed product";
  }

  return "Unnamed product";
}

export default function OrderRow({ order, isExpanded, onToggle, productsData, onLoadMore }) {
  const shippingInfo = order.shippingInfo || {};
  const customerName = [shippingInfo.firstName, shippingInfo.lastName].filter(Boolean).join(" ") || "—";

  const items = productsData?.items || [];
  const pagination = productsData?.pagination;
  const loading = productsData?.loading || false;

  const itemsCount = pagination?.total;

  return (
    <>
      <div className={`grid ${ordersGridCols} items-center gap-3 border-b border-[var(--color-divider)] px-4 py-3 transition-colors hover:bg-[var(--color-cream)]`}>
        <div>
          <button
            type="button"
            onClick={onToggle}
            aria-label={isExpanded ? "Collapse order" : "Expand order"}
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
            {order.paymentId || "No payment ID"}
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
            {itemsCount ?? "—"}
          </span>
        </div>

        <div className="text-[10px] text-[var(--color-soft)]">
          {formatDate(order.createdAt)}
        </div>

        <div className="text-[11px] font-semibold text-[var(--color-ink)]">
          {formatMoney(order.totalPrice, order.currency)}
        </div>

        <div>
            <StatusBadge status={order.paymentStatus} styles={paymentStatusStyles} />
        </div>

        <div>
            <StatusBadge status={order.orderStatus} styles={orderStatusStyles} />
        </div>

        <div className="flex justify-center">
          <span className="text-[var(--color-muted)]">—</span>
        </div>
      </div>

      {isExpanded && (
        <div className="border-b border-[var(--color-divider)] bg-[var(--color-cream)] px-4 py-4 sm:px-5">
          <div className="grid min-w-0 grid-cols-1 gap-3 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:grid-cols-2 xl:grid-cols-3">
            <InfoBlock label="Order ID">
              {order._id || "—"}
            </InfoBlock>

            <InfoBlock label="Created At">
              {formatDate(order.createdAt)}
            </InfoBlock>

            <InfoBlock label="Payment ID">
              {order.paymentId || "Not available"}
            </InfoBlock>

              <InfoBlock label="Customer & Contact">
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

              <InfoBlock label="Shipping Address">
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="mt-0.5 shrink-0" />
                  <span>
                    {[shippingInfo.address, shippingInfo.city].filter(Boolean).join(", ") || "—"}
                  </span>
                </div>
              </InfoBlock>

              <InfoBlock label="Payment & Order Status">
                <div className="flex flex-wrap gap-2">
                    <StatusBadge status={order.paymentStatus} styles={paymentStatusStyles} />
                    <StatusBadge status={order.orderStatus} styles={orderStatusStyles} />
                </div>
              </InfoBlock>
            </div>

            <div className="mt-3 grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.5fr)_minmax(220px,1fr)]">
              
              <div className="min-w-0 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <h3 className="mb-3 flex items-center gap-2 text-[12px] font-semibold text-[var(--color-ink)]">
                  <ShoppingBag size={15} />
                  Order Items ({itemsCount ?? items.length})
                </h3>

                {loading && items.length === 0 ? (
                  <p className="py-4 text-[11px] text-[var(--color-muted)]">
                    Loading order items...
                  </p>
                ) : items.length === 0 ? (
                  <p className="py-4 text-[11px] text-[var(--color-muted)]">
                    No order items found.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item._id} className="flex min-w-0 items-center justify-between gap-3 rounded-[10px] border border-[var(--color-divider)] bg-[var(--color-cream)] px-3 py-2.5">
                        
                        <div className="flex min-w-0 items-start gap-2">
                          <Package size={15} className="mt-0.5 shrink-0 text-[var(--color-muted)]" />
                          <div className="min-w-0">
                              <p className="break-words text-[11px] font-semibold text-[var(--color-ink)]">
                                {getProductTitle(item.productTitle)}
                              </p>
                              <p className="mt-1 text-[10px] text-[var(--color-muted)]">
                                Qty: {item.quantity}
                              </p>
                          </div>
                        </div>

                        <p className="shrink-0 text-[11px] font-semibold text-[var(--color-ink)]">
                          {formatMoney(item.subtotal, order.currency)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {pagination?.hasNextPage && (
                  <button
                    type="button"
                    onClick={onLoadMore}
                    disabled={loading}
                    className="mt-3 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-[11px] font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-sand)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Loading..." : "Load more items"}
                  </button>
                )}
              </div>

              <div className="min-w-0 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <h3 className="mb-3 flex items-center gap-2 text-[12px] font-semibold text-[var(--color-ink)]">
                  <CreditCard size={15} />
                  Price Breakdown
                </h3>

                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between gap-3">
                    <span className="text-[var(--color-muted)]">Subtotal</span>
                    <span>{formatMoney(order.subtotal, order.currency)}</span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-[var(--color-muted)]">Tax</span>
                    <span>{formatMoney(order.tax, order.currency)}</span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-[var(--color-muted)]">Shipping</span>
                    <span>{formatMoney(order.shipping, order.currency)}</span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-[var(--color-muted)]">Discount</span>
                    <span>{formatMoney(order.discount, order.currency)}</span>
                  </div>

                  <div className="flex justify-between gap-3 border-t border-[var(--color-divider)] pt-3 text-[13px] font-bold text-[var(--color-green-dark)]">
                    <span>Total</span>
                    <span>{formatMoney(order.totalPrice, order.currency)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
      )}
    </>
  );
}
