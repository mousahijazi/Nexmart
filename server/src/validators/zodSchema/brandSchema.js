import { z } from "zod";

export const brandSchema = z.object({
  nameAr: z.string().min(2),
  nameEn: z.string().min(2),
  descriptionAr: z.string().optional(),
  descriptionEn: z.string().optional(),
});