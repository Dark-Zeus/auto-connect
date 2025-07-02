// routes/auth.route.js
import express from "express";
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  verifyEmail,
  resendVerificationEmail,
  getMe,
  updateMe,
  deleteMe,
  checkAuthStatus,
} from "../controllers/auth.controller.js";
import {
  protect,
  refreshToken,
  optionalAuth,
} from "../middleware/auth.middleware.js";
import {
  validate,
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  updatePasswordValidation,
  updateProfileValidation,
  emailValidation,
} from "../utils/validation.util.js";
import { upload } from "../configs/multer.config.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);
router.post(
  "/forgot-password",
  validate(forgotPasswordValidation),
  forgotPassword
);
router.patch(
  "/reset-password/:token",
  validate(resetPasswordValidation),
  resetPassword
);
router.get("/verify-email/:token", verifyEmail);
router.post(
  "/resend-verification",
  validate(emailValidation),
  resendVerificationEmail
);
router.post("/refresh-token", refreshToken);
router.get("/status", optionalAuth, checkAuthStatus);

// Protected routes (authentication required)
router.use(protect); // All routes after this middleware are protected

router.post("/logout", logout);
router.get("/me", getMe);
router.patch("/update-me", validate(updateProfileValidation), updateMe);
router.patch(
  "/update-password",
  validate(updatePasswordValidation),
  updatePassword
);
router.delete("/delete-me", deleteMe);

// Profile image upload
router.patch(
  "/upload-profile-image",
  upload.single("profileImage"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload an image file",
        });
      }

      // Here you would typically upload to cloud storage (AWS S3, Cloudinary, etc.)
      // For now, we'll just simulate the upload
      const imageUrl = `/uploads/profiles/${req.user._id}_${Date.now()}.${
        req.file.mimetype.split("/")[1]
      }`;

      // Update user's profile image
      req.user.profileImage = imageUrl;
      await req.user.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        message: "Profile image uploaded successfully",
        data: {
          imageUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
