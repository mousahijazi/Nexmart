import jwt from "jsonwebtoken";

export default async (payload, expireTime = "1m") => {
    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: expireTime});
    return token;
}