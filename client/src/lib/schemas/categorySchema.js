import { z } from "zod";

export const categorySchema = z.object({
  nameEn: z.string().trim().min(1, "English category name is required").max(100, "English category name must be less than 100 characters"),
  nameAr: z.string().trim().min(1, "Arabic category name is required").max(100, "Arabic category name must be less than 100 characters"),

  descriptionEn: z.string().trim().min(1, "English category description is required").max(500, "English category description must be less than 500 characters"),
  descriptionAr: z.string().trim().min(1, "Arabic category description is required").max(500, "Arabic category description must be less than 500 characters"),

  isActive: z.boolean(),
});