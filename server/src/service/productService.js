import Product from "../model/Product.js";
import Category from "../model/Category.js";
import AppError from "../utils/AppError.js";
import { FAIL } from "../utils/httpStatusText.js";

const getAllProducts = async ({categories, page = 1, limit = 10, userRole}) => {
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

  if (userRole === "USER") {
    filter.isActive = true;
  }

  const products = await Product.find(filter).populate("category", "name slug image").populate("brand").sort({ createdAt: -1 }).skip(skip).limit(limit);

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


// todo
const updateProduct = async (productId, productData) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw AppError.create("Product is not found!", 404, FAIL);
  }

  const updateData = { ...productData };

  delete updateData.existingImages;
  delete updateData.newMainImage;
  delete updateData.newImages;

  if (productData.newMainImage) {
    updateData.mainImage = productData.newMainImage;
  }

  if (productData.existingImages !== undefined || productData.newImages) {
    const oldImages =
      productData.existingImages !== undefined
        ? productData.existingImages
        : product.images;

    const newImages = productData.newImages || [];

    updateData.images = [
      ...oldImages,
      ...newImages,
    ];
  }

  return await Product.findByIdAndUpdate(
    productId,
    updateData,
    {
      returnDocument: "after",
      runValidators: true,
    }
  ).populate("category").populate("brand");
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