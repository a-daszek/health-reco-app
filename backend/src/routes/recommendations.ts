import express from "express";
import { verifyToken } from "../middleware/auth";
import { getGeminiRecommendation } from "../services/gemini";

const router = express.Router();

router.post("/blood", verifyToken, async (req, res) => {
  try {
    const bloodResult = req.body;

    if (!bloodResult) {
      return res.status(400).json({ message: "Brak danych" });
    }

    const recommendation = await getGeminiRecommendation(bloodResult);

    return res.json({
      recommendations: [recommendation],
    });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({
      message: "Błąd generowania rekomendacji AI",
    });
  }
});

export default router;
