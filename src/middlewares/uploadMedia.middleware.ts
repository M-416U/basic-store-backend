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

export const uploadMediaMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files: any = req.files;
    if (!files) {
      return next();
    }

    let images: string[] = [];
    let videoUrl: string | undefined;

    if (files.images) {
      for (const file of files.images) {
        if (!file.path) {
          throw new Error("Temporary file path not available");
        }

        if (file.mimetype.startsWith("image")) {
          const uploadedImage = await cloudinary.v2.uploader.upload(file.path);
          images.push(uploadedImage.secure_url);
        }
        fs.rmSync(file.path);
      }
    }

    if (files.video) {
      const file = files.video[0];
      if (!file.path) {
        throw new Error("Temporary file path not available");
      }

      if (file.mimetype.startsWith("video")) {
        const uploadedVideo = await cloudinary.v2.uploader.upload(file.path, {
          resource_type: "video",
        });
        videoUrl = uploadedVideo.secure_url;
        fs.rmSync(file.path);
      }
    }

    req.body.images = images;
    req.body.video = videoUrl;
    next();
  } catch (error) {
    console.error("Error uploading media:", error);
    return res.status(500).json({ message: "Error uploading media" });
  }
};
