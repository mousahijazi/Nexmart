"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { BrandForm, BrandLogo, BrandModalFooter } from "@/index";
import { brandSchema } from "@/lib/schemas/brandSchema";
import { useAdminContext } from "@/Context/Adminprovider";
import { useAlertContext } from "@/Context/AlertProvider";

const inputClass = "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-field)] px-3 py-2.5 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-green-light)] placeholder:text-[var(--color-muted-2)]";
const labelClass = "mb-1.5 block text-xs font-medium text-[var(--color-soft-2)]";
const sectionClass = "rounded-2xl border border-[var(--color-border)] bg-[var(--color-cream)] p-4 sm:p-5";
const emptyValues = {
  nameEn: "",
  nameAr: "",
  isActive: true,
};

export default function BrandModal() {
  const { isBrandModalOpen, brandModalMode, editingBrand, closeBrandModal, addBrand, editBrand } = useAdminContext();
  const { showAlert } = useAlertContext();

  const isEdit = brandModalMode === "edit";

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting }} = useForm({resolver: zodResolver(brandSchema), defaultValues: emptyValues});

  useEffect(() => {
    if (!isBrandModalOpen) {
      return;
    }

    if (isEdit && editingBrand) {
      reset({
        nameEn: editingBrand.name?.en || "",
        nameAr: editingBrand.name?.ar || "",

        descriptionEn: editingBrand.name?.en || "",
        descriptionAr: editingBrand.name?.ar || "",

        isActive: editingBrand.isActive ?? true,
      });

      setExistingImage(editingBrand.logo || null);
    } else {
      reset(emptyValues);
      setExistingImage(null);
    }

    setImage(null);
    setImagePreview(null);
  }, [isBrandModalOpen, isEdit, editingBrand, reset]);

  if (!isBrandModalOpen) {
    return null;
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleRemoveExistingImage = () => {
    setExistingImage(null);
  };

  const onSubmit = async (values) => {
    const formData = new FormData();

    formData.append("nameAr", values.nameAr);
    formData.append("nameEn", values.nameEn);
    
    formData.append("descriptionAr", values.descriptionAr);
    formData.append("descriptionEn", values.descriptionEn);

    formData.append("isActive", String(values.isActive));

    if (isEdit && !existingImage && !image) {
      formData.append("removeLogo", "true");
    }

    if (image) {
      formData.append("logo", image);
    }

    const result = isEdit ? await editBrand(editingBrand._id, formData) : await addBrand(formData);

    if (result?.success) {
      showAlert(isEdit ? "تم تعديل البراند بنجاح" : "تمت إضافة البراند بنجاح", "success");
      closeBrandModal();
    } else {
      showAlert(result?.message || "حدث خطأ ما", "danger");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-[var(--color-cream)] shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-divider)] px-5 py-4 sm:px-6">
          <h2 className="text-base font-semibold text-[var(--color-ink)]">
            {isEdit ? "تعديل البراند" : "إضافة براند جديد"}
          </h2>

          <button
            type="button"
            onClick={closeBrandModal}
            disabled={isSubmitting}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] transition hover:bg-[var(--color-sand)] disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <form id="brand-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <BrandForm
              register={register}
              errors={errors}
              inputClass={inputClass}
              labelClass={labelClass}
              sectionClass={sectionClass}
            />

            <BrandLogo
              mode={brandModalMode}
              image={image}
              existingImage={existingImage}
              imagePreview={imagePreview}
              submitting={isSubmitting}
              handleImageChange={handleImageChange}
              handleRemoveImage={handleRemoveImage}
              handleRemoveExistingImage={handleRemoveExistingImage}
              labelClass={labelClass}
              sectionClass={sectionClass}
            />
          </form>
        </div>

        <BrandModalFooter
          isEdit={isEdit}
          submitting={isSubmitting}
          onClose={closeBrandModal}
        />
      </div>
    </div>
  );
}