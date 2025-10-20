import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";

const router = express.Router();

// GET /api/v1/dashboard
router.get("/", getDashboardStats);

export default router;