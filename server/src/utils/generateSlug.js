import slugify from "slugify";
import AppError from "./AppError.js";
import { FAIL } from "./httpStatusText.js";

const generateSlug = ({ model, slugSource }) => {
  return async (req, res, next) => {
    const source = slugSource(req.body);

    const baseSlug = slugify(source, {
      lower: true,
      strict: true,
      trim: true,
    });

    if (!baseSlug) {
      return next(AppError.create("Unable to generate slug", 400, FAIL));
    }

    let slug = baseSlug;
    let counter = 2;

    while (await model.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    req.body.slug = slug;

    next();
  };
};

export default generateSlug;