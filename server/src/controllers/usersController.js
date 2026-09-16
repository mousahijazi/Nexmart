import { getAllUsersService, registerUserService, loginUserService } from "../service/userService.js";
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

export const registerUser = asyncHandler(
    async (req, res) => {
        const user = await registerUserService(req.body);

        res.status(201).json({
            status: SUCCESS,
            data: {
            user,
            },
        });
    }
);

export const loginUser = asyncHandler(
    async (req, res) => {
        const { email, password } = req.body;

        const token = await loginUserService(email, password);

        res.json({
            status: SUCCESS,
            data: {
            token,
            },
        });
    }
);