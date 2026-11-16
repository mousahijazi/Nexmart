import express from "express";
import { authToken } from "../../../middlewares/auth.js";
import { authorizeRoles } from "../../../middlewares/role.js";
import { getAdminOrdersController, getAdminOrderItemsController, rejectShippingOrderController, shipOrderController, deliverOrderController } from "../../../controllers/orders/adminOrderController.js";

const router = express.Router();

router.use(authToken);
router.use(authorizeRoles("ADMIN"));

router.get("/", getAdminOrdersController);
router.get("/:orderId/items", getAdminOrderItemsController);

router.patch("/:orderId/reject", rejectShippingOrderController);
router.patch("/:orderId/deliver", deliverOrderController);
router.post("/:orderId/ship", shipOrderController);

export default router;