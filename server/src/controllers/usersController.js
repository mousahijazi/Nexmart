import { getAllUsersService, getUserByIdService, registerUserService, loginUserService, getCurrentUserService, logoutUserService, updateUserService } from "../service/userService.js";
import { SUCCESS } from "../utils/httpStatusText.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { setAuthCookie, clearAuthCookie } from "../utils/tokenAndCookies/authCookie.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const { limit = 10, page = 1 } = req.query;

  const users = await getAllUsersService(limit, page);

  res.json({
    status: SUCCESS,
    data: { users },
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await getUserByIdService(req.params.userId);

  res.json({
    status: SUCCESS,
    data: { user },
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await getCurrentUserService(req.currentUser.id);
  const redirectTo = user.role === "ADMIN" ? "/admin" : "/user";

  res.json({
    status: SUCCESS,
    data: {
      user,
      redirectTo,
    },
  });
});

export const registerUser = asyncHandler(async (req, res) => {
  const { user, token, redirectTo } = await registerUserService(req.body);

  setAuthCookie(res, token, user.role);

  res.status(201).json({
    status: SUCCESS,
    data: {
      user,
      redirectTo,
    },
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token, redirectTo } = await loginUserService(email, password);

  setAuthCookie(res, token, user.role);

  res.json({
    status: SUCCESS,
    data: {
      user,
      redirectTo,
    },
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const updateData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
  };

  if (req.file) {
    updateData.avatar = `/uploads/users/${req.file.filename}`;
  }

  const user = await updateUserService(req.currentUser.id, updateData);

  res.json({
    status: SUCCESS,
    data: { user },
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  await logoutUserService(req.currentUser.id);

  clearAuthCookie(res);

  res.json({
    status: SUCCESS,
    message: "Logged out successfully",
  });
});