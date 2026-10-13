"use client";
import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useLocale } from "next-intl";
import { OfferForm, OfferModalFooter } from "@/index";
import { createOfferSchema } from "@/lib/schemas/offerSchema";
import { getCategories, getProducts, getSeasons } from "@/helper/fetchApi";
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
  type: "percentage",
  discount: undefined,
  targetType: "product",
  product: "",
  category: "",
  season: "",
  startDate: "",
  endDate: "",
  isActive: true,
};

// todo
function toLocalInput(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

const getId = (value) => value?._id || value || "";

export default function OfferModal() {
  const { isOfferModalOpen, offerModalMode, editingOffer, closeOfferModal, addOffer, editOffer } = useAdminContext();
  const { showAlert } = useAlertContext();
  const locale = useLocale();

  const isEdit = offerModalMode === "edit";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const schema = useMemo(() => createOfferSchema(seasons), [seasons]);

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!isOfferModalOpen) return;

    let cancelled = false;

    async function loadOptions() {
      setLoadingOptions(true);

      const token = localStorage.getItem("nexmart-token");

      // todo
      const [productsResult, categoriesResult, seasonsResult] = await Promise.all([
        getProducts(20, 0, token),
        getCategories(),
        getSeasons(),
      ]);

      if (cancelled) return;

      setProducts(productsResult?.products || []);
      setCategories(categoriesResult?.categories || []);
      setSeasons(seasonsResult?.seasons || []);
      setLoadingOptions(false);
    }

    loadOptions();

    return () => {
      cancelled = true;
    };
  }, [isOfferModalOpen]);

  useEffect(() => {
    if (!isOfferModalOpen || loadingOptions) return;

    if (isEdit && editingOffer) {
      reset({
        nameEn: editingOffer.name?.en || "",
        nameAr: editingOffer.name?.ar || "",
        descriptionEn: editingOffer.description?.en || "",
        descriptionAr: editingOffer.description?.ar || "",
        type: editingOffer.type || "percentage",
        discount: editingOffer.discount,
        targetType: editingOffer.targetType || "product",
        product: getId(editingOffer.product),
        category: getId(editingOffer.category),
        season: getId(editingOffer.season),
        startDate: toLocalInput(editingOffer.startDate),
        endDate: toLocalInput(editingOffer.endDate),
        isActive: editingOffer.isActive ?? true,
      });
    } else {
      reset(emptyValues);
    }
  }, [isOfferModalOpen, loadingOptions, isEdit, editingOffer, reset]);

  if (!isOfferModalOpen) {
    return null;
  }

  const onSubmit = async (values) => {
    const payload = {
      name: { en: values.nameEn, ar: values.nameAr },
      description: { en: values.descriptionEn || "", ar: values.descriptionAr || "" },
      type: values.type,
      targetType: values.targetType,
      discount: values.discount,
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
      season: values.season || null,
    };

    if (values.targetType === "product") {
      payload.product = values.product;
    } else {
      payload.category = values.category;
    }

    if (!isEdit || values.isActive !== editingOffer.isActive) {
      payload.isActive = values.isActive;
    }

    const result = isEdit ? await editOffer(editingOffer._id, payload) : await addOffer(payload);

    if (result?.success) {
      showAlert(isEdit ? "تم تعديل العرض بنجاح" : "تمت إضافة العرض بنجاح", "success");
      closeOfferModal();
    } else {
      showAlert(result?.message || "حدث خطأ ما", "danger");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-[var(--color-cream)] shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-divider)] px-5 py-4 sm:px-6">
          <h2 className="text-base font-semibold text-[var(--color-ink)]">
            {isEdit ? "تعديل العرض" : "إضافة عرض جديد"}
          </h2>

          <button
            type="button"
            onClick={closeOfferModal}
            disabled={isSubmitting}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] transition hover:bg-[var(--color-sand)] disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <form id="offer-form" onSubmit={handleSubmit(onSubmit)}>
            <OfferForm
              register={register}
              errors={errors}
              watch={watch}
              products={products}
              categories={categories}
              seasons={seasons}
              locale={locale}
              loadingOptions={loadingOptions}
              inputClass={inputClass}
              labelClass={labelClass}
              sectionClass={sectionClass}
            />
          </form>
        </div>

        <OfferModalFooter
          isEdit={isEdit}
          submitting={isSubmitting}
          loadingOptions={loadingOptions}
          onClose={closeOfferModal}
        />
      </div>
    </div>
  );
}