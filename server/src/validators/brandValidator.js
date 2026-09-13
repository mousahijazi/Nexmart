import { body } from "express-validator";

export const createBrandValidator = [
  body("nameAr")
    .trim()
    .notEmpty()
    .withMessage("Arabic brand name is required")
    .isLength({ min: 2, max: 32 })
    .withMessage("Arabic name must be between 2 and 32 characters"),

  body("nameEn")
    .trim()
    .notEmpty()
    .withMessage("English brand name is required")
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
];