import express from "express";
import { createSeasonController, getAllSeasonsController, getSeasonByIdController, updateSeasonController, deleteSeasonController } from "../../controllers/seasonController.js";
import { authToken } from "../../middlewares/auth.js";
import { authorizeRoles } from "../../middlewares/role.js";
import { createSeasonValidator, updateSeasonValidator } from "../../validators/seasonValidator.js";

const router = express.Router();

router.route("/")
  .get(getAllSeasonsController)
  .post(authToken, authorizeRoles("ADMIN"), createSeasonValidator, createSeasonController);

router.route("/:seasonId")
  .get(getSeasonByIdController)
  .patch(authToken, authorizeRoles("ADMIN"), updateSeasonValidator, updateSeasonController)
  .delete(authToken, authorizeRoles("ADMIN"), deleteSeasonController);

export default router;