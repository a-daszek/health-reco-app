import express, { Request, Response } from "express";
import User from "../models/user";
import { verifyToken } from "../middleware/auth";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import mongoose from "mongoose";
import Blood from "../models/blood";

const router = express.Router();

router.get("/me", verifyToken, async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findOne({ _id: req.userId });
    if (!currentUser) {
      return res.status(404).json({ message: "Nie znaleziono użytkownika" });
    }
    res.json(currentUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Wystąpił błąd" });
  }
});

router.post(
  "/register",
  [
    check("firstName", "Imię jest wymagane").isString(),
    check("lastName", "Nazwisko jest wymagane").isString(),
    check("email", "Email jest wymagany").isEmail(),
    check("password", "Hasło z przynajmniej 12 znaków jest wymagane").isLength({
      min: 12,
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      let user = await User.findOne({
        email: req.body.email, //checking if the email in database matches the email in the body of the request
      });

      if (user) {
        return res
          .status(400)
          .json({ message: "Konto z tym adresem email już istnieje." });
      }

      user = new User(req.body);
      await user.save();

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });

      // return res.sendStatus(200);
      return res.status(200).send({ message: "Konto utworzone pomyślnie." });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Coś poszło nie tak." });
    }
  }
);

router.get(
  "/me/blood-tests",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.userId).populate("bloodResults");
      if (!user) {
        return res.status(404).json({ message: "Nie znaleziono użytkownika" });
      }
      res.json(user.bloodResults);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Wystąpił błąd" });
    }
  }
);

router.post(
  "/me/blood-tests",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      if (!body?.date) {
        return res.status(400).json({ message: "Pole date jest wymagane" });
      }

      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: "Nie znaleziono użytkownika" });
      }

      const blood = new Blood({
        _id: new mongoose.Types.ObjectId().toString(),
        date: new Date(body.date),
        hemoglobin: body.hemoglobin,
        wbc: body.wbc,
        platelets: body.platelets,
        glucose: body.glucose,
        cholesterolTotal: body.cholesterolTotal,
      });

      await blood.save();

      if (!user.bloodResults) {
        user.bloodResults = [];
      }
      user.bloodResults.push(blood._id as any);
      await user.save();

      return res.status(201).json(blood);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Wystąpił błąd" });
    }
  }
);

router.delete(
  "/me/blood-tests/:bloodId",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { bloodId } = req.params;

      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: "Nie znaleziono użytkownika" });
      }

      const hasBlood =
        Array.isArray(user.bloodResults) &&
        user.bloodResults.some((id: any) => id.toString() === bloodId);

      if (!hasBlood) {
        return res.status(403).json({ message: "Brak dostępu do tego wyniku" });
      }

      user.bloodResults = (user.bloodResults ?? []).filter(
        (id: any) => id.toString() !== bloodId
      );
      await user.save();

      await Blood.findByIdAndDelete(bloodId);

      return res.status(200).json({ message: "Wynik usunięty" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Wystąpił błąd" });
    }
  }
);

export default router;
