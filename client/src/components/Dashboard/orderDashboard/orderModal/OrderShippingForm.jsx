"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderShippingSchema } from "@/lib/schemas/orderShippingSchema";

const inputClass = "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-field)] px-3 py-2.5 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-green-light)] placeholder:text-[var(--color-muted-2)]";
const labelClass = "mb-1.5 block text-xs font-medium text-[var(--color-soft-2)]";
const sectionClass = "rounded-2xl border border-[var(--color-border)] bg-[var(--color-cream)] p-4 sm:p-5";

const emptyValues = {
  firstName: "",
  lastName: "",
  phone: "",
  city: "",
  address: "",
  notes: "",
};

export default function OrderShippingForm({ order, onSave, submitting }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(orderShippingSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    reset({
      firstName: order?.shippingInfo?.firstName || "",
      lastName: order?.shippingInfo?.lastName || "",
      phone: order?.shippingInfo?.phone || "",
      city: order?.shippingInfo?.city || "",
      address: order?.shippingInfo?.address || "",
      notes: order?.shippingInfo?.notes || "",
    });
  }, [order, reset]);

  const submit = async (values) => {
    await onSave({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      phone: values.phone.trim(),
      city: values.city.trim(),
      address: values.address.trim(),
      notes: values.notes.trim(),
    });
  };

  const fields = [
    {
      name: "firstName",
      label: "الاسم الأول",
      placeholder: "أدخل الاسم الأول",
    },
    {
      name: "lastName",
      label: "اسم العائلة",
      placeholder: "أدخل اسم العائلة",
    },
    {
      name: "phone",
      label: "رقم الهاتف",
      placeholder: "أدخل رقم الهاتف",
    },
    {
      name: "city",
      label: "المدينة",
      placeholder: "أدخل المدينة",
    },
  ];

  return (
    <form id="order-shipping-form" onSubmit={handleSubmit(submit)} className="space-y-5">
      <div className={sectionClass}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.name}>
              <label className={labelClass}>
                {field.label}
              </label>

              <input
                {...register(field.name)}
                type={field.name === "phone" ? "tel" : "text"}
                placeholder={field.placeholder}
                disabled={submitting}
                className={inputClass}
              />

              {errors[field.name] && (
                <p className="mt-1 text-xs text-[var(--color-red)]">
                  {errors[field.name].message}
                </p>
              )}
            </div>
          ))}

          <div className="sm:col-span-2">
            <label className={labelClass}>
              العنوان بالتفصيل
            </label>

            <input
              {...register("address")}
              placeholder="المنطقة، الشارع، وأي تفاصيل مهمة"
              disabled={submitting}
              className={inputClass}
            />

            {errors.address && (
              <p className="mt-1 text-xs text-[var(--color-red)]">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass}>
              ملاحظات إضافية (اختياري)
            </label>

            <textarea
              {...register("notes")}
              rows={3}
              placeholder="ملاحظات للمندوب..."
              disabled={submitting}
              className={`${inputClass} resize-none`}
            />

            {errors.notes && (
              <p className="mt-1 text-xs text-[var(--color-red)]">
                {errors.notes.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}