"use client";
import { UploadCloud, Trash2 } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/helper/getImage";
import { useTranslations } from "next-intl";

export default function CategoryImage({ mode, image, existingImage, imagePreview, submitting, handleImageChange, handleRemoveImage, handleRemoveExistingImage, labelClass, sectionClass }) {
  const t = useTranslations("Admin.categories.modal.image");
  const isEdit = mode === "edit";
  const previewSrc = imagePreview || (existingImage ? getImageUrl(existingImage) : null);

  return (
    <div className={sectionClass}>
      <label className={labelClass}>
        {t("label")}
      </label>

      <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-field)] p-3 transition hover:bg-[var(--color-sand)]">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        {previewSrc ? (
          <Image
            src={previewSrc}
            alt={t("previewAlt")}
            width={72}
            height={72}
            unoptimized
            className="h-[72px] w-[72px] shrink-0 rounded-xl object-cover"
          />
        ) : (
          <span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-xl bg-[var(--color-sand)] text-[var(--color-muted-2)]">
            <UploadCloud size={20} />
          </span>
        )}

        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--color-ink)]">
            {image ? image.name : isEdit ? t("replace") : t("uploadOptional")}
          </p>

          <p className="mt-1 text-xs text-[var(--color-muted-3)]">
            {isEdit ? t("keepCurrent") : t("recommendedFormats")}
          </p>
        </div>
      </label>

      {(image || existingImage) && (
        <button
          type="button"
          onClick={image ? handleRemoveImage : handleRemoveExistingImage}
          disabled={submitting}
          className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[var(--color-red)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 size={12} />
          {t("remove")}
        </button>
      )}
    </div>
  );
}