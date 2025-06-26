import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import LOG from "../configs/log.config.js";

// Middleware to verify JWT token
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      LOG.security.invalidToken(
        null,
        "Missing or invalid authorization header",
        {
          ip: req.ip,
          userAgent: req.get("user-agent"),
        }
      );
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      LOG.security.invalidToken(null, "Empty token", {
        ip: req.ip,
        userAgent: req.get("user-agent"),
      });
      return res.status(401).json({
        success: false,
        message: "Access denied. Invalid token format.",
      });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        issuer: "auto-connect",
        audience: "auto-connect-users",
      });

      // Check if user still exists and is active
      const user = await User.findById(decoded.userId);

      if (!user) {
        LOG.security.invalidToken(token, "User not found", {
          userId: decoded.userId,
          ip: req.ip,
        });
        return res.status(401).json({
          success: false,
          message: "Token is no longer valid. User not found.",
        });
      }

      if (!user.isActive) {
        LOG.security.invalidToken(token, "User account is deactivated", {
          userId: decoded.userId,
          ip: req.ip,
        });
        return res.status(401).json({
          success: false,
          message: "Account has been deactivated.",
        });
      }

      // Attach user to request
      req.user = user;
      req.token = token;

      next();
    } catch (jwtError) {
      let message = "Invalid token.";
      let reason = "jwt_error";

      if (jwtError.name === "TokenExpiredError") {
        message = "Token has expired.";
        reason = "token_expired";
      } else if (jwtError.name === "JsonWebTokenError") {
        message = "Invalid token format.";
        reason = "invalid_format";
      } else if (jwtError.name === "NotBeforeError") {
        message = "Token not active yet.";
        reason = "token_not_active";
      }

      LOG.security.invalidToken(token, reason, {
        error: jwtError.message,
        ip: req.ip,
        userAgent: req.get("user-agent"),
      });

      return res.status(401).json({
        success: false,
        message,
      });
    }
  } catch (error) {
    LOG.error("Authentication middleware error", {
      error: error.message,
      stack: error.stack,
      ip: req.ip,
    });

    return res.status(500).json({
      success: false,
      message: "Authentication error occurred.",
    });
  }
};

// Middleware to check if user is verified
export const requireVerification = (req, res, next) => {
  if (!req.user.isVerified) {
    LOG.security.suspiciousActivity(
      req.user._id,
      "Unverified user access attempt",
      {
        email: req.user.email,
        ip: req.ip,
      }
    );

    return res.status(403).json({
      success: false,
      message: "Email verification required to access this resource.",
    });
  }
  next();
};

// Middleware to authorize based on roles
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      LOG.security.suspiciousActivity(
        req.user._id,
        "Unauthorized role access attempt",
        {
          userRole: req.user.role,
          requiredRoles: allowedRoles,
          endpoint: req.originalUrl,
          ip: req.ip,
        }
      );

      return res.status(403).json({
        success: false,
        message: "Insufficient permissions to access this resource.",
      });
    }

    next();
  };
};

// Middleware to check if user is admin
export const requireAdmin = authorize("admin");

// Middleware to check if user is service provider
export const requireServiceProvider = authorize("service_provider", "admin");

// Middleware to check if user is insurance company
export const requireInsuranceCompany = authorize("insurance_company", "admin");

// Middleware to check if user is vehicle owner
export const requireVehicleOwner = authorize("vehicle_owner", "admin");

// Middleware to allow multiple roles
export const allowRoles = (...roles) => authorize(...roles);

// Optional authentication middleware (doesn't require token)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(); // Continue without authentication
    }

    const token = authHeader.substring(7);

    if (!token) {
      return next(); // Continue without authentication
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        issuer: "auto-connect",
        audience: "auto-connect-users",
      });

      const user = await User.findById(decoded.userId);

      if (user && user.isActive) {
        req.user = user;
        req.token = token;
      }
    } catch (jwtError) {
      // Log but don't fail the request
      LOG.debug("Optional auth token verification failed", {
        error: jwtError.message,
        ip: req.ip,
      });
    }

    next();
  } catch (error) {
    LOG.error("Optional authentication middleware error", {
      error: error.message,
      ip: req.ip,
    });
    next(); // Continue without authentication
  }
};

// Middleware to extract user info from token without strict validation
export const extractUserInfo = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);

      if (token) {
        try {
          const decoded = jwt.decode(token); // Decode without verification
          req.tokenPayload = decoded;
        } catch (error) {
          LOG.debug("Token decode failed in extractUserInfo", {
            error: error.message,
            ip: req.ip,
          });
        }
      }
    }

    next();
  } catch (error) {
    LOG.error("Extract user info middleware error", {
      error: error.message,
      ip: req.ip,
    });
    next();
  }
};
