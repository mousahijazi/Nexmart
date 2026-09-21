import mongoose from "mongoose";
import { userRoles } from "../utils/userRoles.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    avatar: {
      type: String,
      trim: true,
      default: "/uploads/users/Profile.jpg",
    },

    token: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: [userRoles.USER, userRoles.ADMIN, userRoles.SELLER],
      default: userRoles.USER,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    phoneNumber: {
      type: String,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;