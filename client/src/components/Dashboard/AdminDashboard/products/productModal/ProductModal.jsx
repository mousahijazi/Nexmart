"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getCategories, getBrand, createProduct, updateProduct } from "@/helper/fetchApi";
import { useLocale } from "next-intl";
import { useAdminContext } from "@/Context/Adminprovider";
import ProductForm from "./ProductForm";
import ProductImages from "./ProductImages";
import ProductModalFooter from "./ProductModalFooter";

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
  const locale = useLocale();
  const { isProductModalOpen, productModalMode, editingProduct, closeProductModal, refreshProducts } = useAdminContext();
  const isEdit = productModalMode === "edit";

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [form, setForm] = useState(EMPTY_FORM);
  const [mainImage, setMainImage] = useState(null);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isProductModalOpen) {
      return;
    }

    if (!isEdit || !editingProduct) {
      setForm(EMPTY_FORM);

      setMainImage(null);
      setImages([]);
      setExistingImages([]);

      setMainImagePreview(null);
      setImagePreviews([]);

      return;
    }

    setForm({
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
  }, [isProductModalOpen, isEdit, editingProduct]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoadingOptions(true);

        const [categoriesResult, brandsResult] = await Promise.all([
          getCategories(),
          getBrand(),
        ]);

        setCategories(categoriesResult.categories || []);
        setBrands(brandsResult.brands || []);
      } catch (error) {
        console.log("Failed to load categories or brands:", error);
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

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

    return () => {
      URL.revokeObjectURL(url);
    };
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
    if (!isProductModalOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !submitting) {
        closeProductModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProductModalOpen, submitting, closeProductModal]);

  useEffect(() => {
    if (!isProductModalOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isProductModalOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMainImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setMainImage(file);
  };

  // todo
  const handleImagesChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    const availableSlots = 4 - existingImages.length;
    const remainingSlots = Math.max(availableSlots - images.length, 0);

    const newFiles = selectedFiles.slice(0, remainingSlots);

    setImages((prev) => [
      ...prev,
      ...newFiles,
    ]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, imageIndex) => imageIndex !== index));
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, imageIndex) => imageIndex !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      return;
    }

    if (!isEdit && !mainImage) {
      console.log("Main image is required");
      return;
    }

    if (!form.category) {
      console.log("Category is required");
      return;
    }

    if (!form.brand) {
      console.log("Brand is required");
      return;
    }

    const formData = new FormData();

    formData.append("titleAr", form.titleAr);
    formData.append("titleEn", form.titleEn);

    formData.append("descriptionAr", form.descriptionAr);
    formData.append("descriptionEn", form.descriptionEn);

    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("category", form.category);
    formData.append("brand", form.brand);

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
      setSubmitting(true);

      const result = isEdit 
        ? await updateProduct(editingProduct._id, formData, token)
        : await createProduct(formData, token);

      if (!result.success) {
        console.log(result.message);
        return;
      }

      refreshProducts();
      closeProductModal();
    } catch (error) {
      console.error(isEdit ? "Failed to update product:" : "Failed to create product:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isProductModalOpen) {
    return null;
  }

  const inputClass = "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-field)] px-3.5 py-2.5 text-sm text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted-3)] focus:border-[var(--color-green-light)] focus:ring-2 focus:ring-[var(--color-green-light)]/20";
  const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted-2)]";
  const sectionClass = "rounded-2xl border border-[var(--color-border)] bg-[var(--color-field)]/40 p-4 sm:p-5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 backdrop-blur-[2px] sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) {
          closeProductModal();
        }
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-divider)] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-green-dark)] text-white">
              <span className="text-sm font-bold">
                N
              </span>
            </div>
            <div>
              <h2 className="text-base font-semibold text-[var(--color-ink)] sm:text-lg">
                {isEdit ? "Edit Product" : "Add New Product"}
              </h2>
              <p className="mt-0.5 text-xs text-[var(--color-muted-2)]">
                {isEdit ? "Update product information and images." : "Add the product information below."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeProductModal}
            disabled={submitting}
            className="rounded-lg p-1.5 text-[var(--color-muted-2)] transition hover:bg-[var(--color-sand)] disabled:opacity-40"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form id="product-form" onSubmit={handleSubmit} className="overflow-y-auto px-5 py-5 sm:px-6">
          <div className="space-y-5">
            <ProductForm
              form={form}
              categories={categories}
              brands={brands}
              locale={locale}
              loadingOptions={loadingOptions}
              handleChange={handleChange}
              inputClass={inputClass}
              labelClass={labelClass}
              sectionClass={sectionClass}
            />

            <ProductImages
              mode={productModalMode}
              mainImage={mainImage}
              images={images}
              existingImages={existingImages}
              mainImagePreview={mainImagePreview} imagePreviews={imagePreviews}
              submitting={submitting}
              handleMainImageChange={handleMainImageChange} handleImagesChange={handleImagesChange} handleRemoveImage={handleRemoveImage} handleRemoveExistingImage={handleRemoveExistingImage}
              labelClass={labelClass}
              sectionClass={sectionClass}
            />
          </div>
        </form>

        <ProductModalFooter
          isEdit={isEdit}
          submitting={submitting}
          loadingOptions={loadingOptions}
          onClose={closeProductModal}
        />
      </div>
    </div>
  );
}