import asyncHandler from "../../middlewares/asyncHandler.js";
import { SUCCESS } from "../../utils/httpStatusText.js";
import { getAdminOrdersService, getAdminOrderStats } from "../../service/orders/adminOrderService.js";

const getAdminOrdersController = asyncHandler(async (req, res) => {
    const [result, stats] = await Promise.all([
        getAdminOrdersService(req.query),
        getAdminOrderStats(),
    ]);

    res.status(200).json({
        status: SUCCESS,
        data: {
            ...result,
            stats,
        },
    });
});

export { getAdminOrdersController };