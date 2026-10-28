import { z } from "zod";

export const orderShippingSchema = z.object({
  firstName: z.string().trim().min(1, "الاسم الأول مطلوب").max(80),
  lastName: z.string().trim().min(1, "اسم العائلة مطلوب").max(80),
  phone: z.string().trim().min(1, "رقم الهاتف مطلوب").max(30),
  city: z.string().trim().min(1, "المدينة مطلوبة").max(100),
  address: z.string().trim().min(1, "العنوان مطلوب").max(300),
  notes: z.string().max(1000).optional().default(""),
});