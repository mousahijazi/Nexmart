const COOKIE_NAME = "nexmart-token"

const sameSite = (process.env.COOKIE_SAME_SITE || "lax").toLowerCase();

const secure =
  process.env.COOKIE_SECURE !== undefined
    ? process.env.COOKIE_SECURE === "true"
    : process.env.NODE_ENV === "production";

if (!["strict", "lax", "none"].includes(sameSite)) {
  throw new Error("Invalid COOKIE_SAME_SITE value");
}

if (sameSite === "none" && !secure) {
  throw new Error("SameSite=None requires Secure cookies");
}

const cookieOptions = {
  httpOnly: true,
  secure,
  sameSite,
  path: "/",
  ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
};

export const setAuthCookie = (res, token, role) => {
  const maxAge = role === "ADMIN" ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

  res.cookie(COOKIE_NAME, token, {
    ...cookieOptions,
    maxAge,
  });
};

export const clearAuthCookie = (res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);
};

export { COOKIE_NAME };