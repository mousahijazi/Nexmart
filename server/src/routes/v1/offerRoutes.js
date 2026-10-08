import express from "express";
import { createOfferController, getAllOffersController, getOfferByIdController, updateOfferController, deleteOfferController } from "../../controllers/offerController.js";
import { authToken } from "../../middlewares/auth.js";
import { authorizeRoles } from "../../middlewares/role.js";
import { createOfferValidator, updateOfferValidator } from "../../validators/offerValidator.js";

const router = express.Router();

router.route("/")
  .get(getAllOffersController)
  .post(authToken, authorizeRoles("ADMIN"), createOfferValidator, createOfferController);

router.route("/:offerId")
  .get(getOfferByIdController)
  .patch(authToken, authorizeRoles("ADMIN"), updateOfferValidator, updateOfferController)
  .delete(authToken, authorizeRoles("ADMIN"), deleteOfferController);

export default router;