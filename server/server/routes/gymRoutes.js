import express from "express";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  createGym,
  getAllGyms,
  getGym,
  updateGym,
  deleteGym,
} from "../controllers/gymController.js";

const router = express.Router();

// =================== Public Routes ===================
router.get("/", getAllGyms);
router.get("/:id", getGym);

// =================== Gym Owner Routes ===================
router.post(
  "/",
  protect,
  authorizeRoles("gymOwner"),
  upload.array("images", 5),
  createGym,
);

router.put(
  "/:id",
  protect,
  authorizeRoles("gymOwner"),
  upload.array("images", 5),
  updateGym,
);
// =================== Gym Owner + Admin ===================
router.delete("/:id", protect, authorizeRoles("gymOwner", "admin"), deleteGym);

export default router;
