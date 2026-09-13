import AppError from "./AppError.js";
import { FAIL } from "./httpStatusText.js";

export const formatProductData = (req) => {
  if (!req.files?.mainImage?.[0]) {
    throw AppError.create("Main image is required", 400, FAIL);
  }

  const images = req.files?.images
    ? req.files.images.map((file) => `/uploads/products/${file.filename}`)
    : [];

  return {
    title: {
      ar: req.body.titleAr,
      en: req.body.titleEn,
    },
    description: {
      ar: req.body.descriptionAr,
      en: req.body.descriptionEn,
    },
    price: Number(req.body.price),
    mainImage: `/uploads/products/${req.files.mainImage[0].filename}`,
    images,
    category: req.body.category,
    brand: req.body.brand,
    stock: Number(req.body.stock),
  };
};