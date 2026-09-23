import { authToken } from "./auth.js";

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers["Authorization"] || req.headers["authorization"];

  if (!authHeader) {
    return next();
  }

  return authToken(req, res, next);
};

export default optionalAuth;