import { body, param, query } from "express-validator";
import AppError from "../utils/AppError.js";
import { FAIL } from "../utils/httpStatusText.js";
import mongoose from "mongoose";

const isValidObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};

export const seasonIdValidator = [
  param("seasonId")
    .custom(isValidObjectId)
    .withMessage("Invalid season ID format"),
];

export const createSeasonValidator = [
  body("name.ar")
    .trim()
    .notEmpty()
    .withMessage("Arabic season name is required")
    .isLength({ min: 2, max: 60 })
    .withMessage("Arabic season name must be between 2 and 60 characters"),

  body("name.en")
    .trim()
    .notEmpty()
    .withMessage("English season name is required")
    .isLength({ min: 2, max: 60 })
    .withMessage("English season name must be between 2 and 60 characters"),

  body("description.ar")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 600 })
    .withMessage("Arabic description cannot exceed 600 characters"),

  body("description.en")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 600 })
    .withMessage("English description cannot exceed 600 characters"),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid ISO date"),

  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("End date must be a valid ISO date")
    .custom((value, { req }) => {
      const start = new Date(req.body.startDate);
      const end = new Date(value);

      if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime())) {
        return true;
      }

      if (end <= start) {
        throw AppError.create("End date must be greater than start date", 400, FAIL)
      }

      return true;
    }),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value")
    .toBoolean(),
];

export const updateSeasonValidator = [
  ...seasonIdValidator,

  body("name.ar")
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage("Arabic season name must be between 2 and 60 characters"),

  body("name.en")
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage("English season name must be between 2 and 60 characters"),

  body("description.ar")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 600 })
    .withMessage("Arabic description cannot exceed 600 characters"),

  body("description.en")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 600 })
    .withMessage("English description cannot exceed 600 characters"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO date"),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO date"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value")
    .toBoolean(),
];

export const getAllSeasonsValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .toInt(),

  query("search")
    .optional()
    .isString()
    .withMessage("Search must be a string")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search cannot exceed 100 characters"),

  query("status")
    .optional()
    .isIn(["", "All Statuses", "Active", "Inactive", "Scheduled", "Expired"])
    .withMessage("Invalid season status"),
];