import dotenv from "dotenv";
import jwt, {
  JsonWebTokenError,
  JwtPayload,
  TokenExpiredError,
} from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import prisma from "../db/db.config";

dotenv.config();

interface DecodedToken extends JwtPayload {
  userId: number;
  role: string;
}

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: number;
        role: string;
      };
    }
  }
}

export const checkIsAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] ||
      req.headers.cookie?.split("=")[1] ||
      req.cookies.token;

    console.log(token);

    if (!token) {
      return res.status(400).json({
        error: "Unauthorised - No token provided",
      });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as DecodedToken;

    if (!decodedToken) {
      return res.status(400).json({
        error: "Unauthorised - Invalid Token",
      });
    }

    const user = await prisma.student.findUnique({
      where: {
        id: Number(decodedToken.userId),
      },
      select: {
        id: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = {
      id: user.id,
      role: decodedToken.role,
    };

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({
        error: "Unauthorized - Token has expired",
      });
      console.error("Error in middleware:", error);
    } else if (error instanceof JsonWebTokenError) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
      console.error("Error in middleware:", error);
    } else {
      console.error("error in checkIsAuth:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
