import { body, param } from "express-validator";

export const createReviewValidator = [
  param("productId")
    .isMongoId()
    .withMessage("Invalid product ID"),

  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),

  body("comment")
    .trim()
    .notEmpty()
    .withMessage("Comment is required"),
];