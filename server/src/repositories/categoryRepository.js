
import Category from "../model/Category.js";
import Product from "../model/Product.js";

const findAllCategories = async ({ filter, page, limit }) => {
  return Category.find(filter, { __v: false })
    .populate("productsCount").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
};

const countAllCategories = async (filter = {}) => {
  return Category.countDocuments(filter);
};

const findCategoryById = async (filter) => {
  return Category.findOne(filter).populate("productsCount");
};

const createCategory = async (categoryData) => {
  return Category.create(categoryData);
};

const updateCategoryById = async (categoryId, categoryData) => {
  return Category.findByIdAndUpdate(
    categoryId,
    { $set: categoryData },
    {
      new: true,
      runValidators: true,
    }
  ).populate("productsCount");
};

const deleteCategoryById = async (categoryId) => {
  return Category.findByIdAndDelete(categoryId);
};

const updateCategoryProductsArchiveStatus = async (categoryId, isArchived) => {
  return Product.updateMany(
    { category: categoryId },
    {
      $set: {
        archivedByCategory: isArchived,
      },
    }
  );
};

export {
  findAllCategories,
  countAllCategories,
  findCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
  updateCategoryProductsArchiveStatus,
};