// controllers/vehicleController.js
import Vehicle from "../models/Vehicle.js";
import VehicleHistory from "../models/VehicleHistory.js";
import VehicleTransfer from "../models/VehicleTransfer.js";
import User from "../models/User.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

// Register a new vehicle
export const registerVehicle = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const userId = req.user.id; // From JWT middleware
    const vehicleData = req.body;

    // Check if registration number already exists
    const existingVehicle = await Vehicle.findOne({
      registrationNumber: vehicleData.registrationNumber.toUpperCase(),
    });

    if (existingVehicle) {
      return res.status(400).json({
        status: "error",
        message: "Vehicle with this registration number already exists",
      });
    }

    // Check if chassis number already exists
    const existingChassis = await Vehicle.findOne({
      chassisNumber: vehicleData.chassisNumber.toUpperCase(),
    });

    if (existingChassis) {
      return res.status(400).json({
        status: "error",
        message: "Vehicle with this chassis number already exists",
      });
    }

    // Prepare vehicle data
    const newVehicle = new Vehicle({
      ...vehicleData,
      registrationNumber: vehicleData.registrationNumber.toUpperCase(),
      chassisNumber: vehicleData.chassisNumber.toUpperCase(),
      engineNumber: vehicleData.engineNumber.toUpperCase(),
      make: vehicleData.make.toUpperCase(),
      model: vehicleData.model.toUpperCase(),
      currentOwner: {
        ...vehicleData.currentOwner,
        userId: userId,
      },
      isVerified: false, // Admin verification required
      status: "ACTIVE",
    });

    await newVehicle.save();

    // Create initial history record
    const historyRecord = new VehicleHistory({
      vehicleId: newVehicle._id,
      eventType: "REGISTRATION",
      eventDate: vehicleData.dateOfRegistration || new Date(),
      description: "Vehicle registered in AutoConnect system",
      recordedBy: userId,
      location: {
        province: vehicleData.currentOwner.address.province,
      },
    });

    await historyRecord.save();

    res.status(201).json({
      status: "success",
      message: "Vehicle registered successfully. Awaiting admin verification.",
      data: {
        vehicle: {
          id: newVehicle._id,
          registrationNumber: newVehicle.registrationNumber,
          make: newVehicle.make,
          model: newVehicle.model,
          yearOfManufacture: newVehicle.yearOfManufacture,
          isVerified: newVehicle.isVerified,
        },
      },
    });
  } catch (error) {
    console.error("Vehicle registration error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Get all vehicles for a user
export const getUserVehicles = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (page - 1) * limit;

    let query = { "currentOwner.userId": userId };

    // Filter by status
    if (status && status !== "all") {
      if (status === "active") {
        query.status = "ACTIVE";
      } else if (status === "inactive") {
        query.status = { $ne: "ACTIVE" };
      }
    }

    // Search functionality
    if (search) {
      query.$or = [
        { registrationNumber: { $regex: search, $options: "i" } },
        { make: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
      ];
    }

    const vehicles = await Vehicle.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select("-documents -images"); // Exclude large fields for list view

    const total = await Vehicle.countDocuments(query);

    // Add calculated fields
    const vehiclesWithStatus = vehicles.map((vehicle) => {
      const vehicleObj = vehicle.toObject();

      // Calculate if services are due, insurance expired, etc.
      vehicleObj.hasIssues =
        (vehicle.insuranceDetails &&
          vehicle.insuranceDetails.validTo < new Date()) ||
        (vehicle.revenueLicense &&
          vehicle.revenueLicense.validTo < new Date()) ||
        (vehicle.emissionTest && vehicle.emissionTest.nextTestDue < new Date());

      vehicleObj.vehicleAge =
        new Date().getFullYear() - vehicle.yearOfManufacture;

      return vehicleObj;
    });

    res.json({
      status: "success",
      data: {
        vehicles: vehiclesWithStatus,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    console.error("Get user vehicles error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Get vehicle details by ID
export const getVehicleById = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const userId = req.user.id;

    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      "currentOwner.userId": userId,
    });

    if (!vehicle) {
      return res.status(404).json({
        status: "error",
        message: "Vehicle not found",
      });
    }

    // Add calculated fields
    const vehicleObj = vehicle.toObject();
    vehicleObj.vehicleAge =
      new Date().getFullYear() - vehicle.yearOfManufacture;
    vehicleObj.isInsuranceValid = vehicle.isInsuranceValid();
    vehicleObj.isRevenueLicenseValid = vehicle.isRevenueLicenseValid();
    vehicleObj.isEmissionTestDue = vehicle.isEmissionTestDue();

    res.json({
      status: "success",
      data: { vehicle: vehicleObj },
    });
  } catch (error) {
    console.error("Get vehicle by ID error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Update vehicle information
export const updateVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    // Remove fields that shouldn't be updated directly
    delete updateData.registrationNumber;
    delete updateData.chassisNumber;
    delete updateData.engineNumber;
    delete updateData.isVerified;
    delete updateData.verifiedBy;
    delete updateData.status;

    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: vehicleId, "currentOwner.userId": userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({
        status: "error",
        message: "Vehicle not found",
      });
    }

    // Create history record for update
    const historyRecord = new VehicleHistory({
      vehicleId: vehicle._id,
      eventType: "MODIFICATION",
      eventDate: new Date(),
      description: "Vehicle information updated",
      recordedBy: userId,
    });

    await historyRecord.save();

    res.json({
      status: "success",
      message: "Vehicle updated successfully",
      data: { vehicle },
    });
  } catch (error) {
    console.error("Update vehicle error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Get vehicle history
export const getVehicleHistory = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const userId = req.user.id;
    const { page = 1, limit = 20, eventType } = req.query;
    const skip = (page - 1) * limit;

    // Verify user owns the vehicle
    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      "currentOwner.userId": userId,
    });

    if (!vehicle) {
      return res.status(404).json({
        status: "error",
        message: "Vehicle not found",
      });
    }

    let query = { vehicleId };

    // Filter by event type
    if (eventType && eventType !== "all") {
      query.eventType = eventType;
    }

    const history = await VehicleHistory.find(query)
      .populate("serviceProviderId", "businessName")
      .populate("recordedBy", "firstName lastName")
      .sort({ eventDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await VehicleHistory.countDocuments(query);

    res.json({
      status: "success",
      data: {
        history,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    console.error("Get vehicle history error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Add vehicle history record
export const addVehicleHistory = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const userId = req.user.id;
    const historyData = req.body;

    // Verify user owns the vehicle
    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      "currentOwner.userId": userId,
    });

    if (!vehicle) {
      return res.status(404).json({
        status: "error",
        message: "Vehicle not found",
      });
    }

    const historyRecord = new VehicleHistory({
      ...historyData,
      vehicleId,
      recordedBy: userId,
    });

    await historyRecord.save();

    // Update vehicle mileage if provided
    if (
      historyData.mileageAtEvent &&
      historyData.mileageAtEvent > vehicle.mileage
    ) {
      vehicle.mileage = historyData.mileageAtEvent;
      await vehicle.save();
    }

    res.status(201).json({
      status: "success",
      message: "History record added successfully",
      data: { historyRecord },
    });
  } catch (error) {
    console.error("Add vehicle history error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Update insurance details
export const updateInsurance = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const userId = req.user.id;
    const insuranceData = req.body;

    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: vehicleId, "currentOwner.userId": userId },
      { insuranceDetails: insuranceData },
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({
        status: "error",
        message: "Vehicle not found",
      });
    }

    // Create history record
    const historyRecord = new VehicleHistory({
      vehicleId: vehicle._id,
      eventType: "INSURANCE_RENEWAL",
      eventDate: new Date(),
      description: `Insurance renewed with ${insuranceData.provider}`,
      recordedBy: userId,
      certificate: {
        certificateType: "INSURANCE_CERTIFICATE",
        issuedBy: insuranceData.provider,
        issuedDate: new Date(),
        validFrom: insuranceData.validFrom,
        validTo: insuranceData.validTo,
      },
    });

    await historyRecord.save();

    res.json({
      status: "success",
      message: "Insurance details updated successfully",
      data: { vehicle },
    });
  } catch (error) {
    console.error("Update insurance error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Update revenue license
export const updateRevenueLicense = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const userId = req.user.id;
    const licenseData = req.body;

    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: vehicleId, "currentOwner.userId": userId },
      { revenueLicense: { ...licenseData, isValid: true } },
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({
        status: "error",
        message: "Vehicle not found",
      });
    }

    // Create history record
    const historyRecord = new VehicleHistory({
      vehicleId: vehicle._id,
      eventType: "REVENUE_LICENSE_RENEWAL",
      eventDate: new Date(),
      description: `Revenue license renewed`,
      recordedBy: userId,
      certificate: {
        certificateNumber: licenseData.licenseNumber,
        certificateType: "REVENUE_LICENSE",
        issuedDate: new Date(),
        validFrom: licenseData.validFrom,
        validTo: licenseData.validTo,
      },
    });

    await historyRecord.save();

    res.json({
      status: "success",
      message: "Revenue license updated successfully",
      data: { vehicle },
    });
  } catch (error) {
    console.error("Update revenue license error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Add emission test result
export const addEmissionTest = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const userId = req.user.id;
    const testData = req.body;

    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      "currentOwner.userId": userId,
    });

    if (!vehicle) {
      return res.status(404).json({
        status: "error",
        message: "Vehicle not found",
      });
    }

    // Update emission test data
    vehicle.emissionTest = {
      lastTestDate: testData.testDate,
      nextTestDue: new Date(
        new Date(testData.testDate).setFullYear(
          new Date(testData.testDate).getFullYear() + 1
        )
      ),
      testResult: testData.testResult,
      certificateNumber: testData.certificateNumber,
    };

    await vehicle.save();

    // Create history record
    const historyRecord = new VehicleHistory({
      vehicleId: vehicle._id,
      eventType: "EMISSION_TEST",
      eventDate: testData.testDate,
      description: `Emission test completed - ${testData.testResult}`,
      recordedBy: userId,
      mileageAtEvent: testData.mileageAtTest,
      emissionTestResults: {
        coLevel: testData.coLevel,
        hcLevel: testData.hcLevel,
        noxLevel: testData.noxLevel,
        smokeDensity: testData.smokeDensity,
        testResult: testData.testResult,
        testCenter: testData.testCenter,
        testerName: testData.testerName,
      },
      certificate: {
        certificateNumber: testData.certificateNumber,
        certificateType: "EMISSION_CERTIFICATE",
        issuedBy: testData.testCenter,
        issuedDate: testData.testDate,
        validFrom: testData.testDate,
        validTo: new Date(
          new Date(testData.testDate).setFullYear(
            new Date(testData.testDate).getFullYear() + 1
          )
        ),
      },
    });

    await historyRecord.save();

    res.json({
      status: "success",
      message: "Emission test result added successfully",
      data: { vehicle },
    });
  } catch (error) {
    console.error("Add emission test error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Admin: Get pending vehicle verifications
export const getPendingVerifications = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const vehicles = await Vehicle.find({ isVerified: false })
      .populate("currentOwner.userId", "firstName lastName email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Vehicle.countDocuments({ isVerified: false });

    res.json({
      status: "success",
      data: {
        vehicles,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    console.error("Get pending verifications error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Admin: Verify vehicle
export const verifyVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const adminId = req.user.id;

    const vehicle = await Vehicle.findByIdAndUpdate(
      vehicleId,
      {
        isVerified: true,
        verifiedBy: adminId,
        verifiedDate: new Date(),
      },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({
        status: "error",
        message: "Vehicle not found",
      });
    }

    // Create history record
    const historyRecord = new VehicleHistory({
      vehicleId: vehicle._id,
      eventType: "VERIFICATION",
      eventDate: new Date(),
      description: "Vehicle verified by admin",
      recordedBy: adminId,
    });

    await historyRecord.save();

    res.json({
      status: "success",
      message: "Vehicle verified successfully",
    });
  } catch (error) {
    console.error("Verify vehicle error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Get vehicle analytics/statistics
export const getVehicleAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalVehicles = await Vehicle.countDocuments({
      "currentOwner.userId": userId,
    });
    const activeVehicles = await Vehicle.countDocuments({
      "currentOwner.userId": userId,
      status: "ACTIVE",
    });

    // Count vehicles with issues
    const vehiclesWithIssues = await Vehicle.aggregate([
      {
        $match: { "currentOwner.userId": new mongoose.Types.ObjectId(userId) },
      },
      {
        $project: {
          hasInsuranceIssue: {
            $lt: ["$insuranceDetails.validTo", new Date()],
          },
          hasLicenseIssue: {
            $lt: ["$revenueLicense.validTo", new Date()],
          },
          hasEmissionIssue: {
            $lt: ["$emissionTest.nextTestDue", new Date()],
          },
        },
      },
      {
        $match: {
          $or: [
            { hasInsuranceIssue: true },
            { hasLicenseIssue: true },
            { hasEmissionIssue: true },
          ],
        },
      },
      { $count: "total" },
    ]);

    const issuesCount =
      vehiclesWithIssues.length > 0 ? vehiclesWithIssues[0].total : 0;

    // Vehicle age distribution
    const ageDistribution = await Vehicle.aggregate([
      {
        $match: { "currentOwner.userId": new mongoose.Types.ObjectId(userId) },
      },
      {
        $project: {
          age: { $subtract: [new Date().getFullYear(), "$yearOfManufacture"] },
        },
      },
      {
        $bucket: {
          groupBy: "$age",
          boundaries: [0, 5, 10, 15, 20, 100],
          default: "Unknown",
          output: { count: { $sum: 1 } },
        },
      },
    ]);

    // Fuel type distribution
    const fuelDistribution = await Vehicle.aggregate([
      {
        $match: { "currentOwner.userId": new mongoose.Types.ObjectId(userId) },
      },
      { $group: { _id: "$fuelType", count: { $sum: 1 } } },
    ]);

    res.json({
      status: "success",
      data: {
        summary: {
          totalVehicles,
          activeVehicles,
          vehiclesWithIssues: issuesCount,
          verifiedVehicles: await Vehicle.countDocuments({
            "currentOwner.userId": userId,
            isVerified: true,
          }),
        },
        ageDistribution,
        fuelDistribution,
      },
    });
  } catch (error) {
    console.error("Get vehicle analytics error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

