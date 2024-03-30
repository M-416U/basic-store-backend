import express from "express";

import { signInController, signUpController } from "../controllers";
import { signInMiddleware, signUpMiddleware } from "../middlewares";

const router = express.Router();

router.post("/sign-in", signInMiddleware, signInController);
router.post("/sign-up", signUpMiddleware, signUpController);
export default router;
