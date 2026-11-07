import mongoose from "mongoose";
import AppError from "../utils/AppError.js";
import { ERROR, FAIL } from "../utils/httpStatusText.js";
import { userRoles } from "../utils/userRoles.js";
import { deleteFile } from "../middlewares/fileService.js";
import { findAllBrands, countAllBrands, findBrandById, createBrand as createBrandRepository, updateBrandById, deleteBrandById, updateBrandProductsArchiveStatus } from "../repositories/brandRepository.js";

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const parsePositiveInteger = (value, fallback, max = Infinity) => {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.min(parsed, max);
};

const getAllBrands = async (query = {}, userRole) => {
  const page = parsePositiveInteger(query.page, 1);
  const limit = parsePositiveInteger(query.limit, 10, 100);
  const filter = {};

  if (userRole !== userRoles.ADMIN) {
    filter.isActive = true;
  } else {
    const status = query.status;

    if (status === "active") {
      filter.isActive = true;
    } else if (status === "archived") {
      filter.isActive = false;
    }
  }

  const search = typeof query.search === "string" ? query.search.trim().slice(0, 100) : "";

  if (search) {
    const searchRegex = new RegExp(escapeRegex(search), "i");

    filter.$or = [
      { "name.en": searchRegex },
      { "name.ar": searchRegex },
    ];
  }

  const [brands, total] = await Promise.all([
    findAllBrands({ filter, page, limit }),
    countAllBrands(filter),
  ]);

  return {
    brands,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getBrandById = async (brandId, userRole) => {
  if (!mongoose.isValidObjectId(brandId)) {
    throw AppError.create("Invalid brand ID", 400, FAIL);
  }

  const filter = { _id: brandId };

  if (userRole !== userRoles.ADMIN) {
    filter.isActive = true;
  }

  const brand = await findBrandById(filter);

  if (!brand) {
    throw AppError.create("Brand not found", 404, ERROR);
  }

  return brand;
};

const createBrand = async (brandData) => {
  return createBrandRepository(brandData);
};

const updateBrand = async (brandId, brandData) => {
  if (!mongoose.isValidObjectId(brandId)) {
    throw AppError.create("Invalid brand ID", 400, FAIL);
  }

  const oldBrand = await findBrandById({ _id: brandId });

  if (!oldBrand) {
    throw AppError.create("Brand not found", 404, ERROR);
  }

  const { removeLogo, ...updateData } = brandData;

  const hasNewLogo = Boolean(updateData.logo);

  if (removeLogo && !hasNewLogo) {
    throw AppError.create("Brand logo is required. Please upload a new logo.", 400, FAIL);
  }

  const updatedBrand = await updateBrandById(brandId, updateData);

  if (hasNewLogo && oldBrand.logo) {
    await deleteFile(oldBrand.logo);
  }

  return updatedBrand;
};

const deleteBrand = async (brandId) => {
  if (!mongoose.isValidObjectId(brandId)) {
    throw AppError.create("Invalid brand ID", 400, FAIL);
  }

  const brand = await deleteBrandById(brandId);

  if (!brand) {
    throw AppError.create("Brand not found", 404, ERROR);
  }

  if (brand.logo) {
    await deleteFile(brand.logo);
  }

  return brand;
};

const updateBrandStatus = async (brandId, isActive) => {
  if (!mongoose.isValidObjectId(brandId)) {
    throw AppError.create("Invalid brand ID", 400, FAIL);
  }

  if (typeof isActive !== "boolean") {
    throw AppError.create("isActive must be a boolean", 400, FAIL);
  }

  const brand = await findBrandById({ _id: brandId });

  if (!brand) {
    throw AppError.create("Brand not found", 404, ERROR);
  }

  brand.isActive = isActive;

  await brand.save();

  await updateBrandProductsArchiveStatus(brandId, !isActive);

  return brand;
};

export {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  updateBrandStatus,
  deleteBrand,
};