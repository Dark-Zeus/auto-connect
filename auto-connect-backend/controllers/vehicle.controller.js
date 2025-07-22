// controllers/vehicle.controller.js
import Vehicle from "../models/Vehicle.model.js";
import User from "../models/user.model.js";
import { catchAsync } from "../utils/catchAsync.util.js";
import { AppError } from "../utils/appError.util.js";
import LOG from "../configs/log.config.js";

// Create a new vehicle registration
export const createVehicle = catchAsync(async (req, res, next) => {
  console.log("🚗 === CREATE VEHICLE START ===");
  console.log("📦 Request body:", JSON.stringify(req.body, null, 2));
  console.log("👤 User info:", {
    id: req.user._id,
    role: req.user.role,
    nicNumber: req.user.nicNumber,
  });

  // 1) Verify user is a vehicle owner
  if (req.user.role !== "vehicle_owner") {
    console.log("❌ Unauthorized: User is not a vehicle owner");
    return next(new AppError("Only vehicle owners can register vehicles", 403));
  }

  // 2) Check if user has NIC number
  if (!req.user.nicNumber) {
    console.log("❌ User missing NIC number");
    return next(
      new AppError("Vehicle owners must have a valid NIC number", 400)
    );
  }

  // 3) Check for duplicate registration number
  const existingVehicle = await Vehicle.findOne({
    registrationNumber: req.body.registrationNumber.toUpperCase(),
  });

  if (existingVehicle) {
    console.log(
      "❌ Duplicate registration number:",
      req.body.registrationNumber
    );
    LOG.warn({
      message: "Duplicate vehicle registration attempt",
      registrationNumber: req.body.registrationNumber,
      userId: req.user._id,
      existingVehicleId: existingVehicle._id,
    });
    return next(
      new AppError(
        "A vehicle with this registration number already exists",
        400
      )
    );
  }

  // 4) Check for duplicate chassis number
  const existingChassis = await Vehicle.findOne({
    chassisNumber: req.body.chassisNumber.toUpperCase(),
  });

  if (existingChassis) {
    console.log("❌ Duplicate chassis number:", req.body.chassisNumber);
    return next(
      new AppError("A vehicle with this chassis number already exists", 400)
    );
  }

  // 5) Validate owner NIC matches logged-in user (additional security)
  if (req.body.currentOwner && req.body.currentOwner.idNumber) {
    const ownerNIC = req.body.currentOwner.idNumber.toUpperCase();
    if (ownerNIC !== req.user.nicNumber) {
      console.log("❌ Owner NIC mismatch:", {
        providedNIC: ownerNIC,
        userNIC: req.user.nicNumber,
      });
      return next(
        new AppError("Current owner NIC must match your registered NIC", 400)
      );
    }
  }

  // 6) Prepare vehicle data
  const vehicleData = {
    ...req.body,
    ownerId: req.user._id,
    ownerNIC: req.user.nicNumber,
    createdBy: req.user._id,
    registrationNumber: req.body.registrationNumber.toUpperCase(),
    chassisNumber: req.body.chassisNumber.toUpperCase(),
    engineNumber: req.body.engineNumber.toUpperCase(),
    make: req.body.make?.toUpperCase(),
    model: req.body.model?.toUpperCase(),
    color: req.body.color?.toUpperCase(),
  };

  // 7) Handle absolute owner logic
  if (vehicleData.absoluteOwner?.relationshipToCurrentOwner === "same") {
    vehicleData.absoluteOwner = {
      ...vehicleData.currentOwner,
      relationshipToCurrentOwner: "same",
    };
  }

  console.log("🚀 Creating vehicle with data:", {
    ...vehicleData,
    ownerId: vehicleData.ownerId,
    ownerNIC: vehicleData.ownerNIC,
    registrationNumber: vehicleData.registrationNumber,
  });

  try {
    // 8) Create the vehicle
    const newVehicle = await Vehicle.create(vehicleData);

    console.log("✅ Vehicle created successfully:", {
      id: newVehicle._id,
      registrationNumber: newVehicle.registrationNumber,
      owner: newVehicle.ownerNIC,
    });

    // 9) Log successful creation
    LOG.info({
      message: "New vehicle registered",
      vehicleId: newVehicle._id,
      registrationNumber: newVehicle.registrationNumber,
      chassisNumber: newVehicle.chassisNumber,
      ownerId: req.user._id,
      ownerNIC: req.user.nicNumber,
      make: newVehicle.make,
      model: newVehicle.model,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });

    // 10) Return response
    res.status(201).json({
      success: true,
      message: "Vehicle registered successfully!",
      data: {
        vehicle: newVehicle,
      },
    });

    console.log("🚗 === CREATE VEHICLE END ===");
  } catch (error) {
    console.log("💥 Vehicle creation error:", error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];

      LOG.error({
        message: "Duplicate key error in vehicle registration",
        field,
        value,
        userId: req.user._id,
        error: error.message,
      });

      let message = "This vehicle information already exists";
      if (field === "registrationNumber") {
        message = "A vehicle with this registration number already exists";
      } else if (field === "chassisNumber") {
        message = "A vehicle with this chassis number already exists";
      }

      return next(new AppError(message, 400));
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((val) => val.message);
      const message = `Invalid vehicle data: ${errors.join(", ")}`;

      LOG.error({
        message: "Vehicle validation error",
        errors,
        userId: req.user._id,
        vehicleData: vehicleData,
      });

      return next(new AppError(message, 400));
    }

    console.log("🚗 === CREATE VEHICLE END (ERROR) ===");
    return next(
      new AppError("Failed to register vehicle. Please try again.", 500)
    );
  }
});

// Get all vehicles for the logged-in vehicle owner
export const getMyVehicles = catchAsync(async (req, res, next) => {
  console.log("🚗 === GET MY VEHICLES START ===");
  console.log("👤 User info:", {
    id: req.user._id,
    role: req.user.role,
    nicNumber: req.user.nicNumber,
  });

  // 1) Verify user is a vehicle owner
  if (req.user.role !== "vehicle_owner") {
    return next(new AppError("Only vehicle owners can view vehicles", 403));
  }

  // 2) Extract query parameters
  const {
    page = 1,
    limit = 10,
    search = "",
    verificationStatus,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  // 3) Build filter
  const filter = {
    ownerId: req.user._id,
    ownerNIC: req.user.nicNumber,
    isActive: true,
  };

  // Add search functionality
  if (search) {
    filter.$or = [
      { registrationNumber: { $regex: search, $options: "i" } },
      { make: { $regex: search, $options: "i" } },
      { model: { $regex: search, $options: "i" } },
      { chassisNumber: { $regex: search, $options: "i" } },
      { engineNumber: { $regex: search, $options: "i" } },
    ];
  }

  // Add verification status filter
  if (verificationStatus) {
    filter.verificationStatus = verificationStatus;
  }

  console.log("🔍 Vehicle filter:", filter);

  try {
    // 4) Get vehicles with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const [vehicles, totalCount] = await Promise.all([
      Vehicle.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .select("-__v")
        .lean(),
      Vehicle.countDocuments(filter),
    ]);

    console.log("✅ Found vehicles:", {
      count: vehicles.length,
      total: totalCount,
      owner: req.user.nicNumber,
    });

    // 5) Calculate pagination info
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    // 6) Return response
    res.status(200).json({
      success: true,
      message: `Found ${vehicles.length} vehicle(s)`,
      data: {
        vehicles,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit),
        },
        summary: {
          totalVehicles: totalCount,
          verified: vehicles.filter((v) => v.verificationStatus === "VERIFIED")
            .length,
          pending: vehicles.filter((v) => v.verificationStatus === "PENDING")
            .length,
          rejected: vehicles.filter((v) => v.verificationStatus === "REJECTED")
            .length,
        },
      },
    });

    LOG.info({
      message: "Vehicle list retrieved",
      userId: req.user._id,
      ownerNIC: req.user.nicNumber,
      vehicleCount: vehicles.length,
      totalCount,
      page: parseInt(page),
    });

    console.log("🚗 === GET MY VEHICLES END ===");
  } catch (error) {
    console.log("💥 Get vehicles error:", error);
    LOG.error({
      message: "Failed to retrieve vehicles",
      userId: req.user._id,
      error: error.message,
    });

    return next(
      new AppError("Failed to retrieve vehicles. Please try again.", 500)
    );
  }
});

// Get a specific vehicle by ID (owner only)
export const getMyVehicle = catchAsync(async (req, res, next) => {
  console.log("🚗 === GET MY VEHICLE START ===");
  console.log("📝 Vehicle ID:", req.params.id);
  console.log("👤 User info:", {
    id: req.user._id,
    role: req.user.role,
    nicNumber: req.user.nicNumber,
  });

  // 1) Verify user is a vehicle owner
  if (req.user.role !== "vehicle_owner") {
    return next(
      new AppError("Only vehicle owners can view vehicle details", 403)
    );
  }

  try {
    // 2) Find the vehicle
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      ownerId: req.user._id,
      ownerNIC: req.user.nicNumber,
      isActive: true,
    }).select("-__v");

    if (!vehicle) {
      console.log("❌ Vehicle not found or not owned by user");
      return next(new AppError("Vehicle not found", 404));
    }

    console.log("✅ Vehicle found:", {
      id: vehicle._id,
      registrationNumber: vehicle.registrationNumber,
      verificationStatus: vehicle.verificationStatus,
    });

    // 3) Return response
    res.status(200).json({
      success: true,
      message: "Vehicle details retrieved successfully",
      data: {
        vehicle,
      },
    });

    LOG.info({
      message: "Vehicle details retrieved",
      vehicleId: vehicle._id,
      registrationNumber: vehicle.registrationNumber,
      userId: req.user._id,
      ownerNIC: req.user.nicNumber,
    });

    console.log("🚗 === GET MY VEHICLE END ===");
  } catch (error) {
    console.log("💥 Get vehicle error:", error);
    LOG.error({
      message: "Failed to retrieve vehicle details",
      vehicleId: req.params.id,
      userId: req.user._id,
      error: error.message,
    });

    return next(new AppError("Failed to retrieve vehicle details", 500));
  }
});

// Update a vehicle (owner only)
export const updateMyVehicle = catchAsync(async (req, res, next) => {
  console.log("🚗 === UPDATE MY VEHICLE START ===");
  console.log("📝 Vehicle ID:", req.params.id);
  console.log("📦 Update data:", JSON.stringify(req.body, null, 2));
  console.log("👤 User info:", {
    id: req.user._id,
    role: req.user.role,
    nicNumber: req.user.nicNumber,
  });

  // 1) Verify user is a vehicle owner
  if (req.user.role !== "vehicle_owner") {
    return next(new AppError("Only vehicle owners can update vehicles", 403));
  }

  try {
    // 2) Find the vehicle first
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      ownerId: req.user._id,
      ownerNIC: req.user.nicNumber,
      isActive: true,
    });

    if (!vehicle) {
      console.log("❌ Vehicle not found or not owned by user");
      return next(new AppError("Vehicle not found", 404));
    }

    // 3) Check if vehicle is verified (some restrictions may apply)
    if (vehicle.verificationStatus === "VERIFIED") {
      // Restrict certain fields from being updated after verification
      const restrictedFields = [
        "registrationNumber",
        "chassisNumber",
        "engineNumber",
        "currentOwner.idNumber",
      ];

      const hasRestrictedUpdates = restrictedFields.some((field) => {
        const fieldParts = field.split(".");
        let checkValue = req.body;
        for (const part of fieldParts) {
          if (checkValue && checkValue[part] !== undefined) {
            return true;
          }
          checkValue = checkValue?.[part];
        }
        return false;
      });

      if (hasRestrictedUpdates) {
        console.log(
          "❌ Attempting to update restricted fields on verified vehicle"
        );
        return next(
          new AppError(
            "Cannot update registration number, chassis number, engine number, or owner ID on verified vehicles",
            400
          )
        );
      }
    }

    // 4) Check for duplicate registration number (if being updated)
    if (
      req.body.registrationNumber &&
      req.body.registrationNumber.toUpperCase() !== vehicle.registrationNumber
    ) {
      const existingVehicle = await Vehicle.findOne({
        registrationNumber: req.body.registrationNumber.toUpperCase(),
        _id: { $ne: vehicle._id },
      });

      if (existingVehicle) {
        console.log("❌ Duplicate registration number in update");
        return next(
          new AppError(
            "A vehicle with this registration number already exists",
            400
          )
        );
      }
    }

    // 5) Check for duplicate chassis number (if being updated)
    if (
      req.body.chassisNumber &&
      req.body.chassisNumber.toUpperCase() !== vehicle.chassisNumber
    ) {
      const existingChassis = await Vehicle.findOne({
        chassisNumber: req.body.chassisNumber.toUpperCase(),
        _id: { $ne: vehicle._id },
      });

      if (existingChassis) {
        console.log("❌ Duplicate chassis number in update");
        return next(
          new AppError("A vehicle with this chassis number already exists", 400)
        );
      }
    }

    // 6) Prepare update data
    const updateData = { ...req.body };
    updateData.lastModifiedBy = req.user._id;

    // Convert certain fields to uppercase
    if (updateData.registrationNumber) {
      updateData.registrationNumber =
        updateData.registrationNumber.toUpperCase();
    }
    if (updateData.chassisNumber) {
      updateData.chassisNumber = updateData.chassisNumber.toUpperCase();
    }
    if (updateData.engineNumber) {
      updateData.engineNumber = updateData.engineNumber.toUpperCase();
    }
    if (updateData.make) {
      updateData.make = updateData.make.toUpperCase();
    }
    if (updateData.model) {
      updateData.model = updateData.model.toUpperCase();
    }
    if (updateData.color) {
      updateData.color = updateData.color.toUpperCase();
    }

    // 7) Handle absolute owner logic
    if (updateData.absoluteOwner?.relationshipToCurrentOwner === "same") {
      updateData.absoluteOwner = {
        ...updateData.currentOwner,
        relationshipToCurrentOwner: "same",
      };
    }

    console.log("🔄 Updating vehicle with data:", updateData);

    // 8) Update the vehicle
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-__v");

    console.log("✅ Vehicle updated successfully:", {
      id: updatedVehicle._id,
      registrationNumber: updatedVehicle.registrationNumber,
    });

    // 9) Log successful update
    LOG.info({
      message: "Vehicle updated",
      vehicleId: updatedVehicle._id,
      registrationNumber: updatedVehicle.registrationNumber,
      userId: req.user._id,
      ownerNIC: req.user.nicNumber,
      updatedFields: Object.keys(req.body),
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });

    // 10) Return response
    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully!",
      data: {
        vehicle: updatedVehicle,
      },
    });

    console.log("🚗 === UPDATE MY VEHICLE END ===");
  } catch (error) {
    console.log("💥 Vehicle update error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((val) => val.message);
      const message = `Invalid vehicle data: ${errors.join(", ")}`;

      LOG.error({
        message: "Vehicle update validation error",
        errors,
        vehicleId: req.params.id,
        userId: req.user._id,
      });

      return next(new AppError(message, 400));
    }

    LOG.error({
      message: "Failed to update vehicle",
      vehicleId: req.params.id,
      userId: req.user._id,
      error: error.message,
    });

    return next(
      new AppError("Failed to update vehicle. Please try again.", 500)
    );
  }
});

// Delete/Deactivate a vehicle (owner only)
export const deleteMyVehicle = catchAsync(async (req, res, next) => {
  console.log("🚗 === DELETE MY VEHICLE START ===");
  console.log("📝 Vehicle ID:", req.params.id);
  console.log("👤 User info:", {
    id: req.user._id,
    role: req.user.role,
    nicNumber: req.user.nicNumber,
  });

  // 1) Verify user is a vehicle owner
  if (req.user.role !== "vehicle_owner") {
    return next(new AppError("Only vehicle owners can delete vehicles", 403));
  }

  try {
    // 2) Find and soft delete the vehicle
    const vehicle = await Vehicle.findOneAndUpdate(
      {
        _id: req.params.id,
        ownerId: req.user._id,
        ownerNIC: req.user.nicNumber,
        isActive: true,
      },
      {
        isActive: false,
        lastModifiedBy: req.user._id,
      },
      { new: true }
    );

    if (!vehicle) {
      console.log("❌ Vehicle not found or not owned by user");
      return next(new AppError("Vehicle not found", 404));
    }

    console.log("✅ Vehicle deactivated successfully:", {
      id: vehicle._id,
      registrationNumber: vehicle.registrationNumber,
    });

    // 3) Log successful deletion
    LOG.info({
      message: "Vehicle deactivated",
      vehicleId: vehicle._id,
      registrationNumber: vehicle.registrationNumber,
      userId: req.user._id,
      ownerNIC: req.user.nicNumber,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });

    // 4) Return response
    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });

    console.log("🚗 === DELETE MY VEHICLE END ===");
  } catch (error) {
    console.log("💥 Vehicle deletion error:", error);
    LOG.error({
      message: "Failed to delete vehicle",
      vehicleId: req.params.id,
      userId: req.user._id,
      error: error.message,
    });

    return next(
      new AppError("Failed to delete vehicle. Please try again.", 500)
    );
  }
});

// Get vehicle statistics for the owner
export const getMyVehicleStats = catchAsync(async (req, res, next) => {
  console.log("🚗 === GET MY VEHICLE STATS START ===");
  console.log("👤 User info:", {
    id: req.user._id,
    role: req.user.role,
    nicNumber: req.user.nicNumber,
  });

  // 1) Verify user is a vehicle owner
  if (req.user.role !== "vehicle_owner") {
    return next(new AppError("Only vehicle owners can view statistics", 403));
  }

  try {
    // 2) Get statistics using aggregation
    const stats = await Vehicle.aggregate([
      {
        $match: {
          ownerId: req.user._id,
          ownerNIC: req.user.nicNumber,
          isActive: true,
        },
      },
      {
        $group: {
          _id: null,
          totalVehicles: { $sum: 1 },
          verifiedVehicles: {
            $sum: {
              $cond: [{ $eq: ["$verificationStatus", "VERIFIED"] }, 1, 0],
            },
          },
          pendingVehicles: {
            $sum: {
              $cond: [{ $eq: ["$verificationStatus", "PENDING"] }, 1, 0],
            },
          },
          rejectedVehicles: {
            $sum: {
              $cond: [{ $eq: ["$verificationStatus", "REJECTED"] }, 1, 0],
            },
          },
          incompleteVehicles: {
            $sum: {
              $cond: [{ $eq: ["$verificationStatus", "INCOMPLETE"] }, 1, 0],
            },
          },
          averageYear: { $avg: "$yearOfManufacture" },
          oldestYear: { $min: "$yearOfManufacture" },
          newestYear: { $max: "$yearOfManufacture" },
        },
      },
    ]);

    // 3) Get vehicle breakdown by make
    const makeBreakdown = await Vehicle.aggregate([
      {
        $match: {
          ownerId: req.user._id,
          ownerNIC: req.user.nicNumber,
          isActive: true,
        },
      },
      {
        $group: {
          _id: "$make",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // 4) Get vehicle breakdown by fuel type
    const fuelBreakdown = await Vehicle.aggregate([
      {
        $match: {
          ownerId: req.user._id,
          ownerNIC: req.user.nicNumber,
          isActive: true,
        },
      },
      {
        $group: {
          _id: "$fuelType",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // 5) Check insurance expiry warnings
    const insuranceWarnings = await Vehicle.find({
      ownerId: req.user._id,
      ownerNIC: req.user.nicNumber,
      isActive: true,
      "insuranceDetails.validTo": {
        $gte: new Date(),
        $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Next 30 days
      },
    }).select("registrationNumber make model insuranceDetails.validTo");

    // 6) Check revenue license expiry warnings
    const licenseWarnings = await Vehicle.find({
      ownerId: req.user._id,
      ownerNIC: req.user.nicNumber,
      isActive: true,
      "revenueLicense.validTo": {
        $gte: new Date(),
        $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Next 30 days
      },
    }).select("registrationNumber make model revenueLicense.validTo");

    const result = {
      overview: stats[0] || {
        totalVehicles: 0,
        verifiedVehicles: 0,
        pendingVehicles: 0,
        rejectedVehicles: 0,
        incompleteVehicles: 0,
        averageYear: null,
        oldestYear: null,
        newestYear: null,
      },
      breakdown: {
        byMake: makeBreakdown,
        byFuelType: fuelBreakdown,
      },
      warnings: {
        insuranceExpiring: insuranceWarnings,
        licenseExpiring: licenseWarnings,
      },
    };

    console.log("✅ Vehicle statistics calculated:", {
      totalVehicles: result.overview.totalVehicles,
      verified: result.overview.verifiedVehicles,
      pending: result.overview.pendingVehicles,
    });

    // 7) Return response
    res.status(200).json({
      success: true,
      message: "Vehicle statistics retrieved successfully",
      data: result,
    });

    LOG.info({
      message: "Vehicle statistics retrieved",
      userId: req.user._id,
      ownerNIC: req.user.nicNumber,
      totalVehicles: result.overview.totalVehicles,
    });

    console.log("🚗 === GET MY VEHICLE STATS END ===");
  } catch (error) {
    console.log("💥 Get vehicle stats error:", error);
    LOG.error({
      message: "Failed to retrieve vehicle statistics",
      userId: req.user._id,
      error: error.message,
    });

    return next(
      new AppError("Failed to retrieve statistics. Please try again.", 500)
    );
  }
});

// Search vehicles by registration number (for owner)
export const searchMyVehicles = catchAsync(async (req, res, next) => {
  console.log("🚗 === SEARCH MY VEHICLES START ===");
  console.log("🔍 Search query:", req.query.q);
  console.log("👤 User info:", {
    id: req.user._id,
    role: req.user.role,
    nicNumber: req.user.nicNumber,
  });

  // 1) Verify user is a vehicle owner
  if (req.user.role !== "vehicle_owner") {
    return next(new AppError("Only vehicle owners can search vehicles", 403));
  }

  const { q: searchQuery } = req.query;

  if (!searchQuery || searchQuery.trim().length < 2) {
    return next(
      new AppError("Search query must be at least 2 characters", 400)
    );
  }

  try {
    // 2) Search vehicles
    const vehicles = await Vehicle.find({
      ownerId: req.user._id,
      ownerNIC: req.user.nicNumber,
      isActive: true,
      $or: [
        { registrationNumber: { $regex: searchQuery.trim(), $options: "i" } },
        { make: { $regex: searchQuery.trim(), $options: "i" } },
        { model: { $regex: searchQuery.trim(), $options: "i" } },
        { chassisNumber: { $regex: searchQuery.trim(), $options: "i" } },
        { engineNumber: { $regex: searchQuery.trim(), $options: "i" } },
      ],
    })
      .select(
        "registrationNumber make model yearOfManufacture color verificationStatus createdAt"
      )
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    console.log("✅ Search completed:", {
      query: searchQuery,
      resultsCount: vehicles.length,
    });

    // 3) Return response
    res.status(200).json({
      success: true,
      message: `Found ${vehicles.length} vehicle(s) matching "${searchQuery}"`,
      data: {
        vehicles,
        searchQuery: searchQuery.trim(),
        resultCount: vehicles.length,
      },
    });

    LOG.info({
      message: "Vehicle search performed",
      userId: req.user._id,
      ownerNIC: req.user.nicNumber,
      searchQuery: searchQuery.trim(),
      resultCount: vehicles.length,
    });

    console.log("🚗 === SEARCH MY VEHICLES END ===");
  } catch (error) {
    console.log("💥 Vehicle search error:", error);
    LOG.error({
      message: "Failed to search vehicles",
      userId: req.user._id,
      searchQuery,
      error: error.message,
    });

    return next(
      new AppError("Failed to search vehicles. Please try again.", 500)
    );
  }
});

// Get vehicle by registration number (for quick lookup)
export const getVehicleByRegistration = catchAsync(async (req, res, next) => {
  console.log("🚗 === GET VEHICLE BY REGISTRATION START ===");
  console.log("📝 Registration number:", req.params.registrationNumber);
  console.log("👤 User info:", {
    id: req.user._id,
    role: req.user.role,
    nicNumber: req.user.nicNumber,
  });

  // 1) Verify user is a vehicle owner
  if (req.user.role !== "vehicle_owner") {
    return next(
      new AppError("Only vehicle owners can view vehicle details", 403)
    );
  }

  try {
    // 2) Find the vehicle by registration number
    const vehicle = await Vehicle.findOne({
      registrationNumber: req.params.registrationNumber.toUpperCase(),
      ownerId: req.user._id,
      ownerNIC: req.user.nicNumber,
      isActive: true,
    }).select("-__v");

    if (!vehicle) {
      console.log("❌ Vehicle not found with registration number");
      return next(
        new AppError("No vehicle found with this registration number", 404)
      );
    }

    console.log("✅ Vehicle found by registration:", {
      id: vehicle._id,
      registrationNumber: vehicle.registrationNumber,
      verificationStatus: vehicle.verificationStatus,
    });

    // 3) Return response
    res.status(200).json({
      success: true,
      message: "Vehicle found successfully",
      data: {
        vehicle,
      },
    });

    LOG.info({
      message: "Vehicle retrieved by registration number",
      vehicleId: vehicle._id,
      registrationNumber: vehicle.registrationNumber,
      userId: req.user._id,
      ownerNIC: req.user.nicNumber,
    });

    console.log("🚗 === GET VEHICLE BY REGISTRATION END ===");
  } catch (error) {
    console.log("💥 Get vehicle by registration error:", error);
    LOG.error({
      message: "Failed to retrieve vehicle by registration number",
      registrationNumber: req.params.registrationNumber,
      userId: req.user._id,
      error: error.message,
    });

    return next(new AppError("Failed to retrieve vehicle details", 500));
  }
});

// Export vehicle data (for owner's records)
export const exportMyVehicles = catchAsync(async (req, res, next) => {
  console.log("🚗 === EXPORT MY VEHICLES START ===");
  console.log("👤 User info:", {
    id: req.user._id,
    role: req.user.role,
    nicNumber: req.user.nicNumber,
  });

  // 1) Verify user is a vehicle owner
  if (req.user.role !== "vehicle_owner") {
    return next(new AppError("Only vehicle owners can export vehicles", 403));
  }

  try {
    // 2) Get all user's vehicles
    const vehicles = await Vehicle.find({
      ownerId: req.user._id,
      ownerNIC: req.user.nicNumber,
      isActive: true,
    })
      .select(
        "registrationNumber chassisNumber engineNumber make model yearOfManufacture " +
          "color fuelType classOfVehicle verificationStatus dateOfRegistration " +
          "provincialCouncil mileage seatingCapacity createdAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    // 3) Prepare export data
    const exportData = vehicles.map((vehicle) => ({
      "Registration Number": vehicle.registrationNumber,
      "Chassis Number": vehicle.chassisNumber,
      "Engine Number": vehicle.engineNumber,
      Make: vehicle.make,
      Model: vehicle.model,
      Year: vehicle.yearOfManufacture,
      Color: vehicle.color,
      "Fuel Type": vehicle.fuelType,
      "Vehicle Class": vehicle.classOfVehicle,
      "Verification Status": vehicle.verificationStatus,
      "Registration Date": vehicle.dateOfRegistration
        ? new Date(vehicle.dateOfRegistration).toLocaleDateString()
        : "",
      "Provincial Council": vehicle.provincialCouncil,
      "Mileage (km)": vehicle.mileage || 0,
      "Seating Capacity": vehicle.seatingCapacity || "",
      "Added Date": new Date(vehicle.createdAt).toLocaleDateString(),
    }));

    console.log("✅ Vehicle export data prepared:", {
      vehicleCount: exportData.length,
      owner: req.user.nicNumber,
    });

    // 4) Return response
    res.status(200).json({
      success: true,
      message: `Exported ${exportData.length} vehicle(s)`,
      data: {
        vehicles: exportData,
        exportDate: new Date().toISOString(),
        ownerNIC: req.user.nicNumber,
        totalCount: exportData.length,
      },
    });

    LOG.info({
      message: "Vehicle data exported",
      userId: req.user._id,
      ownerNIC: req.user.nicNumber,
      vehicleCount: exportData.length,
    });

    console.log("🚗 === EXPORT MY VEHICLES END ===");
  } catch (error) {
    console.log("💥 Export vehicles error:", error);
    LOG.error({
      message: "Failed to export vehicle data",
      userId: req.user._id,
      error: error.message,
    });

    return next(
      new AppError("Failed to export vehicle data. Please try again.", 500)
    );
  }
});
