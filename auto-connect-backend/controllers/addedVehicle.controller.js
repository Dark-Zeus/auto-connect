// controllers/addedVehicle.controller.js
import AddedVehicle from "../models/AddedVehicle.model.js";
import Vehicle from "../models/Vehicle.model.js";
import { catchAsync } from "../utils/catchAsync.util.js";
import { AppError } from "../utils/appError.util.js";

// Add a vehicle to the added_vehicles collection
export const addVehicle = catchAsync(async (req, res, next) => {
  const {
    vehicleId,
    purpose,
    notes,
    priority,
    scheduledDate,
    serviceDetails,
    contactInfo,
    location,
  } = req.body;

  // Validate that the vehicle exists and user has access to it
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    return next(new AppError("Vehicle not found", 404));
  }

  // Check if user has permission to add this vehicle
  // Allow if user is the owner OR if vehicle owner allows others to add
  const canAdd =
    vehicle.ownerId.toString() === req.user._id.toString() ||
    vehicle.ownerNIC === req.user.nicNumber;

  if (!canAdd) {
    return next(
      new AppError("You don't have permission to add this vehicle", 403)
    );
  }

  // Check if vehicle is already added by this user for the same purpose
  const existingAddedVehicle = await AddedVehicle.findOne({
    vehicleId: vehicleId,
    addedBy: req.user._id,
    purpose: purpose || "SERVICE_BOOKING",
    status: { $in: ["ACTIVE", "PENDING"] },
    isActive: true,
  });

  if (existingAddedVehicle) {
    return next(new AppError("Vehicle is already added for this purpose", 400));
  }

  // Create the added vehicle record
  const addedVehicleData = {
    vehicleId: vehicleId,
    addedBy: req.user._id,
    vehicleOwner: vehicle.ownerId,
    ownerNIC: vehicle.ownerNIC,
    purpose: purpose || "SERVICE_BOOKING",
    notes: notes,
    priority: priority || "MEDIUM",
    scheduledDate: scheduledDate,
    serviceDetails: serviceDetails,
    contactInfo: {
      phone: contactInfo?.phone || req.user.phone,
      email: contactInfo?.email || req.user.email,
      preferredContactMethod: contactInfo?.preferredContactMethod || "PHONE",
    },
    location: location,
    metadata: {
      source: "WEB_APP",
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
      sessionId: req.sessionID,
    },
    createdBy: req.user._id,
    tracking: {
      submittedAt: new Date(),
      lastUpdated: new Date(),
    },
  };

  const addedVehicle = await AddedVehicle.create(addedVehicleData);

  // Populate the response with vehicle details
  const populatedAddedVehicle = await AddedVehicle.findById(addedVehicle._id)
    .populate(
      "vehicleId",
      "registrationNumber make model yearOfManufacture color verificationStatus mileage"
    )
    .populate("addedBy", "firstName lastName email")
    .populate("vehicleOwner", "firstName lastName email nicNumber");

  res.status(201).json({
    success: true,
    message: "Vehicle added successfully",
    data: {
      addedVehicle: populatedAddedVehicle,
    },
  });
});

// Get all added vehicles for the current user
export const getAddedVehicles = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    status,
    purpose,
    ownerNIC,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  // Build filter
  let filter = {
    addedBy: req.user._id,
    isActive: true,
  };

  if (status) {
    filter.status = status.toUpperCase();
  }

  if (purpose) {
    filter.purpose = purpose.toUpperCase();
  }

  if (ownerNIC) {
    filter.ownerNIC = ownerNIC.toUpperCase();
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  // Build aggregation pipeline for search
  let pipeline = [
    { $match: filter },
    {
      $lookup: {
        from: "vehicles",
        localField: "vehicleId",
        foreignField: "_id",
        as: "vehicle",
      },
    },
    { $unwind: "$vehicle" },
  ];

  // Add search functionality
  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { "vehicle.registrationNumber": { $regex: search, $options: "i" } },
          { "vehicle.make": { $regex: search, $options: "i" } },
          { "vehicle.model": { $regex: search, $options: "i" } },
          { notes: { $regex: search, $options: "i" } },
        ],
      },
    });
  }

  // Add sorting and pagination
  pipeline.push(
    { $sort: sortOptions },
    { $skip: skip },
    { $limit: parseInt(limit) }
  );

  // Execute aggregation
  const addedVehicles = await AddedVehicle.aggregate(pipeline);

  // Get total count for pagination
  const totalCount = await AddedVehicle.countDocuments(filter);
  const totalPages = Math.ceil(totalCount / parseInt(limit));

  // Populate additional fields
  const populatedVehicles = await AddedVehicle.populate(addedVehicles, [
    { path: "addedBy", select: "firstName lastName email" },
    { path: "vehicleOwner", select: "firstName lastName email nicNumber" },
  ]);

  res.status(200).json({
    success: true,
    data: {
      addedVehicles: populatedVehicles,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
    },
  });
});

// Get added vehicles by owner NIC (for vehicle owners to see who added their vehicles)
export const getAddedVehiclesByOwnerNIC = catchAsync(async (req, res, next) => {
  const { nicNumber } = req.params;
  const { page = 1, limit = 10, status } = req.query;

  // Ensure user can only access their own vehicles
  if (
    req.user.nicNumber !== nicNumber.toUpperCase() &&
    req.user.role !== "admin"
  ) {
    return next(new AppError("Access denied", 403));
  }

  const filter = {
    ownerNIC: nicNumber.toUpperCase(),
    isActive: true,
  };

  if (status) {
    filter.status = status.toUpperCase();
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [addedVehicles, totalCount] = await Promise.all([
    AddedVehicle.find(filter)
      .populate(
        "vehicleId",
        "registrationNumber make model yearOfManufacture color verificationStatus"
      )
      .populate("addedBy", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    AddedVehicle.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / parseInt(limit));

  res.status(200).json({
    success: true,
    data: {
      addedVehicles,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
    },
  });
});

// Get single added vehicle
export const getAddedVehicle = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const addedVehicle = await AddedVehicle.findById(id)
    .populate("vehicleId")
    .populate("addedBy", "firstName lastName email")
    .populate("vehicleOwner", "firstName lastName email nicNumber")
    .populate("tracking.updatedBy", "firstName lastName")
    .populate("tracking.completedBy", "firstName lastName");

  if (!addedVehicle) {
    return next(new AppError("Added vehicle not found", 404));
  }

  // Check access permissions
  const hasAccess =
    addedVehicle.addedBy._id.toString() === req.user._id.toString() ||
    addedVehicle.vehicleOwner._id.toString() === req.user._id.toString() ||
    req.user.role === "admin";

  if (!hasAccess) {
    return next(new AppError("Access denied", 403));
  }

  res.status(200).json({
    success: true,
    data: {
      addedVehicle,
    },
  });
});

// Update added vehicle
export const updateAddedVehicle = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  // Remove fields that shouldn't be updated directly
  delete updateData.vehicleId;
  delete updateData.addedBy;
  delete updateData.vehicleOwner;
  delete updateData.createdBy;

  const addedVehicle = await AddedVehicle.findById(id);
  if (!addedVehicle) {
    return next(new AppError("Added vehicle not found", 404));
  }

  // Check permissions
  const canUpdate =
    addedVehicle.addedBy.toString() === req.user._id.toString() ||
    req.user.role === "admin";

  if (!canUpdate) {
    return next(
      new AppError("You don't have permission to update this record", 403)
    );
  }

  // Update the record
  updateData.lastModifiedBy = req.user._id;
  updateData["tracking.lastUpdated"] = new Date();

  if (updateData.status && updateData.status !== addedVehicle.status) {
    updateData["tracking.updatedBy"] = req.user._id;
  }

  const updatedAddedVehicle = await AddedVehicle.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  )
    .populate(
      "vehicleId",
      "registrationNumber make model yearOfManufacture color"
    )
    .populate("addedBy", "firstName lastName email")
    .populate("vehicleOwner", "firstName lastName email nicNumber");

  res.status(200).json({
    success: true,
    message: "Added vehicle updated successfully",
    data: {
      addedVehicle: updatedAddedVehicle,
    },
  });
});

// Delete (soft delete) added vehicle
export const deleteAddedVehicle = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const addedVehicle = await AddedVehicle.findById(id);
  if (!addedVehicle) {
    return next(new AppError("Added vehicle not found", 404));
  }

  // Check permissions
  const canDelete =
    addedVehicle.addedBy.toString() === req.user._id.toString() ||
    req.user.role === "admin";

  if (!canDelete) {
    return next(
      new AppError("You don't have permission to delete this record", 403)
    );
  }

  // Soft delete
  await AddedVehicle.findByIdAndUpdate(id, {
    isActive: false,
    status: "CANCELLED",
    lastModifiedBy: req.user._id,
    "tracking.lastUpdated": new Date(),
  });

  res.status(200).json({
    success: true,
    message: "Added vehicle removed successfully",
  });
});

// Mark added vehicle as completed
export const markCompleted = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { notes } = req.body;

  const addedVehicle = await AddedVehicle.findById(id);
  if (!addedVehicle) {
    return next(new AppError("Added vehicle not found", 404));
  }

  // Check permissions
  const canComplete =
    addedVehicle.addedBy.toString() === req.user._id.toString() ||
    addedVehicle.vehicleOwner.toString() === req.user._id.toString() ||
    req.user.role === "admin";

  if (!canComplete) {
    return next(
      new AppError("You don't have permission to complete this record", 403)
    );
  }

  // Mark as completed
  await addedVehicle.markCompleted(req.user._id);

  if (notes) {
    addedVehicle.notes = notes;
    await addedVehicle.save();
  }

  const updatedAddedVehicle = await AddedVehicle.findById(id)
    .populate("vehicleId", "registrationNumber make model")
    .populate("addedBy", "firstName lastName email")
    .populate("tracking.completedBy", "firstName lastName");

  res.status(200).json({
    success: true,
    message: "Added vehicle marked as completed",
    data: {
      addedVehicle: updatedAddedVehicle,
    },
  });
});

// Get statistics
export const getAddedVehicleStats = catchAsync(async (req, res, next) => {
  const { ownerNIC } = req.query;

  let filter = {};

  // If not admin, filter by user's data
  if (req.user.role !== "admin") {
    filter.addedBy = req.user._id;
  }

  // If ownerNIC is provided and user has access
  if (
    ownerNIC &&
    (req.user.nicNumber === ownerNIC.toUpperCase() || req.user.role === "admin")
  ) {
    filter.ownerNIC = ownerNIC.toUpperCase();
  }

  const [stats] = await AddedVehicle.getStatistics(filter);

  const overview = stats || {
    total: 0,
    active: 0,
    completed: 0,
    pending: 0,
    cancelled: 0,
    thisMonth: 0,
  };

  // Get purpose breakdown
  const purposeStats = await AddedVehicle.aggregate([
    { $match: { isActive: true, ...filter } },
    {
      $group: {
        _id: "$purpose",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview,
      purposeBreakdown: purposeStats,
    },
  });
});

// Export added vehicles to CSV
export const exportAddedVehicles = catchAsync(async (req, res, next) => {
  const { ownerNIC, status, purpose } = req.query;

  let filter = {
    addedBy: req.user._id,
    isActive: true,
  };

  if (ownerNIC) {
    filter.ownerNIC = ownerNIC.toUpperCase();
  }

  if (status) {
    filter.status = status.toUpperCase();
  }

  if (purpose) {
    filter.purpose = purpose.toUpperCase();
  }

  const addedVehicles = await AddedVehicle.find(filter)
    .populate(
      "vehicleId",
      "registrationNumber make model yearOfManufacture color verificationStatus"
    )
    .populate("addedBy", "firstName lastName email")
    .populate("vehicleOwner", "firstName lastName email nicNumber")
    .sort({ createdAt: -1 })
    .limit(1000); // Limit for performance

  res.status(200).json({
    success: true,
    data: {
      addedVehicles,
      totalCount: addedVehicles.length,
    },
  });
});
