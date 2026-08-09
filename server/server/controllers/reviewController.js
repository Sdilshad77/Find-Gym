import Review from "../models/Review.js";
import Gym from "../models/Gym.js";

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const gym = await Gym.findById(req.params.id);

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: "Gym not found",
      });
    }

    const alreadyReviewed = await Review.findOne({
      gym: req.params.id,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this gym",
      });
    }

    await Review.create({
      gym: req.params.id,
      user: req.user._id,
      rating,
      comment,
    });

    const reviews = await Review.find({
      gym: req.params.id,
    });

    gym.totalReviews = reviews.length;

    gym.rating =
      reviews.reduce((acc, item) => acc + item.rating, 0) /
      reviews.length;

    await gym.save();

    res.status(201).json({
      success: true,
      message: "Review Added Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      gym: req.params.id,
    })
      .populate("user", "name profileImage")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};