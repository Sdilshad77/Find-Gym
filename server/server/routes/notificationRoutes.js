import express from "express";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

import {
  createNotification,
  getMyNotifications,
  getNotificationById,
  markAsRead,
  deleteNotification,
  deleteAllNotifications,
  unreadNotificationCount,
} from "../controllers/notificationController.js";

const router = express.Router();

// User
router.get("/", protect, getMyNotifications);
router.get("/unread-count", protect, unreadNotificationCount);
router.get("/:id", protect, getNotificationById);
router.put("/:id/read", protect, markAsRead);
router.delete("/:id", protect, deleteNotification);
router.delete("/", protect, deleteAllNotifications);

// Admin
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createNotification
);

export default router;