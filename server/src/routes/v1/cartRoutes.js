import express from "express";
import { priceCartController } from "../../controllers/cartController.js";
import validate from "../../middlewares/validate.js";
import { priceCartValidator } from "../../validators/cartValidator.js";

const router = express.Router();

router.route("/price")
    .post(priceCartValidator, validate, priceCartController);

export default router;