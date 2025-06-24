import express from "express";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Simple login endpoint (mock implementation)
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      // Mock authentication - accept any email/password for now
      const mockUser = {
        id: 1,
        email: email,
        role: "admin",
        firstName: "Admin",
        lastName: "User",
      };

      // Mock token
      const mockToken = "mock-jwt-token-" + Date.now();

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: mockUser,
          token: mockToken,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Simple register endpoint (mock implementation)
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("firstName").optional().trim().isLength({ min: 1 }),
    body("lastName").optional().trim().isLength({ min: 1 }),
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { email, password, firstName, lastName } = req.body;

      // Mock user creation
      const mockUser = {
        id: Date.now(),
        email: email,
        firstName: firstName || "User",
        lastName: lastName || "Name",
        role: "user",
        createdAt: new Date().toISOString(),
      };

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: mockUser,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Logout endpoint
router.post("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

export default router;
