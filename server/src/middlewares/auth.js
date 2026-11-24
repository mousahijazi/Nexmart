import jwt from "jsonwebtoken";
import { ERROR, FAIL } from "../utils/httpStatusText.js";
import AppError from "../utils/AppError.js";
import hashToken from "../utils/tokenAndCookies/hashToken.js";
import { COOKIE_NAME } from "../utils/tokenAndCookies/authCookie.js";
import { findUserForAuthentication, saveUserSession } from "../repositories/usersRepository.js";

const getTokenFromRequest = (req) => {
  const cookieToken = req.cookies?.[COOKIE_NAME];

  if (cookieToken) {
    return cookieToken;
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) return null;

  const [type, token, ...extra] = authHeader.split(" ");

  if (type !== "Bearer" || !token || extra.length) {
    return null;
  }

  return token;
};

const authenticate = async (req, next, optional = false) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    if (optional) {
      req.currentUser = null;
      return next();
    }

    return next(AppError.create("Authentication is required", 401, ERROR));
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch {
    return next(AppError.create("Invalid or expired token", 401, ERROR));
  }

  if (!payload.id) {
    return next(AppError.create("Invalid token payload", 401, ERROR));
  }

  try {
    const user = await findUserForAuthentication(payload.id);

    if (!user || !user.isActive) {
      return next(AppError.create("User not found or inactive", 401, ERROR));
    }

    const incomingHash = hashToken(token);

    const isLegacyToken = user.token === token;
    const isValidSession = user.token === incomingHash;

    if (!isValidSession && !isLegacyToken) {
      return next(AppError.create("Session is no longer valid", 401, ERROR));
    }

    if (isLegacyToken) {
      await saveUserSession(user, incomingHash);
    }

    req.currentUser = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    return next();
  } catch (error) {
    return next(error);
  }
};

export const authToken = (req, res, next) => {
  return authenticate(req, next);
};

export const optionalAuth = (req, res, next) => {
  return authenticate(req, next, true);
};
