import {createCategoryController, getAllCategoriesController, getCategoryByIdController, updateCategoryController, deleteCategoryController,} from "../../controllers/categoryController.js";
import express from "express";
import validate from "../../middlewares/validate.js";
import {createCategoryValidator} from "../../validators/categoryValidator.js";
import { uploadCategoryImage } from "../../middlewares/uploadmiddleware/uploadCategory.js";

const router = express.Router();

router.route("/")
    .get(getAllCategoriesController)
    .post(uploadCategoryImage, createCategoryValidator, validate, createCategoryController);

router.route("/:categoryId")
    .get(getCategoryByIdController)
    .patch(updateCategoryController)
    .delete(deleteCategoryController);

export default router;