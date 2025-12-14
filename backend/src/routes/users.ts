import express, { Request, Response } from "express";
import User from "../models/user";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.get("/me", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "Nie znaleziono użytkownika" });
    }
    res.json(user);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Coś poszło nie tak" });
  }
});

export default router;
