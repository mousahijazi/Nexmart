import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import bcrypt from "bcrypt";
import User from "../model/User.js";
import { userRoles } from "../utils/userRoles.js";
import connectDB from "../config/db.js";
import dotenv from "dotenv";
import generateJWT from "../utils/generateJWT.js";
import generateSlug from "../utils/generateSlug.js";

dotenv.config();

const createDefaultAdmin = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully for admin script...");

    const existingAdmin = await User.findOne({ role: userRoles.ADMIN });

    if (existingAdmin) {
      console.log("Admin account already exists. Skipping creation.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@123456", 18);

    const adminUser = new User({
      firstName: "Super",
      lastName: "Admin",
      email: "mousa@nexmart.com",
      password: hashedPassword,
      role: userRoles.ADMIN,
      slug: "super-admin",
      isActive: true,
    });

    // todo
    // const slug = await generateSlug({model: User, slugSource: (body) => `${body.firstName} ${body.lastName}`});
    // adminUser.slug = slug;

    const token = await generateJWT({email: adminUser.email, id: adminUser._id, role: adminUser.role}, "30d");
    adminUser.token = token;

    await adminUser.save();
    console.log("✅ Default Admin created successfully!");

    console.log("Email: admin@nexmart.com | Password: Admin@123456");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createDefaultAdmin();