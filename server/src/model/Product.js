import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
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

    description: {
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

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    mainImage: {
      type: String,
      required: true,
      trim: true,
    },

    images: {
      type: [String],
      default: [],
      validate: {
        validator: (images) => images.length <= 4,
        message: "A product can have a maximum of 4 additional images",
      },
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    brand: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    ratingsCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
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

const Product = mongoose.model("Product", productSchema);
export default Product;