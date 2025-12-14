import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["auth_token"];
  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    req.userId = (decoded as JwtPayload).userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "unauthorized" });
  }
};

// const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const user = await User.findById(req.userId);
//     if (!user) {
//       return res.status(404).json({ message: "Użytkownik nie znaleziony" });
//     }
//     if (!user.isAdmin) {
//       return res.status(403).json({ message: "Brak dostępu" });
//     }
//     next();
//   } catch (error) {
//     res.status(500).json({ message: "Coś poszło nie tak." });
//   }
// };

// export { verifyToken, verifyAdmin };
export { verifyToken };
