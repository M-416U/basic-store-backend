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

export const uploadImagesMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files: any = req.files;
    if (!req.files || !req.files.length) {
      return next();
    }

    let images: string[] = [];

    const uploadedImagesPromises = files.map(async (file: any) => {
      if (!file.path) {
        throw new Error("Temporary file path not available");
      }

      const uploadedImage = await cloudinary.v2.uploader.upload(file.path);
      fs.rmSync(file.path);
      return uploadedImage.secure_url;
    });

    const uploadedImageURLs = await Promise.all(uploadedImagesPromises);

    images = uploadedImageURLs;

    req.body.images = images;
    next();
  } catch (error) {
    console.error("Error uploading images:", error);
    return res.status(500).json({ message: "Error uploading images" });
  }
};
