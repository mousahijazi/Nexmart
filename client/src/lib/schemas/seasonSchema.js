import { z } from "zod";

export const seasonSchema = z.object({
    nameEn: z.string().trim().min(2, "Name must be at least 2 characters").max(40, "Name must be at most 40 characters"),
    nameAr: z.string().trim().min(2, "الاسم يجب أن يكون حرفين على الأقل").max(40, "الاسم يجب ألا يتجاوز 40 حرف"),
    descriptionEn: z.string().trim().max(600, "Max 600 characters").optional(),
    descriptionAr: z.string().trim().max(600, "الحد الأقصى 600 حرف").optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    isActive: z.boolean(),
}).superRefine((data, ctx) => {
    if (data.startDate && data.endDate && data.endDate < data.startDate) {
      ctx.addIssue({ code: "custom", path: ["endDate"], message: "End date can't be before start date" });
    }
});