import express from "express";
import { createSeasonController, getAllSeasonsController, getSeasonByIdController, updateSeasonController, updateSeasonStatusController, deleteSeasonController } from "../../controllers/seasonController.js";
import { authToken } from "../../middlewares/auth.js";
import { authorizeRoles } from "../../middlewares/role.js";
import optionalAuth from "../../middlewares/optionalAuth.js";
import checkUserRole from "../../middlewares/checkUserRole.js";
import validate from "../../middlewares/validate.js";
import { StatusValidator } from "../../validators/statusSchema.js";
import { createSeasonValidator, updateSeasonValidator } from "../../validators/seasonValidator.js";

const router = express.Router();

router.route("/")
  .get(optionalAuth, checkUserRole, getAllSeasonsController)
  .post(authToken, authorizeRoles("ADMIN"), createSeasonValidator, createSeasonController);

router.route("/:seasonId")
  .get(optionalAuth, checkUserRole, getSeasonByIdController)
  .patch(authToken, authorizeRoles("ADMIN"), updateSeasonValidator, updateSeasonController)
  .delete(authToken, authorizeRoles("ADMIN"), deleteSeasonController);

router.route("/:seasonId/status")
  .patch(authToken, authorizeRoles("ADMIN"), StatusValidator, validate, updateSeasonStatusController);

export default router;