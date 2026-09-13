import {createCategoryController, getAllCategoriesController, getCategoryByIdController, updateCategoryController, deleteCategoryController,} from "../controllers/categoryController.js";
import express from "express";
import validate from "../middlewares/validate.js";
import {createCategoryValidator} from "../validators/categoryValidator.js";

const router = express.Router();

router.route("/")
    .get(getAllCategoriesController)
    .post(createCategoryValidator, validate, createCategoryController);

router.route("/:categoryId")
    .get(getCategoryByIdController)
    .patch(updateCategoryController)
    .delete(deleteCategoryController);

export default router;