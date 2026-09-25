import Category from "../model/Category.js";

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
  return await Category.findByIdAndUpdate(
    categoryId,
    { $set: categoryData },
    {
      new: true,
      runValidators: true,
    }
  ).populate("productsCount");
};

const deleteCategory = async (categoryId) => {
    return await Category.findByIdAndDelete(categoryId);
};

export {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};