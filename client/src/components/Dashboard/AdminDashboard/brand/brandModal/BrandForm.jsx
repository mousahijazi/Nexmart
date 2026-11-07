"use client";
import { useTranslations } from "next-intl";
import { RHFerrors } from "@/index";

export default function BrandForm({ register, errors, inputClass, labelClass, sectionClass }) {
  const t = useTranslations("Admin.brands.modal.form");

  const textFields = [
    { label: t("nameEn.label"), name: "nameEn", placeholder: t("nameEn.placeholder") },
    { label: t("nameAr.label"), name: "nameAr", placeholder: t("nameAr.placeholder") },
    { label: t("descriptionEn.label"), name: "descriptionEn", placeholder: t("descriptionEn.placeholder"), textarea: true },
    { label: t("descriptionAr.label"), name: "descriptionAr", placeholder: t("descriptionAr.placeholder"), textarea: true },
  ];

  return (
    <div className={sectionClass}>
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {textFields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className={labelClass}>
                {field.label}
              </label>

              {field.textarea ? (
                <textarea
                  id={field.name}
                  dir="auto"
                  {...register(field.name)}
                  rows={3}
                  placeholder={field.placeholder}
                  className={`${inputClass} resize-none`}
                />
              ) : (
                <input
                  id={field.name}
                  type="text"
                  dir="auto"
                  {...register(field.name)}
                  placeholder={field.placeholder}
                  className={inputClass}
                />
              )}

              <RHFerrors errors={errors[field.name]} />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-field)] px-3.5 py-3">
          <div>
            <p className="text-sm font-medium text-[var(--color-ink)]">
              {t("activeBrand.title")}
            </p>

            <p className="mt-0.5 text-xs text-[var(--color-muted-3)]">
              {t("activeBrand.description")}
            </p>
          </div>

          <label className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center">
            <input
              type="checkbox"
              {...register("isActive")}
              className="peer sr-only"
            />

            <span className="absolute inset-0 rounded-full border border-[var(--color-border)] bg-[var(--color-field)] transition-colors peer-checked:border-[var(--color-green)] peer-checked:bg-[var(--color-green)]" />

            <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
          </label>
        </div>
      </div>
    </div>
  );
}