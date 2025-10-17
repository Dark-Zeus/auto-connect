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

export const updateAddedVehicle = async (req, res) => {
  try {
    console.log("🔧 updateAddedVehicle hit for ID:", req.params.id);
    console.log("📋 Update data:", req.body);

    const { id } = req.params;
    const updateData = { ...req.body };

    // Remove fields that shouldn't be updated directly
    delete updateData.vehicleId;
    delete updateData.addedBy;
    delete updateData.vehicleOwner;
    delete updateData.createdBy;
    delete updateData._id;

    // Find the added vehicle and check ownership
    const addedVehicle = await AddedVehicle.findOne({
      _id: id,
      addedBy: req.user._id,
      isActive: true,
    });

    if (!addedVehicle) {
      return res.status(404).json({
        success: false,
        message:
          "Added vehicle not found or you don't have permission to update it",
      });
    }

    console.log("🔍 Found added vehicle:", {
      id: addedVehicle._id,
      currentStatus: addedVehicle.status,
      currentPriority: addedVehicle.priority,
    });

    // Validate scheduled date if provided
    if (updateData.scheduledDate) {
      const scheduledDateTime = new Date(updateData.scheduledDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (scheduledDateTime < today) {
        return res.status(400).json({
          success: false,
          message: "Scheduled date cannot be in the past",
        });
      }
    }

    // Update tracking information
    updateData.lastModifiedBy = req.user._id;
    updateData["tracking.lastUpdated"] = new Date();
    updateData["tracking.updatedBy"] = req.user._id;

    // If status is being changed, add status change tracking
    if (updateData.status && updateData.status !== addedVehicle.status) {
      updateData["tracking.statusChangedAt"] = new Date();
      updateData["tracking.statusChangedBy"] = req.user._id;

      // Add status change note to notes
      const statusChangeNote = `\n[${new Date().toISOString()}] Status changed from ${
        addedVehicle.status
      } to ${updateData.status} by ${req.user.firstName} ${req.user.lastName}`;
      updateData.notes = (addedVehicle.notes || "") + statusChangeNote;
    }

    console.log("💾 Updating with data:", updateData);

    // Update the record
    const updatedAddedVehicle = await AddedVehicle.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
        context: "query", // This ensures validators run properly
      }
    )
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
      });

    if (!updatedAddedVehicle) {
      return res.status(404).json({
        success: false,
        message: "Failed to update added vehicle",
      });
    }

    console.log("✅ Successfully updated added vehicle:", {
      id: updatedAddedVehicle._id,
      newStatus: updatedAddedVehicle.status,
      newPriority: updatedAddedVehicle.priority,
    });

    res.status(200).json({
      success: true,
      message: "Added vehicle updated successfully",
      data: {
        addedVehicle: updatedAddedVehicle,
      },
    });
  } catch (error) {
    console.error("❌ Error in updateAddedVehicle:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format provided",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update added vehicle",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
};


export const deleteAddedVehicle = async (req, res) => {
  try {
    console.log("🗑️ deleteAddedVehicle hit for ID:", req.params.id);

    const { id } = req.params;

    // Find the added vehicle and check ownership
    const addedVehicle = await AddedVehicle.findOne({
      _id: id,
      addedBy: req.user._id,
      isActive: true,
    }).populate("vehicleId", "registrationNumber");

    if (!addedVehicle) {
      return res.status(404).json({
        success: false,
        message:
          "Added vehicle not found or you don't have permission to delete it",
      });
    }

    console.log("🔍 Found added vehicle to delete:", {
      id: addedVehicle._id,
      registration: addedVehicle.vehicleId?.registrationNumber,
      status: addedVehicle.status,
    });

    // Perform soft delete by setting isActive to false
    addedVehicle.isActive = false;
    addedVehicle.lastModifiedBy = req.user._id;
    addedVehicle.tracking.lastUpdated = new Date();
    addedVehicle.tracking.updatedBy = req.user._id;
    addedVehicle.tracking.deletedAt = new Date();
    addedVehicle.tracking.deletedBy = req.user._id;

    // Add deletion note
    const deletionNote = `\n[${new Date().toISOString()}] Vehicle request deleted by ${
      req.user.firstName
    } ${req.user.lastName}`;
    addedVehicle.notes = (addedVehicle.notes || "") + deletionNote;

    await addedVehicle.save();

    console.log(
      "✅ Successfully soft deleted added vehicle:",
      addedVehicle._id
    );

    res.status(200).json({
      success: true,
      message: `Vehicle request for ${
        addedVehicle.vehicleId?.registrationNumber || "vehicle"
      } removed successfully`,
      data: {
        deletedVehicle: {
          _id: addedVehicle._id,
          isActive: addedVehicle.isActive,
          deletedAt: addedVehicle.tracking.deletedAt,
        },
      },
    });
  } catch (error) {
    console.error("❌ Error in deleteAddedVehicle:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format provided",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete added vehicle",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
};

export const markVehicleCompleted = async (req, res) => {
  try {
    console.log("✅ markVehicleCompleted hit for ID:", req.params.id);
    console.log("📋 Completion data:", req.body);

    const { id } = req.params;
    const { notes: completionNotes, serviceDetails } = req.body;

    // Find the added vehicle and check ownership
    const addedVehicle = await AddedVehicle.findOne({
      _id: id,
      addedBy: req.user._id,
      isActive: true,
    }).populate("vehicleId", "registrationNumber make model");

    if (!addedVehicle) {
      return res.status(404).json({
        success: false,
        message:
          "Added vehicle not found or you don't have permission to complete it",
      });
    }

    console.log("🔍 Found added vehicle to complete:", {
      id: addedVehicle._id,
      registration: addedVehicle.vehicleId?.registrationNumber,
      currentStatus: addedVehicle.status,
    });

    // Check if already completed
    if (addedVehicle.status === "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Vehicle request is already marked as completed",
      });
    }

    // Update status to completed
    addedVehicle.status = "COMPLETED";
    addedVehicle.tracking.completedAt = new Date();
    addedVehicle.tracking.completedBy = req.user._id;
    addedVehicle.tracking.lastUpdated = new Date();
    addedVehicle.tracking.updatedBy = req.user._id;
    addedVehicle.lastModifiedBy = req.user._id;

    // Update service details if provided
    if (serviceDetails) {
      if (serviceDetails.actualCost !== undefined) {
        addedVehicle.serviceDetails.actualCost = serviceDetails.actualCost;
      }
      if (serviceDetails.actualDuration) {
        addedVehicle.serviceDetails.actualDuration =
          serviceDetails.actualDuration;
      }
      if (serviceDetails.serviceCenter) {
        addedVehicle.serviceDetails.actualServiceCenter =
          serviceDetails.serviceCenter;
      }
      if (serviceDetails.warranty) {
        addedVehicle.serviceDetails.warranty = serviceDetails.warranty;
      }
    }

    // Add completion notes
    const completionNote = `\n[${new Date().toISOString()}] Service completed by ${
      req.user.firstName
    } ${req.user.lastName}`;
    const fullCompletionNote = completionNotes
      ? `${completionNote}\nCompletion Notes: ${completionNotes}`
      : completionNote;

    addedVehicle.notes = (addedVehicle.notes || "") + fullCompletionNote;

    await addedVehicle.save();

    // Populate the response
    await addedVehicle.populate([
      {
        path: "vehicleId",
        select: "registrationNumber make model yearOfManufacture color",
      },
      {
        path: "addedBy",
        select: "firstName lastName email",
      },
      {
        path: "tracking.completedBy",
        select: "firstName lastName",
      },
    ]);

    console.log("✅ Successfully marked vehicle as completed:", {
      id: addedVehicle._id,
      registration: addedVehicle.vehicleId?.registrationNumber,
      completedAt: addedVehicle.tracking.completedAt,
    });

    res.status(200).json({
      success: true,
      message: `Service request for ${
        addedVehicle.vehicleId?.registrationNumber || "vehicle"
      } marked as completed successfully`,
      data: {
        addedVehicle: {
          _id: addedVehicle._id,
          status: addedVehicle.status,
          vehicleId: addedVehicle.vehicleId,
          purpose: addedVehicle.purpose,
          priority: addedVehicle.priority,
          scheduledDate: addedVehicle.scheduledDate,
          contactInfo: addedVehicle.contactInfo,
          location: addedVehicle.location,
          notes: addedVehicle.notes,
          serviceDetails: addedVehicle.serviceDetails,
          tracking: addedVehicle.tracking,
          addedBy: addedVehicle.addedBy,
          createdAt: addedVehicle.createdAt,
          updatedAt: addedVehicle.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error("❌ Error in markVehicleCompleted:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format provided",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to mark vehicle as completed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
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
