export const formatCategoryData = (req) => {
    return {
        name: {
            ar: req.body.nameAr,
            en: req.body.nameEn,
        },

        slug: req.body.slug,

        description: {
            ar: req.body.descriptionAr,
            en: req.body.descriptionEn,
        },

        image: req.body.image,
    };
}