import express from "express";
import { createStripeSession } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-session", createStripeSession);

export default router;