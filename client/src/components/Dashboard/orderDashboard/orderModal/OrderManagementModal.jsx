"use client";
import { useEffect } from "react";
import { X, MapPin, Package } from "lucide-react";
import { OrderShippingForm, OrderItemsForm, OrderModalFooter } from "@/index";
import { useOrdersContext } from "@/Context/OrdersContext";

export default function OrderManagementModal() {
  const { activeOrder, modalMode, orderItems, loadingItems, submitting, error, closeOrderModal, saveShippingInfo, saveOrderItems } = useOrdersContext();

  useEffect(() => {
    if (!modalMode) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !submitting) {
        closeOrderModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalMode, submitting, closeOrderModal]);

  if (!activeOrder || !modalMode) return null;

  const isShipping = modalMode === "shipping";

  const handleSubmit = async (values) => {
    if (isShipping) {
      await saveShippingInfo(values);
      return;
    }

    await saveOrderItems(values);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) {
          closeOrderModal();
        }
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-cream)] shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-divider)] px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-sand)] text-[var(--color-green)]">
              {isShipping ? (
                <MapPin size={19} />
              ) : (
                <Package size={19} />
              )}
            </span>

            <div className="min-w-0">
              <h2 className="text-base font-semibold text-[var(--color-ink)]">
                {isShipping ? "تعديل بيانات الشحن" : "تعديل منتجات الطلب"}
              </h2>

              <p className="mt-1 truncate text-xs text-[var(--color-muted)]">
                رقم الطلب: {activeOrder._id}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeOrderModal}
            disabled={submitting}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--color-muted)] transition hover:bg-[var(--color-sand)] disabled:cursor-not-allowed"
            aria-label="إغلاق النافذة"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {error && (
            <div role="alert" className="mb-4 rounded-xl border border-[var(--color-red)]/30 bg-[var(--color-sand)] p-3 text-sm text-[var(--color-red)]">
              {error}
            </div>
          )}

          {isShipping ? (
            <OrderShippingForm
              order={activeOrder}
              onSave={handleSubmit}
              submitting={submitting}
            />
          ) : loadingItems ? (
            <div className="py-12 text-center text-sm text-[var(--color-muted)]">
              جارٍ تحميل عناصر الطلب...
            </div>
          ) : (
            <OrderItemsForm
              key={activeOrder._id}
              order={activeOrder}
              items={orderItems}
              onSave={handleSubmit}
              submitting={submitting}
            />
          )}
        </div>

        {!loadingItems && (
          <OrderModalFooter
            formId={
              isShipping ? "order-shipping-form" : "order-items-form"
            }
            submitting={submitting}
            onClose={closeOrderModal}
            submitLabel={
              isShipping ? "حفظ بيانات الشحن" : "حفظ تغييرات المنتجات"
            }
          />
        )}
      </div>
    </div>
  );
}