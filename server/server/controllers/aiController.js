import ai from "../config/gemini.js";
import Product from "../models/Product.js";
import Gym from "../models/Gym.js";
import calculateBMI from "../utils/calculateBMI.js";

export const askAI = async (req, res) => {
  try {
    const { message, height, weight } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // ==========================
    // BMI Mode
    // ==========================
    if (height && weight) {
      const { bmi, category } = calculateBMI(height, weight);

      const prompt = `
You are a professional fitness trainer.

User Details:
Height: ${height} cm
Weight: ${weight} kg

BMI: ${bmi}
Category: ${category}

Generate:

1. BMI Analysis
2. Diet Plan
3. Workout Plan
4. Daily Calories
5. Water Intake
6. Health Tips

Keep the response short and easy to understand.
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      return res.status(200).json({
        success: true,
        bmi,
        category,
        answer: response.text,
      });
    }

    // ==========================
    // Gym/Product Recommendation
    // ==========================

    const products = await Product.find()
      .select("productName price category brand")
      .lean();

    const gyms = await Gym.find()
      .select("gymName city address rating")
      .lean();

    const prompt = `
You are an AI assistant for GymHub.

Available Products:
${JSON.stringify(products)}

Available Gyms:
${JSON.stringify(gyms)}

User Question:
${message}

Rules:
- Recommend ONLY products and gyms from the database.
- If not available, clearly say it is unavailable.
- Keep the answer concise.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return res.status(200).json({
      success: true,
      answer: response.text,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};