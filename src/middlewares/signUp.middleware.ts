import * as db from "../db";
import express from "express";
import jwt from "jsonwebtoken";

export const signUpMiddleware = async (
  req: express.Request & { token: string },
  res: express.Response,
  next: express.NextFunction
) => {
  const { firstName, email, password, lastName, phoneNumber, avatar } =
    req.body;
  console.log("Request", req.body);
  const errors = [];
  if (!firstName) {
    errors.push({ field: "firstName", message: "First Name is required" });
  }
  if (!avatar) {
    errors.push({ field: "avatar", message: "avatar ('image') is required" });
  }
  if (!email) {
    errors.push({ field: "email", message: "Email is required" });
  }
  if (!password) {
    errors.push({ field: "password", message: "Password is required" });
  }
  if (!lastName) {
    errors.push({ field: "lastName", message: "Last Name is required" });
  }
  if (!phoneNumber) {
    errors.push({ field: "phoneNumber", message: "Phone Number is required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push({ field: "email", message: "Invalid email address" });
  }

  try {
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }
    const existingUser = await db.user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new db.user({
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      avatar,
    });
    const token = jwt.sign({ userId: newUser._id }, process.env.SECRET);
    newUser.token = token;
    await newUser.save();

    req.token = token;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
