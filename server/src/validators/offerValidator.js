import { body, param } from "express-validator";
import mongoose from "mongoose";
import AppError from "../utils/AppError.js";
import { FAIL } from "../utils/httpStatusText.js";

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export const createOfferValidator = [
  body("name.ar")
    .trim()
    .notEmpty().withMessage("Arabic offer name is required")
    .isLength({ min: 2, max: 40 }).withMessage("Arabic offer name must be between 2 and 40 characters"),

  body("name.en")
    .trim()
    .notEmpty().withMessage("English offer name is required")
    .isLength({ min: 2, max: 40 }).withMessage("English offer name must be between 2 and 40 characters"),

  body("description.ar")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 600 }).withMessage("Arabic description cannot exceed 600 characters"),

  body("description.en")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 600 }).withMessage("English description cannot exceed 600 characters"),

  body("type")
    .notEmpty().withMessage("Offer type is required")
    .isIn(["percentage", "fixed"]).withMessage("Offer type must be either 'percentage' or 'fixed'"),

  body("targetType")
    .notEmpty().withMessage("Target type is required")
    .isIn(["product", "category"]).withMessage("Target type must be either 'product' or 'category'"),

  body("product")
    .optional({ nullable: true })
    .custom((value, { req }) => {
      if (req.body.targetType === "product" && (!value || !isValidObjectId(value))) {
        throw AppError.create("Valid product ID is required when targetType is 'product'", 400, FAIL);
      }
      return true;
    }),

  body("category")
    .optional({ nullable: true })
    .custom((value, { req }) => {
      if (req.body.targetType === "category" && (!value || !isValidObjectId(value))) {
        throw AppError.create("Valid category ID is required when targetType is 'category'", 400, FAIL);
      }
      return true;
    }),

  body("discount")
    .notEmpty()
    .isNumeric()
    .withMessage("Discount must be a number")
    .custom((value, { req }) => {
      const discount = Number(value);

      if (discount < 0) {
        throw AppError.create("Discount must be at least 0", 400, FAIL);
      }

      if (req.body.type === "percentage" && discount > 100) {
        throw AppError.create("Percentage discount cannot be greater than 100", 400, FAIL);
      }

      return true;
    }),

  body("startDate")
    .notEmpty().withMessage("Start date is required")
    .isISO8601().withMessage("Start date must be a valid ISO date"),

  body("endDate")
    .notEmpty().withMessage("End date is required")
    .isISO8601().withMessage("End date must be a valid ISO date")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw AppError.create("End date must be greater than start date", 400, FAIL);
      }
      return true;
    }),

  body("isActive")
    .optional()
    .isBoolean().withMessage("isActive must be a boolean value")
    .toBoolean(),
];

export const updateOfferValidator = [
  param("offerId")
    .custom(isValidObjectId)
    .withMessage("Invalid offer ID format"),

  body("name.ar")
    .optional()
    .trim()
    .isLength({ min: 2, max: 40 }).withMessage("Arabic offer name must be between 2 and 40 characters"),

  body("name.en")
    .optional()
    .trim()
    .isLength({ min: 2, max: 40 }).withMessage("English offer name must be between 2 and 40 characters"),

  body("description.ar")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 600 }).withMessage("Arabic description cannot exceed 600 characters"),

  body("description.en")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 600 }).withMessage("English description cannot exceed 600 characters"),

  body("type")
    .optional()
    .isIn(["percentage", "fixed"]).withMessage("Offer type must be either 'percentage' or 'fixed'"),

  body("targetType")
    .optional()
    .isIn(["product", "category"]).withMessage("Target type must be either 'product' or 'category'"),

  body("product")
    .optional({ nullable: true })
    .custom((value) => {
      if (value && !isValidObjectId(value)) {
        throw AppError.create("Invalid product ID format", 400, FAIL);
      }
      return true;
    }),

  body("category")
    .optional({ nullable: true })
    .custom((value) => {
      if (value && !isValidObjectId(value)) {
        throw AppError.create("Invalid category ID format", 400, FAIL);
      }
      return true;
    }),

  body("discount")
    .notEmpty()
    .isNumeric()
    .withMessage("Discount must be a number")
    .custom((value, { req }) => {
      const discount = Number(value);

      if (discount < 0) {
        throw AppError.create("Discount must be at least 0", 400, FAIL);
      }

      if (req.body.type === "percentage" && discount > 100) {
        throw AppError.create("Percentage discount cannot be greater than 100", 400, FAIL);
      }

      return true;
    }),

  body("startDate")
    .optional()
    .isISO8601().withMessage("Start date must be a valid ISO date"),

  body("endDate")
    .optional()
    .isISO8601().withMessage("End date must be a valid ISO date"),

  body("isActive")
    .optional()
    .isBoolean().withMessage("isActive must be a boolean value")
    .toBoolean(),
];