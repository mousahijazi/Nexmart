import Category from "../model/Category.js";
import { deleteFile } from "../middlewares/fileService.js";

const getAllCategories = async ({page = 1, limit = 10}) => {
    const skip = (page - 1) * limit;

    const categories = await Category.find({}, {"__v": false}).populate("productsCount").sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalCategories = await Category.countDocuments();

    return {
        categories,
        total: totalCategories,
        page: page,
        limit: limit,
        skip: skip,
        totalPages: Math.ceil(totalCategories / limit),
    };
};

const getCategoryById = async (categoryId) => {
    return await Category.findById(categoryId).populate("productsCount");
};

const createCategory = async (categoryData) => {
    return await Category.create(categoryData);
};

const updateCategory = async (categoryId, categoryData) => {
  const oldCategory = await Category.findById(categoryId);

  if (!oldCategory) {
    return null;
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    { $set: categoryData },
    {
      returnDocument: "after",
      runValidators: true,
    }
  ).populate("productsCount");

  if (categoryData.image && oldCategory.image) {
    await deleteFile(oldCategory.image);
  }

  return updatedCategory;
};

const deleteCategory = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    return null;
  }

  await Category.findByIdAndDelete(categoryId);

  if (category.image) {
    await deleteFile(category.image);
  }

  return category;
};

export {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};