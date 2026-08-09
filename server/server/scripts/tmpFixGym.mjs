import mongoose from "mongoose";

const fix = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  const G = conn.connection.collection("gyms");
  const r = await G.updateMany(
    { gymName: "Iron Temple Fitness" },
    [
      {
        $set: {
          gymName: {
            $cond: [{ $eq: ["$city", "bengaluru"] }, "Peak Performance Gym", "$gymName"],
          },
        },
      },
    ]
  );
  console.log("Modified:", r.modifiedCount);
  await mongoose.disconnect();
};

fix().catch((e) => {
  console.error(e.message);
  process.exit(1);
});