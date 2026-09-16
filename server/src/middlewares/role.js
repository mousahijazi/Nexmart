import AppError from "../utils/AppError.js";
import { FAIL } from "../utils/httpStatusText.js";

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      const error = AppError.create("This role is not authorized", 403, FAIL);

      return next(error);
    }

    next();
  };
};