import { body } from "express-validator";

export const registerValidator = [
  body("firstName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters")
    .isLength({ max: 30 })
    .withMessage("First name must not exceed 30 characters"),

  body("lastName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters")
    .isLength({ max: 30 })
    .withMessage("Last name must not exceed 30 characters"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("phoneNumber")
    .trim()
    .matches(/^[0-9+\-\s()]*$/)
    .withMessage("Please enter a valid phone number"),
];