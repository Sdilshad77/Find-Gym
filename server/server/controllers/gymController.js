import Gym from "../models/Gym.js";

// ==============================
// Create Gym
// ==============================

export const createGym = async (req, res) => {
  try {

    const imageUrls = req.files
      ? req.files.map(file => file.path)
      : [];

    const gym = await Gym.create({
      ...req.body,
      images: imageUrls,
      owner: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Gym Created Successfully",
      gym,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Get All Gyms
// ==============================

export const getAllGyms = async (req, res) => {
  try {
    const {
      search,
      city,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      sort = "newest",
    } = req.query;

    let query = {};

    // Search by Gym Name
    if (search) {
      query.gymName = {
        $regex: search,
        $options: "i",
      };
    }

    // Search by City
    if (city) {
      query.city = {
        $regex: city,
        $options: "i",
      };
    }

    // Price Filter
    if (minPrice || maxPrice) {
      query.membershipPrice = {};

      if (minPrice)
        query.membershipPrice.$gte = Number(minPrice);

      if (maxPrice)
        query.membershipPrice.$lte = Number(maxPrice);
    }

    let sortOption = {};

    switch (sort) {
      case "priceLow":
        sortOption = { membershipPrice: 1 };
        break;

      case "priceHigh":
        sortOption = { membershipPrice: -1 };
        break;

      case "rating":
        sortOption = { rating: -1 };
        break;

      default:
        sortOption = { createdAt: -1 };
    }

    const total = await Gym.countDocuments(query);

    const gyms = await Gym.find(query)
      .populate("owner", "name email")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      gyms,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Single Gym
// ==============================

export const getGym = async (req, res) => {
  try {

    const gym = await Gym.findById(req.params.id)
      .populate("owner", "name email phone");

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: "Gym Not Found",
      });
    }

    res.status(200).json({
      success: true,
      gym,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Update Gym
// ==============================

export const updateGym = async (req, res) => {
  try {

    const gym = await Gym.findById(req.params.id);

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: "Gym Not Found",
      });
    }

    if (gym.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized",
      });
    }

    let imageUrls = gym.images;

    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => file.path);
    }

    const updatedGym = await Gym.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        images: imageUrls,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Gym Updated Successfully",
      gym: updatedGym,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Delete Gym
// ==============================

export const deleteGym = async (req, res) => {
  try {

    const gym = await Gym.findById(req.params.id);

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: "Gym Not Found",
      });
    }

    if (gym.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized",
      });
    }

    await gym.deleteOne();

    res.status(200).json({
      success: true,
      message: "Gym Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};