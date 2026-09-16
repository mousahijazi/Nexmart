import express from "express";
import { getAllUsers, registerUser, loginUser, getCurrentUser, logoutUser} from "../../controllers/usersController.js";
import { registerValidator } from "../../validators/createUsersSchema.js";
import generateSlug from "../../utils/generateSlug.js";
import validate from "../../middlewares/validate.js";
import User from "../../model/User.js";
import {authorizeRoles} from "../../middlewares/role.js";
import { authToken } from "../../middlewares/auth.js";
import checkUserRole from "../../middlewares/checkUserRole.js";

const router = express.Router();

router.route("/")
        .get(authToken, authorizeRoles("ADMIN"), getAllUsers);

router.route("/me")
        .get(authToken, checkUserRole, getCurrentUser);

router.route("/register")
        .post(
                registerValidator, 
                validate, 
                generateSlug({
                        model: User, 
                        slugSource: (body) => `${body.firstName} ${body.lastName}`
                }), 
                registerUser
        );

router.route("/login")
        .post(validate, loginUser);

router.route("/logout")
        .post(authToken, logoutUser);

export default router;