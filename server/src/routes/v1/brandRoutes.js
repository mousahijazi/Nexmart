import {createBrandController, getAllBrandsController, getBrandByIdController, updateBrandController, deleteBrandController} from "../../controllers/brandController.js";
import express from "express";
import validate from "../../middlewares/validate.js";
import {createBrandValidator} from "../../validators/brandValidator.js";
import { uploadBrandLogo } from "../../middlewares/uploadmiddleware/uploadBrand.js";

const router = express.Router();

router.route("/")
    .get(getAllBrandsController)
    .post(uploadBrandLogo, createBrandValidator, validate, createBrandController);

router.route("/:brandId")
    .get(getBrandByIdController)
    .patch(updateBrandController)
    .delete(deleteBrandController);

export default router;