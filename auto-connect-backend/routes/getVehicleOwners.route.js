import express from "express";
import { getAllVehicleOwners } from "../controllers/getVehicleOwners.controller.js";

const router = express.Router();

router.get("/", getAllVehicleOwners);

export default router;
