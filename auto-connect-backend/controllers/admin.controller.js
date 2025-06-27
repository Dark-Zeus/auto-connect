// controllers/admin.controller.js
import User from "../models/user.model.js";
import LOG from "../configs/log.config.js";
import { catchAsync } from "../utils/catchAsync.util.js";
import { AppError } from "../utils/appError.util.js";
import {
  sendVerificationStatusEmail,
  sendWelcomeEmail,
} from "../utils/email.util.js";

// Get all users with filtering, sorting, and pagination
export const getAllUsers = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build filter object
  const filter = {};

  if (req.query.role) filter.role = req.query.role;
  if (req.query.isVerified !== undefined)
    filter.isVerified = req.query.isVerified === "true";
  if (req.query.isActive !== undefined)
    filter.isActive = req.query.isActive === "true";
  if (req.query.emailVerified !== undefined)
    filter.emailVerified = req.query.emailVerified === "true";

  // Search functionality
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, "i");
    filter.$or = [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
      { "businessInfo.businessName": searchRegex },
    ];
  }

  // Date range filter
  if (req.query.startDate || req.query.endDate) {
    filter.createdAt = {};
    if (req.query.startDate)
      filter.createdAt.$gte = new Date(req.query.startDate);
    if (req.query.endDate) filter.createdAt.$lte = new Date(req.query.endDate);
  }

  // Build sort object
  const sort = {};
  if (req.query.sortBy) {
    const sortBy = req.query.sortBy;
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
    sort[sortBy] = sortOrder;
  } else {
    sort.createdAt = -1; // Default sort by newest first
  }

  const users = await User.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate("createdBy", "firstName lastName email")
    .populate("lastModifiedBy", "firstName lastName email");

  const total = await User.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  LOG.info({
    message: "Users retrieved by admin",
    adminId: req.user._id,
    adminEmail: req.user.email,
    totalUsers: total,
    page,
    limit,
    filters: filter,
  });

  res.status(200).json({
    success: true,
    data: {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    },
  });
});

// Get a single user by ID
export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .populate("createdBy", "firstName lastName email")
    .populate("lastModifiedBy", "firstName lastName email");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  LOG.info({
    message: "User details retrieved by admin",
    adminId: req.user._id,
    targetUserId: user._id,
    targetUserEmail: user.email,
  });

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

// Create a new user (admin only)
export const createUser = catchAsync(async (req, res, next) => {
  const userData = {
    ...req.body,
    createdBy: req.user._id,
    isVerified: true, // Admin-created users are auto-verified
    emailVerified: true,
  };

  const newUser = await User.create(userData);

  // Send welcome email
  try {
    await sendWelcomeEmail(newUser);
  } catch (error) {
    LOG.warn({
      message: "Failed to send welcome email to admin-created user",
      userId: newUser._id,
      error: error.message,
    });
  }

  LOG.info({
    message: "User created by admin",
    adminId: req.user._id,
    newUserId: newUser._id,
    newUserEmail: newUser.email,
    newUserRole: newUser.role,
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: {
      user: newUser,
    },
  });
});

// Update a user
export const updateUser = catchAsync(async (req, res, next) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "phone",
    "address",
    "businessInfo",
    "isVerified",
    "isActive",
    "emailVerified",
    "phoneVerified",
  ];

  const updateData = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  updateData.lastModifiedBy = req.user._id;

  const user = await User.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  LOG.info({
    message: "User updated by admin",
    adminId: req.user._id,
    targetUserId: user._id,
    updatedFields: Object.keys(updateData),
  });

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: {
      user,
    },
  });
});

// Soft delete a user (deactivate)
export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Prevent deleting other admins (unless you're a super admin)
  if (
    user.role === "system_admin" &&
    user._id.toString() !== req.user._id.toString()
  ) {
    return next(new AppError("Cannot delete other admin accounts", 403));
  }

  user.isActive = false;
  user.lastModifiedBy = req.user._id;
  await user.save({ validateBeforeSave: false });

  LOG.warn({
    message: "User deactivated by admin",
    adminId: req.user._id,
    targetUserId: user._id,
    targetUserEmail: user.email,
  });

  res.status(200).json({
    success: true,
    message: "User deactivated successfully",
  });
});

// Verify a user
export const verifyUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (user.isVerified) {
    return next(new AppError("User is already verified", 400));
  }

  user.isVerified = true;
  user.emailVerified = true;
  user.lastModifiedBy = req.user._id;
  await user.save({ validateBeforeSave: false });

  // Send verification approval email
  try {
    await sendVerificationStatusEmail(user, true);
  } catch (error) {
    LOG.warn({
      message: "Failed to send verification approval email",
      userId: user._id,
      error: error.message,
    });
  }

  LOG.info({
    message: "User verified by admin",
    adminId: req.user._id,
    targetUserId: user._id,
    targetUserEmail: user.email,
    targetUserRole: user.role,
  });

  res.status(200).json({
    success: true,
    message: "User verified successfully",
    data: {
      user,
    },
  });
});

// Unverify a user
export const unverifyUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (!user.isVerified) {
    return next(new AppError("User is already unverified", 400));
  }

  user.isVerified = false;
  user.lastModifiedBy = req.user._id;
  await user.save({ validateBeforeSave: false });

  // Send verification rejection email
  try {
    await sendVerificationStatusEmail(user, false);
  } catch (error) {
    LOG.warn({
      message: "Failed to send verification rejection email",
      userId: user._id,
      error: error.message,
    });
  }

  LOG.warn({
    message: "User unverified by admin",
    adminId: req.user._id,
    targetUserId: user._id,
    targetUserEmail: user.email,
    reason: req.body.reason || "No reason provided",
  });

  res.status(200).json({
    success: true,
    message: "User unverified successfully",
    data: {
      user,
    },
  });
});

// Activate a user
export const activateUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  user.isActive = true;
  user.lastModifiedBy = req.user._id;
  await user.save({ validateBeforeSave: false });

  LOG.info({
    message: "User activated by admin",
    adminId: req.user._id,
    targetUserId: user._id,
    targetUserEmail: user.email,
  });

  res.status(200).json({
    success: true,
    message: "User activated successfully",
    data: {
      user,
    },
  });
});

// Deactivate a user
export const deactivateUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  user.isActive = false;
  user.lastModifiedBy = req.user._id;
  await user.save({ validateBeforeSave: false });

  LOG.warn({
    message: "User deactivated by admin",
    adminId: req.user._id,
    targetUserId: user._id,
    targetUserEmail: user.email,
    reason: req.body.reason || "No reason provided",
  });

  res.status(200).json({
    success: true,
    message: "User deactivated successfully",
    data: {
      user,
    },
  });
});

// Get users by role
export const getUsersByRole = catchAsync(async (req, res, next) => {
  const { role } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const validRoles = User.getUserRoles();
  if (!validRoles.includes(role)) {
    return next(new AppError("Invalid role specified", 400));
  }

  const filter = { role };
  if (req.query.isVerified !== undefined)
    filter.isVerified = req.query.isVerified === "true";
  if (req.query.isActive !== undefined)
    filter.isActive = req.query.isActive === "true";

  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

// Get pending verifications
export const getPendingVerifications = catchAsync(async (req, res, next) => {
  const pendingUsers = await User.find({
    isVerified: false,
    isActive: true,
    role: {
      $in: ["service_center", "repair_center", "insurance_agent", "police"],
    },
  }).sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    data: {
      pendingUsers,
      count: pendingUsers.length,
    },
  });
});

// Get user statistics
export const getUserStats = catchAsync(async (req, res, next) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const stats = {
    users: {
      total: await User.countDocuments(),
      active: await User.countDocuments({ isActive: true }),
      verified: await User.countDocuments({ isVerified: true }),
      registeredToday: await User.countDocuments({
        createdAt: { $gte: startOfDay },
      }),
      registeredThisWeek: await User.countDocuments({
        createdAt: { $gte: startOfWeek },
      }),
      registeredThisMonth: await User.countDocuments({
        createdAt: { $gte: startOfMonth },
      }),
    },
    roleDistribution: await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
          verified: { $sum: { $cond: ["$isVerified", 1, 0] } },
          active: { $sum: { $cond: ["$isActive", 1, 0] } },
        },
      },
    ]),
    pendingActions: {
      pendingVerifications: await User.countDocuments({
        isVerified: false,
        isActive: true,
        role: {
          $in: ["service_center", "repair_center", "insurance_agent", "police"],
        },
      }),
      inactiveUsers: await User.countDocuments({ isActive: false }),
    },
    system: {
      serverUptime: process.uptime(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date(),
    },
  };

  res.status(200).json({
    success: true,
    data: stats,
  });
});

// Export users data
export const exportUsers = catchAsync(async (req, res, next) => {
  const filter = {};

  if (req.query.role) filter.role = req.query.role;
  if (req.query.isVerified !== undefined)
    filter.isVerified = req.query.isVerified === "true";
  if (req.query.isActive !== undefined)
    filter.isActive = req.query.isActive === "true";

  const users = await User.find(filter)
    .select("-password -__v")
    .sort({ createdAt: -1 });

  LOG.info({
    message: "User data exported by admin",
    adminId: req.user._id,
    exportCount: users.length,
    filters: filter,
  });

  res.status(200).json({
    success: true,
    data: {
      users,
      exportDate: new Date(),
      totalRecords: users.length,
    },
  });
});

// Bulk verify users
export const bulkVerifyUsers = catchAsync(async (req, res, next) => {
  const { userIds, verified = true } = req.body;

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return next(new AppError("Please provide an array of user IDs", 400));
  }

  const result = await User.updateMany(
    { _id: { $in: userIds } },
    {
      isVerified: verified,
      emailVerified: verified,
      lastModifiedBy: req.user._id,
    }
  );

  LOG.info({
    message: "Bulk user verification completed",
    adminId: req.user._id,
    userIds,
    verified,
    modifiedCount: result.modifiedCount,
  });

  res.status(200).json({
    success: true,
    message: `${result.modifiedCount} users ${
      verified ? "verified" : "unverified"
    } successfully`,
    data: {
      modifiedCount: result.modifiedCount,
    },
  });
});

// Bulk delete users
export const bulkDeleteUsers = catchAsync(async (req, res, next) => {
  const { userIds, permanent = false } = req.body;

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return next(new AppError("Please provide an array of user IDs", 400));
  }

  // Prevent deleting admin users
  const adminUsers = await User.find({
    _id: { $in: userIds },
    role: "system_admin",
  });

  if (adminUsers.length > 0) {
    return next(
      new AppError("Cannot delete admin users in bulk operation", 403)
    );
  }

  let result;
  if (permanent) {
    result = await User.deleteMany({ _id: { $in: userIds } });
  } else {
    result = await User.updateMany(
      { _id: { $in: userIds } },
      {
        isActive: false,
        lastModifiedBy: req.user._id,
      }
    );
  }

  LOG.warn({
    message: `Bulk user ${permanent ? "deletion" : "deactivation"} completed`,
    adminId: req.user._id,
    userIds,
    permanent,
    modifiedCount: result.modifiedCount || result.deletedCount,
  });

  res.status(200).json({
    success: true,
    message: `${result.modifiedCount || result.deletedCount} users ${
      permanent ? "deleted" : "deactivated"
    } successfully`,
    data: {
      modifiedCount: result.modifiedCount || result.deletedCount,
    },
  });
});

// Get user activity log
export const getUserActivityLog = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // This would typically query an activity/audit log collection
  // For now, we'll return basic user information
  const activityLog = {
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isActive: user.isActive,
    },
    activities: [
      {
        action: "account_created",
        timestamp: user.createdAt,
        details: "User account created",
      },
      {
        action: "last_login",
        timestamp: user.lastLogin,
        details: "User last login",
      },
    ],
    pagination: {
      page,
      limit,
      total: 2,
      totalPages: 1,
    },
  };

  res.status(200).json({
    success: true,
    data: activityLog,
  });
});

// Get system statistics
export const getSystemStats = catchAsync(async (req, res, next) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const stats = {
    users: {
      total: await User.countDocuments(),
      active: await User.countDocuments({ isActive: true }),
      verified: await User.countDocuments({ isVerified: true }),
      registeredToday: await User.countDocuments({
        createdAt: { $gte: startOfDay },
      }),
      registeredThisWeek: await User.countDocuments({
        createdAt: { $gte: startOfWeek },
      }),
      registeredThisMonth: await User.countDocuments({
        createdAt: { $gte: startOfMonth },
      }),
    },
    roleDistribution: await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
          verified: { $sum: { $cond: ["$isVerified", 1, 0] } },
          active: { $sum: { $cond: ["$isActive", 1, 0] } },
        },
      },
    ]),
    pendingActions: {
      pendingVerifications: await User.countDocuments({
        isVerified: false,
        isActive: true,
        role: {
          $in: ["service_center", "repair_center", "insurance_agent", "police"],
        },
      }),
      inactiveUsers: await User.countDocuments({ isActive: false }),
    },
    system: {
      serverUptime: process.uptime(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date(),
    },
  };

  res.status(200).json({
    success: true,
    data: stats,
  });
});

// Manage user permissions
export const manageUserPermissions = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { permissions, role } = req.body;

  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Update user role if provided
  if (role && role !== user.role) {
    const validRoles = User.getUserRoles();
    if (!validRoles.includes(role)) {
      return next(new AppError("Invalid role provided", 400));
    }
    user.role = role;
  }

  // Update permissions (this would depend on your permission system)
  if (permissions) {
    user.permissions = permissions;
  }

  user.lastModifiedBy = req.user._id;
  await user.save();

  LOG.info({
    message: "User permissions updated",
    adminId: req.user._id,
    targetUserId: user._id,
    newRole: role,
    permissions,
  });

  res.status(200).json({
    success: true,
    message: "User permissions updated successfully",
    data: {
      user,
    },
  });
});
