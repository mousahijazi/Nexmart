import multer from "multer";
import AppError from "../utils/AppError.js";
import { FAIL } from "../utils/httpStatusText.js";
import { productSchema } from "../validators/uploadProductSchema.js";
import fs from "fs";

export const uploadImage = (folderName, model) => {
  const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = `uploads/${folderName}`;

      if (folderName === "products") {
        const result = productSchema.safeParse(req.body);

        if (!result.success) {
          const errorMessage = result.error.issues.map((i) => i.message).join(" | ");
          return cb(AppError.create(errorMessage, 400, FAIL));
        }

        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }

        return cb(null, uploadPath);
      }

      const { nameAr, nameEn, slug } = req.body;

      if (!nameAr || !nameEn || !slug) {
        return cb(
          AppError.create("Arabic name, English name, and slug are required before uploading image", 400, FAIL)
        );
      }

      model.findOne({ slug }).then((doc) => {
          if (doc) {
            return cb(AppError.create(`${folderName} slug already exists`, 400, FAIL));
          }

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
    if (imageType === "image") return cb(null, true);
    return cb(AppError.create("The file must be an image", 400, FAIL), false);
  };

  return multer({
    storage: diskStorage,
    fileFilter,
  });
};