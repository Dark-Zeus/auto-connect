import express from "express";

const router = express.Router({ mergeParams: true });

/* Route Imports */
import healthRoute from "./health.route.js";
import vehicleRoutes from "./vehicles.js";
import authRoute from "./auth.route.js";


/* Routes */
router.use("/", healthRoute);
router.use("/vehicles", vehicleRoutes);
router.use("/auth", authRoute);

export default router;
 