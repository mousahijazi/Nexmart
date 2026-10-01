import express from "express";
import { createReviewController, getProductReviewsController, getAllReviewsController, updateReviewStatusController } from "../../controllers/reviewController.js";
import { authToken } from "../../middlewares/auth.js";
import { authorizeRoles } from "../../middlewares/role.js";
import validate from "../../middlewares/validate.js";
import { createReviewValidator } from "../../validators/reviewValidator.js";
import { StatusValidator } from "../../validators/statusSchema.js";

const router = express.Router();

router.route("/products/:productId/reviews")
    .post(authToken, createReviewValidator, validate, createReviewController)
    .get(getProductReviewsController)

router.route("/")
    .get(authToken, authorizeRoles("ADMIN"), getAllReviewsController);

router.route("/:reviewId/status")
    .patch(authToken, authorizeRoles("ADMIN"), StatusValidator, validate, updateReviewStatusController);

export default router;