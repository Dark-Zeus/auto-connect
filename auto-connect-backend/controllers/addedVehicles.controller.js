// controllers/addedVehicles.controller.js - REAL IMPLEMENTATION
// Create this file to actually save data to MongoDB

import AddedVehicle from "../models/AddedVehicle.model.js";
import Vehicle from "../models/vehicle.model.js";
import User from "../models/user.model.js";

// @desc    Add a vehicle to the added_vehicles collection - REAL IMPLEMENTATION
// @route   POST /api/v1/added-vehicles
// @access  Private (Vehicle Owner)
export const addVehicle = async (req, res) => {
  try {
    console.log("🎯 === REAL addVehicle Controller Hit! ===");
    console.log("👤 User ID:", req.user?._id);
    console.log("👤 User Email:", req.user?.email);
    console.log("👤 User Role:", req.user?.role);
    console.log("📋 Request Body:", req.body);

    const {
      vehicleId,
      purpose = "SERVICE_BOOKING",
      priority = "MEDIUM",
      scheduledDate,
      contactInfo,
      location,
      notes,
      serviceDetails,
    } = req.body;

    // Validate required fields
    if (!vehicleId) {
      return res.status(400).json({
        success: false,
        message: "Vehicle ID is required",
      });
    }

    if (!scheduledDate) {
      return res.status(400).json({
        success: false,
        message: "Scheduled date is required",
      });
    }

    // Check if vehicle exists and get vehicle details
    console.log("🔍 Looking for vehicle with ID:", vehicleId);
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      console.error("❌ Vehicle not found:", vehicleId);
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    console.log("🚗 Found vehicle:", {
      id: vehicle._id,
      registration: vehicle.registrationNumber,
      ownerId: vehicle.ownerId,
      ownerNIC: vehicle.ownerNIC,
    });

    // Get vehicle owner information - try multiple approaches
    let vehicleOwner;
    let ownerNIC;

    // Method 1: Try to find by ownerId if it exists
    if (vehicle.ownerId) {
      console.log("🔍 Looking for owner by ownerId:", vehicle.ownerId);
      vehicleOwner = await User.findById(vehicle.ownerId);
    }

    // Method 2: Try to find by ownerNIC if ownerId failed or doesn't exist
    if (!vehicleOwner && vehicle.ownerNIC) {
      console.log("🔍 Looking for owner by ownerNIC:", vehicle.ownerNIC);
      vehicleOwner = await User.findOne({ nicNumber: vehicle.ownerNIC });
    }

    // Method 3: Use current user as vehicle owner (if they own the vehicle)
    if (!vehicleOwner && req.user.nicNumber === vehicle.ownerNIC) {
      console.log("🔍 Using current user as vehicle owner");
      vehicleOwner = req.user;
    }

    // Set ownerNIC
    ownerNIC =
      vehicle.ownerNIC || vehicleOwner?.nicNumber || req.user.nicNumber;

    if (!vehicleOwner) {
      console.error("❌ Vehicle owner not found. Available data:", {
        vehicleOwnerId: vehicle.ownerId,
        vehicleOwnerNIC: vehicle.ownerNIC,
        currentUserNIC: req.user.nicNumber,
      });

      // Create a fallback - use current user as owner
      vehicleOwner = req.user;
      ownerNIC = req.user.nicNumber;
    }

    console.log("👤 Found/Set vehicle owner:", {
      id: vehicleOwner._id,
      name: `${vehicleOwner.firstName} ${vehicleOwner.lastName}`,
      nic: vehicleOwner.nicNumber || ownerNIC,
    });

    // Check if vehicle is already added for the same purpose and not completed/cancelled
    const existingRequest = await AddedVehicle.findOne({
      vehicleId,
      addedBy: req.user._id,
      purpose,
      status: { $nin: ["CANCELLED", "COMPLETED"] },
      isActive: true,
    });

    if (existingRequest) {
      console.log("⚠️ Vehicle already added:", existingRequest._id);
      return res.status(409).json({
        success: false,
        message: `Vehicle ${vehicle.registrationNumber} is already added for ${purpose}. Current status: ${existingRequest.status}`,
      });
    }

    // Validate scheduled date (should not be in the past)
    const scheduledDateTime = new Date(scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (scheduledDateTime < today) {
      return res.status(400).json({
        success: false,
        message: "Scheduled date cannot be in the past",
      });
    }

    // Create new added vehicle request with PROPER field mapping
    const addedVehicleData = {
      vehicleId,
      addedBy: req.user._id,
      vehicleOwner: vehicleOwner._id,
      ownerNIC: ownerNIC,
      purpose,
      priority,
      scheduledDate: scheduledDateTime,
      notes:
        notes || `Added vehicle ${vehicle.registrationNumber} for ${purpose}`,
      status: "ACTIVE",
      createdBy: req.user._id,

      // Contact information with validation
      contactInfo: {
        phone: contactInfo?.phone || req.user.phone || "+94771234567",
        email: contactInfo?.email || req.user.email,
        preferredContactMethod: contactInfo?.preferredContactMethod || "PHONE",
      },

      // Location information
      location: {
        address: location?.address || "To be specified",
        city: location?.city || "Colombo",
        district: location?.district || "Colombo",
        coordinates: location?.coordinates || {
          latitude: null,
          longitude: null,
        },
      },

      // Service details with proper enum values
      serviceDetails: {
        serviceType: serviceDetails?.serviceType || "GENERAL_MAINTENANCE",
        urgency:
          serviceDetails?.urgency === true ||
          serviceDetails?.urgency === "true",
        estimatedDuration: serviceDetails?.estimatedDuration || "2-3 hours",
        estimatedCost: serviceDetails?.estimatedCost || 0,
      },

      // Tracking metadata
      tracking: {
        submittedAt: new Date(),
        lastUpdated: new Date(),
        updatedBy: req.user._id,
      },

      // Request metadata
      metadata: {
        source: "WEB_APP",
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get("User-Agent"),
        sessionId: req.sessionID,
      },

      isActive: true,
    };

    console.log("💾 Creating added vehicle record with data:", {
      vehicleId: addedVehicleData.vehicleId,
      addedBy: addedVehicleData.addedBy,
      vehicleOwner: addedVehicleData.vehicleOwner,
      ownerNIC: addedVehicleData.ownerNIC,
      purpose: addedVehicleData.purpose,
      status: addedVehicleData.status,
    });

    // 🔥 ACTUALLY CREATE THE DATABASE RECORD
    const addedVehicle = await AddedVehicle.create(addedVehicleData);
    console.log("✅ Database record created with ID:", addedVehicle._id);

    // Populate the response with vehicle and user details
    await addedVehicle.populate([
      {
        path: "vehicleId",
        select:
          "registrationNumber make model yearOfManufacture color fuelType verificationStatus classOfVehicle",
      },
      {
        path: "addedBy",
        select: "firstName lastName email nicNumber",
      },
      {
        path: "vehicleOwner",
        select: "firstName lastName email nicNumber",
      },
    ]);

    console.log("✅ Successfully created added vehicle:", {
      id: addedVehicle._id,
      vehicleRegistration: addedVehicle.vehicleId?.registrationNumber,
      status: addedVehicle.status,
      purpose: addedVehicle.purpose,
    });

    // Send success response with consistent format
    res.status(201).json({
      success: true,
      message: `Vehicle ${vehicle.registrationNumber} added to service requests successfully`,
      data: {
        addedVehicle: {
          _id: addedVehicle._id,
          vehicleId: addedVehicle.vehicleId,
          purpose: addedVehicle.purpose,
          priority: addedVehicle.priority,
          status: addedVehicle.status,
          scheduledDate: addedVehicle.scheduledDate,
          contactInfo: addedVehicle.contactInfo,
          location: addedVehicle.location,
          notes: addedVehicle.notes,
          serviceDetails: addedVehicle.serviceDetails,
          ownerNIC: addedVehicle.ownerNIC,
          addedBy: addedVehicle.addedBy,
          vehicleOwner: addedVehicle.vehicleOwner,
          createdAt: addedVehicle.createdAt,
          updatedAt: addedVehicle.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error("❌ Error in addVehicle controller:", error);
    console.error("❌ Error stack:", error.stack);

    // Handle specific error types
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      console.error("❌ Validation errors:", validationErrors);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
        details: error.errors,
      });
    }

    if (error.name === "CastError") {
      console.error("❌ Cast error:", error.message);
      return res.status(400).json({
        success: false,
        message: "Invalid ID format provided",
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: "Internal server error while adding vehicle to service requests",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
};

// @desc    Get all added vehicles for the authenticated user
// @route   GET /api/v1/added-vehicles
// @access  Private (Vehicle Owner)
export const getAddedVehicles = async (req, res) => {
  try {
    console.log("🎯 === getAddedVehicles Controller Hit! ===");
    console.log("👤 User ID:", req.user?._id);

    const {
      page = 1,
      limit = 12,
      status,
      purpose,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      ownerNIC,
    } = req.query;

    // Build query - filter by addedBy (user who added the vehicle)
    let query = {
      isActive: true,
      addedBy: req.user._id,
    };

    // Add filters
    if (status && status !== "all") {
      query.status = status.toUpperCase();
    }

    if (purpose && purpose !== "all") {
      query.purpose = purpose.toUpperCase();
    }

    if (ownerNIC) {
      query.ownerNIC = ownerNIC.toUpperCase();
    }

    // Search functionality
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { purpose: searchRegex },
        { status: searchRegex },
        { notes: searchRegex },
        { ownerNIC: searchRegex },
        { "location.address": searchRegex },
        { "location.city": searchRegex },
      ];
    }

    console.log("🔍 MongoDB Query:", JSON.stringify(query, null, 2));

    // Pagination
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query with population
    const [addedVehicles, totalCount] = await Promise.all([
      AddedVehicle.find(query)
        .populate({
          path: "vehicleId",
          select:
            "registrationNumber make model yearOfManufacture color fuelType verificationStatus",
        })
        .populate({
          path: "addedBy",
          select: "firstName lastName email",
        })
        .populate({
          path: "vehicleOwner",
          select: "firstName lastName email nicNumber",
        })
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize)
        .lean(),
      AddedVehicle.countDocuments(query),
    ]);

    console.log(
      "📊 Found",
      addedVehicles.length,
      "vehicles out of",
      totalCount,
      "total"
    );

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / pageSize);

    // Format the response
    const response = {
      success: true,
      message: "Added vehicles fetched successfully",
      data: {
        addedVehicles: addedVehicles.map((vehicle) => ({
          _id: vehicle._id,
          status: vehicle.status,
          purpose: vehicle.purpose,
          priority: vehicle.priority,
          notes: vehicle.notes,
          ownerNIC: vehicle.ownerNIC,
          scheduledDate: vehicle.scheduledDate,
          createdAt: vehicle.createdAt,
          updatedAt: vehicle.updatedAt,
          // Vehicle information
          vehicleId: vehicle.vehicleId
            ? {
                _id: vehicle.vehicleId._id,
                registrationNumber: vehicle.vehicleId.registrationNumber,
                make: vehicle.vehicleId.make,
                model: vehicle.vehicleId.model,
                yearOfManufacture: vehicle.vehicleId.yearOfManufacture,
                color: vehicle.vehicleId.color,
                fuelType: vehicle.vehicleId.fuelType,
                verificationStatus: vehicle.vehicleId.verificationStatus,
              }
            : null,
          // Contact information
          contactInfo: vehicle.contactInfo || {},
          // Location information
          location: vehicle.location || {},
          // Service details
          serviceDetails: vehicle.serviceDetails || {},
          // User information
          addedBy: vehicle.addedBy,
          vehicleOwner: vehicle.vehicleOwner,
        })),
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalCount,
          hasNextPage: pageNumber < totalPages,
          hasPrevPage: pageNumber > 1,
          limit: pageSize,
        },
      },
    };

    console.log(
      "✅ Sending response with",
      response.data.addedVehicles.length,
      "vehicles"
    );
    res.status(200).json(response);
  } catch (error) {
    console.error("❌ Error in getAddedVehicles:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch added vehicles",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
};

// @desc    Get added vehicle statistics
// @route   GET /api/v1/added-vehicles/stats
// @access  Private (Vehicle Owner)
export const getAddedVehicleStats = async (req, res) => {
  try {
    console.log("📊 === getAddedVehicleStats Controller Hit! ===");
    console.log("👤 User ID:", req.user?._id);

    const { ownerNIC } = req.query;

    // Build filter for the user's vehicles
    let filter = {
      isActive: true,
      addedBy: req.user._id,
    };

    if (ownerNIC) {
      filter.ownerNIC = ownerNIC.toUpperCase();
    }

    console.log("🔍 Stats filter:", filter);

    // Get statistics using aggregation
    const stats = await AddedVehicle.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: {
              $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0],
            },
          },
          active: {
            $sum: {
              $cond: [{ $eq: ["$status", "ACTIVE"] }, 1, 0],
            },
          },
          completed: {
            $sum: {
              $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0],
            },
          },
          cancelled: {
            $sum: {
              $cond: [{ $eq: ["$status", "CANCELLED"] }, 1, 0],
            },
          },
        },
      },
    ]);

    let statsData = {
      totalRequests: 0,
      pendingRequests: 0,
      scheduledRequests: 0,
      completedRequests: 0,
      cancelledRequests: 0,
    };

    if (stats.length > 0) {
      const result = stats[0];
      statsData = {
        totalRequests: result.total || 0,
        pendingRequests: result.pending || 0,
        scheduledRequests: result.active || 0, // Map ACTIVE to scheduledRequests
        completedRequests: result.completed || 0,
        cancelledRequests: result.cancelled || 0,
      };
    }

    console.log("📊 Calculated stats:", statsData);

    res.status(200).json({
      success: true,
      message: "Statistics fetched successfully",
      data: statsData,
    });
  } catch (error) {
    console.error("❌ Error in getAddedVehicleStats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
};

// Placeholder for other endpoints
export const getAddedVehicleById = (req, res) => {
  res.status(501).json({ success: false, message: "Not implemented yet" });
};

export const updateAddedVehicle = (req, res) => {
  res.status(501).json({ success: false, message: "Not implemented yet" });
};

export const deleteAddedVehicle = (req, res) => {
  res.status(501).json({ success: false, message: "Not implemented yet" });
};

export const markVehicleCompleted = (req, res) => {
  res.status(501).json({ success: false, message: "Not implemented yet" });
};

export const exportAddedVehicles = (req, res) => {
  res.status(501).json({ success: false, message: "Not implemented yet" });
};

export const updateVehicleStatus = (req, res) => {
  res.status(501).json({ success: false, message: "Not implemented yet" });
};

export const bulkUpdateStatus = (req, res) => {
  res.status(501).json({ success: false, message: "Not implemented yet" });
};

export const bulkDeleteVehicles = (req, res) => {
  res.status(501).json({ success: false, message: "Not implemented yet" });
};

export const getVehicleHistory = (req, res) => {
  res.status(501).json({ success: false, message: "Not implemented yet" });
};

export const getAddedVehiclesByOwnerNIC = (req, res) => {
  res.status(501).json({ success: false, message: "Not implemented yet" });
};
