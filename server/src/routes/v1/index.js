import express from "express";
import productRoutes from "./productRoutes.js";
import categoryRoutes from "./categoriesRoutes.js";
import brandRoutes from "./brandRoutes.js";
import userRoutes from "./userRoutes.js"

const router = express.Router();

router.use("/users", userRoutes);

router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/brands", brandRoutes);

export default router;