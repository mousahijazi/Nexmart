import Product from "../model/Product.js";
import Category from "../model/Category.js";
import AppError from "../utils/AppError.js";
import { FAIL } from "../utils/httpStatusText.js";
import { userRoles } from "../utils/userRoles.js";
import { deleteFile, deleteFiles } from "../middlewares/fileService.js";

const getAllProducts = async ({categories, page = 1, limit = 10}, userRole) => {
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

  if (userRole !== userRoles.ADMIN) {
    filter.isActive = true;
    filter.archivedByCategory = false;
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

const getProductById = async (productId, userRole) => {
  const filter = {
    _id: productId,
  };

  if (userRole !== userRoles.ADMIN) {
    filter.isActive = true;
    filter.archivedByCategory = false;
  }

  return await Product.findOne(filter).populate("category").populate("brand");
};

const createProduct = async (productData) => {
  return await Product.create(productData);
};

const updateProduct = async (productId, productData) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw AppError.create("Product is not found!", 404, FAIL);
  }

  const updateData = { ...productData };

  delete updateData.existingImages;
  delete updateData.newMainImage;
  delete updateData.newImages;

  let imagesToDelete = [];

  if (productData.newMainImage) {
    updateData.mainImage = productData.newMainImage;
  }

  if (productData.existingImages !== undefined || productData.newImages) {
    const oldImages = product.images || [];
    const existingImages = productData.existingImages || [];
    const newImages = productData.newImages || [];

    updateData.images = [
      ...existingImages,
      ...newImages,
    ];

    imagesToDelete = oldImages.filter(
      (oldImage) => !existingImages.includes(oldImage)
    );
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  ).populate("category").populate("brand");

  if (imagesToDelete.length > 0) {
    await deleteFiles(imagesToDelete);
  }

  if (productData.newMainImage && product.mainImage) {
    await deleteFile(product.mainImage);
  }

  return updatedProduct;
};

const updateProductStatus = async (productId, isActive) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw AppError.create("Product not found", 404, FAIL);
  }

  if (isActive) {
    const category = await Category.findById(product.category);

    if (category && !category.isActive) {
      throw AppError.create("Cannot activate a product while its category is archived", 400, FAIL);
    }
  }

  product.isActive = isActive;
  await product.save();

  return product;
};

const deleteProduct = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    return null;
  }

  await Product.findByIdAndDelete(productId);

  if (product.mainImage) {
    await deleteFile(product.mainImage);
  }

  if (product.images?.length > 0) {
    await deleteFiles(product.images);
  }

  return product;
};

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  updateProductStatus,
  deleteProduct,
};