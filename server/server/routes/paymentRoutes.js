import express from "express";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

import {
  createPayment,
  getMyPayments,
  getAllPayments,
  updatePaymentStatus,
  razorpayOrder,
  razorpayVerify,
} from "../controllers/paymentController.js";

const router = express.Router();

// ==============================
// User Routes
// ==============================

// Create Payment
router.post(
  "/",
  protect,
  authorizeRoles("user"),
  createPayment
);

// Razorpay - Create Order
router.post(
  "/razorpay/order",
  protect,
  authorizeRoles("user"),
  razorpayOrder
);

// Razorpay - Verify Signature
router.post(
  "/razorpay/verify",
  protect,
  authorizeRoles("user"),
  razorpayVerify
);

// My Payments
router.get(
  "/my-payments",
  protect,
  authorizeRoles("user"),
  getMyPayments
);

// ==============================
// Admin Routes
// ==============================

// Get All Payments
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllPayments
);

// Update Payment Status
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updatePaymentStatus
);

export default router;