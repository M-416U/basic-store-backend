import express from "express";

import { signInController, signUpController } from "../controllers";
import { signInMiddleware, signUpMiddleware, upload } from "../middlewares";
import { uploadAvatarMiddleware } from "../middlewares";

const router = express.Router();

router.post("/sign-in", signInMiddleware, signInController);
router.post(
  "/sign-up",
  upload.single("avatar"),
  uploadAvatarMiddleware,
  signUpMiddleware,
  signUpController
);
export default router;
