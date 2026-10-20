import mongoose from "mongoose";
import AppError from "./AppError.js";
import { ERROR } from "./httpStatusText.js";

const getAuthenticatedUserId = (currentUser) => {
    if (!currentUser) {
        throw AppError.create("Authentication is required", 401, ERROR);
    }

    const userId = currentUser._id ?? currentUser.userId;

    if (typeof userId !== "string" || !mongoose.Types.ObjectId.isValid(userId) || !/^[a-f\d]{24}$/i.test(userId)) {
        throw AppError.create("Invalid authenticated user ID", 401, ERROR);
    }

    return new mongoose.Types.ObjectId(userId);
};

export default getAuthenticatedUserId;
