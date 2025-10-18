import express from "express";
import { sendAdInquiry } from "../controllers/inquiry.controller.js";

const router = express.Router();

// Public endpoint to send an inquiry to a listing's seller
router.post("/", sendAdInquiry);

export default router;