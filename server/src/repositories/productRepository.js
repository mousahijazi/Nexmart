import Product from "../model/Product.js";
import Category from "../model/Category.js";
import Brand from "../model/Brand.js";

const findCategoryBySlug = (slug) => {
  return Category.findOne({ slug }).select("_id").lean();
};

const findBrandBySlug = (slug) => {
  return Brand.findOne({ slug }).select("_id").lean();
};

const findCategoryById = (id) => {
  return Category.findById(id).select("_id isActive").lean();
};

const findBrandById = (id) => {
  return Brand.findById(id).select("_id isActive").lean();
};

const findProducts = (filter, { skip, limit }) => {
  return Product.find(filter)
    .select("-__v").populate("category", "name slug image").populate("brand").sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limit);
};

const countProducts = (filter) => {
  return Product.countDocuments(filter);
};

const findProductById = (productId) => {
  return Product.findById(productId);
};

const findProduct = (filter) => {
  return Product.findOne(filter)
    .populate("category").populate("brand");
};

const createProduct = (productData) => {
  return Product.create(productData);
};

const updateProduct = (productId, updateData) => {
  return Product.findByIdAndUpdate(productId, updateData, {
    new: true,
    runValidators: true,
  }).populate("category").populate("brand");
};

const deleteProduct = (productId) => {
  return Product.findByIdAndDelete(productId);
};

const saveProduct = (product) => {
  return product.save();
};

const productRepository = {
  findCategoryBySlug,
  findBrandBySlug,
  findCategoryById,
  findBrandById,
  findProducts,
  countProducts,
  findProductById,
  findProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  saveProduct,
};

export default productRepository;