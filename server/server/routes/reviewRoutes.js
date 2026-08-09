import express from "express";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

import {
  addReview,
  getReviews,
} from "../controllers/reviewController.js";

const router = express.Router();

// ================= Public Route =================
router.get("/:id", getReviews);

// ================= User Routes =================
router.post(
  "/:id",
  protect,
  authorizeRoles("user", "gymOwner", "admin"),
  addReview
);

export default router;