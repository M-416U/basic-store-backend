import express from "express";
import multer from "multer";

import { Product } from "../controllers";
import { uploadImagesMiddleware } from "../middlewares";

const router = express.Router();
const upload = multer({ dest: "uploads/" });
router.post(
  "/",
  upload.array("images"),
  uploadImagesMiddleware,
  Product.createProduct
);
router.get("/", Product.getAllProducts);
router.get("/:productId", Product.getProduct);
router.put(
  "/:productId",
  upload.array("images"),
  uploadImagesMiddleware,
  Product.updateProduct
);
router.delete("/:productId", Product.deleteProduct);
export default router;
