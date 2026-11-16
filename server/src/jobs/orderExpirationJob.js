import cron from "node-cron";
import mongoose from "mongoose";
import Order from "../model/Order.js";
import OrderItem from "../model/OrderItem.js";
import Product from "../model/Product.js";
import AppError from "../utils/AppError.js";
import { FAIL } from "../utils/httpStatusText.js";

const ORDER_EXPIRATION_DAYS = 14;
const BATCH_SIZE = 100;

const expireUnpaidOrder = async (orderId, expirationDate) => {
    const session = await mongoose.startSession();

    let expired = false;

    try {
        await session.withTransaction(async () => {
            const now = new Date();

            const order = await Order.findOneAndUpdate(
                {
                    _id: orderId,
                    orderStatus: "pending",
                    paymentStatus: { $in: ["pending", "failed"] },
                    createdAt: { $lte: expirationDate },
                },
                {
                    $set: {
                        orderStatus: "cancelled",
                        cancelledAt: now,
                        cancellationReason: "Automatically cancelled after 14 days without successful payment",
                    },
                },
                {
                    new: true,
                    session,
                }
            );

            if (!order) {
                return;
            }

            const items = await OrderItem.find({ order: order._id }).session(session);

            for (const item of items) {
                const restoreResult = await Product.updateOne(
                    { _id: item.product },
                    { $inc: { stock: item.quantity } },
                    { session }
                );

                if (restoreResult.matchedCount !== 1) {
                    throw AppError.create(`Cannot restore stock: product ${item.product} does not exist`, 400, FAIL)
                }

                await Product.updateOne(
                    {
                        _id: item.product,
                        stock: { $gt: 0 },
                    },
                    { $set: { status: "Available" } },
                    { session }
                );
            }

            expired = true;
        });
    } finally {
        await session.endSession();
    }

    return expired;
};

const startOrderExpirationJob = () => {
    cron.schedule("*/5 * * * *", async () => {
        const expirationDate = new Date(Date.now() - ORDER_EXPIRATION_DAYS * 24 * 60 * 60 * 1000);

            try {
                const expiredCandidates = await Order.find({
                    orderStatus: "pending",
                    paymentStatus: { $in: ["pending", "failed"] },
                    createdAt: { $lte: expirationDate },
                }).select("_id").sort({ createdAt: 1 }).limit(BATCH_SIZE).lean();

                let cancelledCount = 0;

                for (const order of expiredCandidates) {
                    const expired = await expireUnpaidOrder(order._id, expirationDate);

                    if (expired) {
                        cancelledCount++;
                    }
                }

                if (cancelledCount > 0) {
                    console.log(`[Order Expiration Job] Cancelled ${cancelledCount} unpaid orders`);
                }
            } catch (error) {
                console.error("[Order Expiration Job] Failed:", error);
            }
        },
        {
            name: "order-expiration-job",
            noOverlap: true,
        }
    );

    console.log("[Order Expiration Job] Started");
};

export default startOrderExpirationJob;