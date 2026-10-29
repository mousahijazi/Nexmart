import { rateLimit } from "express-rate-limit";
import { FAIL } from "../utils/httpStatusText.js";

export const registerRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 3,
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    status: FAIL,
    message: "Too many registration attempts. Please try again later.",
  },
});

export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    status: FAIL,
    message: "Too many login attempts. Please try again later.",
  },
});
