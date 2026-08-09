import express from "express";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

import {
  buyMembership,
  myMemberships,
  cancelMembership,
} from "../controllers/membershipController.js";

const router = express.Router();

// =========================
// User Routes
// =========================

// Buy Membership
router.post(
  "/buy",
  protect,
  authorizeRoles("user"),
  buyMembership
);

// My Memberships
router.get(
  "/my-memberships",
  protect,
  authorizeRoles("user"),
  myMemberships
);

// Cancel Membership
router.put(
  "/cancel/:id",
  protect,
  authorizeRoles("user", "admin"),
  cancelMembership
);

export default router;