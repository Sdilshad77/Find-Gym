import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/configdb.js";
import colors from "colors";
import authRoutes from "./routes/authRoutes.js";
import gymRoutes from "./routes/gymRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import membershipRoutes from "./routes/membershipRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

const defaultAllowedOrigins = ["https://find-gym-theta.vercel.app"];

const allowedOrigins = [
  ...defaultAllowedOrigins,
  ...(process.env.CLIENT_URL || "")
    .split(",")
    .map((u) => u.trim().replace(/\/+$/, ""))
    .filter(Boolean),
];

const normalizeOrigin = (o) => (o || "").replace(/\/+$/, "");

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const ok =
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
        allowedOrigins.includes(normalizeOrigin(origin));
      return cb(null, ok);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
    maxAge: 86400,
  })
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "GymHub API Running 🚀",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/gyms", gymRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/memberships", membershipRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/bookings", bookingRoutes);

// API 404 - unknown routes
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});