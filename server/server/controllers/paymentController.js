import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import crypto from "crypto";
import Razorpay from "razorpay";

// =======================
// Create Payment
// =======================
export const createPayment = async (req, res) => {
  try {
    const { order, paymentMethod } = req.body;

    const orderExists = await Order.findById(order);

    if (!orderExists) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const payment = await Payment.create({
      user: req.user._id,
      order,
      amount: orderExists.totalPrice,
      paymentMethod,
      paymentStatus: "Paid",
    });

    // Order bhi update karo
    orderExists.paymentStatus = "Paid";
    await orderExists.save();

    res.status(201).json({
      success: true,
      message: "Payment Successful",
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// My Payments
// =======================
export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      user: req.user._id,
    })
      .populate("order")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: payments.length,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Admin Get All Payments
// =======================
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email")
      .populate("order")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: payments.length,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Update Payment Status
// =======================
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    payment.paymentStatus = paymentStatus;
    await payment.save();

    // Order bhi update ho jayega
    await Order.findByIdAndUpdate(payment.order, {
      paymentStatus,
    });

    res.json({
      success: true,
      message: "Payment status updated successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Delete Payment
// =======================
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    await payment.deleteOne();

    res.json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Razorpay: Create Order
// =======================
export const razorpayOrder = async (req, res) => {
  try {
    const { amount, receipt } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return res.status(200).json({
        success: true,
        demo: true,
        keyId: "demo",
        orderId: "order_demo_" + Date.now(),
        amount: Number(amount),
        currency: "INR",
        message:
          "Razorpay keys not configured. Running in demo mode - use Simulate Payment.",
      });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: receipt || "receipt_" + Date.now(),
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(201).json({
      success: true,
      keyId,
      orderId: razorpayOrder.id,
      amount: Number(amount),
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error("RAZORPAY ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Razorpay: Verify Signature
// =======================
export const razorpayVerify = async (req, res) => {
  try {
    const {
      orderId,
      paymentMethod,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment details are missing",
      });
    }

    let isValid = false;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret && razorpay_order_id.startsWith("order_demo_")) {
      isValid = true;
    } else {
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(body)
        .digest("hex");

      isValid = expectedSignature === razorpay_signature;
    }

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    let payment = null;

    if (orderId) {
      const orderExists = await Order.findById(orderId);

      if (!orderExists) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      payment = await Payment.create({
        user: req.user._id,
        order: orderId,
        amount: orderExists.totalPrice,
        paymentMethod: paymentMethod || "Card",
        paymentStatus: "Paid",
      });

      orderExists.paymentStatus = "Paid";
      await orderExists.save();
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment,
    });
  } catch (error) {
    console.error("RAZORPAY VERIFY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};