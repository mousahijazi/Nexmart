import asyncHandler from "../../middlewares/asyncHandler.js";
import { SUCCESS } from "../../utils/httpStatusText.js";
import { getMyOrderByIdService } from "../../service/orders/orderService.js";

const getMyOrderItemsController = asyncHandler(
    async (req, res) => {
        const result = await getMyOrderByIdService(req.currentUser, req.params.orderId);

        res.status(200).json({
            status: SUCCESS,
            data: {
                orderId: result.order._id,
                items: result.items,
                pagination: result.pagination,
            },
        });
    }
);

export { getMyOrderItemsController };
