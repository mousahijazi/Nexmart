import { body } from "express-validator";
import Category from "../model/Category.js";
import AppError from "../utils/AppError.js";
import { FAIL } from "../utils/httpStatusText.js";

const createProductValidator = [
    body("titleAr")
        .trim()
        .notEmpty()
        .withMessage("Arabic title is required")
        .isLength({ min: 2 })
        .withMessage("Arabic title must be at least 2 characters"),

    body("titleEn")
        .trim()
        .notEmpty()
        .withMessage("English title is required")
        .isLength({ min: 2 })
        .withMessage("English title must be at least 2 characters"),

    body("descriptionAr")
        .trim()
        .notEmpty()
        .withMessage("Arabic description is required"),

    body("descriptionEn")
        .trim()
        .notEmpty()
        .withMessage("English description is required"),

    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),

    body("category")
    .notEmpty()
    .withMessage("Category ID is required")
    .isMongoId()
    .withMessage("Invalid Category ID format")
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      
      if (!category) {
        throw AppError.create(`Category not found with ID: ${categoryId}`, 404, FAIL);
      }
      return true;
    }),

    body("brand")
        .trim()
        .notEmpty()
        .withMessage("Brand is required"),
        // .isMongoId()
        // .withMessage("Brand ID is invalid"),

    body("stock")
        .notEmpty()
        .withMessage("Stock is required")
        .isInt({ min: 0 })
        .withMessage("Stock must be a positive integer"),
];

export default createProductValidator;