import { body } from "express-validator";

export const StatusValidator = [
  body("isActive")
    .isBoolean()
    .withMessage("isActive must be a boolean value")
    .toBoolean(),
];