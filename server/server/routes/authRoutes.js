import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

// Protected Routes
router.get(
  "/profile",
  protect,
  authorizeRoles("user", "gymOwner", "admin"),
  getProfile
);

router.put(
  "/profile",
  protect,
  authorizeRoles("user", "gymOwner", "admin"),
  updateProfile
);

// Logout
router.get(
  "/logout",
  protect,
  authorizeRoles("user", "gymOwner", "admin"),
  logout
);

export default router;