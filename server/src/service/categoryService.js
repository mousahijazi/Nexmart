import Category from "../model/Category.js";
import Product from "../model/Product.js";
import { deleteFile } from "../middlewares/fileService.js";
import { userRoles } from "../utils/userRoles.js";

const getAllCategories = async ({page = 1, limit = 10}, userRole) => {
    const skip = (page - 1) * limit;

    const filter = {};

    if (userRole !== userRoles.ADMIN) {
      filter.isActive = true;
    }

    const categories = await Category.find(filter, {"__v": false}).populate("productsCount").sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalCategories = await Category.countDocuments(filter);

    return {
        categories,
        total: totalCategories,
        page: page,
        limit: limit,
        skip: skip,
        totalPages: Math.ceil(totalCategories / limit),
    };
};

const getCategoryById = async (categoryId, userRole) => {
    const filter = {
      "_id": categoryId
    };

    if (userRole !== userRoles.ADMIN) {
      filter.isActive = true;
    }
    
    return await Category.findOne(filter).populate("productsCount");
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

const updateCategoryStatus = async (categoryId, isActive) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw AppError.create("Category not found", 404, FAIL);
  }

  category.isActive = isActive;

  await category.save();

  if (!isActive) {
    await Product.updateMany(
      { category: categoryId },
      {
        $set: {
          archivedByCategory: true,
        },
      }
    );
  }

  if (isActive) {
    await Product.updateMany(
      { category: categoryId },
      {
        $set: {
          archivedByCategory: false,
        },
      }
    );
  }

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