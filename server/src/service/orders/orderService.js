import mongoose from "mongoose";
import Product from "../../model/Product.js";
import AppError from "../../utils/AppError.js";
import { ERROR, FAIL } from "../../utils/httpStatusText.js";
import { priceCart } from "../cartService.js";
import { toMinorUnits, fromMinorUnits } from "../../utils/moneyUtils.js";
import getAuthenticatedUserId from "../../utils/getAuthenticatedUserId.js";
import { createOrder, findUserOrderById, findOrdersByUser, countUserOrders } from "../../repositories/orderRepository.js";
import { createOrderItems, findItemsByOrderId, deleteItemsByOrderId } from "../../repositories/orderItemRepository.js";

const SHIPPING_PRICE_MINOR = 1500;
const FREE_SHIPPING_THRESHOLD_MINOR = 20000;
const TAX_RATE = 0.05;
const VALID_COUPON = "mousa";

const calculateOrderTotals = (subtotal) => {
    const subtotalMinor = toMinorUnits(subtotal);
    const taxMinor = Math.round(subtotalMinor * TAX_RATE);
    const shippingMinor = subtotalMinor > FREE_SHIPPING_THRESHOLD_MINOR ? 0 : SHIPPING_PRICE_MINOR;

    return { subtotalMinor, taxMinor, shippingMinor };
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

    return {
        firstName: shippingInfo.firstName.trim(),
        lastName: shippingInfo.lastName.trim(),
        phone: shippingInfo.phone.trim(),
        city: shippingInfo.city.trim(),
        address: shippingInfo.address.trim(),
        notes: typeof shippingInfo.notes === "string" ? shippingInfo.notes.trim() : null,
    };
};

const calculatePricing = async (items, couponInput = "") => {
    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
        throw AppError.create("Order must contain between 1 and 50 items", 400, FAIL);
    }

    const requestedItems = items.map((item) => {
        if (!item || typeof item.productId !== "string" || !mongoose.isValidObjectId(item.productId)) {
            throw AppError.create("Invalid product ID", 400, FAIL);
        }

        if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) {
            throw AppError.create("Quantity must be an integer between 1 and 100", 400, FAIL);
        }

        return { productId: item.productId, quantity: item.quantity };
    });

    const pricedCart = await priceCart(requestedItems);

    if (!pricedCart.canCheckout) {
        throw AppError.create("Some products are unavailable or quantities are invalid", 409, FAIL);
    }

    const subtotalMinor = toMinorUnits(pricedCart.totals.subtotal);
    const { taxMinor, shippingMinor } = calculateOrderTotals(pricedCart.totals.subtotal);
    const normalizedCoupon = typeof couponInput === "string" ? couponInput.trim().toLowerCase() : "";

    // todo
    if (normalizedCoupon && normalizedCoupon !== VALID_COUPON) {
        throw AppError.create("Invalid coupon code", 400, FAIL);
    }

    const discountMinor = normalizedCoupon ? taxMinor : 0;
    const finalTaxMinor = taxMinor - discountMinor;
    const grandTotalMinor = subtotalMinor + shippingMinor + finalTaxMinor;

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

const replaceMyOrderItemsService = async (currentUser, orderId, body) => {
    const userId = getAuthenticatedUserId(currentUser);

    if (!mongoose.isValidObjectId(orderId)) {
        throw AppError.create("Invalid order ID", 400, FAIL);
    }

    const pricing = await calculatePricing(body.items, body.coupon);

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

            for (const item of oldItems) {
                await Product.updateOne(
                    { _id: item.product },
                    { $inc: { stock: item.quantity } },
                    { session }
                );
            }

            for (const item of pricing.pricedCart.items) {
                const stockResult = await Product.updateOne(
                    {
                        _id: item.productId,
                        stock: { $gte: item.quantity },
                        isActive: true,
                        archivedByCategory: { $ne: true },
                        archivedByBrand: { $ne: true },
                    },
                    { $inc: { stock: -item.quantity } },
                    { session }
                );

                if (stockResult.modifiedCount !== 1) {
                    throw AppError.create(`Insufficient stock for product ${item.productId}`, 409, FAIL);
                }
            }

            await deleteItemsByOrderId(order._id, session);

            const newItems = pricing.pricedCart.items.map((item) => ({
                order: order._id,
                product: item.productId,
                productTitle: item.title,
                thumbnail: item.mainImage || null,
                price: item.pricing.finalPrice,
                quantity: item.quantity,
                subtotal: item.lineTotal,
            }));

            await createOrderItems(newItems, session);

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

const createOrderService = async (currentUser, body) => {
    const userId = getAuthenticatedUserId(currentUser);
    const shippingInfo = normalizeShippingInfo(body.shippingInfo);
    const pricing = await calculatePricing(body.items, body.coupon);

    const session = await mongoose.startSession();

    let createdOrder;

    try {
        await session.withTransaction(async () => {
            for (const item of pricing.pricedCart.items) {
                const stockResult = await Product.updateOne(
                    {
                        _id: item.productId,
                        stock: { $gte: item.quantity },
                        isActive: true,
                        archivedByCategory: { $ne: true },
                        archivedByBrand: { $ne: true },
                    },
                    {
                        $inc: { stock: -item.quantity },
                    },
                    { session }
                );

                if (stockResult.modifiedCount !== 1) {
                    throw AppError.create(`Insufficient stock for product ${item.productId}`, 409, FAIL);
                }
            }

            const order = await OrderCreateInTransaction(
                {
                    user: userId,
                    shippingInfo,
                    currency: "SAR",
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

            const orderItems = pricing.pricedCart.items.map((item) => ({
                order: order._id,
                product: item.productId,
                productTitle: {
                    ar: item.title.ar,
                    en: item.title.en
                },
                mainImage: item.mainImage || null,
                price: item.pricing.finalPrice,
                quantity: item.quantity,
                subtotal: item.lineTotal,
            }));

            await createOrderItems(orderItems, session);

            createdOrder = order;
        });
    } finally {
        await session.endSession();
    }

    const items = await findItemsByOrderId(createdOrder._id);

    return { order: createdOrder, items };
};

const OrderCreateInTransaction = async (data, session) => {
    return createOrder(data, session);
};

const getMyOrdersService = async (currentUser, query = {}) => {
    const userId = getAuthenticatedUserId(currentUser);

    const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, Number.parseInt(query.limit, 10) || 10));

    const [orders, total] = await Promise.all([findOrdersByUser(userId, { page, limit }), countUserOrders(userId)]);

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

const getMyOrderByIdService = async (currentUser, orderId) => {
    const userId = getAuthenticatedUserId(currentUser);

    if (!mongoose.isValidObjectId(orderId)) {
        throw AppError.create("Invalid order ID", 400, FAIL);
    }

    const order = await findUserOrderById(orderId, userId);
    if (!order) {
        throw AppError.create("Order not found", 404, ERROR);
    }

    const items = await findItemsByOrderId(order._id);

    return { order, items };
};

const updateMyOrderService = async (currentUser, orderId, body) => {
    const userId = getAuthenticatedUserId(currentUser);

    if (!mongoose.isValidObjectId(orderId)) {
        throw AppError.create("Invalid order ID", 400, FAIL);
    }

    const shippingInfo = normalizeShippingInfo(body.shippingInfo);
    const order = await findUserOrderById(orderId, userId);

    if (!order) {
        throw AppError.create("Order not found", 404, ERROR);
    }

    // todo
    if (order.orderStatus !== "pending" || order.paymentStatus !== "pending") {
        throw AppError.create("Only pending unpaid orders can be edited", 409, FAIL);
    }

    order.shippingInfo = shippingInfo;
    await order.save();

    return order;
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

            if (order.orderStatus !== "pending" || order.paymentStatus !== "pending") {
                throw AppError.create("Only pending unpaid orders can be cancelled", 409, FAIL);
            }

            const items = await findItemsByOrderId(order._id, session);

            for (const item of items) {
                await Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } }, { session });
            }

            order.orderStatus = "cancelled";
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
