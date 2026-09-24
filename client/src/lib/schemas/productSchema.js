import { z } from "zod";

const englishOnly = /^[A-Za-z ]+$/;
const arabicOnly = /^[\u0621-\u063A\u0641-\u064A ]+$/;

export const productFormSchema = z.object({
  titleEn: z.string().trim().min(2, "English title must be at least 2 characters").regex(englishOnly, "English title must contain English letters only"),
  titleAr: z.string().trim().min(2, "Arabic title must be at least 2 characters").regex(arabicOnly, "Arabic title must contain Arabic letters only"),

  descriptionEn: z.string().trim().min(10, "English description must be at least 10 characters").regex(englishOnly, "English description must contain English letters only"),
  descriptionAr: z.string().trim().min(10, "Arabic description must be at least 10 characters").regex(arabicOnly, "Arabic description must contain Arabic letters only"),

  price: z.number({ error: "Price is required" }).min(0, "Price cannot be negative"),

  stock: z.number({ error: "Stock is required" }).int("Stock must be a whole number").min(0, "Stock cannot be negative"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
});