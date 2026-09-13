import mongoose from "mongoose";

const connectDB = async () => {
  return await mongoose.connect(process.env.MONGODB_URL);
};

export default connectDB;