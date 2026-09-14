import {uploadImage} from "./upload.js";

const upload = uploadImage("products");

export const uploadProductImages = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "images", maxCount: 4 },
]);