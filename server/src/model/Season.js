import mongoose from "mongoose";

const seasonSchema = new mongoose.Schema(
  {
    name: {
      ar: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 60,
      },
      en: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 60,
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

    status: {
      type: String,
      enum: ["Active", "Inactive", "Scheduled", "Expired"],
      default: "Active",
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
    toObject: { virtuals: true },
  }
);

seasonSchema.virtual("offersCount", {
  ref: "Offer",
  localField: "_id",
  foreignField: "season",
  count: true,
});

seasonSchema.index({ status: 1, createdAt: -1 });
seasonSchema.index({ isActive: 1, status: 1, startDate: 1, endDate: 1 });

const Season = mongoose.model("Season", seasonSchema);
export default Season;