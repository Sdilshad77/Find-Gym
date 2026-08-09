import mongoose from "mongoose";

const gymSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    gymName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
      lowercase: true,
    },

    state: {
      type: String,
      required: true,
    },
    

    pincode: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      default: "",
    },

    membershipPrice: {
      type: Number,
      required: true,
    },

    openingTime: {
      type: String,
      default: "06:00 AM",
    },
    rating: {
  type: Number,
  default: 0,
},

totalReviews: {
  type: Number,
  default: 0,
},

    closingTime: {
      type: String,
      default: "10:00 PM",
    },

    facilities: [
      {
        type: String,
      },
    ],

    images: [
      {
        type: String,
      },
    ],

    location: {
      latitude: Number,
      longitude: Number,
    },

    rating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Gym = mongoose.models.Gym || mongoose.model("Gym", gymSchema);

export default Gym;