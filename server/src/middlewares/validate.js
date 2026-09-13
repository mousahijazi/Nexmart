import { validationResult } from "express-validator";
import AppError from "../utils/AppError.js";
import { FAIL } from "../utils/httpStatusText.js";

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(AppError.create(errors.array(), 400, FAIL));
    }

    next();
};

export default validate;