import mongoose from "mongoose";
import AppError from "../../utils/AppError.js";
import { findAllOrders, countAllOrders, countOrdersByStatus } from "../../repositories/orderRepository.js";

const ORDER_STATUSES = [
    "pending",
    "confirmed",
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

const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getAdminOrdersService = async (query) => {
    const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 10));

    const filter = {};

    if (query.orderStatus) {
        if (!ORDER_STATUSES.includes(query.orderStatus)) {
            throw AppError.create("Invalid order status", 400);
        }

        filter.orderStatus = query.orderStatus;
    }

    if (query.paymentStatus) {
        if (!PAYMENT_STATUSES.includes(query.paymentStatus)) {
            throw AppError.create("Invalid payment status", 400);
        }

        filter.paymentStatus = query.paymentStatus;
    }

    const search = query.search?.trim();

    if (search) {
        const safeSearch = escapeRegex(search);
        const searchRegex = new RegExp(safeSearch, "i");

        const searchConditions = [
            { "shippingInfo.firstName": searchRegex },
            { "shippingInfo.lastName": searchRegex },
            { "shippingInfo.phone": searchRegex },
            { paymentId: searchRegex },
        ];

        if (mongoose.isValidObjectId(search)) {
            searchConditions.push({
                _id: new mongoose.Types.ObjectId(search),
            });
        }

        filter.$or = searchConditions;
    }

    const [orders, total] = await Promise.all([
        findAllOrders({ filter, page, limit }),
        countAllOrders(filter),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

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
    const [total, pending, confirmed, paid] = await Promise.all([
        countAllOrders(),
        countOrdersByStatus("orderStatus", "pending"),
        countOrdersByStatus("orderStatus", "confirmed"),
        countOrdersByStatus("paymentStatus", "paid"),
    ]);

    return {
        total,
        pending,
        confirmed,
        paid,
    };
};

export {
    getAdminOrdersService,
    getAdminOrderStats,
};
