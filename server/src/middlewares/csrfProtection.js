import AppError from "../utils/AppError.js";
import { FAIL } from "../utils/httpStatusText.js";
import { COOKIE_NAME } from "../utils/tokenAndCookies/authCookie.js";

const allowedOrigins = (process.env.CLIENT_URLS || "")
  .split(",").map((origin) => origin.trim()).filter(Boolean);

const unsafeMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const csrfProtection = (req, res, next) => {
  if (!unsafeMethods.has(req.method)) {
    return next();
  }

  if (!req.cookies?.[COOKIE_NAME]) {
    return next();
  }

  const origin = req.get("origin");

  if (!origin || !allowedOrigins.includes(origin)) {
    return next(AppError.create("Request origin is not allowed", 403, FAIL));
  }

  next();
};

export default csrfProtection;
