import express from "express";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

import {
  adminDashboard,
  gymOwnerDashboard,
  userDashboard,
} from "../controllers/dashboardController.js";

const router = express.Router();

// ===========================
// User Dashboard
// ===========================
router.get(
  "/user",
  protect,
  authorizeRoles("user"),
  userDashboard
);

// ===========================
// Gym Owner Dashboard
// ===========================
router.get(
  "/gym-owner",
  protect,
  authorizeRoles("gymOwner"),
  gymOwnerDashboard
);

// ===========================
// Admin Dashboard
// ===========================
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  adminDashboard
);

export default router;