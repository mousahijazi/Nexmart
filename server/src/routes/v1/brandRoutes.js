import {createBrandController, getAllBrandsController, getBrandByIdController, updateBrandController, deleteBrandController} from "../../controllers/brandController.js";
import express from "express";
import validate from "../../middlewares/validate.js";
import { uploadBrandLogo } from "../../middlewares/uploadmiddleware/uploadBrand.js";
import { authToken } from "../../middlewares/auth.js";
import { authorizeRoles } from "../../middlewares/role.js";

const router = express.Router();

router.route("/")
    .get(getAllBrandsController)
    .post(authToken, authorizeRoles("ADMIN"), uploadBrandLogo, validate, createBrandController);

router.route("/:brandId")
    .get(getBrandByIdController)
    .patch(authToken, authorizeRoles("ADMIN"), updateBrandController)
    .delete(authToken, authorizeRoles("ADMIN"), deleteBrandController);

export default router;