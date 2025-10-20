import express from "express";
import insuranceClaimController from "../../../controllers/insuranceClaim.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";
import { upload, handleMulterError } from "../../../configs/multer.config.js";

const router = express.Router();

router.post(
  "/",
  protect,
  upload.fields([
    { name: "digitalSignature", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "policeReport", maxCount: 1 },
    { name: "photos[front]", maxCount: 1 },
    { name: "photos[back]", maxCount: 1 },
    { name: "photos[left]", maxCount: 1 },
    { name: "photos[right]", maxCount: 1 },
    { name: "photos[special][]", maxCount: 10 },
  ]),
  handleMulterError,
  insuranceClaimController.createInsuranceClaim
);

router.get("/", insuranceClaimController.getAllInsuranceClaims);
router.get("/customer/:customerId", insuranceClaimController.getInsuranceClaimsByCustomer);
router.post("/company", insuranceClaimController.getAllInsuranceClaimsByCompany);

export default router;