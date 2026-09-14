import {createBrandController, getAllBrandsController, getBrandByIdController, updateBrandController, deleteBrandController} from "../controllers/brandController.js";
import express from "express";
import validate from "../middlewares/validate.js";
import {createBrandValidator} from "../validators/brandValidator.js";
import { uploadImage } from "../middlewares/upload.js";

const router = express.Router();
const upload = uploadImage("brands");

router.route("/")
    .get(getAllBrandsController)
    .post(upload.single("logo"), createBrandValidator, validate, createBrandController);

router.route("/:brandId")
    .get(getBrandByIdController)
    .patch(updateBrandController)
    .delete(deleteBrandController);

export default router;