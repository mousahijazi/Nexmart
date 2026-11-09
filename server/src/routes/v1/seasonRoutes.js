import express from "express";
import { createSeasonController, getAllSeasonsController, getSeasonByIdController, updateSeasonController, updateSeasonStatusController, deleteSeasonController } from "../../controllers/seasonController.js";
import { authToken } from "../../middlewares/auth.js";
import { authorizeRoles } from "../../middlewares/role.js";
import optionalAuth from "../../middlewares/optionalAuth.js";
import checkUserRole from "../../middlewares/checkUserRole.js";
import validate from "../../middlewares/validate.js";
import { StatusValidator } from "../../validators/statusSchema.js";
import { createSeasonValidator, updateSeasonValidator, getAllSeasonsValidator, seasonIdValidator } from "../../validators/seasonValidator.js";

const router = express.Router();

router.route("/")
  .get(optionalAuth, checkUserRole, getAllSeasonsValidator, validate, getAllSeasonsController)
  .post(authToken, authorizeRoles("ADMIN"), createSeasonValidator, validate, createSeasonController);

router.route("/:seasonId")
  .get(optionalAuth, checkUserRole, seasonIdValidator, validate, getSeasonByIdController)
  .patch(authToken, authorizeRoles("ADMIN"), updateSeasonValidator, validate, updateSeasonController)
  .delete(authToken, authorizeRoles("ADMIN"), seasonIdValidator, validate, deleteSeasonController);

router.route("/:seasonId/status")
  .patch(authToken, authorizeRoles("ADMIN"), seasonIdValidator, StatusValidator, validate, updateSeasonStatusController);

export default router;