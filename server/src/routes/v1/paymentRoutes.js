import express from "express";
import { authToken } from "../../middlewares/auth.js";
import { verifyPaymentController } from "../../controllers/paymentController.js";

const router = express.Router();

router.use(authToken);

// router.post("/intent", createPaymentIntentController);
router.post("/verify", verifyPaymentController);

export default router;
