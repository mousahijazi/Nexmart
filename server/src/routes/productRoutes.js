import express from "express";
import {createProductController, getAllProductsController, getProductByIdController, updateProductController,deleteProductController} from "../controllers/productController.js";
import createProductValidator from "../validators/productValidator.js";
import { uploadProductImages } from "../middlewares/uploadProductMiddleware.js";
import validate from "../middlewares/validate.js";

const router = express.Router();

router.route("/")
  .get(getAllProductsController)
  .post(uploadProductImages, createProductValidator, validate, createProductController);

router.route("/:productId")
  .get(getProductByIdController)
  .patch(updateProductController)
  .delete(deleteProductController);

export default router;