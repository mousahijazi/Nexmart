export const formatBrandData = (req) => {
  const brandData = {
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
    brandData.logo = `/uploads/brands/${req.file.filename}`;
  }

  return brandData;
};