// todo
import { uploadImage } from "../upload.js";
import User from "../../model/User.js";
import { registerUserSchema } from "../../validators/zodSchema/userSchema.js";

const upload = uploadImage({
  folderName: "users",
  model: User,
  schema: registerUserSchema,
  slugSource: (body) =>
    `${body.firstName} ${body.lastName}`,
});

export const uploadUserImage = upload.single("avater");