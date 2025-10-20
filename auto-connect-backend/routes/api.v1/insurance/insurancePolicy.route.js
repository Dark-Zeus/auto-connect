import express from "express";
import InsurancePolicyController from "../../../controllers/insurancePolicy.controller.js";


const router = express.Router();

router.get("/types", InsurancePolicyController.getAllInsurancePolicyTypesByCompany);
router.post("/types", InsurancePolicyController.createInsurancePolicyType);
router.put("/types/:id", InsurancePolicyController.updateInsurancePolicyType);
router.delete("/types/:id", InsurancePolicyController.deleteInsurancePolicyType);

router.get("/", InsurancePolicyController.getAllInsurancePoliciesByCompany);
router.post("/", InsurancePolicyController.createInsurancePolicy);


export default router;

