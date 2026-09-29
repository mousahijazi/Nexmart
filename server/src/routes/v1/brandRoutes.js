import {createBrandController, getAllBrandsController, getBrandByIdController, updateBrandController, updateBrandStatusController, deleteBrandController} from "../../controllers/brandController.js";
import express from "express";
import validate from "../../middlewares/validate.js";
import { uploadBrandLogo, uploadBrandUpdateImage } from "../../middlewares/uploadmiddleware/uploadBrand.js";
import { authToken } from "../../middlewares/auth.js";
import { authorizeRoles } from "../../middlewares/role.js";
import { StatusValidator } from "../../validators/statusSchema.js";
import checkUserRole from "../../middlewares/checkUserRole.js";
import optionalAuth from "../../middlewares/optionalAuth.js";

const router = express.Router();

router.route("/")
    .get(optionalAuth, checkUserRole, getAllBrandsController)
    .post(authToken, authorizeRoles("ADMIN"), uploadBrandLogo, validate, createBrandController);

router.route("/:brandId")
    .get(optionalAuth, checkUserRole, getBrandByIdController)
    .patch(authToken, authorizeRoles("ADMIN"), uploadBrandUpdateImage, validate, updateBrandController)
    .delete(authToken, authorizeRoles("ADMIN"), deleteBrandController);

router.route("/:brandId/status")
    .patch(authToken, authorizeRoles("ADMIN"), StatusValidator, validate, updateBrandStatusController);

export default router;