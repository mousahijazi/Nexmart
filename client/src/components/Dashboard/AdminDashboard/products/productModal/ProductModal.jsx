"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createProduct, updateProduct } from "@/helper/fetchApi";
import { useAdminContext } from "@/Context/Adminprovider";
import ProductForm from "./ProductForm";
import ProductImages from "./ProductImages";
import ProductModalFooter from "./ProductModalFooter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productFormSchema } from "@/lib/schemas/productSchema";
import { useAlertContext } from "@/Context/AlertProvider";
import { useLocale, useTranslations } from "next-intl";

const EMPTY_FORM = {
  titleAr: "",
  titleEn: "",
  descriptionAr: "",
  descriptionEn: "",
  price: "",
  stock: "",
  category: "",
  brand: "",
};

export default function ProductModal() {
  const { isProductModalOpen, productModalMode, editingProduct, closeProductModal, refreshProducts, categories, brands, categoriesLoading, brandsLoading } = useAdminContext();

  const locale = useLocale();
  const t = useTranslations("Admin.products.productModal");
  const { showAlert } = useAlertContext();

  const isEdit = productModalMode === "edit";
  const loadingOptions = categoriesLoading || brandsLoading;

  const { register, reset, handleSubmit, formState: { errors, isSubmitting }} = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: EMPTY_FORM,
  });

  const [mainImage, setMainImage] = useState(null);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (!isProductModalOpen) return;

    if (!isEdit || !editingProduct) {
      reset(EMPTY_FORM);

      setMainImage(null);
      setImages([]);
      setExistingImages([]);
      setMainImagePreview(null);
      setImagePreviews([]);

      return;
    }

    reset({
      titleAr: editingProduct.title?.ar || "",
      titleEn: editingProduct.title?.en || "",
      descriptionAr: editingProduct.description?.ar || "",
      descriptionEn: editingProduct.description?.en || "",
      price: editingProduct.price ?? "",
      stock: editingProduct.stock ?? "",
      category: editingProduct.category?._id || editingProduct.category || "",
      brand: editingProduct.brand?._id || editingProduct.brand || "",
    });

    setExistingImages(editingProduct.images || []);

    setMainImage(null);
    setImages([]);
    setImagePreviews([]);
    setMainImagePreview(editingProduct.mainImage || null);
  }, [isProductModalOpen, isEdit, editingProduct, reset]);

  useEffect(() => {
    if (!mainImage) {
      if (isEdit) {
        setMainImagePreview(editingProduct?.mainImage || null);
      } else {
        setMainImagePreview(null);
      }

      return;
    }

    const url = URL.createObjectURL(mainImage);
    setMainImagePreview(url);

    return () => URL.revokeObjectURL(url);
  }, [mainImage, isEdit, editingProduct]);

  useEffect(() => {
    if (images.length === 0) {
      setImagePreviews([]);
      return;
    }

    const urls = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  useEffect(() => {
    if (!isProductModalOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSubmitting) {
        closeProductModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProductModalOpen, isSubmitting, closeProductModal]);

  useEffect(() => {
    if (!isProductModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isProductModalOpen]);

  const handleMainImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setMainImage(file);
  };

  const handleImagesChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    const availableSlots = 4 - existingImages.length;
    const remainingSlots = Math.max(availableSlots - images.length, 0);

    const newFiles = selectedFiles.slice(0, remainingSlots);

    setImages((prev) => [...prev, ...newFiles]);

    event.target.value = "";
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, imageIndex) => imageIndex !== index));
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  const onSubmit = async (data) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      showAlert(t("messages.authRequired"), "danger");
      return;
    }

    if (!isEdit && !mainImage) {
      showAlert(t("messages.mainImageRequired"), "danger");
      return;
    }

    const formData = new FormData();

    formData.append("titleAr", data.titleAr);
    formData.append("titleEn", data.titleEn);
    formData.append("descriptionAr", data.descriptionAr);
    formData.append("descriptionEn", data.descriptionEn);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("category", data.category);
    formData.append("brand", data.brand);

    if (mainImage) {
      formData.append("mainImage", mainImage);
    }

    if (isEdit) {
      formData.append("existingImages", JSON.stringify(existingImages));
    }

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const result = isEdit
        ? await updateProduct(editingProduct._id, formData, token)
        : await createProduct(formData, token);

      if (!result.success) {
        showAlert(result.message || t(isEdit ? "messages.updateFailed" : "messages.createFailed"), "danger");
        return;
      }

      const productName = locale === "ar" ? data.titleAr : data.titleEn;

      showAlert(t(isEdit ? "messages.updated" : "messages.created", { name: productName }));

      refreshProducts();
      closeProductModal();
    } catch (error) {
      console.error(isEdit ? "Failed to update product:" : "Failed to create product:", error);

      showAlert(t(isEdit ? "messages.updateFailed" : "messages.createFailed"),"danger");
    }
  };

  if (!isProductModalOpen) return null;

  const inputClass = "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-field)] px-3.5 py-2.5 text-sm text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted-3)] focus:border-[var(--color-green-light)] focus:ring-2 focus:ring-[var(--color-green-light)]/20";
  const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted-2)]";
  const sectionClass = "rounded-2xl border border-[var(--color-border)] bg-[var(--color-field)]/40 p-4 sm:p-5";

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 backdrop-blur-[2px] sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          closeProductModal();
        }
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-divider)] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-green-dark)] text-white">
              <span className="text-sm font-bold">N</span>
            </div>

            <div>
              <h2 className="text-base font-semibold text-[var(--color-ink)] sm:text-lg">
                {t(isEdit ? "header.editTitle" : "header.createTitle")}
              </h2>

              <p className="mt-0.5 text-xs text-[var(--color-muted-2)]">
                {t(isEdit ? "header.editDescription" : "header.createDescription")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeProductModal}
            disabled={isSubmitting}
            className="rounded-lg p-1.5 text-[var(--color-muted-2)] transition hover:bg-[var(--color-sand)] disabled:opacity-40"
            aria-label={t("actions.close")}
          >
            <X size={18} />
          </button>
        </div>

        <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto px-5 py-5 sm:px-6">
          <div className="space-y-5">
            <ProductForm
              register={register}
              errors={errors}
              categories={categories}
              brands={brands}
              locale={locale}
              loadingOptions={loadingOptions}
              inputClass={inputClass}
              labelClass={labelClass}
              sectionClass={sectionClass}
            />

            <ProductImages
              mode={productModalMode}
              mainImage={mainImage}
              images={images}
              existingImages={existingImages}
              mainImagePreview={mainImagePreview}
              imagePreviews={imagePreviews}
              submitting={isSubmitting}
              handleMainImageChange={handleMainImageChange}
              handleImagesChange={handleImagesChange}
              handleRemoveImage={handleRemoveImage}
              handleRemoveExistingImage={handleRemoveExistingImage}
              labelClass={labelClass}
              sectionClass={sectionClass}
            />
          </div>
        </form>

        <ProductModalFooter
          isEdit={isEdit}
          submitting={isSubmitting}
          loadingOptions={loadingOptions}
          onClose={closeProductModal}
        />
      </div>
    </div>
  );
}
