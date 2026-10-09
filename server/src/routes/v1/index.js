import express from "express";
import productRoutes from "./productRoutes.js";
import categoryRoutes from "./categoriesRoutes.js";
import brandRoutes from "./brandRoutes.js";
import userRoutes from "./userRoutes.js";
import reviewRoutes from "./reviewRoutes.js";
import offerRoutes from "./offerRoutes.js";

const router = express.Router();

router.use("/users", userRoutes);

router.use("/categories", categoryRoutes);
router.use("/brands", brandRoutes);

router.use("/products", productRoutes);
router.use("/reviews", reviewRoutes);

router.use("/seasons", offerRoutes);
router.use("/offers", offerRoutes);

export default router;