import multer from "multer";
import AppError from "../utils/AppError.js";
import { FAIL } from "../utils/httpStatusText.js";
import fs from "fs";

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = "uploads/products";

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        const fileName = `product-${Date.now()}.${ext}`;
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split("/")[0];
    if (imageType === "image") {
        return cb(null, true);
    }

    return cb(AppError.create( "The file must be an image", 400, FAIL), false);
};

const upload = multer({
    storage: diskStorage,
    fileFilter,
});

export default upload;