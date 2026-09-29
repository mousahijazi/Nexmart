import { z } from "zod";

export const brandSchema = z.object({
  nameEn: z.string().trim().min(1, "English name is required"),
  nameAr: z.string().trim().min(1, "Arabic name is required"),

  descriptionEn: z.string().trim().min(1, "English category description is required").max(500, "English category description must be less than 500 characters"),
  descriptionAr: z.string().trim().min(1, "Arabic category description is required").max(500, "Arabic category description must be less than 500 characters"),

  isActive: z.boolean(),
});