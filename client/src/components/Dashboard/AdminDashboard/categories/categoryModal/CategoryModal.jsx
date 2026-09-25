"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { categorySchema } from "@/lib/schemas/categorySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { CategoryForm, CategoryImage, CategoryModalFooter } from "@/index";
import { useAdminContext } from "@/Context/Adminprovider";
import { useAlertContext } from "@/Context/AlertProvider";

const inputClass = "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-field)] px-3 py-2.5 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-green-light)] placeholder:text-[var(--color-muted-2)]";
const labelClass = "mb-1.5 block text-xs font-medium text-[var(--color-soft-2)]";
const sectionClass = "rounded-2xl border border-[var(--color-border)] bg-[var(--color-cream)] p-4 sm:p-5";

const emptyValues = {
  nameEn: "",
  nameAr: "",
  descriptionEn: "",
  descriptionAr: "",
  isActive: true,
};

export default function CategoryModal() {
  const { isCategoryModalOpen, categoryModalMode, editingCategory, closeCategoryModal, addCategory, editCategory } = useAdminContext();

  const { showAlert } = useAlertContext();

  const isEdit = categoryModalMode === "edit";

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(categorySchema), defaultValues: emptyValues });

  useEffect(() => {
    if (!isCategoryModalOpen) return;

    if (isEdit && editingCategory) {
      reset({
        nameEn: editingCategory.name?.en || "",
        nameAr: editingCategory.name?.ar || "",
        descriptionEn: editingCategory.description?.en || "",
        descriptionAr: editingCategory.description?.ar || "",
        isActive: editingCategory.isActive ?? true,
      });
      setExistingImage(editingCategory.image || null);
    } else {
      reset(emptyValues);
      setExistingImage(null);
    }

    setImage(null);
    setImagePreview(null);
  }, [isCategoryModalOpen, isEdit, editingCategory, reset]);

  if (!isCategoryModalOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      formData.append("removeImage", "true");
    }

    if (image) {
      formData.append("image", image);
    }

    const result = isEdit ? await editCategory(editingCategory._id, formData) : await addCategory(formData);

    if (result?.success) {
      showAlert("تمت إضافة الصنف بنجاح", "success");
      closeCategoryModal();
    } else {
      showAlert(result?.message || "حدث خطأ ما", "danger");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-[var(--color-cream)] shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-divider)] px-5 py-4 sm:px-6">
          <h2 className="text-base font-semibold text-[var(--color-ink)]">
            {isEdit ? "تعديل الصنف" : "إضافة صنف جديد"}
          </h2>

          <button
            type="button"
            onClick={closeCategoryModal}
            disabled={isSubmitting}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] transition hover:bg-[var(--color-sand)] disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <form id="category-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <CategoryForm
              register={register}
              errors={errors}
              inputClass={inputClass}
              labelClass={labelClass}
              sectionClass={sectionClass}
            />

            <CategoryImage
              mode={categoryModalMode}
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

        <CategoryModalFooter
          isEdit={isEdit}
          submitting={isSubmitting}
          onClose={closeCategoryModal}
        />
      </div>
    </div>
  );
}