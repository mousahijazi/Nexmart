import {createCategoryController, getAllCategoriesController, getCategoryByIdController, updateCategoryController, deleteCategoryController,} from "../../controllers/categoryController.js";
import express from "express";
import validate from "../../middlewares/validate.js";
import { uploadCategoryImage } from "../../middlewares/uploadmiddleware/uploadCategory.js";
import { authToken } from "../../middlewares/auth.js";
import { authorizeRoles } from "../../middlewares/role.js";

const router = express.Router();

router.route("/")
    .get(getAllCategoriesController)
    .post(authToken, authorizeRoles("ADMIN"), uploadCategoryImage, validate, createCategoryController);

router.route("/:categoryId")
    .get(getCategoryByIdController)
    .patch(authToken, authorizeRoles("ADMIN"), updateCategoryController)
    .delete(authToken, authorizeRoles("ADMIN"), deleteCategoryController);

export default router;