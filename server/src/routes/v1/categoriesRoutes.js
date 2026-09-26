import {createCategoryController, getAllCategoriesController, getCategoryByIdController, updateCategoryController, updateCategoryStatusController, deleteCategoryController,} from "../../controllers/categoryController.js";
import express from "express";
import validate from "../../middlewares/validate.js";
import { uploadCategoryImage, uploadCategoryUpdateImage } from "../../middlewares/uploadmiddleware/uploadCategory.js";
import { authToken } from "../../middlewares/auth.js";
import { authorizeRoles } from "../../middlewares/role.js";
import { StatusValidator } from "../../validators/statusSchema.js";
import optionalAuth from "../../middlewares/optionalAuth.js";
import checkUserRole from "../../middlewares/checkUserRole.js";

const router = express.Router();

router.route("/")
    .get(optionalAuth, checkUserRole, getAllCategoriesController)
    .post(authToken, authorizeRoles("ADMIN"), uploadCategoryImage, validate, createCategoryController);

router.route("/:categoryId")
    .get(optionalAuth, checkUserRole, getCategoryByIdController)
    .patch(authToken, authorizeRoles("ADMIN"), uploadCategoryUpdateImage, validate, updateCategoryController)
    .delete(authToken, authorizeRoles("ADMIN"), deleteCategoryController);

router.route("/:categoryId/status")
    .patch(authToken, authorizeRoles("ADMIN"), StatusValidator, validate, updateCategoryStatusController);
    
export default router;