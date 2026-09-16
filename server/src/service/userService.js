import User from "../model/User.js";
import bcrypt from "bcrypt";
import generateJWT from "../utils/generateJWT.js";
import AppError from "../utils/AppError.js";
import { FAIL, ERROR } from "../utils/httpStatusText.js";

export const getAllUsersService = async (limit, page) => {
  const skip = (page - 1) * limit;

  const users = await User.find({},{__v: false, password: false}).limit(limit).skip(skip);
  return users;
};

export const registerUserService = async ({firstName, lastName, email, password, phoneNumber, slug}) => {
  const oldUser = await User.findOne({ email });

  if (oldUser) {
    const error = AppError.create("user already exists!", 400, FAIL);
    throw error;
  }

  const hashedUser = await bcrypt.hash(password, 18);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedUser,
    phoneNumber,
    slug,
  });

  await newUser.save();


  const token = await generateJWT({email: email, id: newUser._id, role: newUser.role});
  newUser.token = token;

  return newUser;
};

export const loginUserService = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    const error = AppError("Email or password is incorrect", 401, FAIL);
    throw error;
  }

  const matchedPassword = await bcrypt.compare(password, user.password);

  if (user && matchedPassword) {
    const token = await generateJWT({email: user.email, id: user._id, role: user.role});
    return token;
  }

  const error = AppError.create("somthing wrong", 500, ERROR);
  throw error;
};