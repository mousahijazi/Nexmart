import mongoose from "mongoose";
import Product from "../../model/Product.js";
import AppError from "../../utils/AppError.js";
import { ERROR, FAIL } from "../../utils/httpStatusText.js";
import { priceCart } from "../cartService.js";
import { toMinorUnits, fromMinorUnits } from "../../utils/moneyUtils.js";
import getAuthenticatedUserId from "../../utils/getAuthenticatedUserId.js";
import { createOrder, findUserOrderById, findOrdersByUser, countUserOrders } from "../../repositories/orderRepository.js";
import { findOrderItemsPage, countOrderItemsByOrderId, createOrderItems, findItemsByOrderId, deleteItemsByOrderId } from "../../repositories/orderItemRepository.js";

const TAX_RATE = 0.05;
const VALID_COUPON = "mousa";

const parsePagination = (pageInput, limitInput, maxLimit = 50) => {
  const page = Math.max(1, Number.parseInt(pageInput, 10) || 1);

  const limit = Math.min(maxLimit, Math.max(1, Number.parseInt(limitInput, 10) || 10));

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

const normalizeShippingInfo = (shippingInfo) => {
  if (!shippingInfo || typeof shippingInfo !== "object") {
    throw AppError.create("Shipping information is required", 400, FAIL);
  }

  const fields = ["firstName", "lastName", "phone", "city", "address"];

  for (const field of fields) {
    if (typeof shippingInfo[field] !== "string" || !shippingInfo[field].trim()) {
      throw AppError.create(`${field} is required`, 400, FAIL);
    }
  }

  if (shippingInfo.notes !== undefined && typeof shippingInfo.notes !== "string") {
    throw AppError.create("Invalid shipping notes", 400, FAIL);
  }

  return {
    firstName: shippingInfo.firstName.trim(),
    lastName: shippingInfo.lastName.trim(),
    phone: shippingInfo.phone.trim(),
    city: shippingInfo.city.trim(),
    address: shippingInfo.address.trim(),
    notes: shippingInfo.notes?.trim() || "",
  };
};

const calculatePricing = async (items, couponInput = "", session = null) => {
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    throw AppError.create("Order must contain between 1 and 50 items", 400, FAIL);
  }

  const seenProductIds = new Set();

  const requestedItems = items.map((item) => {
    if (!item || typeof item.productId !== "string" || !mongoose.isValidObjectId(item.productId)) {
      throw AppError.create("Invalid product ID", 400, FAIL);
    }

    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) {
      throw AppError.create("Quantity must be an integer between 1 and 100", 400, FAIL);
    }

    const productId = item.productId.toLowerCase();

    if (seenProductIds.has(productId)) {
      throw AppError.create("Each product must appear only once in the order", 400, FAIL);
    }

    seenProductIds.add(productId);

    return {
      productId,
      quantity: item.quantity,
    };
  });

  const normalizedCoupon = typeof couponInput === "string" ? couponInput.trim().toLowerCase() : "";

  if (normalizedCoupon && normalizedCoupon !== VALID_COUPON) {
    throw AppError.create("Invalid coupon code", 400, FAIL);
  }

  const pricedCart = await priceCart(requestedItems, "", { session });

  if (!pricedCart.canCheckout) {
    throw AppError.create("Some products are unavailable or quantities are invalid", 409, FAIL);
  }

  const subtotalMinor = toMinorUnits(pricedCart.totals.subtotal);
  const taxMinor = Math.round(subtotalMinor * TAX_RATE);
  const shippingMinor = subtotalMinor > toMinorUnits(200) ? 0 : toMinorUnits(15);

  const discountMinor = normalizedCoupon ? taxMinor : 0;
  const finalTaxMinor = taxMinor - discountMinor;
  const grandTotalMinor = subtotalMinor + finalTaxMinor + shippingMinor;

  return {
    pricedCart,
    couponCode: normalizedCoupon || null,
    subtotal: fromMinorUnits(subtotalMinor),
    tax: fromMinorUnits(finalTaxMinor),
    shipping: fromMinorUnits(shippingMinor),
    discount: fromMinorUnits(discountMinor),
    totalPrice: fromMinorUnits(grandTotalMinor),
  };
};

const createOrderItemsData = (orderId, items) => {
  return items.map((item) => ({
    order: orderId,
    product: item.productId,

    productTitle: {
      ar: item.title.ar,
      en: item.title.en,
    },

    mainImage: item.mainImage || null,
    price: item.pricing.finalPrice,
    quantity: item.quantity,
    subtotal: item.lineTotal,
  }));
};


const changeProductStock = async (productId, quantity, direction, session) => {
  if (![1, -1].includes(direction)) {
    throw new Error("Invalid stock direction");
  }

  const stockExpression = direction === -1 ? { $subtract: ["$stock", quantity] } : { $add: ["$stock", quantity] };

  const filter = { _id: productId };

  if (direction === -1) {
    Object.assign(filter, {
      stock: { $gte: quantity },
      isActive: true,
      archivedByCategory: { $ne: true },
      archivedByBrand: { $ne: true },
    });
  }

  const result = await Product.updateOne(
    filter,
    [
      {
        $set: {
          stock: stockExpression,
          status: {
            $cond: [
              { $gt: [stockExpression, 0] },
              "Available",
              "OutOfStock",
            ],
          },
        },
      },
    ],
    {
      session,
      updatePipeline: true,
    }
  );

  if (result.modifiedCount !== 1) {
    throw AppError.create(direction === -1 ? `Insufficient stock for product ${productId}` : `Unable to restore stock for product ${productId}`, 409, FAIL);
  }
};

const restoreOrderStock = async (items, session) => {
  for (const item of items) {
    await changeProductStock(item.product, item.quantity, 1, session);
  }
};

const reserveCartStock = async (items, session) => {
  for (const item of items) {
    await changeProductStock(item.productId, item.quantity, -1, session);
  }
};

const getMyOrdersService = async (currentUser, query = {}) => {
  const userId = getAuthenticatedUserId(currentUser);
  const { page, limit } = parsePagination(query.page, query.limit, 50);

  const [orders, total] = await Promise.all([
    findOrdersByUser(userId, { page, limit }),
    countUserOrders(userId),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const getMyOrderByIdService = async (currentUser, orderId, query = {}) => {
  const userId = getAuthenticatedUserId(currentUser);

  if (!mongoose.isValidObjectId(orderId)) {
    throw AppError.create("Invalid order ID", 400, FAIL);
  }

  const order = await findUserOrderById(orderId, userId);

  if (!order) {
    throw AppError.create("Order not found", 404, ERROR);
  }

  const { page, limit } = parsePagination(query.page, query.limit, 100);

  const [items, total] = await Promise.all([
    findOrderItemsPage(order._id, { page, limit }),
    countOrderItemsByOrderId(order._id),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    order,
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

const createOrderService = async (currentUser, body) => {
  const userId = getAuthenticatedUserId(currentUser);
  const shippingInfo = normalizeShippingInfo(body.shippingInfo);

  const session = await mongoose.startSession();

  let createdOrder;

  try {
    await session.withTransaction(async () => {
      const pricing = await calculatePricing(body.items, body.coupon, session);

      await reserveCartStock(pricing.pricedCart.items, session);

      const order = await createOrder(
        {
          user: userId,
          shippingInfo,
          currency: pricing.pricedCart.currency,
          subtotal: pricing.subtotal,
          tax: pricing.tax,
          shipping: pricing.shipping,
          couponCode: pricing.couponCode,
          discount: pricing.discount,
          totalPrice: pricing.totalPrice,
          paymentStatus: "pending",
          orderStatus: "pending",
        },
        session
      );

      const orderItems = createOrderItemsData(order._id, pricing.pricedCart.items);
      await createOrderItems(orderItems, session);

      createdOrder = order;
    });
  } finally {
    await session.endSession();
  }

  const items = await findItemsByOrderId(createdOrder._id);

  return {
    order: createdOrder,
    items,
  };
};

const updateMyOrderService = async (currentUser, orderId, body) => {
  const userId = getAuthenticatedUserId(currentUser);

  if (!mongoose.isValidObjectId(orderId)) {
    throw AppError.create("Invalid order ID", 400, FAIL);
  }

  const shippingInfo = normalizeShippingInfo(body.shippingInfo);
  const session = await mongoose.startSession();

  let updatedOrder;

  try {
    await session.withTransaction(async () => {
      const order = await findUserOrderById(orderId, userId, session);

      if (!order) {
        throw AppError.create("Order not found", 404, ERROR);
      }

      if (order.orderStatus !== "pending" || order.paymentStatus !== "pending") {
        throw AppError.create("Only pending unpaid orders can be edited", 409, FAIL);
      }

      order.shippingInfo = shippingInfo;

      await order.save({ session });

      updatedOrder = order;
    });
  } finally {
    await session.endSession();
  }

  return updatedOrder;
};

const replaceMyOrderItemsService = async (currentUser, orderId, body) => {
  const userId = getAuthenticatedUserId(currentUser);

  if (!mongoose.isValidObjectId(orderId)) {
    throw AppError.create("Invalid order ID", 400, FAIL);
  }

  const session = await mongoose.startSession();

  let updatedOrder;

  try {
    await session.withTransaction(async () => {
      const order = await findUserOrderById(orderId, userId, session);

      if (!order) {
        throw AppError.create("Order not found", 404, ERROR);
      }

      if (order.orderStatus !== "pending" || order.paymentStatus !== "pending") {
        throw AppError.create("Only pending unpaid orders can be edited", 409, FAIL);
      }

      const oldItems = await findItemsByOrderId(order._id, session);

      await restoreOrderStock(oldItems, session);
      const pricing = await calculatePricing(body.items, body.coupon, session);

      await reserveCartStock(pricing.pricedCart.items, session);
      await deleteItemsByOrderId(order._id, session);

      const newItems = createOrderItemsData(order._id, pricing.pricedCart.items);
      await createOrderItems(newItems, session);

      order.currency = pricing.pricedCart.currency;
      order.subtotal = pricing.subtotal;
      order.tax = pricing.tax;
      order.shipping = pricing.shipping;
      order.couponCode = pricing.couponCode;
      order.discount = pricing.discount;
      order.totalPrice = pricing.totalPrice;

      await order.save({ session });

      updatedOrder = order;
    });
  } finally {
    await session.endSession();
  }

  const items = await findItemsByOrderId(updatedOrder._id);

  return {
    order: updatedOrder,
    items,
  };
};

const cancelMyOrderService = async (currentUser, orderId) => {
  const userId = getAuthenticatedUserId(currentUser);

  if (!mongoose.isValidObjectId(orderId)) {
    throw AppError.create("Invalid order ID", 400, FAIL);
  }

  const session = await mongoose.startSession();

  let cancelledOrder;

  try {
    await session.withTransaction(async () => {
      const order = await findUserOrderById(orderId, userId, session);

      if (!order) {
        throw AppError.create("Order not found", 404, ERROR);
      }

      if (order.orderStatus !== "pending" || !["pending", "failed"].includes(order.paymentStatus)) {
        throw AppError.create("Only pending unpaid orders can be cancelled", 409, FAIL);
      }

      const items = await findItemsByOrderId(order._id, session);

      if (!items.length) {
        throw AppError.create("Cannot cancel an order without order items", 409, FAIL);
      }

      await restoreOrderStock(items, session);

      order.orderStatus = "cancelled";
      order.cancelledAt = new Date();
      order.cancellationReason = "Cancelled by customer";

      await order.save({ session });

      cancelledOrder = order;
    });
  } finally {
    await session.endSession();
  }

  return cancelledOrder;
};

export {
  createOrderService,
  getMyOrdersService,
  getMyOrderByIdService,
  updateMyOrderService,
  replaceMyOrderItemsService,
  cancelMyOrderService,
};