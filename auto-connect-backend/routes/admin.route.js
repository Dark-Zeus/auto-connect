// routes/admin.route.js
import express from "express";
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  verifyUser,
  unverifyUser,
  activateUser,
  deactivateUser,
  getUsersByRole,
  getPendingVerifications,
  getUserStats,
  exportUsers,
  bulkVerifyUsers,
  bulkDeleteUsers,
  getUserActivityLog,
  getSystemStats,
  manageUserPermissions,
} from "../controllers/admin.controller.js";
import {
  protect,
  requireAdmin,
  restrictTo,
} from "../middleware/auth.middleware.js";
import {
  validate,
  registerValidation,
  updateUserValidation,
  bulkActionValidation,
} from "../utils/validation.util.js";
import { upload } from "../configs/multer.config.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(requireAdmin);

// User management routes
router
  .route("/users")
  .get(getAllUsers)
  .post(validate(registerValidation), createUser);

router
  .route("/users/:id")
  .get(getUser)
  .patch(validate(updateUserValidation), updateUser)
  .delete(deleteUser);

// Bulk operations
router.post(
  "/users/bulk-verify",
  validate(bulkActionValidation),
  bulkVerifyUsers
);
router.post(
  "/users/bulk-delete",
  validate(bulkActionValidation),
  bulkDeleteUsers
);

// User verification management
router.patch("/users/:id/verify", verifyUser);
router.patch("/users/:id/unverify", unverifyUser);
router.patch("/users/:id/activate", activateUser);
router.patch("/users/:id/deactivate", deactivateUser);
router.patch(
  "/users/:id/permissions",
  validate(updateUserValidation),
  manageUserPermissions
);

// User activity and audit
router.get("/users/:id/activity-log", getUserActivityLog);

// User analytics and filtering
router.get("/users/role/:role", getUsersByRole);
router.get("/users/pending-verifications", getPendingVerifications);
router.get("/analytics/user-stats", getUserStats);
router.get("/analytics/system-stats", getSystemStats);
router.get("/users/export", exportUsers);

// File upload for admin operations
router.post(
  "/users/bulk-import",
  upload.single("userFile"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a CSV file",
        });
      }

      // Process bulk user import
      // Implementation would depend on your CSV processing needs
      res.status(200).json({
        success: true,
        message: "Bulk import initiated",
        data: {
          fileName: req.file.originalname,
          fileSize: req.file.size,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// System configuration routes
router.get("/config/system-settings", async (req, res) => {
  // Return system configuration settings
  res.status(200).json({
    success: true,
    data: {
      systemSettings: {
        maxLoginAttempts: 5,
        lockoutDuration: 30, // minutes
        passwordPolicy: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: true,
        },
        emailVerificationRequired: true,
        adminVerificationRequired: {
          service_center: true,
          repair_center: true,
          insurance_agent: true,
          police: true,
        },
      },
    },
  });
});

router.patch("/config/system-settings", async (req, res) => {
  // Update system configuration settings
  // Implementation would depend on your configuration storage
  res.status(200).json({
    success: true,
    message: "System settings updated successfully",
  });
});

export default router;
