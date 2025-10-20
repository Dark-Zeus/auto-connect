import express from 'express';
import { getAllServiceCenters } from '../controllers/getServiceCenters.controller.js';

const router = express.Router();
router.get("/", getAllServiceCenters);

export default router;