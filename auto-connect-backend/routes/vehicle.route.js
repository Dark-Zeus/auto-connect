// routes/vehicle.route.js (Updated with Enhanced Middleware)
import express from "express";
import {
  createVehicle,
  getMyVehicles,
  getMyVehicle,
  updateMyVehicle,
  deleteMyVehicle,
  getMyVehicleStats,
  searchMyVehicles,
  getVehicleByRegistration,
  exportMyVehicles,
} from "../controllers/vehicle.controller.js";
import {
  protect,
  restrictTo,
  requireVehicleOwner,
  verifyNICOwnership,
  sensitiveOperationLimit,
  protectVehicleOperations,
  validateSession,
  attachUserContext,
} from "../middleware/auth.middleware.js";
import {
  validateVehicle,
  vehicleRegistrationValidation,
  vehicleUpdateValidation,
  vehicleQueryValidation,
} from "../utils/vehicleValidation.util.js";
import { upload } from "../configs/multer.config.js";

const router = express.Router();

// All vehicle routes require authentication and vehicle owner role
router.use(protect);
router.use(attachUserContext); // Attach user context for better logging
router.use(validateSession); // Validate user session
router.use(requireVehicleOwner); // Ensure only vehicle owners can access

// Vehicle CRUD routes
router
  .route("/")
  .get(getMyVehicles) // GET /api/vehicles - Get all user's vehicles with pagination/filtering
  .post(
    verifyNICOwnership, // Verify NIC ownership before creation
    validateVehicle(vehicleRegistrationValidation),
    createVehicle
  ); // POST /api/vehicles - Create new vehicle

// Vehicle statistics and search routes
router.get("/stats", getMyVehicleStats); // GET /api/vehicles/stats - Get user's vehicle statistics
router.get("/search", searchMyVehicles); // GET /api/vehicles/search?q=search_term - Search user's vehicles

// Sensitive operation - Export (with additional logging)
router.get("/export", sensitiveOperationLimit, exportMyVehicles); // GET /api/vehicles/export - Export user's vehicle data

// Get vehicle by registration number
router.get("/registration/:registrationNumber", getVehicleByRegistration); // GET /api/vehicles/registration/ABC-1234

// Individual vehicle operations
router
  .route("/:id")
  .get(getMyVehicle) // GET /api/vehicles/:id - Get specific vehicle details
  .patch(validateVehicle(vehicleUpdateValidation), updateMyVehicle) // PATCH /api/vehicles/:id - Update vehicle
  .delete(
    sensitiveOperationLimit, // Log sensitive DELETE operations
    deleteMyVehicle
  ); // DELETE /api/vehicles/:id - Soft delete vehicle

// Document and image upload routes with enhanced security
router.post(
  "/:id/documents",
  sensitiveOperationLimit, // Log file upload operations
  upload.single("document"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a document file",
          error: "NO_FILE_UPLOADED",
        });
      }

      // Verify vehicle ownership before allowing upload
      const Vehicle = (await import("../models/Vehicle.model.js")).default;
      const vehicle = await Vehicle.findOne({
        _id: req.params.id,
        ownerId: req.user._id,
        isDeleted: { $ne: true },
      });

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message:
            "Vehicle not found or you do not have access to this vehicle.",
          error: "VEHICLE_NOT_FOUND",
        });
      }

      // Here you would typically upload to cloud storage (AWS S3, Cloudinary, etc.)
      // For now, we'll simulate the upload
      const documentUrl = `/uploads/vehicles/${
        req.params.id
      }/documents/${Date.now()}_${req.file.originalname}`;

      // Update vehicle's documents array
      const documentData = {
        type: req.body.documentType || "OTHER",
        fileName: req.file.originalname,
        fileUrl: documentUrl,
        fileSize: req.file.size,
        uploadDate: new Date(),
        description: req.body.description || "",
      };

      vehicle.documents.push(documentData);
      await vehicle.save();

      // Log the upload
      const LOG = (await import("../configs/log.config.js")).default;
      LOG.info({
        message: "Document uploaded successfully",
        userId: req.user._id,
        vehicleId: vehicle._id,
        vehicleReg: vehicle.registrationNumber,
        documentType: documentData.type,
        fileName: req.file.originalname,
        fileSize: req.file.size,
      });

      res.status(200).json({
        success: true,
        message: "Document uploaded successfully",
        data: {
          document: documentData,
          vehicle: {
            id: vehicle._id,
            registrationNumber: vehicle.registrationNumber,
            totalDocuments: vehicle.documents.length,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/:id/images",
  sensitiveOperationLimit, // Log image upload operations
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload an image file",
          error: "NO_FILE_UPLOADED",
        });
      }

      // Validate file type
      if (!req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({
          success: false,
          message: "Please upload only image files",
          error: "INVALID_FILE_TYPE",
        });
      }

      // Verify vehicle ownership before allowing upload
      const Vehicle = (await import("../models/Vehicle.model.js")).default;
      const vehicle = await Vehicle.findOne({
        _id: req.params.id,
        ownerId: req.user._id,
        isDeleted: { $ne: true },
      });

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message:
            "Vehicle not found or you do not have access to this vehicle.",
          error: "VEHICLE_NOT_FOUND",
        });
      }

      // Here you would typically upload to cloud storage (AWS S3, Cloudinary, etc.)
      // For now, we'll simulate the upload
      const imageUrl = `/uploads/vehicles/${
        req.params.id
      }/images/${Date.now()}_${req.file.originalname}`;

      // Update vehicle's images array
      const imageData = {
        type: req.body.imageType || "EXTERIOR",
        imageUrl: imageUrl,
        description: req.body.description || "",
        uploadDate: new Date(),
      };

      vehicle.images.push(imageData);
      await vehicle.save();

      // Log the upload
      const LOG = (await import("../configs/log.config.js")).default;
      LOG.info({
        message: "Image uploaded successfully",
        userId: req.user._id,
        vehicleId: vehicle._id,
        vehicleReg: vehicle.registrationNumber,
        imageType: imageData.type,
        fileName: req.file.originalname,
        fileSize: req.file.size,
      });

      res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        data: {
          image: imageData,
          vehicle: {
            id: vehicle._id,
            registrationNumber: vehicle.registrationNumber,
            totalImages: vehicle.images.length,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Remove document with enhanced security
router.delete(
  "/:id/documents/:documentId",
  sensitiveOperationLimit,
  async (req, res, next) => {
    try {
      // Verify vehicle ownership
      const Vehicle = (await import("../models/Vehicle.model.js")).default;
      const vehicle = await Vehicle.findOne({
        _id: req.params.id,
        ownerId: req.user._id,
        isDeleted: { $ne: true },
      });

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message:
            "Vehicle not found or you do not have access to this vehicle.",
          error: "VEHICLE_NOT_FOUND",
        });
      }

      // Find and remove the document
      const documentIndex = vehicle.documents.findIndex(
        (doc) => doc._id.toString() === req.params.documentId
      );

      if (documentIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Document not found.",
          error: "DOCUMENT_NOT_FOUND",
        });
      }

      const removedDocument = vehicle.documents[documentIndex];
      vehicle.documents.splice(documentIndex, 1);
      await vehicle.save();

      // Log the removal
      const LOG = (await import("../configs/log.config.js")).default;
      LOG.warn({
        message: "Document removed from vehicle",
        userId: req.user._id,
        vehicleId: vehicle._id,
        vehicleReg: vehicle.registrationNumber,
        documentId: req.params.documentId,
        fileName: removedDocument.fileName,
      });

      res.status(200).json({
        success: true,
        message: "Document removed successfully",
      });
    } catch (error) {
      next(error);
    }
  }
);

// Remove image with enhanced security
router.delete(
  "/:id/images/:imageId",
  sensitiveOperationLimit,
  async (req, res, next) => {
    try {
      // Verify vehicle ownership
      const Vehicle = (await import("../models/Vehicle.model.js")).default;
      const vehicle = await Vehicle.findOne({
        _id: req.params.id,
        ownerId: req.user._id,
        isDeleted: { $ne: true },
      });

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message:
            "Vehicle not found or you do not have access to this vehicle.",
          error: "VEHICLE_NOT_FOUND",
        });
      }

      // Find and remove the image
      const imageIndex = vehicle.images.findIndex(
        (img) => img._id.toString() === req.params.imageId
      );

      if (imageIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Image not found.",
          error: "IMAGE_NOT_FOUND",
        });
      }

      const removedImage = vehicle.images[imageIndex];
      vehicle.images.splice(imageIndex, 1);
      await vehicle.save();

      // Log the removal
      const LOG = (await import("../configs/log.config.js")).default;
      LOG.warn({
        message: "Image removed from vehicle",
        userId: req.user._id,
        vehicleId: vehicle._id,
        vehicleReg: vehicle.registrationNumber,
        imageId: req.params.imageId,
        imageType: removedImage.type,
      });

      res.status(200).json({
        success: true,
        message: "Image removed successfully",
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
