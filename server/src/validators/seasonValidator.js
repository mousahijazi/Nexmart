import { body, param } from "express-validator";
import mongoose from "mongoose";
import AppError from "../utils/AppError.js";
import { FAIL } from "../utils/httpStatusText.js";

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

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
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw AppError.create("End date must be greater than start date", 400, FAIL);
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
  param("seasonId")
    .custom(isValidObjectId)
    .withMessage("Invalid season ID format"),

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