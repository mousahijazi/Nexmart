import asyncHandler from "../middlewares/asyncHandler.js";
import { SUCCESS } from "../utils/httpStatusText.js";
import { verifyPaymentService } from "../service/paymentService.js";

// const createPaymentIntentController = asyncHandler(async (req, res) => {
//     const result = await createPaymentIntentService(req.currentUser, req.body.orderId);

//     res.status(201).json({
//         status: SUCCESS,
//         data: result,
//     });
// });

const verifyPaymentController = asyncHandler(async (req, res) => {
    const result = await verifyPaymentService(req.currentUser, req.body.paymentId, req.body.orderId);

    res.status(200).json({
        status: SUCCESS,
        data: result,
    });
});

export {
    // createPaymentIntentController,
    verifyPaymentController,
};
