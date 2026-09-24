"use client";
import { UploadCloud, Trash2 } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/helper/getImage";

export default function CategoryImage({ mode, image, existingImage, imagePreview, submitting, handleImageChange, handleRemoveImage, handleRemoveExistingImage, labelClass, sectionClass }) {
  const isEdit = mode === "edit";
  const previewSrc = imagePreview || (existingImage ? getImageUrl(existingImage) : null);

  return (
    <div className={sectionClass}>
      <label className={labelClass}>
        Category Image
      </label>

      <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-field)] p-3 transition hover:bg-[var(--color-sand)]">
        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

        {previewSrc ? (
          <Image
            src={previewSrc}
            alt="Category preview"
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
            {image ? image.name : isEdit ? "Click to replace image" : "Click to upload image (optional)"}
          </p>

          <p className="mt-1 text-xs text-[var(--color-muted-3)]">
            {isEdit ? "Leave unchanged to keep the current image." : "PNG or JPG recommended."}
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
          Remove image
        </button>
      )}
    </div>
  );
}