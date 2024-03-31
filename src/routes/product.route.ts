import express from "express";
import multer from "multer";

import { Product } from "../controllers";
import {
  uploadMediaMiddleware,
  validateProductDataMiddleware,
} from "../middlewares";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/",
  upload.fields([{ name: "video" }, { name: "images" }]),
  uploadMediaMiddleware,
  validateProductDataMiddleware,
  Product.createProduct
);

router.get("/", Product.getAllProducts);
router.get("/:productId", Product.getProduct);
router.put(
  "/:productId",
  upload.fields([{ name: "images" }, { name: "video" }]),
  uploadMediaMiddleware,
  Product.updateProduct
);

router.delete("/:productId", Product.deleteProduct);

export default router;
