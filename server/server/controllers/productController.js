import Product from "../models/Product.js";
import Gym from "../models/Gym.js";

// ==============================
// Create Product
// ==============================

export const createProduct = async (req, res) => {
  try {
    const {
      productName,
      description,
      category,
      brand,
      price,
      discountPrice,
      stock,
      gym,
    } = req.body;

    const gymExists = await Gym.findById(gym);
  
    if (!gymExists) {
      return res.status(404).json({
        success: false,
        message: "Gym not found",
      });
    }

    if (gymExists.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "You are not the owner of this gym",
      });
    }

    const imageUrls = req.files
      ? req.files.map((file) => file.path)
      : [];

    const product = await Product.create({
      productName,
      description,
      category,
      brand,
      price,
      discountPrice,
      stock,
      gym,
      seller: req.user._id,
      images: imageUrls,
    });

    res.status(201).json({
      success: true,
      message: "Product Created Successfully",
      product,
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
// Get All Products
// ==============================

export const getAllProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      sort = "newest",
    } = req.query;

    let query = {};

    if (search) {
      query.productName = {
        $regex: search,
        $options: "i",
      };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice)
        query.price.$gte = Number(minPrice);

      if (maxPrice)
        query.price.$lte = Number(maxPrice);
    }

    let sortOption = {};

    switch (sort) {
      case "priceLow":
        sortOption = { price: 1 };
        break;

      case "priceHigh":
        sortOption = { price: -1 };
        break;

      case "rating":
        sortOption = { rating: -1 };
        break;

      default:
        sortOption = { createdAt: -1 };
    }

    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate("seller", "name email")
      .populate("gym", "gymName city")
      .sort(sortOption)
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      products,
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
// Get Single Product
// ==============================

export const getProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id)
      .populate("seller", "name email")
      .populate("gym", "gymName city");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Update Product
// ==============================

export const updateProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized",
      });
    }

    let imageUrls = product.images;

    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => file.path);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
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
      message: "Product Updated Successfully",
      product: updatedProduct,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// ==============================
// Delete Product
// ==============================

export const deleteProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


