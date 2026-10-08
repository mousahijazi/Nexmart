import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
   name: {
      ar: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 40,
      },
      en: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 40,
      },
    },

    description: {
      ar: {
        type: String,
        trim: true,
        maxlength: 600,
      },
      en: {
        type: String,
        trim: true,
        maxlength: 600,
      },
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

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    discount: {
      type: Number,
      required: true,
      min: 0,
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

const Offer = mongoose.model("Offer", offerSchema); 
export default Offer;