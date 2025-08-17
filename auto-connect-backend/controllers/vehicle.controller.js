// controllers/vehicle.controller.js
import Vehicle from "../models/vehicle.model.js";
import { catchAsync } from "../utils/catchAsync.util.js";
import { AppError } from "../utils/appError.util.js";

// Get all vehicles with filtering by ownerNIC
export const getVehicles = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 12,
    search,
    verificationStatus,
    ownerNIC, // THIS IS THE KEY PARAMETER
    make,
    model,
    color,
    fuelType,
    classOfVehicle,
  } = req.query;

  // Build query object
  let query = {};

  // MOST IMPORTANT: Filter by owner NIC if provided
  if (ownerNIC) {
    query.ownerNIC = ownerNIC.toUpperCase();
    console.log("Filtering vehicles by ownerNIC:", ownerNIC); // Debug log
  }

  // Add search functionality
  if (search) {
    query.$or = [
      { registrationNumber: { $regex: search, $options: "i" } },
      { make: { $regex: search, $options: "i" } },
      { model: { $regex: search, $options: "i" } },
      { chassisNumber: { $regex: search, $options: "i" } },
    ];
  }

  // Add filters
  if (verificationStatus && verificationStatus.toUpperCase() !== "ALL") {
    query.verificationStatus = verificationStatus.toUpperCase();
  }

  if (make) query.make = { $regex: make, $options: "i" };
  if (model) query.model = { $regex: model, $options: "i" };
  if (color) query.color = color.toUpperCase();
  if (fuelType) query.fuelType = fuelType.toUpperCase();
  if (classOfVehicle) query.classOfVehicle = classOfVehicle.toUpperCase();

  // Only show active vehicles
  query.isActive = true;

  console.log("Vehicle query:", JSON.stringify(query, null, 2)); // Debug log

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query with pagination
  const [vehicles, totalCount] = await Promise.all([
    Vehicle.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("createdBy", "name email")
      .populate("verifiedBy", "name email"),
    Vehicle.countDocuments(query),
  ]);

  // Calculate summary statistics for the filtered results
  const summary = await Vehicle.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        totalVehicles: { $sum: 1 },
        verified: {
          $sum: { $cond: [{ $eq: ["$verificationStatus", "VERIFIED"] }, 1, 0] },
        },
        pending: {
          $sum: { $cond: [{ $eq: ["$verificationStatus", "PENDING"] }, 1, 0] },
        },
        rejected: {
          $sum: { $cond: [{ $eq: ["$verificationStatus", "REJECTED"] }, 1, 0] },
        },
        incomplete: {
          $sum: {
            $cond: [{ $eq: ["$verificationStatus", "INCOMPLETE"] }, 1, 0],
          },
        },
      },
    },
  ]);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / parseInt(limit));

  res.status(200).json({
    success: true,
    data: {
      vehicles,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
      summary: summary[0] || {
        totalVehicles: 0,
        verified: 0,
        pending: 0,
        rejected: 0,
        incomplete: 0,
      },
    },
  });
});

// Get vehicles by owner NIC - Alternative endpoint
export const getVehiclesByOwnerNIC = catchAsync(async (req, res, next) => {
  const { nicNumber } = req.params;
  const { page = 1, limit = 12 } = req.query;

  if (!nicNumber) {
    return next(new AppError("NIC number is required", 400));
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [vehicles, totalCount] = await Promise.all([
    Vehicle.find({
      ownerNIC: nicNumber.toUpperCase(),
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Vehicle.countDocuments({
      ownerNIC: nicNumber.toUpperCase(),
      isActive: true,
    }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      vehicles,
      totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
    },
  });
});

// Get vehicle statistics with optional NIC filtering
export const getVehicleStats = catchAsync(async (req, res, next) => {
  const { ownerNIC } = req.query;

  let matchQuery = { isActive: true };
  if (ownerNIC) {
    matchQuery.ownerNIC = ownerNIC.toUpperCase();
  }

  // Get overview statistics
  const overview = await Vehicle.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        totalVehicles: { $sum: 1 },
        verifiedVehicles: {
          $sum: { $cond: [{ $eq: ["$verificationStatus", "VERIFIED"] }, 1, 0] },
        },
        pendingVehicles: {
          $sum: { $cond: [{ $eq: ["$verificationStatus", "PENDING"] }, 1, 0] },
        },
        rejectedVehicles: {
          $sum: { $cond: [{ $eq: ["$verificationStatus", "REJECTED"] }, 1, 0] },
        },
      },
    },
  ]);

  // Get expiring documents
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const warnings = {
    insuranceExpiring: await Vehicle.find({
      ...matchQuery,
      "insuranceDetails.validTo": {
        $gte: new Date(),
        $lte: thirtyDaysFromNow,
      },
    }).limit(10),
    licenseExpiring: await Vehicle.find({
      ...matchQuery,
      "revenueLicense.validTo": {
        $gte: new Date(),
        $lte: thirtyDaysFromNow,
      },
    }).limit(10),
  };

  res.status(200).json({
    success: true,
    data: {
      overview: overview[0] || {
        totalVehicles: 0,
        verifiedVehicles: 0,
        pendingVehicles: 0,
        rejectedVehicles: 0,
      },
      warnings,
    },
  });
});

// Create vehicle
export const createVehicle = catchAsync(async (req, res, next) => {
  // Add the current user as the creator
  req.body.createdBy = req.user._id;
  req.body.ownerId = req.user._id;
  req.body.ownerNIC = req.user.nicNumber || req.body.ownerNIC;

  // Handle file uploads if present
  if (req.files) {
    if (req.files.documents) {
      req.body.documents = req.files.documents.map((file) => ({
        type: "OTHER", // You can enhance this based on filename or user input
        fileName: file.originalname,
        fileUrl: `/uploads/documents/${file.filename}`,
      }));
    }

    if (req.files.images) {
      req.body.images = req.files.images.map((file) => ({
        type: "OTHER", // You can enhance this based on filename or user input
        imageUrl: `/uploads/images/${file.filename}`,
      }));
    }
  }

  const vehicle = await Vehicle.create(req.body);

  res.status(201).json({
    success: true,
    message: "Vehicle registered successfully",
    data: { vehicle },
  });
});

// Get single vehicle
export const getVehicle = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id)
    .populate("createdBy", "name email")
    .populate("verifiedBy", "name email");

  if (!vehicle) {
    return next(new AppError("Vehicle not found", 404));
  }

  res.status(200).json({
    success: true,
    data: { vehicle },
  });
});

// Update vehicle
export const updateVehicle = catchAsync(async (req, res, next) => {
  req.body.lastModifiedBy = req.user._id;

  // Handle file uploads if present
  if (req.files) {
    if (req.files.documents) {
      const newDocuments = req.files.documents.map((file) => ({
        type: "OTHER",
        fileName: file.originalname,
        fileUrl: `/uploads/documents/${file.filename}`,
      }));
      req.body.$push = { documents: { $each: newDocuments } };
    }

    if (req.files.images) {
      const newImages = req.files.images.map((file) => ({
        type: "OTHER",
        imageUrl: `/uploads/images/${file.filename}`,
      }));
      req.body.$push = { ...req.body.$push, images: { $each: newImages } };
    }
  }

  const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!vehicle) {
    return next(new AppError("Vehicle not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Vehicle updated successfully",
    data: { vehicle },
  });
});

// Delete vehicle (soft delete)
export const deleteVehicle = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    {
      isActive: false,
      lastModifiedBy: req.user._id,
    },
    { new: true }
  );

  if (!vehicle) {
    return next(new AppError("Vehicle not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Vehicle deleted successfully",
  });
});

// Export vehicles
export const exportVehicles = catchAsync(async (req, res, next) => {
  const { ownerNIC } = req.query;

  let query = { isActive: true };
  if (ownerNIC) {
    query.ownerNIC = ownerNIC.toUpperCase();
  }

  const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: {
      vehicles,
      totalCount: vehicles.length,
    },
  });
});

// Verify vehicle (admin only)
export const verifyVehicle = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    {
      verificationStatus: "VERIFIED",
      isVerified: true,
      verifiedBy: req.user._id,
      verifiedAt: new Date(),
      rejectionReason: undefined, // Clear any previous rejection reason
    },
    { new: true }
  );

  if (!vehicle) {
    return next(new AppError("Vehicle not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Vehicle verified successfully",
    data: { vehicle },
  });
});

// Reject vehicle (admin only)
export const rejectVehicle = catchAsync(async (req, res, next) => {
  const { rejectionReason } = req.body;

  if (!rejectionReason) {
    return next(new AppError("Rejection reason is required", 400));
  }

  const vehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    {
      verificationStatus: "REJECTED",
      isVerified: false,
      verifiedBy: req.user._id,
      verifiedAt: new Date(),
      rejectionReason,
    },
    { new: true }
  );

  if (!vehicle) {
    return next(new AppError("Vehicle not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Vehicle rejected",
    data: { vehicle },
  });
});

// Get user's vehicles for booking (simplified data)
export const getUserVehiclesForBooking = catchAsync(async (req, res, next) => {
  console.log("=== getUserVehiclesForBooking called ===");
  console.log("User object:", req.user);

  const userNIC = req.user?.nicNumber;

  if (!userNIC) {
    console.log("❌ User NIC not found in req.user");
    console.log("Available user fields:", Object.keys(req.user || {}));
    return next(new AppError("User NIC not found", 400));
  }

  console.log("✅ Fetching vehicles for user NIC:", userNIC);

  try {
    // Get vehicles owned by the current user
    const vehicles = await Vehicle.find({
      ownerNIC: userNIC.toUpperCase(),
      isActive: true,
      verificationStatus: "VERIFIED",
    })
      .select({
        _id: 1,
        registrationNumber: 1,
        make: 1,
        model: 1,
        yearOfManufacture: 1,
        color: 1,
        fuelType: 1,
        classOfVehicle: 1,
        cylinderCapacity: 1,
        images: 1,
      })
      .sort({ createdAt: -1 });

    console.log(`📊 Query result: Found ${vehicles.length} vehicles for user`);
    console.log(
      "Vehicle details:",
      vehicles.map((v) => ({
        id: v._id,
        reg: v.registrationNumber,
        make: v.make,
        model: v.model,
      }))
    );

    // Also check if there are ANY vehicles for this NIC (regardless of verification status)
    const allUserVehicles = await Vehicle.find({
      ownerNIC: userNIC.toUpperCase(),
      isActive: true,
    }).select("registrationNumber verificationStatus");

    console.log(
      `📈 Total vehicles for user (all statuses):`,
      allUserVehicles.length
    );
    console.log("All user vehicles:", allUserVehicles);

    // Transform data for booking form
    const vehicleOptions = vehicles.map((vehicle) => ({
      id: vehicle._id,
      value: vehicle.registrationNumber,
      label: `${vehicle.registrationNumber} - ${vehicle.make} ${vehicle.model} (${vehicle.yearOfManufacture})`,
      details: {
        registrationNumber: vehicle.registrationNumber,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.yearOfManufacture,
        color: vehicle.color,
        fuelType: vehicle.fuelType,
        classOfVehicle: vehicle.classOfVehicle,
        cylinderCapacity: vehicle.cylinderCapacity,
        image: vehicle.images?.[0]?.url || null,
      },
    }));

    console.log("🚗 Final vehicle options:", vehicleOptions);

    res.status(200).json({
      success: true,
      message: "User vehicles retrieved successfully",
      data: {
        vehicles: vehicleOptions,
        totalCount: vehicles.length,
        debug: {
          userNIC,
          totalVehiclesAllStatuses: allUserVehicles.length,
          verifiedVehicles: vehicles.length,
        },
      },
    });
  } catch (error) {
    console.error("❌ Error in getUserVehiclesForBooking:", error);
    return next(new AppError("Failed to fetch user vehicles", 500));
  }
});
