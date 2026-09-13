import { body } from "express-validator";

const createReviewValidator = [
    body("product")
        .trim()
        .notEmpty()
        .withMessage("Product is required")
        .isMongoId()
        .withMessage("Product ID is invalid"),

    body("rating")
        .notEmpty()
        .withMessage("Rating is required")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5"),

    body("comment")
        .optional()
        .trim(),
];

export default createReviewValidator;