import express from "express";
import { askAI } from "../controllers/aiController.js";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/chat",
  protect,
  authorizeRoles("user", "gymOwner", "admin"),
  askAI
);

export default router;