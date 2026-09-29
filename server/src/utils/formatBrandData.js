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

export const formatBrandUpdateData = (req) => {
  const updateData = {};

  if (req.body.nameAr !== undefined) {
    updateData["name.ar"] = req.body.nameAr;
  }

  if (req.body.nameEn !== undefined) {
    updateData["name.en"] = req.body.nameEn;
  }

  if (req.body.descriptionAr !== undefined) {
    updateData["description.ar"] = req.body.descriptionAr;
  }

  if (req.body.descriptionEn !== undefined) {
    updateData["description.en"] = req.body.descriptionEn;
  }

  if (req.body.isActive !== undefined) {
    updateData.isActive = req.body.isActive;
  }

  if (req.body.removeImage === "true") {
    updateData.logo = null;
  }

  if (req.file) {
    updateData.logo = `/uploads/brands/${req.file.filename}`;
  }

  return updateData;
};