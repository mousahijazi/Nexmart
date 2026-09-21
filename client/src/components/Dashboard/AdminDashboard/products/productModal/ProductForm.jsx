"use client";
import { ChevronDown } from "lucide-react";
import { RHFerrors } from "@/index";

export default function ProductForm({ register, errors, categories, brands, locale, loadingOptions, inputClass, labelClass, sectionClass }) {
  const textFields = [
    {
      label: "Title (English)",
      name: "titleEn",
      placeholder: "Product name",
    },
    {
      label: "العنوان (عربي)",
      name: "titleAr",
      placeholder: "اسم المنتج",
    },
    {
      label: "Description (English)",
      name: "descriptionEn",
      placeholder: "Product description",
      textarea: true,
    },
    {
      label: "الوصف (عربي)",
      name: "descriptionAr",
      placeholder: "وصف المنتج",
      textarea: true,
    },
  ];

  const numberFields = [
    {
      label: "Price",
      name: "price",
      placeholder: "0.00",
      step: "0.01",
    },
    {
      label: "Stock Quantity",
      name: "stock",
      placeholder: "0",
    },
  ];

  const selectFields = [
    {
      label: "Category",
      name: "category",
      placeholder: "Select category",
      options: categories,
    },
    {
      label: "Brand",
      name: "brand",
      placeholder: "Select brand",
      options: brands,
    },
  ];
  
  return (
    <div className={sectionClass}>
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {textFields.map((field) => (
            <div key={field.name}>
              <label className={labelClass}>
                {field.label}
              </label>

              {field.textarea ? (
                <textarea
                  {...register(field.name)}
                  rows={4}
                  placeholder={field.placeholder}
                  className={`${inputClass} resize-none`}
                />
              ) : (
                <input
                  type="text"
                  {...register(field.name)}
                  placeholder={field.placeholder}
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
                {field.label}
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
                {field.label}
              </label>

              <div className="relative">
                <select
                  {...register(field.name)}
                  disabled={loadingOptions}
                  className={`${inputClass} appearance-none pr-8 disabled:opacity-60`}
                >
                  <option value="">
                    {loadingOptions ? "Loading..." : field.placeholder}
                  </option>

                  {field.options.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name?.[locale] || option.name?.en || option.nameEn || option.name?.ar || option.nameAr}
                    </option>
                  ))}
                </select>

                <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-muted-2)]" />
              </div>

              <RHFerrors errors={errors[field.name]} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}