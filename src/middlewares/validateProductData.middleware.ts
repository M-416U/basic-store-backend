import { Request, Response, NextFunction } from "express";

export const validateProductDataMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, description, price, inStock, images } = req.body;

  if (!name || !description || !price || !inStock || !images) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (isNaN(Number(price)) || isNaN(Number(inStock))) {
    return res
      .status(400)
      .json({ message: "Price and inStock must be valid numbers" });
  }

  if (!Array.isArray(images) || images.length === 0) {
    return res
      .status(400)
      .json({ message: "Images must be a non-empty array" });
  }

  next();
};
