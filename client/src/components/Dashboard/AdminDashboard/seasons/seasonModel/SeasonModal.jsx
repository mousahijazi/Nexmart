"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { SeasonForm, SeasonModalFooter } from "@/index";
import { seasonSchema } from "@/lib/schemas/seasonSchema";
import { useAdminContext } from "@/Context/Adminprovider";

const inputClass = "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-field)] px-3 py-2.5 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-green-light)] placeholder:text-[var(--color-muted-2)]";
const labelClass = "mb-1.5 block text-xs font-medium text-[var(--color-soft-2)]";
const sectionClass = "rounded-2xl border border-[var(--color-border)] bg-[var(--color-cream)] p-4 sm:p-5";

const emptyValues = {
  nameEn: "",
  nameAr: "",
  descriptionEn: "",
  descriptionAr: "",
  startDate: "",
  endDate: "",
  isActive: true,
};

const toDateInput = (iso) => (iso ? iso.slice(0, 10) : "");

export default function SeasonModal() {
  const { isSeasonModalOpen, seasonModalMode, editingSeason, closeSeasonModal, addSeason, editSeason } = useAdminContext();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(seasonSchema), defaultValues: emptyValues });
  const isEdit = seasonModalMode === "edit"

  useEffect(() => {
    if (!isSeasonModalOpen) return;

    if (isEdit && editingSeason) {
      reset({
        nameEn: editingSeason.name?.en || "",
        nameAr: editingSeason.name?.ar || "",
        descriptionEn: editingSeason.description?.en || "",
        descriptionAr: editingSeason.description?.ar || "",
        startDate: toDateInput(editingSeason.startDate),
        endDate: toDateInput(editingSeason.endDate),
        isActive: editingSeason.isActive ?? true,
      });
    } else {
      reset(emptyValues);
    }
  }, [isSeasonModalOpen, isEdit, editingSeason, reset]);

  if (!isSeasonModalOpen) {
    return null;
  }

  const onSubmit = async (values) => {
    const payload = {
      name: { en: values.nameEn, ar: values.nameAr },
      description: { en: values.descriptionEn || "", ar: values.descriptionAr || "" },
      startDate: `${values.startDate}T00:00:00.000Z`,
      endDate: `${values.endDate}T23:59:59.999Z`,
    };

    if (!isEdit || values.isActive !== editingSeason.isActive) {
      payload.isActive = values.isActive;
    }

    const result = isEdit ? await editSeason(editingSeason._id, payload) : await addSeason(payload);

    if (result?.success) {
      closeSeasonModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-[var(--color-cream)] shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-divider)] px-5 py-4 sm:px-6">
          <h2 className="text-base font-semibold text-[var(--color-ink)]">
            {isEdit ? "تعديل الموسم" : "إضافة موسم جديد"}
          </h2>

          <button
            type="button"
            onClick={closeSeasonModal}
            disabled={isSubmitting}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] transition hover:bg-[var(--color-sand)] disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <form id="season-form" onSubmit={handleSubmit(onSubmit)}>
            <SeasonForm
              register={register}
              errors={errors}
              inputClass={inputClass}
              labelClass={labelClass}
              sectionClass={sectionClass}
            />
          </form>
        </div>

        <SeasonModalFooter isEdit={isEdit} submitting={isSubmitting} onClose={closeSeasonModal} />
      </div>
    </div>
  );
}