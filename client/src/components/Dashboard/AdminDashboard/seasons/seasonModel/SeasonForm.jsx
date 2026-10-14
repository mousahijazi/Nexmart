"use client";
import { RHFerrors } from "@/index";

export default function SeasonForm({ register, errors, inputClass, labelClass, sectionClass }) {
  const textFields = [
    { label: "Name (English)", name: "nameEn", placeholder: "Season name" },
    { label: "الاسم (عربي)", name: "nameAr", placeholder: "اسم الموسم" },
    { label: "Description (English)", name: "descriptionEn", placeholder: "Season description", textarea: true },
    { label: "الوصف (عربي)", name: "descriptionAr", placeholder: "وصف الموسم", textarea: true },
  ];

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
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Start Date</label>
              <input type="date" {...register("startDate")} className={inputClass} />
              <RHFerrors errors={errors.startDate} />
            </div>

            <div>
              <label className={labelClass}>End Date</label>
              <input type="date" {...register("endDate")} className={inputClass} />
              <RHFerrors errors={errors.endDate} />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-field)] px-3.5 py-3">
            <div>
              <p className="text-sm font-medium text-[var(--color-ink)]">Active Season</p>
              <p className="mt-0.5 text-xs text-[var(--color-muted-3)]">
                Future seasons are activated automatically on their start date.
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