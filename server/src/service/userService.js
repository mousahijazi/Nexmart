import bcrypt from "bcrypt";
import mongoose from "mongoose";
import generateJWT from "../utils/tokenAndCookies/generateJWT.js";
import hashToken from "../utils/tokenAndCookies/hashToken.js";
import AppError from "../utils/AppError.js";
import { FAIL } from "../utils/httpStatusText.js";
import { deleteFile } from "../middlewares/fileService.js";
import { findUserByEmail, createUser, saveUserSession, findUserById, findAllUsers, updateUserById, revokeUserSession } from "../repositories/usersRepository.js";

const sanitizeUser = (user) => {
  const userObject = user.toObject ? user.toObject() : { ...user };

  delete userObject.password;
  delete userObject.token;
  delete userObject.__v;

  return userObject;
};

const createUserSession = async (user, expiration) => {
  const token = await generateJWT(
    {
      email: user.email,
      id: user._id,
      role: user.role,
    },
    expiration
  );

  await saveUserSession(user, hashToken(token));
  return token;
};

export const getAllUsersService = async (limit = 10, page = 1) => {
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const skip = (safePage - 1) * safeLimit;

  return findAllUsers(safeLimit, skip);
};

export const getUserByIdService = async (userId) => {
  if (!mongoose.isValidObjectId(userId)) {
    throw AppError.create("Invalid user ID", 400, FAIL);
  }

  const user = await findUserById(userId);

  if (!user) {
    throw AppError.create("User not found", 404, FAIL);
  }

  return user;
};

export const getCurrentUserService = async (userId) => {
  return getUserByIdService(userId);
};

export const registerUserService = async ({ firstName, lastName, email, password, phoneNumber, slug }) => {
  const oldUser = await findUserByEmail(email);

  if (oldUser) {
    throw AppError.create("User already exists", 400, FAIL);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await createUser({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phoneNumber,
    slug,
  });

  const token = await createUserSession(newUser, "7d");

  return {
    user: sanitizeUser(newUser),
    token,
    redirectTo: newUser.role === "ADMIN" ? "/admin" : "/user",
  };
};

export const loginUserService = async (email, password) => {
  const user = await findUserByEmail(email);

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

  const tokenExpiration = user.role === "ADMIN" ? "1d" : "7d";
  const token = await createUserSession(user, tokenExpiration);

  return {
    user: sanitizeUser(user),
    token,
    redirectTo: user.role === "ADMIN" ? "/admin" : "/user",
  };
};

export const updateUserService = async (userId, updateData) => {
  const oldUser = await findUserById(userId);

  if (!oldUser) {
    throw AppError.create("User not found", 404, FAIL);
  }

  const updatedUser = await updateUserById(userId, updateData);

  if (!updatedUser) {
    throw AppError.create("User not found", 404, FAIL);
  }

  if (updateData.avatar && oldUser.avatar) {
    await deleteFile(oldUser.avatar);
  }

  return sanitizeUser(updatedUser);
};

export const logoutUserService = async (userId) => {
  await revokeUserSession(userId);

  return { success: true };
};