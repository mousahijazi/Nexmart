import { z } from "zod";

const booleanFromFormData = z.preprocess(
  (value) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  },
  z.boolean()
);

export const categorySchema = z.object({
  nameAr: z.string().min(2),
  nameEn: z.string().min(2),
  descriptionAr: z.string().optional(),
  descriptionEn: z.string().optional(),
  isActive: booleanFromFormData.optional(),
});

export const categoryUpdateSchema = z.object({
  nameAr: z.string().min(2, "Arabic name must be at least 2 characters").optional(),
  nameEn: z.string().min(2, "English name must be at least 2 characters").optional(),
  descriptionAr: z.string().optional(),
  descriptionEn: z.string().optional(),
  isActive: booleanFromFormData.optional(),
  removeImage: booleanFromFormData.optional(),
});
