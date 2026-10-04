import mongoose from "mongoose";
import AppError from "../utils/AppError.js";
import { FAIL } from "../utils/httpStatusText.js";

const offerTargetSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        discount: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        _id: false,
    }
);

const offerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100,
        },

        description: {
            type: String,
            trim: true,
            maxlength: 500,
            default: null,
        },

        season: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Season",
            default: null,
        },

        type: {
            type: String,
            enum: ["percentage", "fixed"],
            required: true,
        },

        targetType: {
            type: String,
            enum: ["product", "category"],
            required: true,
        },

        targets: {
            type: [offerTargetSchema],
            default: [],
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null,
        },

        discount: {
            type: Number,
            min: 0,
            default: null,
        },

        startDate: {
            type: Date,
            required: true,
        },

        endDate: {
            type: Date,
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        overrideApplied: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

offerSchema.pre("validate", function (next) {
    if (this.startDate && this.endDate && this.endDate <= this.startDate) {
        return next(AppError.create("Offer end date must be after start date", 400, FAIL));
    }

    if (this.type === "percentage") {
        if (this.targetType === "category" && this.discount !== null && this.discount > 100) {
            return next(AppError.create("Percentage discount cannot be greater than 100", 400, FAIL));
        }

        if (this.targetType === "product") {
            const invalidTarget = this.targets.some((target) => target.discount > 100);

            if (invalidTarget) {
                return next(AppError.create("Percentage discount cannot be greater than 100", 400, FAIL));
            }
        }
    }

    if (this.targetType === "product") {
        if (this.isActive && (!this.targets || this.targets.length === 0)) {
            return next(AppError.create("Active product offer must contain at least one target product", 400, FAIL));
        }

        if (this.category) {
            return next(AppError.create("Product offer cannot have a category target", 400, FAIL));
        }

        if (this.discount !== null) {
            return next(AppError.create("Product offer must define discount inside targets", 400, FAIL));
        }

        const productIds = this.targets.map((target) => String(target.product));
        const uniqueProductIds = new Set(productIds);

        if (productIds.length !== uniqueProductIds.size) {
            return next(AppError.create("A product cannot appear more than once in the same offer", 400, FAIL));
        }

        this.overrideApplied = false;
    }

    if (this.targetType === "category") {
        if (!this.category) {
            return next(AppError.create("Category offer must contain a category", 400, FAIL));
        }

        if (this.discount === null || this.discount === undefined) {
            return next(AppError.create("Category offer must contain a discount", 400, FAIL));
        }

        if (this.targets.length > 0) {
            return next(AppError.create("Category offer cannot contain product targets", 400, FAIL));
        }
    }

    next();
});

offerSchema.index({ targetType: 1, "targets.product": 1, isActive: 1, startDate: 1, endDate: 1 });
offerSchema.index({ targetType: 1, category: 1, isActive: 1, startDate: 1, endDate: 1 });
offerSchema.index({ targetType: 1, overrideApplied: 1, startDate: 1, endDate: 1 });

const Offer = mongoose.model("Offer", offerSchema);
export default Offer;