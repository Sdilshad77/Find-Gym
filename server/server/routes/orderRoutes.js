import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";

import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ================= User / GymOwner / Admin =================

// Create Order
router.post(
  "/",
  protect,
  authorizeRoles("user", "gymOwner", "admin"),
  createOrder
);

// My Orders
router.get(
  "/my-orders",
  protect,
  authorizeRoles("user", "gymOwner", "admin"),
  getMyOrders
);

// ================= Admin Only =================

// Get All Orders
router.get(
  "/all",
  protect,
  authorizeRoles("admin"),
  getAllOrders
);

// Update Order Status
router.put(
  "/:id/status",
  protect,
  authorizeRoles("gymOwner", "admin"),
  updateOrderStatus
);

// Delete Order
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteOrder
);

// ================= User / GymOwner / Admin =================

// Get Single Order
router.get(
  "/:id",
  protect,
  authorizeRoles("user", "gymOwner", "admin"),
  getOrderById
);

export default router;