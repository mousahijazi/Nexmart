import { uploadImage } from "../upload.js";
import Product from "../../model/Product.js";

import { productSchema } from "../../validators/zodSchema/productSchema.js";
import { productUpdateSchema } from "../../validators/zodSchema/productUpdateSchema.js";

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


const uploadUpdate = uploadImage({
  folderName: "products",
  model: Product,
  schema: productUpdateSchema,
  generateSlug: false,
});

export const uploadProductUpdateImages = uploadUpdate.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "images", maxCount: 4 },
]);