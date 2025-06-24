// routes/vehicles.js
import express from "express";
import { body, param } from "express-validator";
import {
  registerVehicle,
  getUserVehicles,
  getVehicleById,
  updateVehicle,
  getVehicleHistory,
  addVehicleHistory,
  updateInsurance,
  updateRevenueLicense,
  addEmissionTest,
  getPendingVerifications,
  verifyVehicle,
  getVehicleAnalytics,
} from "../controllers/VehicleController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Validation middleware
const validateVehicleRegistration = [
  body("registrationNumber")
    .notEmpty()
    .withMessage("Registration number is required")
    .matches(/^([A-Z]{2,3}\s)?[A-Z]{2,3}-\d{4}$/)
    .withMessage("Invalid registration number format"),

  body("chassisNumber")
    .isLength({ min: 17, max: 17 })
    .withMessage("Chassis number must be exactly 17 characters"),

  body("engineNumber").notEmpty().withMessage("Engine number is required"),

  body("currentOwner.name")
    .notEmpty()
    .withMessage("Current owner name is required"),

  body("currentOwner.idNumber")
    .notEmpty()
    .withMessage("Current owner ID number is required"),

  body("cylinderCapacity")
    .isInt({ min: 50, max: 10000 })
    .withMessage("Cylinder capacity must be between 50 and 10000 CC"),

  body("classOfVehicle")
    .isIn([
      "MOTOR CAR",
      "MOTOR CYCLE",
      "THREE WHEELER",
      "MOTOR LORRY",
      "MOTOR COACH",
      "MOTOR AMBULANCE",
      "MOTOR HEARSE",
      "DUAL PURPOSE VEHICLE",
      "LAND VEHICLE",
      "PRIME MOVER",
      "TRAILER",
      "MOTOR TRICYCLE VAN",
      "MOTOR TRICYCLE CAB",
    ])
    .withMessage("Invalid vehicle class"),

  body("yearOfManufacture")
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage("Invalid year of manufacture"),
];

const validateVehicleUpdate = [
  body("mileage")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Mileage must be a positive number"),

  body("insuranceDetails.validTo")
    .optional()
    .isISO8601()
    .withMessage("Invalid insurance expiry date"),

  body("revenueLicense.validTo")
    .optional()
    .isISO8601()
    .withMessage("Invalid license expiry date"),
];

const validateVehicleId = [
  param("vehicleId").isMongoId().withMessage("Invalid vehicle ID"),
];

// Apply authentication to all routes
router.use(authenticateToken);

// Public routes (for authenticated users)
router.post("/register", validateVehicleRegistration, registerVehicle);
router.get("/", getUserVehicles);
router.get("/analytics", getVehicleAnalytics);
router.get("/:vehicleId", validateVehicleId, getVehicleById);
router.put(
  "/:vehicleId",
  validateVehicleId,
  validateVehicleUpdate,
  updateVehicle
);

// Vehicle history routes
router.get("/:vehicleId/history", validateVehicleId, getVehicleHistory);
router.post("/:vehicleId/history", validateVehicleId, addVehicleHistory);

// Insurance and license routes
router.put("/:vehicleId/insurance", validateVehicleId, updateInsurance);
router.put(
  "/:vehicleId/revenue-license",
  validateVehicleId,
  updateRevenueLicense
);
router.post("/:vehicleId/emission-test", validateVehicleId, addEmissionTest);

// Admin routes
router.get(
  "/admin/pending-verifications",
  requireRole(["admin"]),
  getPendingVerifications
);
router.patch(
  "/:vehicleId/verify",
  requireRole(["admin"]),
  validateVehicleId,
  verifyVehicle
);

export default router;
