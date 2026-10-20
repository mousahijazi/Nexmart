import mongoose from "mongoose";

const shippingInfoSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 80,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 80,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
            maxlength: 30,
        },
        city: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        address: {
            type: String,
            required: true,
            trim: true,
            maxlength: 300,
        },
        notes: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: null,
        },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true,
        },

        shippingInfo: {
            type: shippingInfoSchema,
            required: true,
        },

        currency: {
            type: String,
            enum: ["SAR"],
            default: "SAR",
            required: true,
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },

        tax: {
            type: Number,
            required: true,
            min: 0,
        },

        shipping: {
            type: Number,
            required: true,
            min: 0,
        },

        couponCode: {
            type: String,
            trim: true,
            lowercase: true,
            default: null,
        },

        discount: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },

        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        orderStatus: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
            default: "pending",
            required: true,
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending",
            required: true,
        },

        paymentId: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

orderSchema.index({ user: 1, createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;