import { z } from "zod";

export const createOfferSchema = (seasons = []) => z.object({
    nameEn: z.string().trim().min(2, "Name must be at least 2 characters").max(40, "Name must be at most 40 characters"),
    nameAr: z.string().trim().min(2, "الاسم يجب أن يكون حرفين على الأقل").max(40, "الاسم يجب ألا يتجاوز 40 حرف"),
    descriptionEn: z.string().trim().max(600, "Max 600 characters").optional(),
    descriptionAr: z.string().trim().max(600, "الحد الأقصى 600 حرف").optional(),

    type: z.enum(["percentage", "fixed"]),
    discount: z.number({ message: "Discount is required" }).min(0, "Discount can't be negative"),

    targetType: z.enum(["product", "category"]),
    product: z.string().optional(),
    category: z.string().optional(),
    season: z.string().optional(),

    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),

    isActive: z.boolean(),
}).superRefine((data, ctx) => {
    if (data.targetType === "product" && !data.product) {
        ctx.addIssue({ code: "custom", path: ["product"], message: "Please select a product" });
    }

    if (data.targetType === "category" && !data.category) {
        ctx.addIssue({ code: "custom", path: ["category"], message: "Please select a category" });
    }

    if (data.type === "percentage" && data.discount > 100) {
        ctx.addIssue({ code: "custom", path: ["discount"], message: "Percentage can't exceed 100" });
    }

    if (data.startDate && data.endDate && new Date(data.endDate) <= new Date(data.startDate)) {
        ctx.addIssue({ code: "custom", path: ["endDate"], message: "End date must be after start date" });
    }

    if (data.season) {
        const season = seasons.find((item) => item._id === data.season);

        if (season) {
            const seasonStart = new Date(season.startDate);
            const seasonEnd = new Date(season.endDate);

            if (data.startDate && new Date(data.startDate) < seasonStart) {
                ctx.addIssue({ code: "custom", path: ["startDate"], message: "Start date is before the season starts" });
            }

            if (data.endDate && new Date(data.endDate) > seasonEnd) {
                ctx.addIssue({ code: "custom", path: ["endDate"], message: "End date is after the season ends" });
            }
        }
    }
});