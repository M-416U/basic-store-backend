import express from "express";

import { anyController } from "../controllers";
import { validateDataForAnyRoute } from "../middlewares";

const router = express.Router();

//visit http://localhost:3000/any/nested/ to see
router.get("/nested/:anyData", validateDataForAnyRoute, anyController);
export default router;
