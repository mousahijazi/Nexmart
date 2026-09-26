import User from "../model/User.js";
import bcrypt from "bcrypt";
import generateJWT from "../utils/generateJWT.js";
import AppError from "../utils/AppError.js";
import { FAIL } from "../utils/httpStatusText.js";
import { deleteFile } from "../middlewares/fileService.js";

export const getAllUsersService = async (limit, page) => {
  const skip = (page - 1) * limit;

  const users = await User.find({},{__v: false, password: false}).limit(limit).skip(skip);
  return users;
};

export const getCurrentUserService = async (userId) => {
  const user = await User.findById(userId, {password: false, token: false, __v: false});

  if (!user) {
    const error = AppError.create("User not found", 404, FAIL);
    throw error;
  }

  return user;
};

export const registerUserService = async ({firstName, lastName, email, password, phoneNumber, slug}) => {
  const oldUser = await User.findOne({ email });

  if (oldUser) {
    const error = AppError.create("user already exists!", 400, FAIL);
    throw error;
  }

  const hashedUser = await bcrypt.hash(password, 12);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedUser,
    phoneNumber,
    slug,
  });

  const token = await generateJWT({email: email, id: newUser._id, role: newUser.role});
  newUser.token = token;

  await newUser.save();

  return {
    user: newUser,
    redirectTo: newUser.role === "ADMIN" ? "/admin" : "/user",
  };
};

export const loginUserService = async (email, password) => {
  const user = await User.findOne({ email },  {__v: false});

  if (!user) {
    throw AppError.create("Email or password is incorrect", 401, FAIL);
  }

  const matchedPassword = await bcrypt.compare(password, user.password);

  if (!matchedPassword) {
    throw AppError.create("Email or password is incorrect", 401, FAIL);
  }

  if (!user.isActive) {
    throw AppError.create("This account is inactive", 403, FAIL);
  }

  const token = await generateJWT({email: user.email, id: user._id, role: user.role});
  const userResponse = user.toObject();
  delete userResponse.password;
  userResponse.token = token; 

  return {
    user: userResponse,
    redirectTo: user.role === "ADMIN" ? "/admin" : "/user",
  };
};

export const updateUserService = async (userId, updateData) => {
  const oldUser = await User.findById(userId);

  if (!oldUser) {
    throw AppError.create("User not found", 404, FAIL);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    }
  );

  if (updateData.avatar && oldUser.avatar) {
    await deleteFile(oldUser.avatar);
  }

  const userResponse = user.toObject();

  delete userResponse.password;
  delete userResponse.token;
  delete userResponse.__v;

  return userResponse;
};

export const logoutUserService = async (userId) => {
  await User.findByIdAndUpdate(userId, { token: null });
  return { success: true };
};