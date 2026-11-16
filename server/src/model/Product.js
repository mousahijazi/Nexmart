import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      ar: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
    },

    description: {
      ar: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
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
      validate: {
        validator: Number.isInteger,
        message: "Stock must be an integer",
      },
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    archivedByCategory: {
      type: Boolean,
      default: false,
    },

    archivedByBrand: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["Available", "OutOfStock"],
      default: "OutOfStock",
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("validate", function () {
  if (this.isNew || this.isModified("stock")) {
    this.status = this.stock > 0 ? "Available" : "OutOfStock";
  }
});

const Product = mongoose.model("Product", productSchema);
export default Product;