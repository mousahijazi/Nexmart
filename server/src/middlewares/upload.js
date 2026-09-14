import multer from "multer";
import AppError from "../utils/AppError.js";
import { FAIL } from "../utils/httpStatusText.js";
import fs from "fs";
import Brand from "../model/Brand.js";

export const uploadImage = (folderName) => {
  const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      const { nameAr, nameEn, slug } = req.body;

      if (!nameAr || !nameEn || !slug) {
        return cb(AppError.create("Arabic name, English name, and slug are required before uploading image", 400, FAIL));
      }

      Brand.findOne({ slug }).then((brand) => {
          if (brand) {
            return cb(AppError.create("Brand slug already exists", 400, FAIL));
          }

          const uploadPath = `uploads/${folderName}`;

          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        })
        .catch((error) => {
          cb(error);
        });
    },

    filename: function (req, file, cb) {
      const ext = file.mimetype.split("/")[1];
      const fileName = `${folderName}-${Date.now()}.${ext}`;

      cb(null, fileName);
    },
  });

  const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split("/")[0];

    if (imageType === "image") {
      return cb(null, true);
    }

    return cb(AppError.create("The file must be an image", 400, FAIL), false);
  };

  return multer({
    storage: diskStorage,
    fileFilter,
  });
};