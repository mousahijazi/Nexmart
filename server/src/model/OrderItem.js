import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            index: true,
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        productTitle: {
            ar: {
                type: String,
                required: true,
                trim: true,
                minlength: 2,
                maxlength: 200,
            },
            en: {
                type: String,
                required: true,
                trim: true,
                minlength: 2,
                maxlength: 200,
            },
        },

        mainImage: {
            type: String,
            default: null,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
            validate: {
                validator: Number.isInteger,
                message: "Quantity must be an integer",
            },
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

orderItemSchema.index({ order: 1, createdAt: 1 });

const OrderItem = mongoose.model("OrderItem", orderItemSchema);
export default OrderItem;