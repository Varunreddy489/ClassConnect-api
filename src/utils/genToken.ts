import { Response } from "express";
import jwt from "jsonwebtoken";

export const genTokenAndCookie = (
  userId: number,
  role: string,
  res: Response
) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;

    const token = jwt.sign({ userId, role }, JWT_SECRET!, { expiresIn: "1d" });
    console.log("token:", token);

    res.cookie("auth", token, {
      httpOnly: true, // Makes the cookie accessible only by the web server
      secure: process.env.NODE_ENV === "production", // Send only on HTTPS in production
      sameSite: "strict", // Helps prevent CSRF attacks
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    console.error("errror in genTokenCookie:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
