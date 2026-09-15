import {uploadImage} from "../upload.js";
import Product from "../../model/Product.js";
import { productSchema } from "../../validators/zodSchema/productSchema.js";

const upload = uploadImage({
  folderName: "products",
  model: Product,
  schema: productSchema,
  slugSource: (body) => body.titleEn,
});

export const uploadProductImages = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "images", maxCount: 4 },
]);