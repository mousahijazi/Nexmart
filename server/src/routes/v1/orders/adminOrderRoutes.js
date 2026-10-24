import express from "express";
import { authToken } from "../../../middlewares/auth.js";
import { authorizeRoles } from "../../../middlewares/role.js";
import { getAdminOrdersController } from "../../../controllers/orders/adminOrderController.js";

const router = express.Router();

router.use(authToken);
router.use(authorizeRoles("admin"));

router.get("/", getAdminOrdersController);

export default router;
