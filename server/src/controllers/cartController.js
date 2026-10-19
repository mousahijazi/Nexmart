import asyncHandler from "../middlewares/asyncHandler.js";
import { priceCart } from "../service/cartService.js";
import { SUCCESS } from "../utils/httpStatusText.js";

const priceCartController = asyncHandler(
    async (req, res) => {
        const result = await priceCart(req.body.items, req.body.coupon);

        res.status(200).json({
            status: SUCCESS,
            data: result,
        });
    }
);

export { priceCartController };