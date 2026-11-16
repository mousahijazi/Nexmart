import asyncHandler from "../../middlewares/asyncHandler.js";
import { SUCCESS } from "../../utils/httpStatusText.js";
import { getAdminOrdersService, getAdminOrderStats, getAdminOrderItemsService, rejectShippingOrderService, shipOrderService, deliverOrderService } from "../../service/orders/adminOrderService.js";

const getAdminOrdersController = asyncHandler(
  async (req, res) => {
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
  }
);

const getAdminOrderItemsController = asyncHandler(
  async (req, res) => {
    const result = await getAdminOrderItemsService(req.params.orderId, req.query);

    res.status(200).json({
      status: SUCCESS,
      data: result,
    });
  }
);

const rejectShippingOrderController = asyncHandler(
  async (req, res) => {
    const order = await rejectShippingOrderService(req.currentUser, req.params.orderId, req.body);

    res.status(200).json({
      status: SUCCESS,
      data: { order },
    });
  }
);

const shipOrderController = asyncHandler(
  async (req, res) => {
    const order = await shipOrderService(req.currentUser, req.params.orderId);

    res.status(200).json({
      status: SUCCESS,
      data: { order },
    });
  }
);

const deliverOrderController = asyncHandler(
  async (req, res) => {
    const order = await deliverOrderService(req.currentUser, req.params.orderId);

    res.status(200).json({
      status: SUCCESS,
      data: { order },
    });
  }
);

export {
  getAdminOrdersController,
  getAdminOrderItemsController,
  rejectShippingOrderController,
  shipOrderController,
  deliverOrderController,
};