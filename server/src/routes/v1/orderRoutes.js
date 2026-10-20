import express from "express";
import { authToken } from "../../middlewares/auth.js"; 
import { createOrderController, getMyOrdersController, getMyOrderByIdController, updateMyOrderController, cancelMyOrderController } from "../../controllers/orderController.js";

const router = express.Router();

router.use(authToken);

router.route("/my")
    .get(getMyOrdersController);

router.route("/")
    .post(createOrderController);

router.route("/:orderId")
    .get(getMyOrderByIdController)
    .patch(updateMyOrderController)
    .delete(cancelMyOrderController);

export default router;
