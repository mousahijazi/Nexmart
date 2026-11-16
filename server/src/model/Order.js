import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    shippingInfo: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      notes: { type: String, trim: true, default: "" },
    },

    currency: {
      type: String,
      required: true,
      default: "SAR",
      uppercase: true,
      trim: true,
    },

    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, required: true, min: 0 },
    shipping: { type: Number, required: true, min: 0 },

    couponCode: {
      type: String,
      trim: true,
      default: null,
    },

    discount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    totalPrice: { type: Number, required: true, min: 0 },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "onHold",
        "shipped",
        "delivered",
        "cancelled",
      ],
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
      trim: true,
      default: null,
    },

    paymentReviewRequired: {
      type: Boolean,
      default: false,
    },

    paymentExceptionReason: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },

    paymentExceptionAt: {
      type: Date,
      default: null,
    },

    shippingDecision: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },

    shippingDecisionReason: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },

    shippingDecisionAt: {
      type: Date,
      default: null,
    },

    shippingDecisionBy: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    shippingDecisionHistory: [
      {
        decision: {
          type: String,
          enum: ["approved", "rejected"],
          required: true,
        },
        reason: {
          type: String,
          trim: true,
          maxlength: 1000,
          default: null,
        },
        decidedAt: {
          type: Date,
          required: true,
        },
        decidedBy: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
      },
    ],

    cancelledAt: {
      type: Date,
      default: null,
    },

    cancellationReason: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },

    shippingHoldReason: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },

    shippingHoldAt: {
      type: Date,
      default: null,
    },

    shippingHoldBy: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    shippedAt: {
      type: Date,
      default: null,
    },

    shippedBy: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.virtual("totalItems", {
  ref: "OrderItem",
  localField: "_id",
  foreignField: "order",
  count: true,
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, createdAt: -1 });
orderSchema.index({ shippingDecision: 1, orderStatus: 1, createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;