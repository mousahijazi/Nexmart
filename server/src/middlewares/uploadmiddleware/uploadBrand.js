import { uploadImage } from "../upload.js";
import Brand from "../../model/Brand.js";
import { brandSchema } from "../../validators/zodSchema/brandSchema.js";

const upload = uploadImage({
  folderName: "brands",
  model: Brand,
  schema: brandSchema,
  slugSource: (body) => body.nameEn,
});

export const uploadBrandLogo = upload.single("logo");