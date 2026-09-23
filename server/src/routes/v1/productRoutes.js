import express from "express";
import {createProductController, getAllProductsController, getProductByIdController, updateProductController, updateProductStatusController , deleteProductController} from "../../controllers/productController.js";
import { uploadProductImages, uploadProductUpdateImages } from "../../middlewares/uploadmiddleware/uploadProductMiddleware.js";
import validate from "../../middlewares/validate.js";
import { authToken } from "../../middlewares/auth.js";
import { authorizeRoles } from "../../middlewares/role.js";
import { productStatusValidator } from "../../validators/productStatusSchema.js";
import checkUserRole from "../../middlewares/checkUserRole.js";
import optionalAuth from "../../middlewares/optionalAuth.js";

const router = express.Router();

router.route("/")
  .get(optionalAuth, checkUserRole, getAllProductsController)
  .post(authToken, authorizeRoles("ADMIN"), uploadProductImages, validate, createProductController);

router.route("/:productId")
  .get(optionalAuth, checkUserRole, getProductByIdController)
  .patch(authToken, authorizeRoles("ADMIN"), uploadProductUpdateImages, validate, updateProductController)
  .delete(authToken, authorizeRoles("ADMIN"), deleteProductController);

router.route("/:productId/status")
  .patch(authToken, authorizeRoles("ADMIN"), productStatusValidator, validate, updateProductStatusController);

export default router;