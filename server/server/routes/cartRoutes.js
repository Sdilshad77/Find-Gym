import express from "express";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

// ================= Add To Cart =================
router.post(
  "/",
  protect,
  authorizeRoles("user", "gymOwner", "admin"),
  addToCart
);

// ================= Get My Cart =================
router.get(
  "/",
  protect,
  authorizeRoles("user", "gymOwner", "admin"),
  getCart
);

// ================= Update Quantity =================
router.put(
  "/:productId",
  protect,
  authorizeRoles("user", "gymOwner", "admin"),
  updateCartItem
);
// ================= Clear Cart =================
router.delete(
  "/clear",
  protect,
  authorizeRoles("user", "gymOwner", "admin"),
  clearCart
);

// ================= Remove Item =================
router.delete(
  "/:productId",
  protect,
  authorizeRoles("user", "gymOwner", "admin"),
  removeCartItem
);

export default router;