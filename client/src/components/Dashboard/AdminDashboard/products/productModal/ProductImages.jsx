"use client";
import { UploadCloud, Trash2 } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/helper/getImage";

export default function ProductImages({ mode, mainImage, images, existingImages, mainImagePreview, imagePreviews, submitting, handleMainImageChange, handleImagesChange, handleRemoveImage, handleRemoveExistingImage, labelClass, sectionClass }) {
  const isEdit = mode === "edit";
  const totalAdditionalImages = existingImages.length + images.length;
  const canAddImages = totalAdditionalImages < 4;

  return (
    <div className={sectionClass}>
      <div className="space-y-5">
        <div>
          <label className={labelClass}>
            Main Image
          </label>

          <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-field)] p-3 transition hover:bg-[var(--color-sand)]">
            <input
              type="file"
              accept="image/*"
              onChange={handleMainImageChange}
              className="hidden"
            />

            {mainImagePreview ? (
              <Image
                src={mainImage ? mainImagePreview : getImageUrl(mainImagePreview)}
                alt="Main product preview"
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
                {mainImage ? mainImage.name : isEdit ? "Click to replace main image" : "Click to upload main image"}
              </p>

              <p className="mt-1 text-xs text-[var(--color-muted-3)]">
                {isEdit ? "Leave unchanged to keep the current image." : "Choose the main product image."}
              </p>
            </div>
          </label>
        </div>


        {isEdit && existingImages.length > 0 && (
          <div>
            <label className={labelClass}>
              Existing Images ({existingImages.length}/4)
            </label>

            <div className="flex flex-wrap gap-3">
              {existingImages.map((src, index) => (
                  <div key={`${src}-${index}`} className="group relative">
                    <Image
                      src={getImageUrl(src)}
                      alt={`Existing product image ${ index + 1 }`}
                      width={72}
                      height={72}
                      unoptimized
                      className="h-[72px] w-[72px] rounded-xl border border-[var(--color-border)] object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveExistingImage(
                          index
                        )
                      }
                      disabled={submitting}
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-red)] text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:cursor-not-allowed"
                      aria-label="Remove existing image"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                )
              )}

            </div>
          </div>
        )}

        <div>
          <label className={labelClass}>
            Additional Images ({totalAdditionalImages}/4)
          </label>

          <label
            className={`flex items-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-field)] p-3 text-sm text-[var(--color-soft-2)] transition hover:bg-[var(--color-sand)] ${
              !canAddImages ? "pointer-events-none opacity-50" : "cursor-pointer"
            }`}
          >

            <input
              type="file"
              accept="image/*"
              multiple
              disabled={!canAddImages || submitting}
              onChange={handleImagesChange}
              className="hidden"
            />

            <UploadCloud size={16} className="shrink-0 text-[var(--color-muted-2)]" />

            {canAddImages ? "Click to upload additional images" : "Maximum 4 additional images"}
          </label>

          {imagePreviews.length > 0 && (
            <div className="mt-3">
              <p className="mb-2 text-xs text-[var(--color-muted-3)]">
                New images
              </p>

              <div className="flex flex-wrap gap-3">
                {imagePreviews.map((src, index) => (
                    <div key={src} className="group relative">
                      <Image
                        src={src}
                        alt={`New image preview ${index + 1}`}
                        width={72}
                        height={72}
                        unoptimized
                        className="h-[72px] w-[72px] rounded-xl border border-[var(--color-border)] object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        disabled={submitting}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-red)] text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:cursor-not-allowed"
                        aria-label="Remove new image"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}