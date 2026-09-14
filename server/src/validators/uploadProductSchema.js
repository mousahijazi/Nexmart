import { z } from "zod";

export const productSchema = z.object({
  titleAr: z.string().min(2),
  titleEn: z.string().min(2),
  descriptionAr: z.string().nonempty(),
  descriptionEn: z.string().nonempty(),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().min(0),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Category ID"),
  brand: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Brand ID"),
});