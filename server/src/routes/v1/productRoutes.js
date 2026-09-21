import express from "express";
import {createProductController, getAllProductsController, getProductByIdController, updateProductController,deleteProductController} from "../../controllers/productController.js";
import { uploadProductImages, uploadProductUpdateImages } from "../../middlewares/uploadmiddleware/uploadProductMiddleware.js";
import validate from "../../middlewares/validate.js";
import { authToken } from "../../middlewares/auth.js";
import { authorizeRoles } from "../../middlewares/role.js";

const router = express.Router();

router.route("/")
  .get(getAllProductsController)
  .post(authToken, authorizeRoles("ADMIN"), uploadProductImages, validate, createProductController);

router.route("/:productId")
  .get(getProductByIdController)
  .patch(authToken, authorizeRoles("ADMIN"), uploadProductUpdateImages, validate, updateProductController)
  .delete(authToken, authorizeRoles("ADMIN"), deleteProductController);

export default router;