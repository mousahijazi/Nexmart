import { uploadImage } from "../upload.js";
import { updateUserSchema } from "../../validators/zodSchema/userSchema.js";
import User from "../../model/User.js";

const upload = uploadImage({
  folderName: "users",
  model: User,
  schema: updateUserSchema,
  generateSlug: false,
});

export const uploadUserImage = upload.single("avatar");