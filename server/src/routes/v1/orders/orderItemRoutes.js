import express from "express";
import { authToken } from "../../../middlewares/auth.js";
import { getMyOrderItemsController } from "../../../controllers/orders/orderItemController.js";

const router = express.Router();

router.use(authToken);

router.route("/:orderId/items")
    .get(getMyOrderItemsController);

export default router;
