import dotenv from "dotenv";
import { connectDB } from "../config/configdb.js";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const name = process.env.ADMIN_NAME || "Admin";
    const email = process.env.ADMIN_EMAIL || "admin@gymhub.com";
    const password = process.env.ADMIN_PASSWORD || "admin123";

    const existing = await User.findOne({ email });

    if (existing) {
      console.log(`Admin already exists with email: ${email}`);
      process.exit(0);
    }

    await User.create({
      name,
      email,
      password,
      role: "admin",
    });

    console.log(`Admin created successfully: ${email} / ${password}`);
    process.exit(0);
  } catch (error) {
    console.error("ADMIN SEED ERROR:", error);
    process.exit(1);
  }
};

createAdmin();