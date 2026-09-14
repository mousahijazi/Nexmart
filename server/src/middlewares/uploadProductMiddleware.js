import {uploadImage} from "./upload.js";
import Product from "../model/Product.js";

const upload = uploadImage("products", Product);

export const uploadProductImages = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "images", maxCount: 4 },
]);