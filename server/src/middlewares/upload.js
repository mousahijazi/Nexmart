import multer from "multer";
import AppError from "../utils/AppError.js";
import { FAIL } from "../utils/httpStatusText.js";
import fs from "fs";
import slugify from "slugify";

export const uploadImage = ({ folderName, model, schema, slugSource, generateSlug = true }) => {
  const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = `uploads/${folderName}`;

      const result = schema.safeParse(req.body);

      if (!result.success) {
        const errorMessage = result.error.issues
          .map((issue) => issue.message)
          .join(" | ");

        return cb(
          AppError.create(errorMessage, 400, FAIL)
        );
      }

      if (!generateSlug) {
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }

        return cb(null, uploadPath);
      }

      const source = slugSource(req.body);

      const baseSlug = slugify(source, {
        lower: true,
        strict: true,
        trim: true,
      });

      if (!baseSlug) {
        return cb(AppError.create("Unable to generate slug", 400, FAIL));
      }

      let slug = baseSlug;

      const checkSlug = async () => {
        let counter = 2;

        while (await model.findOne({ slug })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }

        req.body.slug = slug;

        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
      };

      checkSlug().catch((error) => {
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