import dotenv from "dotenv";
import { connectDB } from "../config/configdb.js";
import User from "../models/User.js";
import Gym from "../models/Gym.js";
import Product from "../models/Product.js";

dotenv.config();

const u = (id, w = 1200, q = 80) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`;

const GYM_IMAGES = [
  "photo-1534438327276-14e5300c3a48",
  "photo-1526506118085-60ce8714f8c5",
  "photo-1540497077202-7c8a3999166f",
  "photo-1517836357463-d25dfeac3438",
  "photo-1550345332-09e3ac987658",
  "photo-1571019613454-1cb2f99b2d8b",
  "photo-1583454110551-21f2fa2afe61",
  "photo-1571902943202-507ec2618e8f",
  "photo-1584735935682-2f2b69dff9d2",
  "photo-1570829460005-c840387bb1ca",
  "photo-1518611012118-696072aa579a",
  "photo-1546483875-ad9014c88eba",
  "photo-1507398941214-572c25f4b1dc",
  "photo-1532029837206-abbe2b7620e3",
  "photo-1558611848-73f7eb4001a1",
  "photo-1599058917212-d750089bc07e",
  "photo-1521805103424-d8f8430e8933",
];

const SUP_IMAGES = [
  "photo-1548690312-e3b507d8c110",
  "photo-1553729459-efe14ef6055d",
  "photo-1579758629938-03607ccdbaba",
  "photo-1556906781-9a412961c28c",
  "photo-1579722820308-d74e571900a9",
  "photo-1593095948071-474c5cc2989d",
  "photo-1605296867304-46d5465a13f1",
  "photo-1502657877623-f66bf489d236",
  "photo-1518611012118-696072aa579a",
  "photo-1571019613454-1cb2f99b2d8b",
  "photo-1517836357463-d25dfeac3438",
  "photo-1526506118085-60ce8714f8c5",
  "photo-1584735935682-2f2b69dff9d2",
  "photo-1599058917212-d750089bc07e",
];

const SEED_OWNER = {
  name: "GymHub Demo Owner",
  email: "owner@gymhub.com",
  password: "owner123",
  phone: "+91 9876543210",
  role: "gymOwner",
};

const GYMS = [
  {
    gymName: "Iron Temple Fitness",
    description:
      "Mumbai's premium strength & conditioning club with certified trainers, olympic platforms and a dedicated sauna floor.",
    address: "Linking Road, Andheri West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400053",
    phone: "+91 9820012345",
    email: "info@irontemple.in",
    membershipPrice: 3500,
    openingTime: "05:30 AM",
    closingTime: "11:00 PM",
    facilities: ["Cardio Zone", "Free Weights", "CrossFit", "Sauna", "Personal Trainer", "Smoothie Bar"],
    verified: true,
    rating: 4.8,
    totalReviews: 240,
    location: { latitude: 19.1136, longitude: 72.8697 },
    imgIdx: [0, 1, 2],
  },
  {
    gymName: "Iron Temple Fitness",
    description:
      "Premium fitness destination in the heart of Delhi with olympic lifting platforms, turf training area and smart lockers.",
    address: "Connaught Place",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560001",
    phone: "+91 9811001122",
    email: "care@peekperf.in",
    membershipPrice: 3200,
    openingTime: "06:00 AM",
    closingTime: "10:30 PM",
    facilities: ["Olympic Lifting", "Cardio Cinema", "Cryotherapy", "Nutrition Counselling"],
    verified: true,
    rating: 4.7,
    totalReviews: 180,
    location: { latitude: 12.9716, longitude: 77.5946 },
    imgIdx: [3, 4, 5],
  },
  {
    gymName: "Titan Strength & Fitness",
    description:
      "Full-service strength studio with HIIT arena, steam & sauna and certified coaches for all levels.",
    address: "BTM Layout",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500034",
    phone: "+91 98450 11223",
    email: "connect@titanfit.in",
    membershipPrice: 2800,
    openingTime: "05:00 AM",
    closingTime: "11:00 PM",
    facilities: ["Strength Zone", "HIIT Studio", "Steam & Sauna", "Group Classes"],
    verified: true,
    rating: 4.9,
    totalReviews: 312,
    location: { latitude: 17.4401, longitude: 78.3489 },
    imgIdx: [6, 7, 8],
  },
  {
    gymName: "Iron Temple Indore",
    description:
      "Biggest powerlifting & functional gym of Indore — 15,000 sq ft, competition platforms and cardio deck.",
    address: "Vijay Nagar",
    city: "Indore",
    state: "Madhya Pradesh",
    pincode: "452010",
    phone: "+91 98270 22331",
    email: "indore@irontemple.in",
    membershipPrice: 1500,
    openingTime: "05:00 AM",
    closingTime: "10:00 PM",
    facilities: ["Powerlifting", "Boxing", "Cardio Zone", "Steam"],
    verified: true,
    rating: 4.6,
    totalReviews: 410,
    location: { latitude: 22.7533, longitude: 75.8938 },
    imgIdx: [9, 10, 11],
  },
  {
    gymName: "Nirvana Fitness Studio",
    description: "Boutique fitness studio with yoga, zumba and recovery centre in the heart of Pune.",
    address: "Kothrud",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411038",
    phone: "+91 99225 18234",
    email: "care@nirvanafit.in",
    membershipPrice: 2200,
    openingTime: "06:00 AM",
    closingTime: "10:30 PM",
    facilities: ["Yoga Studio", "Zumba", "Strength Lab", "Steam"],
    verified: false,
    rating: 4.3,
    totalReviews: 96,
    location: { latitude: 18.5074, longitude: 73.8077 },
    imgIdx: [12, 13, 14],
  },
  {
    gymName: "Peak Valleys Fitness",
    description: "Holistic fitness club in Jaipur with swimming pool, squash court and personal coaching.",
    address: "Malviya Nagar",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302017",
    phone: "+91 96020 22450",
    email: "hello@peakvally.in",
    membershipPrice: 1900,
    openingTime: "05:30 AM",
    closingTime: "10:30 PM",
    facilities: ["Swimming Pool", "Squash", "Free Weights", "Trainer"],
    verified: true,
    rating: 4.4,
    totalReviews: 133,
    location: { latitude: 26.8572, longitude: 75.8097 },
    imgIdx: [15, 0, 3],
  },
  {
    gymName: "FitVerse Elite",
    description: "Elite training facility with smart equipment tracking, recovery lounge and nutrition bar.",
    address: "Koramangala",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600017",
    phone: "+91 98840 15531",
    email: "elite@fitverse.in",
    membershipPrice: 3500,
    openingTime: "05:00 AM",
    closingTime: "11:30 PM",
    facilities: ["Smart Equipment", "Recovery Lounge", "Nutrition Bar", "Steam"],
    verified: true,
    rating: 4.5,
    totalReviews: 230,
    location: { latitude: 13.0827, longitude: 80.1834 },
    imgIdx: [2, 6, 10],
  },
  {
    gymName: "Dumbbell Fitness Club",
    description:
      "Friendly neighbourhood gym with cardio deck, free weights room and 24x7 access for members.",
    address: "Salt Lake",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700091",
    phone: "+91 98300 26712",
    email: "dp@dumbbellclub.in",
    membershipPrice: 1400,
    openingTime: "05:30 AM",
    closingTime: "10:00 PM",
    facilities: ["Cardio Zone", "Weight Room", "Yoga", "Zumba"],
    verified: true,
    rating: 4.2,
    totalReviews: 78,
    location: { latitude: 22.5841, longitude: 88.4293 },
    imgIdx: [5, 8, 13],
  },
];

const PRODUCTS = [
  { name: "Gold Standard 100% Whey 1kg", cat: "Protein", brand: "Optimum Nutrition", price: 4999, disc: 4299, stock: 30, rating: 4.8, rev: 512, imgIdx: [0, 1] },
  { name: "MuscleBlaze Whey Protein 1kg", cat: "Protein", brand: "MuscleBlaze", price: 2799, disc: 2349, stock: 55, rating: 4.7, rev: 890, imgIdx: [2, 3] },
  { name: "Ultra Pure Creatine 300g", cat: "Creatine", brand: "NutriWorks", price: 1299, disc: 899, stock: 80, rating: 4.6, rev: 743, imgIdx: [4, 5] },
  { name: "Nitro Pre-Workout 30serv", cat: "Pre Workout", brand: "RYSE Supplements", price: 1999, disc: 1599, stock: 40, rating: 4.5, rev: 289, imgIdx: [6, 7] },
  { name: "BCAA 2:1:1 Recovery 250g", cat: "BCAA", brand: "MuscleTech", price: 1599, disc: 1299, stock: 35, rating: 4.4, rev: 198, imgIdx: [8, 9] },
  { name: "Mass Gainer 3kg", cat: "Mass Gainer", brand: "MuscleBlaze", price: 3499, disc: 2999, stock: 25, rating: 4.3, rev: 342, imgIdx: [10, 11] },
  { name: "Gym Gloves Pro Grip", cat: "Accessories", brand: "Rage", price: 999, disc: 699, stock: 90, rating: 4.6, rev: 210, imgIdx: [12, 13] },
  { name: "Lifting Straps & Belt Combo", cat: "Accessories", brand: "Body Beast", price: 1499, disc: 1099, stock: 60, rating: 4.5, rev: 145, imgIdx: [0, 2] },
  { name: "Resistance Bands Set (5pcs)", cat: "Accessories", brand: "Toros", price: 799, disc: 499, stock: 120, rating: 4.7, rev: 620, imgIdx: [5, 6] },
  { name: "Shaker Bottle 700ml Pro", cat: "Accessories", brand: "GymHub", price: 499, disc: 349, stock: 150, rating: 4.4, rev: 180, imgIdx: [3, 8] },
  { name: "ThermoX Fat Burner 60caps", cat: "Others", brand: "NovaLabs", price: 1899, disc: 1499, stock: 45, rating: 4.2, rev: 96, imgIdx: [9, 4] },
  { name: "Amino Energy 30 serves", cat: "BCAA", brand: "Cellucor", price: 1699, disc: 1399, stock: 30, rating: 4.4, rev: 112, imgIdx: [7, 1] },
];

const seed = async () => {
  try {
    await connectDB();

    let owner = await User.findOne({ email: SEED_OWNER.email });
    if (!owner) {
      owner = await User.create(SEED_OWNER);
    }

    const existingGyms = await Gym.find();
    const existingGymNames = existingGyms.map((g) => g.gymName);
    const createdGymIds = [];
    let gymsCreated = 0;

    for (const g of GYMS) {
      if (existingGymNames.includes(g.gymName)) continue;

      const images = g.imgIdx.map((i) => u(GYM_IMAGES[i % GYM_IMAGES.length]));
      const gym = await Gym.create({
        owner: owner._id,
        gymName: g.gymName,
        description: g.description,
        address: g.address || `${g.gymName}, ${g.city}`,
        city: g.city,
        state: g.state,
        pincode: g.pincode,
        phone: g.phone,
        email: g.email || "",
        membershipPrice: g.membershipPrice,
        openingTime: g.openingTime,
        closingTime: g.closingTime,
        facilities: g.facilities,
        images,
        location: g.location,
        rating: g.rating,
        totalReviews: g.totalReviews ?? 0,
        verified: g.verified,
      });
      createdGymIds.push(gym._id);
      gymsCreated++;
    }

    const allGyms = gymsCreated > 0
      ? await Gym.find({ _id: { $in: createdGymIds } })
      : existingGyms;

    if (allGyms.length === 0) {
      console.log("No gym found to attach products → aborting.");
      process.exit(0);
    }

    const existingProductNames = await Product.find().distinct("productName");
    let productsCreated = 0;

    for (let i = 0; i < PRODUCTS.length; i++) {
      const p = PRODUCTS[i];
      if (existingProductNames.includes(p.name)) continue;

      const images = p.imgIdx.map((j) => u(SUP_IMAGES[j % SUP_IMAGES.length]));
      const gym = allGyms[i % allGyms.length];

      await Product.create({
        productName: p.name,
        description: `${p.cat} for gym${i % 2 === 0 ? " lovers" : " athletes"}: ${p.brand} ${p.name}.`,
        category: p.cat,
        brand: p.brand,
        price: p.price,
        discountPrice: p.disc,
        stock: p.stock,
        images,
        gym: gym._id,
        seller: owner._id,
        rating: p.rating,
        totalReviews: p.rev,
      });
      productsCreated++;
    }

    console.log(`Seed done → owner: ${SEED_OWNER.email} | gyms: ${gymsCreated} | products: ${productsCreated}`);
    process.exit(0);
  } catch (error) {
    console.error("SEED ERROR:", error);
    process.exit(1);
  }
};

seed();