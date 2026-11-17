import mongoose from "mongoose";
import AppError from "../../utils/AppError.js";
import { findAllOrders, findOrderById, countAllOrders, countOrdersByStatus, updateOrderConditionally } from "../../repositories/orderRepository.js";
import { findOrderItemsPage, countOrderItemsByOrderId } from "../../repositories/orderItemRepository.js";
import { ERROR, FAIL } from "../../utils/httpStatusText.js";
import getAuthenticatedUserId from "../../utils/getAuthenticatedUserId.js";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "onHold",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

const SHIPPING_DECISIONS = [
  "pending",
  "approved",
  "rejected",
];

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const parsePagination = (query = {}) => {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);

  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 10));

  return { page, limit };
};

const getAdminOrdersService = async (query = {}) => {
  const { page, limit } = parsePagination(query);
  const conditions = [];

  if (query.orderStatus) {
    if (!ORDER_STATUSES.includes(query.orderStatus)) {
      throw AppError.create("Invalid order status", 400, FAIL);
    }

    conditions.push({ orderStatus: query.orderStatus });
  }

  if (query.paymentStatus) {
    if (!PAYMENT_STATUSES.includes(query.paymentStatus)) {
      throw AppError.create("Invalid payment status", 400, FAIL);
    }

    conditions.push({ paymentStatus: query.paymentStatus });
  }

  if (query.shippingDecision) {
    if (!SHIPPING_DECISIONS.includes(query.shippingDecision)) {
      throw AppError.create("Invalid shipping decision", 400, FAIL);
    }

    conditions.push({ shippingDecision: query.shippingDecision });

    if (["pending", "rejected"].includes(query.shippingDecision)) {
      conditions.push({
        orderStatus: "onHold",
        paymentStatus: "paid",
      });
    }

    if (query.shippingDecision === "approved") {
      conditions.push({
        orderStatus: { $in: ["shipped", "delivered"] },
        paymentStatus: "paid",
      });
    }
  }

  const search = typeof query.search === "string" ? query.search.trim() : "";

  if (search.length > 100) {
    throw AppError.create("Search query cannot exceed 100 characters", 400, FAIL);
  }

  if (search) {
    const searchRegex = new RegExp(escapeRegex(search), "i");

    const searchConditions = [
      { "shippingInfo.firstName": searchRegex },
      { "shippingInfo.lastName": searchRegex },
      { "shippingInfo.phone": searchRegex },
      { paymentId: searchRegex },
    ];

    if (mongoose.isValidObjectId(search)) {
      searchConditions.push({ _id: new mongoose.Types.ObjectId(search) });
    }

    conditions.push({ $or: searchConditions });
  }

  const filter = conditions.length ? { $and: conditions } : {};

  const [orders, total] = await Promise.all([
    findAllOrders({ filter, page, limit }),
    countAllOrders(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

const getAdminOrderStats = async () => {
  const [total, pending, confirmed, onHold, shipped, delivered, cancelled, paid, failed, refunded, shippingPending, shippingRejected, shippingApproved] = await Promise.all([
    countAllOrders(),
    countOrdersByStatus("orderStatus", "pending"),
    countOrdersByStatus("orderStatus", "confirmed"),
    countOrdersByStatus("orderStatus", "onHold"),
    countOrdersByStatus("orderStatus", "shipped"),
    countOrdersByStatus("orderStatus", "delivered"),
    countOrdersByStatus("orderStatus", "cancelled"),
    countOrdersByStatus("paymentStatus", "paid"),
    countOrdersByStatus("paymentStatus", "failed"),
    countOrdersByStatus("paymentStatus", "refunded"),
    countAllOrders({
      orderStatus: "onHold",
      paymentStatus: "paid",
      shippingDecision: "pending",
    }),
    countAllOrders({
      orderStatus: "onHold",
      paymentStatus: "paid",
      shippingDecision: "rejected",
    }),
    countAllOrders({
      shippingDecision: "approved",
      orderStatus: { $in: ["shipped", "delivered"] },
    }),
  ]);

  return {
    total,
    pending,
    confirmed,
    onHold,
    shipped,
    delivered,
    cancelled,
    paid,
    failed,
    refunded,
    shippingPending,
    shippingRejected,
    shippingApproved,
  };
};

const getAdminOrderItemsService = async (orderId, query = {}) => {
  if (!mongoose.isValidObjectId(orderId)) {
    throw AppError.create("Invalid order ID", 400, FAIL);
  }

  const order = await findOrderById(orderId);

  if (!order) {
    throw AppError.create("Order not found", 404, ERROR);
  }

  const { page, limit } = parsePagination(query);

  const [items, total] = await Promise.all([
    findOrderItemsPage(order._id, { page, limit }),
    countOrderItemsByOrderId(order._id),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    orderId: order._id,
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

const rejectShippingOrderService = async (currentUser, orderId, body = {}) => {
  if (!mongoose.isValidObjectId(orderId)) {
    throw AppError.create("Invalid order ID", 400, FAIL);
  }

  const reason = typeof body.reason === "string" ? body.reason.trim() : "";

  if (!reason) {
    throw AppError.create("A rejection reason is required", 400, FAIL);
  }

  if (reason.length > 1000) {
    throw AppError.create("Rejection reason cannot exceed 1000 characters", 400, FAIL);
  }

  const adminId = getAuthenticatedUserId(currentUser);
  const now = new Date();

  const order = await updateOrderConditionally(
    {
      _id: orderId,
      orderStatus: "onHold",
      paymentStatus: "paid",
      shippingDecision: { $in: ["pending", "rejected"] },
    },
    {
      $set: {
        shippingDecision: "rejected",
        shippingDecisionReason: reason,
        shippingDecisionAt: now,
        shippingDecisionBy: adminId,
      },
      $push: {
        shippingDecisionHistory: {
          decision: "rejected",
          reason,
          decidedAt: now,
          decidedBy: adminId,
        },
      },
    }
  );

  if (order) {
    return order;
  }

  const existingOrder = await findOrderById(orderId);

  if (!existingOrder) {
    throw AppError.create("Order not found", 404, ERROR);
  }

  throw AppError.create("Only paid orders awaiting shipment can be rejected", 409, FAIL);
};

const shipOrderService = async (currentUser, orderId, body = {}) => {
  if (!mongoose.isValidObjectId(orderId)) {
    throw AppError.create("Invalid order ID", 400, FAIL);
  }

  const reason = typeof body.reason === "string" ? body.reason.trim() : "";

  if (!reason) {
    throw AppError.create("An approval reason is required", 400, FAIL);
  }

  if (reason.length > 1000) {
    throw AppError.create("Approval reason cannot exceed 1000 characters", 400, FAIL);
  }

  const adminId = getAuthenticatedUserId(currentUser);
  const now = new Date();

  const order = await updateOrderConditionally(
    {
      _id: orderId,
      orderStatus: "onHold",
      paymentStatus: "paid",
      shippingDecision: { $in: ["pending", "rejected"] },
    },
    {
      $set: {
        orderStatus: "shipped",
        shippingDecision: "approved",
        shippingDecisionReason: reason,
        shippingDecisionAt: now,
        shippingDecisionBy: adminId,
        shippedAt: now,
        shippedBy: adminId,
      },
      $push: {
        shippingDecisionHistory: {
          decision: "approved",
          reason,
          decidedAt: now,
          decidedBy: adminId,
        },
      },
      $unset: {
        shippingHoldReason: "",
        shippingHoldAt: "",
        shippingHoldBy: "",
      },
    }
  );

  if (order) return order;

  const existingOrder = await findOrderById(orderId);

  if (!existingOrder) {
      throw AppError.create("Order not found", 404, ERROR);
  }

  throw AppError.create("Only paid orders awaiting shipment can be approved", 409, FAIL);
};

const deliverOrderService = async (currentUser, orderId) => {
  if (!mongoose.isValidObjectId(orderId)) {
    throw AppError.create("Invalid order ID", 400, FAIL);
  }

  const order = await updateOrderConditionally(
    {
      _id: orderId,
      orderStatus: "shipped",
      paymentStatus: "paid",
    },
    {
      $set: {
        orderStatus: "delivered",
      },
    }
  );

  if (order) {
    return order;
  }

  const existingOrder = await findOrderById(orderId);

  if (!existingOrder) {
    throw AppError.create("Order not found", 404, ERROR);
  }

  throw AppError.create("Only paid shipped orders can be marked as delivered", 409, FAIL);
};


export {
  getAdminOrdersService,
  getAdminOrderStats,
  getAdminOrderItemsService,
  rejectShippingOrderService,
  shipOrderService,
  deliverOrderService,
};