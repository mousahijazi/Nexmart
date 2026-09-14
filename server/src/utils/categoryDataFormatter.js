export const formatCategoryData = (req) => {
  const categoryData = {
    name: {
      ar: req.body.nameAr,
      en: req.body.nameEn,
    },
    slug: req.body.slug,
    description: {
      ar: req.body.descriptionAr,
      en: req.body.descriptionEn,
    },
  };

  if (req.file) {
    categoryData.image = `/uploads/categories/${req.file.filename}`;
  }

  return categoryData;
};