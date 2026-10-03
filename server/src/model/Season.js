import mongoose from "mongoose";
import AppError from "../utils/AppError";
import { FAIL } from "../utils/httpStatusText";

const seasonSchema = new mongoose.Schema(
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
    },
    {
        timestamps: true,
    }
);

seasonSchema.pre("validate", function (next) {
    if (this.startDate && this.endDate && this.endDate <= this.startDate) {
        return next(new AppError.create("Season end date must be after start date", 400, FAIL));
    }

    next();
});

const Season = mongoose.model("Season", seasonSchema);
export default Season;