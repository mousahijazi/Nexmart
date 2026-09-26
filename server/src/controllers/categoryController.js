import {createCategory, getAllCategories, getCategoryById, updateCategory, updateCategoryStatus, deleteCategory} from "../service/categoryService.js";
import AppError from "../utils/AppError.js";
import { FAIL, SUCCESS } from "../utils/httpStatusText.js";
import { formatCategoryData, formatCategoryUpdateData } from "../utils/categoryDataFormatter.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const getAllCategoriesController = async (req, res) => {
    const {page = 1, limit = 10} = req.query;

    const result = await getAllCategories({page: Number(page), limit: Number(limit)}, req?.userRole);

    res.status(200).json({
        status: SUCCESS,
        data: result,
    });
};

const getCategoryByIdController = asyncHandler(
    async (req, res, next) => {
        const category = await getCategoryById(req.params.categoryId, req?.userRole);

        if (!category) {
            return next(AppError.create("Category not found", 404, FAIL));
        }

        res.status(200).json({
            status: SUCCESS,
            data: {
                category,
            },
        });
    }
);

const createCategoryController = async (req, res) => {
    const categoryData = formatCategoryData(req);
    const category = await createCategory(categoryData);

    res.status(201).json({
        status: SUCCESS,
        data: {
            category,
        },
    });
};

const updateCategoryController = asyncHandler(
  async (req, res, next) => {
    const categoryData = formatCategoryUpdateData(req);
    const category = await updateCategory(req.params.categoryId, categoryData);

    if (!category) {
      return next(AppError.create("Category not found", 404, FAIL));
    }

    res.status(200).json({
      status: SUCCESS,
      data: {
        category,
      },
    });
  }
);

const updateCategoryStatusController = asyncHandler(
  async (req, res, next) => {
    const { isActive } = req.body;

    const category = await updateCategoryStatus(req.params.categoryId, isActive);

    res.status(200).json({
      status: SUCCESS,
      data: {
        category,
      },
    });
  }
);

const deleteCategoryController = asyncHandler(
    async (req, res, next) => {
        const category = await deleteCategory(req.params.categoryId);

        if (!category) {
            return next(AppError.create("Category not found", 404, FAIL));
        }

        res.status(200).json({
            status: SUCCESS,
            data: {
                category,
            },
        });
    }
);

export {
    createCategoryController,
    getAllCategoriesController,
    getCategoryByIdController,
    updateCategoryController,
    updateCategoryStatusController,
    deleteCategoryController,
};