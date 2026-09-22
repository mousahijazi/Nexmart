import { body } from "express-validator";

export const productStatusValidator = [
  body("isActive")
    .isBoolean()
    .withMessage("isActive must be a boolean value")
    .toBoolean(),
];