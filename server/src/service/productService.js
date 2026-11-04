import mongoose from "mongoose";
import productRepository from "../repositories/productRepository.js";
import AppError from "../utils/AppError.js";
import { FAIL } from "../utils/httpStatusText.js";
import { userRoles } from "../utils/userRoles.js";
import { deleteFile, deleteFiles } from "../middlewares/fileService.js";
import { addPricingToProduct } from "./offer/pricingService.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const LOW_STOCK_THRESHOLD = 5;

const parsePagination = (page, limit) => {
  const parsedPage = Math.max(DEFAULT_PAGE, Number.parseInt(page, 10) || DEFAULT_PAGE);
  const parsedLimit = Math.min(MAX_LIMIT, Math.max(1, Number.parseInt(limit, 10) || DEFAULT_LIMIT));

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip: (parsedPage - 1) * parsedLimit,
  };
};

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const isValidObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};

const resolveCategory = async (value) => {
  if (!value) return null;

  if (isValidObjectId(value)) {
    return value;
  }

  const category = await productRepository.findCategoryBySlug(value);

  return category?._id || null;
};

const resolveBrand = async (value) => {
  if (!value) return null;

  if (isValidObjectId(value)) {
    return value;
  }

  const brand = await productRepository.findBrandBySlug(value);

  return brand?._id || null;
};

const buildProductsFilter = async (query, userRole) => {
  const { categories, brands, search, category, brand, status, stockStatus } = query;

  const filter = {};
  const andConditions = [];

  const categoryValue = category || categories;

  if (categoryValue) {
    const categoryId = await resolveCategory(categoryValue);

    if (!categoryId) return null;

    filter.category = categoryId;
  }

  const brandValue = brand || brands;

  if (brandValue) {
    const brandId = await resolveBrand(brandValue);

    if (!brandId) return null;

    filter.brand = brandId;
  }

  if (userRole !== userRoles.ADMIN) {
    filter.isActive = true;
    filter.archivedByCategory = false;
    filter.archivedByBrand = false;

    return filter;
  }

  if (typeof search === "string" && search.trim()) {
    const searchRegex = new RegExp(escapeRegex(search.trim()), "i");

    andConditions.push({
      $or: [
        { "title.ar": searchRegex },
        { "title.en": searchRegex },
        { slug: searchRegex },
      ],
    });
  }

  if (status === "active") {
    filter.isActive = true;
    filter.archivedByCategory = false;
    filter.archivedByBrand = false;
  } else if (status === "archived") {
    andConditions.push({
      $or: [
        { isActive: false },
        { archivedByCategory: true },
        { archivedByBrand: true },
      ],
    });
  }

  if (stockStatus === "inStock") {
    filter.stock = { $gt: 0 };
  } else if (stockStatus === "outOfStock") {
    filter.stock = 0;
  } else if (stockStatus === "lowStock") {
    filter.stock = {
      $gt: 0,
      $lte: LOW_STOCK_THRESHOLD,
    };
  }

  if (andConditions.length > 0) {
    filter.$and = andConditions;
  }

  return filter;
};

const getAllProducts = async (query = {}, userRole) => {
  const { page, limit, skip } = parsePagination( query.page, query.limit);
  const filter = await buildProductsFilter(query, userRole);

  if (!filter) {
    return {
      products: [],
      total: 0,
      page,
      limit,
      skip,
      totalPages: 0,
    };
  }

  const [products, totalProducts] = await Promise.all([
    productRepository.findProducts(filter, { skip, limit }),
    productRepository.countProducts(filter),
  ]);

  const productsWithPricing = await Promise.all(
    products.map((product) => addPricingToProduct(product))
  );

  return {
    products: productsWithPricing,
    total: totalProducts,
    page,
    limit,
    skip,
    totalPages: Math.ceil(totalProducts / limit),
  };
};

const getProductById = async (productId, userRole) => {
  const filter = { _id: productId };

  if (userRole !== userRoles.ADMIN) {
    filter.isActive = true;
    filter.archivedByCategory = false;
    filter.archivedByBrand = false;
  }

  const product = await productRepository.findProduct(filter);

  if (!product) {
    return null;
  }

  return addPricingToProduct(product);
};

const createProduct = async (productData) => {
  return productRepository.createProduct(productData);
};

const updateProduct = async (productId, productData) => {
  const product = await productRepository.findProductById(productId);

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

  const updatedProduct = await productRepository.updateProduct(productId, updateData);

  if (imagesToDelete.length > 0) {
    await deleteFiles(imagesToDelete);
  }

  if (productData.newMainImage && product.mainImage) {
    await deleteFile(product.mainImage);
  }

  return updatedProduct;
};

const updateProductStatus = async (productId, isActive) => {
  const product = await productRepository.findProductById(productId);

  if (!product) {
    throw AppError.create("Product not found", 404, FAIL);
  }

  if (isActive) {
    const [category, brand] = await Promise.all([
      productRepository.findCategoryById(product.category),
      productRepository.findBrandById(product.brand),
    ]);

    if (category && !category.isActive) {
      throw AppError.create("Cannot activate a product while its category is archived", 400, FAIL);
    }

    if (brand && !brand.isActive) {
      throw AppError.create("Cannot activate a product while its brand is archived", 400, FAIL);
    }
  }

  product.isActive = isActive;

  return productRepository.saveProduct(product);
};

const deleteProduct = async (productId) => {
  const product = await productRepository.deleteProduct(productId);

  if (!product) {
    return null;
  }

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