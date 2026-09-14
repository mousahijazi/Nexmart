import {createProduct, getAllProducts, getProductById, updateProduct, deleteProduct} from "../service/productService.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { formatProductData } from "../utils/productDataFormatter.js";
import AppError from "../utils/AppError.js";
import { FAIL, SUCCESS } from "../utils/httpStatusText.js";

const getAllProductsController = async (req, res) => {
  const products = await getAllProducts(req.query);

  res.status(200).json({
    status: SUCCESS,
    results: products.length,
    data: products,
  });
};

const getProductByIdController = asyncHandler(
  async (req, res) => {
    const product = await getProductById(req.params.productId);

    if (!product) {
      return next(AppError.create("Product not found", 404, FAIL));
    }

    res.status(200).json({
      status: SUCCESS,
      data: {
        product,
      },
    });
  }
);

const createProductController = asyncHandler(
    async (req, res) => {
      const productData = formatProductData(req);
      const product = await createProduct(productData);

      res.status(201).json({
          status: SUCCESS,
          data: {
              product,
          },
      });
    }
);

const updateProductController = asyncHandler(
  async (req, res, next) => {
    const product = await updateProduct(req.params.productId, req.body);

    if (!product) {
      return next(AppError.create("Product not found", 404, FAIL));
    }

    res.status(200).json({
      status: SUCCESS,
      data: {
        product,
      },
    });
  }
);

const deleteProductController = asyncHandler(
  async (req, res) => {
    const product = await deleteProduct(req.params.productId);

    if (!product) {
      return next(AppError.create("Product not found", 404, FAIL));
    }

    res.status(200).json({
      status: SUCCESS,
      message: "Product deleted successfully",
      data: {
        product,
      },
    });
  }
);


export {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
};