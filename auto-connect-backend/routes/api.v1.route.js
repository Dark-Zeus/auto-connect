import express from "express";

const router = express.Router({ mergeParams: true });

/* Route Imports */
import healthRoute from "./health.route.js";


/* Routes */
router.use("/", healthRoute);

export default router;
