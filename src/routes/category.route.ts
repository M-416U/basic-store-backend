import express from "express";

import { Category } from "../controllers";
import { upload, uploadCategoryImageMiddleware } from "../middlewares";

const router = express.Router();

router.post(
  "/",
  upload.single("image"),
  uploadCategoryImageMiddleware,
  Category.createCategory
);

router.get("/", Category.getAllCategories);
router.get("/:categoryId", Category.getCategory);
router.put(
  "/:categoryId",
  upload.single("image"),
  uploadCategoryImageMiddleware,
  Category.updateCategory
);

router.delete("/:CategoryId", Category.deleteCategory);

export default router;
