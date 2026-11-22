import express from "express";
import cors from "cors";
import v1Routes from "./routes/v1/index.js";
import { setupSwagger } from "./config/swagger.js";
import AppError from "./utils/AppError.js";
import { FAIL } from "./utils/httpStatusText.js";
import { fileURLToPath } from "node:url";
import { API_BASE_PATH } from "./utils/apiEndpoints.js";
import cookieParser from "cookie-parser";
import csrfProtection from "./middlewares/csrfProtection.js";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const allowedOrigins = (process.env.CLIENT_URLS || "http://localhost:3000")
  .split(",").map((origin) => origin.trim()).filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(csrfProtection);

setupSwagger(app);

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")))

app.use(API_BASE_PATH, v1Routes);

app.all("/*splat", (req, res, next) => {
    next(AppError.create("This resource is not available", 404, FAIL));
});

app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({status: error.statusText || error , message: error.message, code: error.statusCode || 500, data: null})
})

export default app;