import mongoose from "mongoose";
import Order from "../model/Order.js";
import AppError from "../utils/AppError.js";
import { ERROR, FAIL } from "../utils/httpStatusText.js";
import getAuthenticatedUserId from "../utils/getAuthenticatedUserId.js";

const MOYASAR_API = "https://api.moyasar.com/v1";

const getMoyasarAuth = (key) => {
    return `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`;
};

const moyasarRequest = async (path, options = {}) => {
    const key = usePublishableKey ? process.env.MOYASAR_PUBLISHABLE_KEY : process.env.MOYASAR_SECRET_KEY;
    if (!key) {
        throw AppError.create(usePublishableKey ? "MOYASAR_PUBLISHABLE_KEY is not configured" : "MOYASAR_SECRET_KEY is not configured", 500, ERROR);
    }

    const response = await fetch(`${MOYASAR_API}${path}`, {
        ...options,
        headers: {
            Authorization: getMoyasarAuth(key),
            "Content-Type": "application/json",
            ...options.headers,
        },
        cache: "no-store",
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
        console.error("Moyasar API error:", { status: response.status, message: result?.message });

        throw AppError.create(result?.message || "Moyasar request failed", response.status >= 500 ? 502 : 400, FAIL);
    }

    return result;
};

const getExpectedPaymentDetails = (order) => {
    if (typeof order.totalPrice !== "number" || !Number.isFinite(order.totalPrice) || order.totalPrice <= 0) {
        throw AppError.create("Invalid order amount", 400, FAIL);
    }

    const amount = Math.round(order.totalPrice * 100);

    // todo
    if (!Number.isSafeInteger(amount) || amount < 100) {
        throw AppError.create("Payment amount is below Moyasar's minimum", 400, FAIL);
    }

    return {
        amount,
        currency: "SAR",
        description: `Nexmart Order ${order._id}`,
    };
};

const ensureOrderCanBePaid = (order) => {
    if (order.orderStatus !== "pending") {
        throw AppError.create("Only pending orders can be paid", 409, FAIL);
    }

    // todo
    if (!["pending", "failed"].includes(order.paymentStatus)) {
        throw AppError.create("This order cannot be paid again", 409, FAIL);
    }

    if (order.paymentStatus === "paid") {
        throw AppError.create("This order already has a payment", 409, FAIL);
    }
};

const createPaymentIntentService = async (currentUser, orderId) => {
    const userId = getAuthenticatedUserId(currentUser);

    if (!mongoose.isValidObjectId(orderId)) {
        throw AppError.create("Invalid order ID", 400, FAIL);
    }

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
        throw AppError.create("Order not found", 404, ERROR);
    }

    ensureOrderCanBePaid(order);
    
    const { amount, currency, description } = getExpectedPaymentDetails(order);

    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
        throw AppError.create("FRONTEND_URL is not configured", 500, ERROR);
    }

    if (order.paymentStatus === "pending" && order.paymentIntentId && order.paymentIntentExpiresAt && order.paymentIntentExpiresAt.getTime() > Date.now()) {
        try {
            const existingIntent = await moyasarRequest(`/payment_intents/${encodeURIComponent(order.paymentIntentId)}`, { method: "GET" });

            if (existingIntent.status === "created" && existingIntent.amount === amount && existingIntent.currency === currency && existingIntent.description === description && existingIntent.client_secret) {
                return {
                    orderId: String(order._id),
                    amount: existingIntent.amount,
                    currency: existingIntent.currency,
                    intentId: existingIntent.id,
                    clientSecret: existingIntent.client_secret,
                    publishableKey: process.env.MOYASAR_PUBLISHABLE_KEY,
                    expiresAt: existingIntent.expires_at,
                };
            }
        } catch (error) {
            throw error;
        }
    }

    const intent = await moyasarRequest("/payment_intents", {
        method: "POST",
        body: JSON.stringify({
            amount,
            currency,
            description,
            callback_url: `${frontendUrl.replace(/\/$/, "")}/checkout?mode=pay&order_id=${order._id}`,
        }),
    });

    if (!intent?.id || !intent?.client_secret || !intent?.expires_at || intent.amount !== amount || intent.currency !== currency || intent.description !== description) {
        throw AppError.create("Moyasar did not return a valid payment intent", 502, ERROR);
    }

    order.paymentIntentId = intent.id;
    order.paymentIntentExpiresAt = new Date(intent.expires_at);
    order.paymentStatus = "pending";
    order.paymentId = null;

    await order.save();

    return {
        orderId: String(order._id),
        amount: intent.amount,
        currency: intent.currency,
        intentId: intent.id,
        clientSecret: intent.client_secret,
        publishableKey: process.env.MOYASAR_PUBLISHABLE_KEY,
        expiresAt: intent.expires_at,
    };
};

const verifyPaymentService = async (currentUser, paymentId, orderId) => {
    const userId = getAuthenticatedUserId(currentUser);

    if (typeof paymentId !== "string" || !paymentId.trim() || paymentId.length > 200) {
        throw AppError.create("Invalid payment ID", 400, FAIL);
    }

    if (!mongoose.isValidObjectId(orderId)) {
        throw AppError.create("Invalid order ID", 400, FAIL);
    }

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
        throw AppError.create("Order not found", 404, ERROR);
    }

    const payment = await moyasarRequest(`/payments/${encodeURIComponent(paymentId)}`, { method: "GET" });

    const { amount, currency, description } = getExpectedPaymentDetails(order);

    if (payment.amount !== amount || payment.currency !== currency || payment.description !== description) {
        throw AppError.create("Payment does not match this order", 409, FAIL);
    }

    if (!order.paymentIntentId || payment.payment_intent_id !== order.paymentIntentId) {
        throw AppError.create("Payment does not match this order's payment intent", 409, FAIL);
    }

    if (order.paymentStatus === "paid") {
        if (order.paymentId && order.paymentId !== payment.id) {
            throw AppError.create("This order is linked to another payment", 409, FAIL);
        }

        return {
            verified: true,
            paymentStatus: "paid",
            order,
        };
    }

    if (order.orderStatus !== "pending") {
        throw AppError.create("This order can no longer be paid", 409, FAIL);
    }

    if (!["pending", "failed"].includes(order.paymentStatus)) {
        throw AppError.create("This order cannot be paid again", 409, FAIL);
    }

    if (payment.status === "failed") {
        order.paymentStatus = "failed";
        order.paymentId = payment.id;
        await order.save();

        return {
            verified: false,
            paymentStatus: "failed",
            orderId: String(order._id),
        };
    }

    if (payment.status !== "paid") {
        return {
            verified: false,
            paymentStatus: order.paymentStatus,
            providerStatus: payment.status,
            orderId: String(order._id),
        };
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = payment.id;

    await order.save();

    return {
        verified: true,
        paymentStatus: "paid",
        order: order,
    };
};

export {
    createPaymentIntentService,
    verifyPaymentService,
};
