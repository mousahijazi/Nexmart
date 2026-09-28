import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
    {
        name: {
            ar: {
                type: String,
                required: true,
                trim: true,
            },

            en: {
                type: String,
                required: true,
                trim: true,
            },
        },

        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },

        description: {
            ar: {
                type: String,
                trim: true,
            },

            en: {
                type: String,
                trim: true,
            },
        },

        logo: {
            type: String,
            trim: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,

        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                delete ret.id;
                return ret;
            },
        },

        toObject: {
            virtuals: true,
        },
    }
);

brandSchema.virtual("productsCount", {
  ref: "Product",
  localField: "_id",
  foreignField: "brand",
  count: true,
});

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;