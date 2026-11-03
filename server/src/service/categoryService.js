import mongoose from "mongoose";
import AppError from "../utils/AppError.js";
import { ERROR, FAIL } from "../utils/httpStatusText.js";
import { userRoles } from "../utils/userRoles.js";
import { deleteFile } from "../middlewares/fileService.js";
import { findAllCategories, countAllCategories, findCategoryById, createCategory as createCategoryRepository, updateCategoryById, deleteCategoryById, updateCategoryProductsArchiveStatus } from "../repositories/categoryRepository.js";

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

const getAllCategories = async (query = {}, userRole) => {
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

  const [categories, total] = await Promise.all([
    findAllCategories({ filter, page, limit }),
    countAllCategories(filter),
  ]);

  return {
    categories,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getCategoryById = async (categoryId, userRole) => {
  if (!mongoose.isValidObjectId(categoryId)) {
    throw AppError.create("Invalid category ID", 400, FAIL);
  }

  const filter = {
    _id: categoryId,
  };

  if (userRole !== userRoles.ADMIN) {
    filter.isActive = true;
  }

  const category = await findCategoryById(filter);

  if (!category) {
    throw AppError.create("Category not found", 404, ERROR);
  }

  return category;
};

const createCategory = async (categoryData) => {
  return createCategoryRepository(categoryData);
};

const updateCategory = async (categoryId, categoryData) => {
  if (!mongoose.isValidObjectId(categoryId)) {
    throw AppError.create("Invalid category ID", 400, FAIL);
  }

  const oldCategory = await findCategoryById({ _id: categoryId });

  if (!oldCategory) {
    throw AppError.create("Category not found", 404, ERROR);
  }

  const updatedCategory = await updateCategoryById(categoryId, categoryData);

  if (categoryData.image && oldCategory.image) {
    await deleteFile(oldCategory.image);
  }

  return updatedCategory;
};

const deleteCategory = async (categoryId) => {
  if (!mongoose.isValidObjectId(categoryId)) {
    throw AppError.create("Invalid category ID", 400, FAIL);
  }

  const category = await deleteCategoryById(categoryId);

  if (!category) {
    throw AppError.create("Category not found", 404, ERROR);
  }

  if (category.image) {
    await deleteFile(category.image);
  }

  return category;
};

const updateCategoryStatus = async (categoryId, isActive) => {
  if (!mongoose.isValidObjectId(categoryId)) {
    throw AppError.create("Invalid category ID", 400, FAIL);
  }

  if (typeof isActive !== "boolean") {
    throw AppError.create("isActive must be a boolean", 400, FAIL);
  }

  const category = await findCategoryById({ _id: categoryId });

  if (!category) {
    throw AppError.create("Category not found", 404, ERROR);
  }

  category.isActive = isActive;

  await category.save();

  await updateCategoryProductsArchiveStatus(categoryId, !isActive);

  return category;
};

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
};