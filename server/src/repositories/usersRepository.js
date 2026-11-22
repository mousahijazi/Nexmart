import User from "../model/User.js";

export const findUserByEmail = (email) => {
  return User.findOne({ email });
};

export const createUser = (userData) => {
  return User.create(userData);
};

export const saveUserSession = async (user, tokenHash) => {
  user.token = tokenHash;
  await user.save();
  return user;
};

export const findUserForAuthentication = (userId) => {
  return User.findById(userId).select("+token _id email role isActive");
};

export const findUserById = (userId) => {
  return User.findById(userId, {
    password: false,
    token: false,
    __v: false,
  });
};

export const findAllUsers = (limit, skip) => {
  return User.find(
    {},
    {
      password: false,
      token: false,
      __v: false,
    }
  ).limit(limit).skip(skip).sort({ createdAt: -1 });
};

export const updateUserById = (userId, updateData) => {
  return User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    {
      new: true,
      runValidators: true,
      projection: {
        password: 0,
        token: 0,
        __v: 0,
      },
    }
  );
};

export const revokeUserSession = async (userId) => {
  return User.findByIdAndUpdate(userId, {
    $set: { token: null },
  });
};