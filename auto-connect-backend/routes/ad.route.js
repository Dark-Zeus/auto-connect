import express from "express";
import { activateBumpForAd } from "../controllers/adPromotion.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:id/bump", protect, activateBumpForAd);

export default router;