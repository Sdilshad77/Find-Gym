import Membership from "../models/Membership.js";
import Gym from "../models/Gym.js";

// =========================
// Buy Membership
// =========================
export const buyMembership = async (req, res) => {
  try {
    const { gym, plan, amount } = req.body;

    if (!gym || !plan || !amount) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const gymExists = await Gym.findById(gym);

    if (!gymExists) {
      return res.status(404).json({
        success: false,
        message: "Gym not found",
      });
    }

    // Check if already active membership exists
    const existingMembership = await Membership.findOne({
      user: req.user._id,
      gym,
      status: "Active",
    });

    if (existingMembership) {
      return res.status(400).json({
        success: false,
        message: "You already have an active membership for this gym",
      });
    }

    const startDate = new Date();
    const endDate = new Date(startDate);

    switch (plan) {
      case "Monthly":
        endDate.setMonth(endDate.getMonth() + 1);
        break;

      case "Quarterly":
        endDate.setMonth(endDate.getMonth() + 3);
        break;

      case "Half-Yearly":
        endDate.setMonth(endDate.getMonth() + 6);
        break;

      case "Yearly":
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid membership plan",
        });
    }

    const membership = await Membership.create({
      user: req.user._id,
      gym,
      plan,
      amount,
      startDate,
      endDate,
    });

    res.status(201).json({
      success: true,
      message: "Membership purchased successfully",
      membership,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// My Memberships
// =========================
export const myMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find({
      user: req.user._id,
    })
      .populate("gym", "gymName city membershipPrice")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: memberships.length,
      memberships,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Cancel Membership
// =========================
export const cancelMembership = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership not found",
      });
    }

    if (
      membership.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    membership.status = "Cancelled";
    await membership.save();

    res.status(200).json({
      success: true,
      message: "Membership cancelled successfully",
      membership,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};