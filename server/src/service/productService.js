import Product from "../model/Product.js";
import Category from "../model/Category.js";

const getAllProducts = async ({categories, page = 1, limit = 10}) => {
  const filter = {};

  if (categories) {
    const category = await Category.findOne({slug: categories}).select("_id");

    if (!category) {
      return {
        products: [],
        total: 0,
        page: page,
        limit: limit,
        totalPages: 0,
      };
    }

    if (category) {
      filter.category = category._id;
    }
  }

  const skip = (page - 1) * limit;

  const products = await Product.find(filter).populate("category", "name slug image").populate("brand").skip(skip).limit(limit);

  const totalProducts = await Product.countDocuments(filter);

  return {
      products,
      total: totalProducts,
      page: page,
      limit: limit,
      skip: skip,
      totalPages: Math.ceil(totalProducts / limit),
  };
};

const getProductById = async (productId) => {
  return await Product.findById(productId).populate("category").populate("brand");
};

const createProduct = async (productData) => {
  return await Product.create(productData);
};

const updateProduct = async (productId, productData) => {
  return await Product.findByIdAndUpdate(
    productId,
    productData,
    {
      returnDocument: "after",
      runValidators: true,
    }
  );
};

const deleteProduct = async (productId) => {
  return await Product.findByIdAndDelete(productId);
};

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};