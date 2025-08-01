// controllers/addedVehicles.controller.js - Real MongoDB Implementation
import AddedVehicle from "../models/AddedVehicle.model.js";
import Vehicle from "../models/vehicle.model.js";
import User from "../models/user.model.js";

// @desc    Get all added vehicles for the authenticated user
// @route   GET /api/v1/added-vehicles
// @access  Private (Vehicle Owner)
export const getAddedVehicles = async (req, res, next) => {
  try {
    console.log("🎯 === getAddedVehicles Controller Hit! ===");
    console.log("👤 User ID:", req.user?._id);
    console.log("👤 User Email:", req.user?.email);
    console.log("👤 User Role:", req.user?.role);
    console.log("📋 Query Parameters:", req.query);

    // Check authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Extract query parameters
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
      addedBy: req.user._id, // Only show vehicles added by the current user
    };

    // Add filters
    if (status && status !== "all") {
      query.status = status.toUpperCase();
    }

    if (purpose) {
      query.purpose = purpose;
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

    console.log(
      "📊 Pagination: page",
      pageNumber,
      "limit",
      pageSize,
      "skip",
      skip
    );
    console.log("🔄 Sort:", sortOptions);

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
        .lean(), // Use lean() for better performance
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
    console.error("❌ Error stack:", error.stack);

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
export const getAddedVehicleStats = async (req, res, next) => {
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
      scheduledRequests: 0, // Frontend expects this name
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

// @desc    Get single added vehicle by ID
// @route   GET /api/v1/added-vehicles/:id
// @access  Private (Vehicle Owner)
export const getAddedVehicleById = async (req, res, next) => {
  try {
    console.log("🔍 getAddedVehicleById hit for ID:", req.params.id);

    const addedVehicle = await AddedVehicle.findOne({
      _id: req.params.id,
      addedBy: req.user._id,
      isActive: true,
    })
      .populate("vehicleId")
      .populate("addedBy", "firstName lastName email")
      .populate("vehicleOwner", "firstName lastName email nicNumber");

    if (!addedVehicle) {
      return res.status(404).json({
        success: false,
        message: "Added vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Added vehicle fetched successfully",
      data: {
        addedVehicle,
      },
    });
  } catch (error) {
    console.error("❌ Error in getAddedVehicleById:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch added vehicle",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
};

// Placeholder functions for other endpoints (implement as needed)
// controllers/addedVehicles.controller.js - REPLACE the placeholder addVehicle function with this:

export const addVehicle = async (req, res, next) => {
  try {
    console.log('🎯 === addVehicle Controller Hit! ===');
    console.log('👤 User ID:', req.user?._id);
    console.log('👤 User Email:', req.user?.email);
    console.log('👤 User Role:', req.user?.role);
    console.log('📋 Request Body:', req.body);

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
        message: "Vehicle ID is required"
      });
    }

    if (!scheduledDate) {
      return res.status(400).json({
        success: false,
        message: "Scheduled date is required"
      });
    }

    // Check if vehicle exists and get vehicle details
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }

    console.log('🚗 Found vehicle:', {
      id: vehicle._id,
      registration: vehicle.registrationNumber,
      owner: vehicle.ownerNIC
    });

    // Get vehicle owner information
    const vehicleOwner = await User.findOne({ nicNumber: vehicle.ownerNIC });
    if (!vehicleOwner) {
      return res.status(404).json({
        success: false,
        message: "Vehicle owner not found"
      });
    }

    console.log('👤 Found vehicle owner:', {
      id: vehicleOwner._id,
      name: `${vehicleOwner.firstName} ${vehicleOwner.lastName}`,
      nic: vehicleOwner.nicNumber
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
      return res.status(409).json({
        success: false,
        message: `Vehicle ${vehicle.registrationNumber} is already added for ${purpose}. Current status: ${existingRequest.status}`
      });
    }

    // Validate scheduled date (should not be in the past)
    const scheduledDateTime = new Date(scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (scheduledDateTime < today) {
      return res.status(400).json({
        success: false,
        message: "Scheduled date cannot be in the past"
      });
    }

    // Create new added vehicle request
    const addedVehicleData = {
      vehicleId,
      addedBy: req.user._id,
      vehicleOwner: vehicleOwner._id,
      ownerNIC: vehicle.ownerNIC,
      purpose,
      priority,
      scheduledDate: scheduledDateTime,
      notes: notes || `Added vehicle ${vehicle.registrationNumber} for ${purpose}`,
      status: "PENDING",
      createdBy: req.user._id,
      
      // Contact information
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
        postalCode: location?.postalCode || "00100",
        coordinates: location?.coordinates || {
          latitude: null,
          longitude: null,
        },
      },
      
      // Service details
      serviceDetails: {
        requestType: serviceDetails?.requestType || "GENERAL_SERVICE",
        urgency: serviceDetails?.urgency || "NORMAL",
        serviceCategory: serviceDetails?.serviceCategory || "MAINTENANCE",
        preferredServiceCenter: serviceDetails?.preferredServiceCenter || null,
        estimatedDuration: serviceDetails?.estimatedDuration || null,
        specialRequirements: serviceDetails?.specialRequirements || [],
      },
      
      // Additional tracking metadata
      tracking: {
        createdAt: new Date(),
        createdBy: req.user._id,
        lastUpdated: new Date(),
        updatedBy: req.user._id,
        source: "VEHICLE_MANAGEMENT_PAGE",
      },
      
      // Request metadata
      metadata: {
        source: "WEB_APP",
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get("User-Agent"),
        addedFrom: "VEHICLE_MANAGEMENT",
        vehicleDetails: {
          registrationNumber: vehicle.registrationNumber,
          make: vehicle.make,
          model: vehicle.model,
          yearOfManufacture: vehicle.yearOfManufacture,
          color: vehicle.color,
          fuelType: vehicle.fuelType,
          classOfVehicle: vehicle.classOfVehicle,
        },
        userDetails: {
          userId: req.user._id,
          userNIC: req.user.nicNumber,
          userName: `${req.user.firstName} ${req.user.lastName}`,
          userEmail: req.user.email,
        },
      },
      
      isActive: true,
    };

    console.log('💾 Creating added vehicle record:', {
      vehicleId: addedVehicleData.vehicleId,
      addedBy: addedVehicleData.addedBy,
      purpose: addedVehicleData.purpose,
      status: addedVehicleData.status,
    });

    // Create the added vehicle record
    const addedVehicle = await AddedVehicle.create(addedVehicleData);

    // Populate the response with vehicle and user details
    await addedVehicle.populate([
      {
        path: 'vehicleId',
        select: 'registrationNumber make model yearOfManufacture color fuelType verificationStatus classOfVehicle'
      },
      {
        path: 'addedBy',
        select: 'firstName lastName email nicNumber'
      },
      {
        path: 'vehicleOwner',
        select: 'firstName lastName email nicNumber'
      }
    ]);

    console.log('✅ Successfully created added vehicle:', {
      id: addedVehicle._id,
      vehicleRegistration: addedVehicle.vehicleId?.registrationNumber,
      status: addedVehicle.status,
      purpose: addedVehicle.purpose,
    });

    // Send success response
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
        }
      },
    });

  } catch (error) {
    console.error('❌ Error in addVehicle controller:', error);
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format provided',
      });
    }
    
    // Generic error response
    res.status(500).json({
      success: false,
      message: 'Internal server error while adding vehicle to service requests',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

export const updateAddedVehicle = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "updateAddedVehicle endpoint not implemented yet",
  });
};

export const deleteAddedVehicle = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "deleteAddedVehicle endpoint not implemented yet",
  });
};

export const updateVehicleStatus = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "updateVehicleStatus endpoint not implemented yet",
  });
};

export const markVehicleCompleted = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "markVehicleCompleted endpoint not implemented yet",
  });
};

export const exportAddedVehicles = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "exportAddedVehicles endpoint not implemented yet",
  });
};

export const bulkUpdateStatus = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "bulkUpdateStatus endpoint not implemented yet",
  });
};

export const bulkDeleteVehicles = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "bulkDeleteVehicles endpoint not implemented yet",
  });
};

export const getVehicleHistory = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "getVehicleHistory endpoint not implemented yet",
  });
};

export const getAddedVehiclesByOwnerNIC = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "getAddedVehiclesByOwnerNIC endpoint not implemented yet",
  });
};
