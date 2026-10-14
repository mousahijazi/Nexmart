import express from "express";
import { createOfferController, getAllOffersController, getOfferByIdController, updateOfferController, updateOfferStatusController, deleteOfferController } from "../../controllers/offerController.js";
import { authToken } from "../../middlewares/auth.js";
import { authorizeRoles } from "../../middlewares/role.js";
import optionalAuth from "../../middlewares/optionalAuth.js";
import checkUserRole from "../../middlewares/checkUserRole.js";
import validate from "../../middlewares/validate.js";
import { StatusValidator } from "../../validators/statusSchema.js";
import { createOfferValidator, updateOfferValidator } from "../../validators/offerValidator.js";

const router = express.Router();

router.route("/")
  .get(optionalAuth, checkUserRole, getAllOffersController)
  .post(authToken, authorizeRoles("ADMIN"), createOfferValidator, createOfferController);

router.route("/:offerId")
  .get(optionalAuth, checkUserRole, getOfferByIdController)
  .patch(authToken, authorizeRoles("ADMIN"), updateOfferValidator, updateOfferController)
  .delete(authToken, authorizeRoles("ADMIN"), deleteOfferController);

router.route("/:offerId/status")
  .patch(authToken, authorizeRoles("ADMIN"), StatusValidator, validate, updateOfferStatusController);

export default router;