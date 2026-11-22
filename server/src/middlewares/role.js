import AppError from "../utils/AppError.js";
import { FAIL } from "../utils/httpStatusText.js";

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.currentUser) {
      return next(AppError.create("Authentication is required", 401, FAIL));
    }

    if (!roles.includes(req.currentUser.role)) {
      return next(AppError.create("This role is not authorized", 403, FAIL));
    }

    next();
  };
};