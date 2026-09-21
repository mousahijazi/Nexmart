import { z } from "zod";

export const productUpdateSchema = z.object({
  titleAr: z
    .string()
    .min(2, "Arabic title must be at least 2 characters")
    .optional(),

  titleEn: z
    .string()
    .min(2, "English title must be at least 2 characters")
    .optional(),

  descriptionAr: z
    .string()
    .min(2, "Arabic description must be at least 2 characters")
    .optional(),

  descriptionEn: z
    .string()
    .min(2, "English description must be at least 2 characters")
    .optional(),

  price: z.coerce
    .number()
    .min(0, "Price cannot be negative")
    .optional(),

  stock: z.coerce
    .number()
    .min(0, "Stock cannot be negative")
    .optional(),

  category: z
    .string()
    .min(1, "Category is required")
    .optional(),

  brand: z
    .string()
    .min(1, "Brand is required")
    .optional(),
});