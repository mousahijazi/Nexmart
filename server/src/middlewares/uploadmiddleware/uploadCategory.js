import { uploadImage } from "../upload.js";
import Category from "../../model/Category.js";
import {categorySchema, categoryUpdateSchema} from "../../validators/zodSchema/categorySchema.js";

const upload = uploadImage({
  folderName: "categories",
  model: Category,
  schema: categorySchema,
  slugSource: (body) => body.nameEn,
});

export const uploadCategoryImage = upload.single("image");

const uploadUpdate = uploadImage({
  folderName: "categories",
  model: Category,
  schema: categoryUpdateSchema,
  generateSlug: false,
});

export const uploadCategoryUpdateImage = uploadUpdate.single("image");