import upload from "./upload.js";

export const uploadProductImages = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "images", maxCount: 4 },
]);