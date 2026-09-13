import { body } from "express-validator";
import AppError from "../utils/AppError.js";
import { FAIL } from "../utils/httpStatusText.js";

export const createCategoryValidator = [
  body("nameAr")
    .trim()
    .notEmpty()
    .withMessage("Arabic category name is required")
    .isLength({ min: 2, max: 32 })
    .withMessage("Arabic name must be between 2 and 32 characters"),

  body("nameEn")
    .trim()
    .notEmpty()
    .withMessage("English category name is required")
    .isLength({ min: 2, max: 32 })
    .withMessage("English name must be between 2 and 32 characters"),

  body("descriptionAr")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Arabic description must not exceed 500 characters"),

  body("descriptionEn")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("English description must not exceed 500 characters"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),

  body("image").custom((value, { req }) => {
    if (!req.file) {
        throw AppError("Category image is required", 404, FAIL);
    }
    return true;
  }),
];