import jwt from "jsonwebtoken";

export default (payload, expireTime = "10m") => {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: expireTime});
    return token;
}