"use client";
import { useEffect, useState } from "react";
import { Minus, Plus, Trash2, Package } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/helper/getImage";

const sectionClass = "rounded-2xl border border-[var(--color-border)] bg-[var(--color-cream)] p-4 sm:p-5";
const labelClass = "mb-1.5 block text-xs font-medium text-[var(--color-soft-2)]";
const inputClass = "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-field)] px-3 py-2.5 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-green-light)]";

const getProductId = (item) => {
  if (typeof item.product === "object") {
    return item.product?._id || item.product?.id || "";
  }

  return item.productId || item.product || item._id || "";
};

const getProductTitle = (item) => {
  if (typeof item.productTitle === "object") {
    return (item.productTitle?.ar || item.productTitle?.en || "منتج");
  }

  return item.productTitle || item.title || "منتج";
};

export default function OrderItemsForm({ items: initialItems, order, onSave, submitting }) {
  const [items, setItems] = useState([]);
  const [coupon, setCoupon] = useState("");

  useEffect(() => {
    setItems((initialItems || []).map((item) => ({
        productId: getProductId(item),
        productTitle: item.productTitle,
        mainImage: item.mainImage || null,
        price: item.price,
        quantity: Number(item.quantity) || 1,
    })));

    setCoupon(order?.couponCode || "");
  }, [initialItems, order]);

  const changeQuantity = (productId, amount) => {
    setItems((currentItems) => currentItems.map((item) => {
        if (item.productId !== productId) return item;

        return {
          ...item,
          quantity: Math.min(100, Math.max(1, item.quantity + amount)),
        };
    }));
  };

  const removeItem = (productId) => {
    setItems((currentItems) => currentItems.filter((item) => item.productId !== productId));
  };

  const submit = async (event) => {
    event.preventDefault();

    if (items.length === 0) {
      return;
    }

    if (items.some((item) => !item.productId)) {
      return;
    }

    await onSave({
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      coupon,
    });
  };

  return (
    <form id="order-items-form" onSubmit={submit} className="space-y-5">
      <div className={sectionClass}>
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[var(--color-ink)]">
            منتجات الطلب
          </h3>

          <p className="mt-1 text-xs leading-5 text-[var(--color-muted)]">
            عدّل الكميات أو احذف المنتجات، ثم احفظ التغييرات.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--color-border)] p-6 text-center">
            <Package
              size={26}
              className="mx-auto mb-2 text-[var(--color-muted-2)]"
            />

            <p className="text-sm text-[var(--color-soft-2)]">
              لم يتبقَّ أي منتج في الطلب.
            </p>

            <p className="mt-1 text-xs text-[var(--color-muted)]">
              لا يمكن حفظ طلب فارغ. استخدم زر إلغاء الطلب لإلغائه.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <article key={item.productId} className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-field)] p-3">
                {item.mainImage ? (
                  <Image
                    src={getImageUrl(item.mainImage)}
                    alt={getProductTitle(item)}
                    width={64}
                    height={64}
                    className="shrink-0 rounded-lg border border-[var(--color-border)] object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[var(--color-sand)] text-[var(--color-muted)]">
                    <Package size={22} />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-2 text-sm font-medium text-[var(--color-ink)]">
                    {getProductTitle(item)}
                  </h4>

                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    سعر الوحدة السابق:{" "}
                    {Number(item.price || 0).toFixed(2)} SAR
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => changeQuantity(item.productId, -1)}
                      disabled={submitting || item.quantity <= 1}
                      aria-label="تقليل الكمية"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-ink)] transition hover:bg-[var(--color-sand)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="min-w-6 text-center text-sm font-semibold text-[var(--color-ink)]">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => changeQuantity(item.productId, 1)}
                      disabled={submitting || item.quantity >= 100}
                      aria-label="زيادة الكمية"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-ink)] transition hover:bg-[var(--color-sand)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      disabled={submitting}
                      className="ms-auto flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium text-[var(--color-red)] transition hover:bg-[var(--color-sand)] disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                      حذف المنتج
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-5 border-t border-[var(--color-divider)] pt-4">
          <label className={labelClass}>
            رمز الخصم (اختياري)
          </label>

          <input
            type="text"
            value={coupon}
            onChange={(event) => setCoupon(event.target.value)}
            placeholder="أدخل رمز الخصم"
            disabled={submitting}
            className={inputClass}
          />

          <p className="mt-2 text-xs leading-5 text-[var(--color-muted)]">
            سيعيد الخادم حساب الأسعار والخصم والضريبة والشحن عند الحفظ.
          </p>
        </div>
      </div>
    </form>
  );
}