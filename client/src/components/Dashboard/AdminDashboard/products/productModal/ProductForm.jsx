"use client";
import { ChevronDown } from "lucide-react";
import { RHFerrors } from "@/index";
import { useTranslations } from "next-intl";

export default function ProductForm({ register, errors, categories, brands, locale, loadingOptions, inputClass, labelClass, sectionClass }) {
  const t = useTranslations("Admin.products.productModal");

  const textFields = [
    {
      label: "fields.titleEn",
      name: "titleEn",
      placeholder: "placeholders.titleEn",
    },
    {
      label: "fields.titleAr",
      name: "titleAr",
      placeholder: "placeholders.titleAr",
    },
    {
      label: "fields.descriptionEn",
      name: "descriptionEn",
      placeholder: "placeholders.descriptionEn",
      textarea: true,
    },
    {
      label: "fields.descriptionAr",
      name: "descriptionAr",
      placeholder: "placeholders.descriptionAr",
      textarea: true,
    },
  ];

  const numberFields = [
    {
      label: "fields.price",
      name: "price",
      placeholder: "0.00",
      step: "0.01",
    },
    {
      label: "fields.stock",
      name: "stock",
      placeholder: "0",
    },
  ];

  const selectFields = [
    {
      label: "fields.category",
      name: "category",
      placeholder: "placeholders.category",
      options: categories,
    },
    {
      label: "fields.brand",
      name: "brand",
      placeholder: "placeholders.brand",
      options: brands,
    },
  ];

  const getLocalizedName = (option) => {
    if (typeof option.name === "string") {
      return option.name;
    }

    return (option.name?.[locale] || option.name?.en || option.name?.ar || "");
  };

  return (
    <div className={sectionClass}>
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {textFields.map((field) => (
            <div key={field.name}>
              <label className={labelClass}>
                {t(field.label)}
              </label>

              {field.textarea ? (
                <textarea
                  {...register(field.name)}
                  rows={4}
                  dir={field.name.endsWith("Ar") ? "rtl" : "ltr"}
                  placeholder={t(field.placeholder)}
                  className={`${inputClass} resize-none`}
                />
              ) : (
                <input
                  type="text"
                  {...register(field.name)}
                  dir={field.name.endsWith("Ar") ? "rtl" : "ltr"}
                  placeholder={t(field.placeholder)}
                  className={inputClass}
                />
              )}

              <RHFerrors errors={errors[field.name]} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {numberFields.map((field) => (
            <div key={field.name}>
              <label className={labelClass}>
                {t(field.label)}
              </label>

              <input
                type="number"
                {...register(field.name, {
                  setValueAs: (value) => value === "" ? undefined : Number(value),
                })}
                placeholder={field.placeholder}
                min="0"
                step={field.step}
                className={inputClass}
              />

              <RHFerrors errors={errors[field.name]} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {selectFields.map((field) => (
            <div key={field.name}>
              <label className={labelClass}>
                {t(field.label)}
              </label>

              <div className="relative">
                <select
                  {...register(field.name)}
                  disabled={loadingOptions}
                  className={`${inputClass} appearance-none pe-8 disabled:opacity-60`}
                >
                  <option value="">
                    {loadingOptions ? t("states.loading") : t(field.placeholder)}
                  </option>

                  {field.options.map((option) => (
                    <option key={option._id} value={option._id}>
                      {getLocalizedName(option)}
                    </option>
                  ))}
                </select>

                <ChevronDown size={14} className="pointer-events-none absolute end-2.5 top-1/2 -translate-y-1/2 text-[var(--color-muted-2)]" />
              </div>

              <RHFerrors errors={errors[field.name]} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
