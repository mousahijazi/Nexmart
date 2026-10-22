import asyncHandler from "../middlewares/asyncHandler.js";
import { SUCCESS } from "../utils/httpStatusText.js";
import { createOrderService, getMyOrdersService, getMyOrderByIdService, updateMyOrderService, cancelMyOrderService, replaceMyOrderItemsService } from "../service/orderService.js";

const createOrderController = asyncHandler(async (req, res) => {
    const result = await createOrderService(req.currentUser, req.body);

    res.status(201).json({
        status: SUCCESS,
        data: result,
    });
});

const getMyOrdersController = asyncHandler(async (req, res) => {
    const result = await getMyOrdersService(req.currentUser, req.query);

    res.status(200).json({
        status: SUCCESS,
        data: result,
    });
});

const getMyOrderByIdController = asyncHandler(async (req, res) => {
    const result = await getMyOrderByIdService(req.currentUser, req.params.orderId);

    res.status(200).json({
        status: SUCCESS,
        data: result,
    });
});

const updateMyOrderController = asyncHandler(async (req, res) => {
    const order = await updateMyOrderService(req.currentUser, req.params.orderId, req.body);

    res.status(200).json({
        status: SUCCESS,
        data: { order },
    });
});

const cancelMyOrderController = asyncHandler(async (req, res) => {
    const order = await cancelMyOrderService(req.currentUser, req.params.orderId);

    res.status(200).json({
        status: SUCCESS,
        data: { order },
    });
});

const replaceMyOrderItemsController = asyncHandler(async (req, res) => {
    const result = await replaceMyOrderItemsService(req.currentUser, req.params.orderId, req.body);

    res.status(200).json({
        status: SUCCESS,
        data: result,
    });
});

export {
    createOrderController,
    getMyOrdersController,
    getMyOrderByIdController,
    updateMyOrderController,
    cancelMyOrderController,
    replaceMyOrderItemsController,
};