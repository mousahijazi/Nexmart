import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoriesRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import { setupSwagger } from "./config/swagger.js";
import AppError from "./utils/AppError.js";
import { FAIL } from "./utils/httpStatusText.js";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

setupSwagger(app);

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")))

app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/products", productRoutes);

app.all("/*splat", (req, res, next) => {
    next(AppError.create("This resource is not available", 404, FAIL));
});

app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({status: error.statusText || error , message: error.message, code: error.statusCode || 500, data: null})
})

export default app;