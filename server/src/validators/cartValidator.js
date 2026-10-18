import { body } from "express-validator";

export const MAX_CART_ITEMS = 50;
export const MAX_ITEM_QUANTITY = 100;

const isString = (value) => typeof value === "string";
const isStringOrNumber = (value) => typeof value === "string" || typeof value === "number";

export const priceCartValidator = [
  body("items")
    .isArray({ min: 1, max: MAX_CART_ITEMS })
    .withMessage(`items must be an array of 1 to ${MAX_CART_ITEMS} elements`),

  body("items.*.productId")
    .custom(isString)
    .withMessage("Invalid product ID")
    .bail()
    .isMongoId()
    .withMessage("Invalid product ID"),

  body("items.*.quantity")
    .custom(isStringOrNumber)
    .withMessage(`Quantity must be an integer between 1 and ${MAX_ITEM_QUANTITY}`)
    .bail()
    .isInt({ min: 1, max: MAX_ITEM_QUANTITY })
    .withMessage(`Quantity must be an integer between 1 and ${MAX_ITEM_QUANTITY}`)
    .toInt(),
];