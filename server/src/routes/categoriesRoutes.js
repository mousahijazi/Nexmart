import {createCategoryController, getAllCategoriesController, getCategoryByIdController, updateCategoryController, deleteCategoryController,} from "../controllers/categoryController.js";
import express from "express";
import validate from "../middlewares/validate.js";
import {createCategoryValidator} from "../validators/categoryValidator.js";
import { uploadImage } from "../middlewares/upload.js";
import Category from "../model/Category.js";

const router = express.Router();
const upload = uploadImage("categories", Category);

router.route("/")
    .get(getAllCategoriesController)
    .post(upload.single("image"), createCategoryValidator, validate, createCategoryController);

router.route("/:categoryId")
    .get(getCategoryByIdController)
    .patch(updateCategoryController)
    .delete(deleteCategoryController);

export default router;