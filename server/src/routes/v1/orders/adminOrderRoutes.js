import express from "express";
import { authToken } from "../../../middlewares/auth.js";
import { authorizeRoles } from "../../../middlewares/role.js";
import { getAdminOrdersController, getAdminOrderItemsController } from "../../../controllers/orders/adminOrderController.js";

const router = express.Router();

router.use(authToken);
router.use(authorizeRoles("ADMIN"));

router.get("/", getAdminOrdersController);
router.get("/:orderId/items", getAdminOrderItemsController);

export default router;
