import { getAllUsersService, registerUserService, loginUserService, getCurrentUserService, logoutUserService, updateUserService } from "../service/userService.js";
import { SUCCESS } from "../utils/httpStatusText.js";
import asyncHandler from "../middlewares/asyncHandler.js";

export const getAllUsers = async (req, res) => {
  const query = req.query;

  const limit = query.limit || 10;
  const page = query.page || 1;

  const users = await getAllUsersService(limit, page);

  res.json({
    status: SUCCESS,
    data: {
      users,
    },
  });
};

export const getCurrentUser = asyncHandler(
  async (req, res) => {
    const user = await getCurrentUserService(req.currentUser.id);

    const redirectTo = req.userRole === "ADMIN" ? "/admin" : "/user";

    res.json({
      status: SUCCESS,
      data: {
        user,
        redirectTo,
      },
    });
  }
);

export const registerUser = asyncHandler(
    async (req, res) => {
        const {user, redirectTo} = await registerUserService(req.body);

        res.status(201).json({
            status: SUCCESS,
            data: {
              user,
              redirectTo,
            },
        });
    }
);

export const loginUser = asyncHandler(
    async (req, res) => {
        const { email, password } = req.body;

        const { user, redirectTo } = await loginUserService(email, password);

        res.json({
            status: SUCCESS,
            data: {
              user,
              redirectTo,
            },
        });
    }
);

export const updateUser = asyncHandler(
  async (req, res) => {
    const userId = req.currentUser.id;
    const updateData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
    };

    if (req.file) {
      updateData.avatar = `/uploads/users/${req.file.filename}`;
    }

    const user = await updateUserService(userId, updateData);

    res.json({
      status: SUCCESS,
      data: { user },
    });
  }
);

export const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.currentUser.id; 
    await logoutUserService(userId);

    res.json({
      status: SUCCESS,
      message: "Logged out successfully",
    });
});