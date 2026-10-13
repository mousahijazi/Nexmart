"use client";
import { ChevronDown } from "lucide-react";
import { RHFerrors } from "@/index";

function getName(item, locale) {
  return item?.name?.[locale] || item?.name?.en || item?.name?.ar || item?.title?.[locale] || item?.title?.en || item?.title?.ar || "";
}

function SelectField({ label, name, register, errors, disabled, placeholder, options, locale, inputClass, labelClass }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>

      <div className="relative">
        <select {...register(name)} disabled={disabled} className={`${inputClass} appearance-none pr-8 disabled:opacity-60`}>
          <option value="">{disabled ? "Loading..." : placeholder}</option>
          {options.map((option) => (
            <option key={option._id} value={option._id}>
              {getName(option, locale)}
            </option>
          ))}
        </select>

        <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-muted-2)]" />
      </div>

      <RHFerrors errors={errors[name]} />
    </div>
  );
}

// دالة لتنسيق التاريخ لصيغة datetime-local
const toInput = (iso) => {
  if (!iso) return undefined;
  const date = new Date(iso);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

export default function OfferForm({ register, errors, watch, products, categories, seasons, locale, loadingOptions, inputClass, labelClass, sectionClass }) {
  const targetType = watch("targetType");
  const discountType = watch("type");
  const selectedSeasonId = watch("season");

  const selectedSeason = seasons.find((season) => season._id === selectedSeasonId);

  const nowInput = toInput(new Date());
  const seasonMin = selectedSeason ? toInput(selectedSeason.startDate) : nowInput;
  const seasonMax = selectedSeason ? toInput(selectedSeason.endDate) : undefined;

  const textFields = [
    { label: "Name (English)", name: "nameEn", placeholder: "Offer name" },
    { label: "الاسم (عربي)", name: "nameAr", placeholder: "اسم العرض" },
    { label: "Description (English)", name: "descriptionEn", placeholder: "Offer description", textarea: true },
    { label: "الوصف (عربي)", name: "descriptionAr", placeholder: "وصف العرض", textarea: true },
  ];

  const selectProps = { register, errors, locale, inputClass, labelClass };

  return (
    <div className="space-y-5">
      <div className={sectionClass}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {textFields.map((field) => (
            <div key={field.name}>
              <label className={labelClass}>{field.label}</label>

              {field.textarea ? (
                <textarea {...register(field.name)} rows={3} placeholder={field.placeholder} className={`${inputClass} resize-none`} />
              ) : (
                <input type="text" {...register(field.name)} placeholder={field.placeholder} className={inputClass} />
              )}

              <RHFerrors errors={errors[field.name]} />
            </div>
          ))}
        </div>
      </div>

      <div className={sectionClass}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Discount Type</label>
              <div className="relative">
                <select {...register("type")} className={`${inputClass} appearance-none pr-8`}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed amount (SAR)</option>
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-muted-2)]" />
              </div>
              <RHFerrors errors={errors.type} />
            </div>

            <div>
              <label className={labelClass}>
                Discount Value {discountType === "percentage" ? "(%)" : "(SAR)"}
              </label>

              <input
                type="number"
                {...register("discount", { setValueAs: (value) => (value === "" ? undefined : Number(value)) })}
                placeholder={discountType === "percentage" ? "25" : "50.00"}
                min="0"
                max={discountType === "percentage" ? "100" : undefined}
                step="0.01"
                className={inputClass}
              />

              <RHFerrors errors={errors.discount} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Target Type</label>

              <div className="relative">
                <select {...register("targetType")} className={`${inputClass} appearance-none pr-8`}>
                  <option value="product">Product</option>
                  <option value="category">Category</option>
                </select>

                <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-muted-2)]" />
              </div>

              <RHFerrors errors={errors.targetType} />
            </div>

            {targetType === "product" ? (
              <SelectField
                key="product"
                label="Product"
                name="product"
                placeholder="Select product"
                options={products}
                disabled={loadingOptions}
                {...selectProps}
              />
            ) : (
              <SelectField
                key="category"
                label="Category"
                name="category"
                placeholder="Select category"
                options={categories}
                disabled={loadingOptions}
                {...selectProps}
              />
            )}
          </div>

          <SelectField
            label="Season (optional)"
            name="season"
            placeholder="No season"
            options={seasons}
            disabled={loadingOptions}
            {...selectProps}
          />
        </div>
      </div>

      <div className={sectionClass}>
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Start Date</label>
              <input
                type="datetime-local"
                {...register("startDate")}
                min={seasonMin}
                max={seasonMax}
                className={inputClass}
              />
              <RHFerrors errors={errors.startDate} />
            </div>

            <div>
              <label className={labelClass}>End Date</label>
              <input
                type="datetime-local"
                {...register("endDate")}
                min={seasonMin}
                max={seasonMax}
                className={inputClass}
              />
              <RHFerrors errors={errors.endDate} />
            </div>
          </div>

          {selectedSeason && (
            <p className="-mt-2 text-xs text-[var(--color-muted-3)]">
              Offer dates must be within the season: {new Date(selectedSeason.startDate).toLocaleDateString("en-US")} – {new Date(selectedSeason.endDate).toLocaleDateString("en-US")}
            </p>
          )}

          <div className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-field)] px-3.5 py-3">
            <div>
              <p className="text-sm font-medium text-[var(--color-ink)]">Active Offer</p>
              <p className="mt-0.5 text-xs text-[var(--color-muted-3)]">
                Future offers are activated automatically on their start date.
              </p>
            </div>

            <label className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center">
              <input type="checkbox" {...register("isActive")} className="peer sr-only" />
              <span className="absolute inset-0 rounded-full border border-[var(--color-border)] bg-[var(--color-field)] transition-colors peer-checked:border-[var(--color-green)] peer-checked:bg-[var(--color-green)]" />
              <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}