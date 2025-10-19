import express from "express";
import { createPromotionStripeSession } from "../controllers/promotionPayment.controller.js";

const router = express.Router();

router.post("/create-session", createPromotionStripeSession);

export default router;