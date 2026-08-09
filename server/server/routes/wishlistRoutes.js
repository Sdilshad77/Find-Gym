import express from "express";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

import {
  addToWishlist,
  getWishlist,
  removeWishlistItem,
} from "../controllers/wishlistController.js";

const router = express.Router();

// Add
router.post(
  "/:productId",
  protect,
  authorizeRoles("user", "gymOwner", "admin"),
  addToWishlist
);

// Get
router.get(
  "/",
  protect,
  authorizeRoles("user", "gymOwner", "admin"),
  getWishlist
);

// Remove
router.delete(
  "/:productId",
  protect,
  authorizeRoles("user", "gymOwner", "admin"),
  removeWishlistItem
);

export default router;