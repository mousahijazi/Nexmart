import { uploadImage } from "../upload.js";
import Category from "../../model/Category.js";
import {categorySchema} from "../../validators/zodSchema/categorySchema.js";

const upload = uploadImage({
  folderName: "categories",
  model: Category,
  schema: categorySchema,
  slugSource: (body) => body.nameEn,
});

export const uploadCategoryImage = upload.single("image");