import { Request, Response, NextFunction } from "express";
import cloudinary from "cloudinary";
import { config } from "dotenv";
import fs from "fs";

config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadAvatarMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Request file", req.file);
    if (!req.file) {
      return next();
    }

    const { path } = req.file;

    if (!path) {
      throw new Error("Temporary file path not available");
    }

    const uploadedAvatar = await cloudinary.v2.uploader.upload(path);

    req.body.avatar = uploadedAvatar.secure_url;

    fs.rmSync(path);

    next();
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return res.status(500).json({ message: "Error uploading avatar" });
  }
};
