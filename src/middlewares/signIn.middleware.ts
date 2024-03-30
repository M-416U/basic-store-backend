import * as db from "../db";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signInMiddleware = async (
  req: express.Request & { token: string },
  res: express.Response,
  next: express.NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await db.user.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "email or password are wrong" });
    }
    const newToken = jwt.sign({ userId: user._id }, process.env.SECRET);
    user.token = newToken;
    req.token = newToken;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
