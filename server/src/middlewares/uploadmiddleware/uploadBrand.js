import { uploadImage } from "../upload.js";
import Brand from "../../model/Brand.js";
import { brandSchema, brandUpdateSchema } from "../../validators/zodSchema/brandSchema.js";

const upload = uploadImage({
  folderName: "brands",
  model: Brand,
  schema: brandSchema,
  slugSource: (body) => body.nameEn,
});

export const uploadBrandLogo = upload.single("logo");

const uploadUpdate = uploadImage({
  folderName: "brands",
  model: Brand,
  schema: brandUpdateSchema,
  generateSlug: false,
});

export const uploadBrandUpdateImage = uploadUpdate.single("logo");