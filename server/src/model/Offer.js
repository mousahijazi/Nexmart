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

    archivedBySeason: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["Active", "Scheduled", "Expired", "Inactive"],
      default: "Active",
    },

    season: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

offerSchema.index({ createdAt: -1, _id: -1 });
offerSchema.index({ targetType: 1, product: 1, startDate: 1, endDate: 1 });
offerSchema.index({ targetType: 1, category: 1, startDate: 1, endDate: 1 });
offerSchema.index({ season: 1, isActive: 1, startDate: 1, endDate: 1 });
offerSchema.index({ "name.ar": 1 });
offerSchema.index({ "name.en": 1 });

const Offer = mongoose.model("Offer", offerSchema); 
export default Offer;