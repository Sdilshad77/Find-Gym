import User from "../models/User.js";
import Gym from "../models/Gym.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// =======================
// Admin Dashboard
// =======================
export const adminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalGyms = await Gym.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const orders = await Order.find();

    const totalRevenue = orders.reduce(
      (acc, order) => acc + order.totalPrice,
      0
    );

    res.status(200).json({
      success: true,
      dashboard: {
        totalUsers,
        totalGyms,
        totalProducts,
        totalOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Gym Owner Dashboard
// =======================
export const gymOwnerDashboard = async (req, res) => {
  try {
    const gyms = await Gym.find({
      owner: req.user._id,
    });

    const gymIds = gyms.map((gym) => gym._id);

    const totalProducts = await Product.countDocuments({
      gym: { $in: gymIds },
    });

    const products = await Product.find({
      gym: { $in: gymIds },
    });

    const productIds = products.map((product) => product._id);

    const orders = await Order.find({
      "products.product": { $in: productIds },
    });

    const totalOrders = orders.length;

    const totalRevenue = orders.reduce(
      (acc, order) => acc + order.totalPrice,
      0
    );

    res.status(200).json({
      success: true,
      dashboard: {
        totalGyms: gyms.length,
        totalProducts,
        totalOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =======================
// User Dashboard
// =======================
export const userDashboard = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({
      user: req.user._id,
    });

    const orders = await Order.find({
      user: req.user._id,
    });

    const totalSpent = orders.reduce(
      (acc, order) => acc + order.totalPrice,
      0
    );

    res.status(200).json({
      success: true,
      dashboard: {
        totalOrders,
        totalSpent,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};