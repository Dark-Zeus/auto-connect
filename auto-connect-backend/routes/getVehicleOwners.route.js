import express from "express";
import { getAllVehicleOwners, getVehicleOwnerByNic } from "../controllers/getVehicleOwners.controller.js";

const router = express.Router();

router.get("/nic/:nic", getVehicleOwnerByNic);
router.get("/", getAllVehicleOwners);

export default router;
