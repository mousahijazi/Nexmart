"use client";
import { ChevronDown } from "lucide-react";
import { RHFerrors } from "@/index";
import { useTranslations } from "next-intl";

function getName(item, locale) {
  return item?.name?.[locale] || item?.name?.en || item?.name?.ar || item?.title?.[locale] || item?.title?.en || item?.title?.ar || "";
}

function SelectField({ label, name, register, errors, disabled, placeholder, options, locale, inputClass, labelClass }) {
  const t = useTranslations("Admin.offers.modal");

  return (
    <div>
      <label className={labelClass}>{label}</label>

      <div className="relative">
        <select {...register(name)} disabled={disabled} className={`${inputClass} appearance-none pr-8 disabled:opacity-60`}>
          <option value="">{disabled ? t("loading") : placeholder}</option>
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

const toInput = (iso) => {
  if (!iso) return undefined;
  const date = new Date(iso);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

export default function OfferForm({ register, errors, watch, products, categories, seasons, locale, loadingOptions, inputClass, labelClass, sectionClass }) {
  const t = useTranslations("Admin.offers.modal.form");
  const targetType = watch("targetType");
  const discountType = watch("type");
  const selectedSeasonId = watch("season");

  const selectedSeason = seasons.find((season) => season._id === selectedSeasonId);

  const nowInput = toInput(new Date());
  const seasonMin = selectedSeason ? toInput(selectedSeason.startDate) : nowInput;
  const seasonMax = selectedSeason ? toInput(selectedSeason.endDate) : undefined;

  const textFields = [
    { label: t("fields.nameEn"), name: "nameEn", placeholder: t("placeholders.nameEn") },
    { label: t("fields.nameAr"), name: "nameAr", placeholder: t("placeholders.nameAr") },
    { label: t("fields.descriptionEn"), name: "descriptionEn", placeholder: t("placeholders.descriptionEn"), textarea: true },
    { label: t("fields.descriptionAr"), name: "descriptionAr", placeholder: t("placeholders.descriptionAr"), textarea: true },
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
              <label className={labelClass}>{t("discountType")}</label>
              <div className="relative">
                <select {...register("type")} className={`${inputClass} appearance-none pr-8`}>
                  <option value="percentage">{t("discountTypes.percentage")}</option>
                  <option value="fixed">{t("discountTypes.fixed")}</option>
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-muted-2)]" />
              </div>
              <RHFerrors errors={errors.type} />
            </div>

            <div>
              <label className={labelClass}>
                {t("discountValue")} {discountType === "percentage" ? "(%)" : "(SAR)"}
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
              <label className={labelClass}>{t("targetType")}</label>

              <div className="relative">
                <select {...register("targetType")} className={`${inputClass} appearance-none pr-8`}>
                  <option value="product">{t("targets.product")}</option>
                  <option value="category">{t("targets.category")}</option>
                </select>

                <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-muted-2)]" />
              </div>

              <RHFerrors errors={errors.targetType} />
            </div>

            {targetType === "product" ? (
              <SelectField
                key="product"
                label={t("product")}
                name="product"
                placeholder={t("placeholders.selectProduct")}
                options={products}
                disabled={loadingOptions}
                {...selectProps}
              />
            ) : (
              <SelectField
                key="category"
                label={t("category")}
                name="category"
                placeholder={t("placeholders.selectCategory")}
                options={categories}
                disabled={loadingOptions}
                {...selectProps}
              />
            )}
          </div>

          <SelectField
            label={t("season")}
            name="season"
            placeholder={t("placeholders.noSeason")}
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
              <label className={labelClass}>{t("startDate")}</label>
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
              <label className={labelClass}>{t("endDate")}</label>
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
              {t("seasonDateNotice", {
                start: new Date(selectedSeason.startDate).toLocaleDateString(locale),
                end: new Date(selectedSeason.endDate).toLocaleDateString(locale),
              })}
            </p>
          )}

          <div className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-field)] px-3.5 py-3">
            <div>
              <p className="text-sm font-medium text-[var(--color-ink)]">{t("activeOffer")}</p>
              <p className="mt-0.5 text-xs text-[var(--color-muted-3)]">
                {t("activeOfferDescription")}
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