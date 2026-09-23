import AppError from "../utils/AppError.js";
import { FAIL } from "../utils/httpStatusText.js";
import { userRoles } from "../utils/userRoles.js";

const checkUserRole = (req, res, next) => {
  if (!req.currentUser) {
    req.userRole = "GUEST";
    return next();
  }

  const role = req.currentUser.role;

  if (!role) {
    return next(
      AppError.create("User role not found", 403, FAIL)
    );
  }

  if (role !== userRoles.USER && role !== userRoles.ADMIN) {
    return next(
      AppError.create("Invalid user role", 403, FAIL)
    );
  }

  req.userRole = role;

  next();
};

export default checkUserRole;