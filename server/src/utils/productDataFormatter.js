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
    slug: req.body.slug,
    price: Number(req.body.price),
    mainImage: `/uploads/products/${req.files.mainImage[0].filename}`,
    images,
    category: req.body.category,
    brand: req.body.brand,
    stock: Number(req.body.stock),
  };
};

export const formatProductUpdateData = (req) => {
  const updateData = {};

  if (req.body.titleAr !== undefined) {
    updateData["title.ar"] = req.body.titleAr;
  }

  if (req.body.titleEn !== undefined) {
    updateData["title.en"] = req.body.titleEn;
  }

  if (req.body.descriptionAr !== undefined) {
    updateData["description.ar"] = req.body.descriptionAr;
  }

  if (req.body.descriptionEn !== undefined) {
    updateData["description.en"] = req.body.descriptionEn;
  }

  if (req.body.price !== undefined) {
    updateData.price = Number(req.body.price);
  }

  if (req.body.stock !== undefined) {
    updateData.stock = Number(req.body.stock);
  }

  if (req.body.category !== undefined) {
    updateData.category = req.body.category;
  }

  if (req.body.brand !== undefined) {
    updateData.brand = req.body.brand;
  }

  if (req.body.existingImages !== undefined) {
    try {
      const existingImages = JSON.parse(req.body.existingImages);

      if (!Array.isArray(existingImages)) {
        throw AppError.create("Existing images is not found !", 400, FAIL);
      }

      updateData.existingImages = existingImages;
    } catch {
      throw AppError.create("Invalid existing images data", 400, FAIL);
    }
  }

  if (req.files?.mainImage?.[0]) {
    updateData.newMainImage = `/uploads/products/${req.files.mainImage[0].filename}`;
  }

  if (req.files?.images) {
    updateData.newImages = req.files.images.map(
      (file) => `/uploads/products/${file.filename}`
    );
  }

  return updateData;
};