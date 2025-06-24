// Minimal auth middleware - just to prevent import errors
export const authenticateToken = (req, res, next) => {
  // Placeholder - always allow for now
  req.user = { id: "test", role: "admin" };
  next();
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Placeholder - always allow for now
    next();
  };
};

// Alias for requireRole (same as authorizeRoles for compatibility)
export const requireRole = (...roles) => {
  return (req, res, next) => {
    // Placeholder - always allow for now
    next();
  };
};
