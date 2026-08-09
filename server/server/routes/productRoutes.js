import express from "express";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// ================= Public Routes =================
router.get("/", getAllProducts);

router.get("/:id", getProduct);

// ================= Gym Owner Routes =================
router.post(
  "/",
  protect,
  authorizeRoles("gymOwner"),
  upload.array("images", 5),
  createProduct,
);

router.put(
  "/:id",
  protect,
  authorizeRoles("gymOwner"),
  upload.array("images", 5),
  updateProduct,
);

// ================= Gym Owner + Admin =================
router.delete(
  "/:id",
  protect,
  authorizeRoles("gymOwner", "admin"),
  deleteProduct,
);

export default router;
