import express from "express";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

import {
  createBooking,
  getMyBookings,
  getGymBookings,
  approveBooking,
  rejectBooking,
  completeBooking,
  cancelBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

// ==============================
// User Routes
// ==============================

// Create Booking
router.post("/", protect, authorizeRoles("user"), createBooking);

// Get My Bookings
router.get(
  "/my-bookings",
  protect,
  authorizeRoles("user"),
  getMyBookings
);

// Cancel Booking
router.put(
  "/cancel/:id",
  protect,
  authorizeRoles("user"),
  cancelBooking
);

// ==============================
// Gym Owner Routes
// ==============================

// Get All Bookings
router.get(
  "/gym-owner",
  protect,
  authorizeRoles("gymOwner"),
  getGymBookings
);

// Approve Booking
router.put(
  "/approve/:id",
  protect,
  authorizeRoles("gymOwner"),
  approveBooking
);

// Reject Booking
router.put(
  "/reject/:id",
  protect,
  authorizeRoles("gymOwner"),
  rejectBooking
);

// Complete Booking
router.put(
  "/complete/:id",
  protect,
  authorizeRoles("gymOwner"),
  completeBooking
);

export default router;