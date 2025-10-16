// controllers/vehiclePassport.controller.js
import Booking from "../models/Booking.model.js";
import ServiceReport from "../models/ServiceReport.model.js";
import User from "../models/user.model.js";
import Vehicle from "../models/vehicle.model.js";
import LOG from "../configs/log.config.js";
import { catchAsync } from "../utils/catchAsync.util.js";
import { AppError } from "../utils/appError.util.js";
import mongoose from "mongoose";

// Get vehicle passport data for a specific vehicle
export const getVehiclePassport = catchAsync(async (req, res, next) => {
  // Only vehicle owners can access their vehicle passport
  if (req.user.role !== "vehicle_owner") {
    return next(new AppError("Only vehicle owners can access vehicle passport", 403));
  }

  const { vehicleId } = req.params;
  const ownerNIC = req.user.nicNumber;

  console.log(`Fetching vehicle passport for vehicle: ${vehicleId}, owner: ${ownerNIC}`);

  // Validate vehicle ownership
  const vehicle = await Vehicle.findOne({
    _id: vehicleId,
    ownerNIC: ownerNIC,
    isActive: true
  });

  if (!vehicle) {
    return next(new AppError("Vehicle not found or you don't have access to this vehicle", 404));
  }

  // Get comprehensive vehicle data with parallel queries
  const [
    serviceRecords,
    insuranceRecords,
    emissionRecords,
    vehicleValue,
    recentActivity
  ] = await Promise.all([
    // Service & Maintenance Records
    getServiceRecords(vehicle.registrationNumber, req.user._id),

    // Insurance Records (placeholder - to be implemented when insurance model exists)
    getInsuranceRecords(vehicle._id),

    // Emission Test Records (placeholder - to be implemented when emission model exists)
    getEmissionRecords(vehicle._id),

    // Vehicle Valuation (calculated based on service history and depreciation)
    calculateVehicleValue(vehicle),

    // Recent Activity (last 10 activities across all categories)
    getRecentActivity(vehicle.registrationNumber, req.user._id)
  ]);

  // Prepare vehicle basic information
  const vehicleInfo = {
    id: vehicle._id,
    plateNumber: vehicle.registrationNumber,
    make: vehicle.vehicleDetails?.make || 'Unknown',
    model: vehicle.vehicleDetails?.model || 'Unknown',
    year: vehicle.vehicleDetails?.year || 'Unknown',
    color: vehicle.vehicleDetails?.color || 'Unknown',
    vin: vehicle.chassisNumber || 'Unknown', // Using chassis as VIN equivalent
    engineNumber: vehicle.engineNumber || 'Unknown',
    currentMileage: vehicle.vehicleDetails?.mileage || 0,
    registrationDate: vehicle.createdAt?.toISOString().split('T')[0] || 'Unknown',
    fuelType: vehicle.vehicleDetails?.fuelType || 'Unknown',
    transmission: vehicle.vehicleDetails?.transmission || 'Unknown',
    engineCapacity: vehicle.vehicleDetails?.engineCapacity || 'Unknown',
    bodyType: vehicle.vehicleDetails?.bodyType || 'Unknown',
    owner: {
      name: vehicle.currentOwner?.name || req.user.fullName || 'Unknown',
      phone: req.user.phoneNumber || 'Not provided',
      email: req.user.email || 'Not provided',
      address: req.user.address || 'Not provided',
    },
  };

  // Accident records placeholder (to be implemented)
  const accidentRecords = [
    // Placeholder data structure for future implementation
    // {
    //   id: "AC001",
    //   type: "accident",
    //   date: "2023-11-22",
    //   location: "Galle Road, Colombo 03",
    //   severity: "Minor",
    //   damage: "Front bumper scratched",
    //   repairCost: 25000,
    //   status: "repaired",
    //   policeReport: "PR-2023-445566",
    //   insuranceClaim: "CL-2023-778899",
    //   images: 8,
    // }
  ];

  // Document management placeholder
  const documentsInfo = {
    registrationCertificate: { status: 'available', lastUpdated: vehicle.createdAt },
    insurancePolicy: { status: 'pending', lastUpdated: null },
    emissionCertificate: { status: 'pending', lastUpdated: null },
    serviceCertificates: { status: 'available', count: serviceRecords.length },
    ownershipDocuments: { status: 'available', lastUpdated: vehicle.createdAt },
    totalDocuments: serviceRecords.length + 5 // Basic docs + service certificates
  };

  // Calculate vehicle health score
  const healthScore = calculateVehicleHealthScore(serviceRecords, vehicle);

  // Generate recommendations
  const recommendations = generateRecommendations(serviceRecords, vehicle);

  console.log(`Returning passport data for vehicle ${vehicle.registrationNumber} with ${serviceRecords.length} service records`);

  res.status(200).json({
    success: true,
    data: {
      vehicleInfo,
      serviceRecords,
      insuranceRecords,
      emissionRecords,
      accidentRecords,
      documentsInfo,
      vehicleValue,
      recentActivity,
      healthScore,
      recommendations
    }
  });
});

// Get all vehicles for passport selection
export const getPassportVehicles = catchAsync(async (req, res, next) => {
  // Only vehicle owners can access their vehicles
  if (req.user.role !== "vehicle_owner") {
    return next(new AppError("Only vehicle owners can access vehicle passport", 403));
  }

  const ownerNIC = req.user.nicNumber;

  console.log(`Fetching passport vehicles for owner: ${ownerNIC}`);

  // Get all vehicles owned by this user with summary data
  const vehicles = await Vehicle.aggregate([
    {
      $match: {
        ownerNIC: ownerNIC,
        isActive: true
      }
    },
    {
      $lookup: {
        from: "bookings",
        let: { regNumber: "$registrationNumber" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$vehicle.registrationNumber", "$$regNumber"] },
              status: "COMPLETED",
              isActive: true
            }
          },
          {
            $lookup: {
              from: "service_reports",
              localField: "_id",
              foreignField: "booking",
              as: "serviceReport"
            }
          }
        ],
        as: "serviceHistory"
      }
    },
    {
      $project: {
        registrationNumber: 1,
        vehicleDetails: 1,
        engineNumber: 1,
        chassisNumber: 1,
        createdAt: 1,
        totalServices: { $size: "$serviceHistory" },
        lastServiceDate: {
          $max: "$serviceHistory.timestamps.completedAt"
        },
        totalServiceCost: {
          $sum: {
            $map: {
              input: "$serviceHistory",
              as: "service",
              in: {
                $ifNull: [
                  { $arrayElemAt: ["$$service.serviceReport.totalCostBreakdown.finalTotal", 0] },
                  "$$service.finalCost"
                ]
              }
            }
          }
        }
      }
    },
    { $sort: { createdAt: -1 } }
  ]);

  // Format the response
  const formattedVehicles = vehicles.map(vehicle => ({
    id: vehicle._id,
    plateNumber: vehicle.registrationNumber,
    make: vehicle.vehicleDetails?.make || 'Unknown',
    model: vehicle.vehicleDetails?.model || 'Unknown',
    year: vehicle.vehicleDetails?.year || 'Unknown',
    color: vehicle.vehicleDetails?.color || 'Unknown',
    registrationDate: vehicle.createdAt?.toISOString().split('T')[0] || 'Unknown',
    totalServices: vehicle.totalServices || 0,
    lastServiceDate: vehicle.lastServiceDate?.toISOString().split('T')[0] || 'Never',
    totalServiceCost: vehicle.totalServiceCost || 0,
    healthScore: Math.max(85 - (vehicle.totalServices * 2), 65), // Simple health calculation
    status: vehicle.totalServices > 0 ? 'active' : 'new'
  }));

  console.log(`Found ${formattedVehicles.length} vehicles for passport display`);

  res.status(200).json({
    success: true,
    data: {
      vehicles: formattedVehicles,
      totalVehicles: formattedVehicles.length
    }
  });
});

// Helper function to get service records
async function getServiceRecords(registrationNumber, ownerId) {
  const bookings = await Booking.aggregate([
    {
      $match: {
        "vehicle.registrationNumber": registrationNumber,
        vehicleOwner: ownerId,
        isActive: true
      }
    },
    {
      $lookup: {
        from: "service_reports",
        localField: "_id",
        foreignField: "booking",
        as: "serviceReport"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "serviceCenter",
        foreignField: "_id",
        as: "serviceCenterDetails"
      }
    },
    {
      $project: {
        bookingId: 1,
        services: 1,
        status: 1,
        finalCost: 1,
        estimatedCost: 1,
        "timestamps.bookedAt": 1,
        "timestamps.completedAt": 1,
        feedback: 1,
        serviceReport: { $arrayElemAt: ["$serviceReport", 0] },
        serviceCenterDetails: { $arrayElemAt: ["$serviceCenterDetails", 0] }
      }
    },
    { $sort: { "timestamps.bookedAt": -1 } }
  ]);

  return bookings.map(booking => {
    const serviceReport = booking.serviceReport;

    return {
      id: booking.bookingId,
      type: "service",
      date: booking.timestamps.bookedAt?.toISOString().split('T')[0] || 'Unknown',
      provider: booking.serviceCenterDetails?.businessInfo?.businessName ||
                booking.serviceCenterDetails?.firstName + ' ' + booking.serviceCenterDetails?.lastName ||
                'Unknown Service Center',
      service: booking.services.join(", "),
      mileage: serviceReport?.vehicleCondition?.currentMileage || 0,
      cost: booking.finalCost || booking.estimatedCost || 0,
      status: booking.status.toLowerCase(),
      nextService: booking.timestamps.completedAt ?
        new Date(booking.timestamps.completedAt.getTime() + 90*24*60*60*1000).toISOString().split('T')[0] : null,
      technician: serviceReport?.technician?.name || 'Not assigned',
      workOrder: booking.bookingId,
      parts: serviceReport?.completedServices?.flatMap(service =>
        service.partsUsed?.map(part => part.partName) || []) || [],
      images: serviceReport?.supportingDocuments?.length || 0,
      warranty: "6 months", // Default warranty period
      rating: booking.feedback?.rating || null,
      completedServices: serviceReport?.completedServices || [],
      totalCostBreakdown: serviceReport?.totalCostBreakdown || null
    };
  });
}

// Helper function to get insurance records (placeholder)
async function getInsuranceRecords(vehicleId) {
  // Placeholder for insurance records - to be implemented when insurance model exists
  return [
    {
      id: "IN001",
      type: "insurance",
      date: new Date(Date.now() - 365*24*60*60*1000).toISOString().split('T')[0], // 1 year ago
      provider: "Ceylon Insurance Company",
      policyNumber: "POL-" + Date.now().toString().slice(-6),
      coverage: "Comprehensive Coverage",
      premium: 35000,
      validUntil: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0], // 30 days from now
      status: "active",
      agent: "Insurance Agent",
      claims: 0,
    }
  ];
}

// Helper function to get emission records (placeholder)
async function getEmissionRecords(vehicleId) {
  // Placeholder for emission records - to be implemented when emission model exists
  return [
    {
      id: "EM001",
      type: "emission",
      date: new Date(Date.now() - 180*24*60*60*1000).toISOString().split('T')[0], // 6 months ago
      provider: "Environmental Test Center",
      testNumber: "ET-" + Date.now().toString().slice(-6),
      result: "Pass",
      validUntil: new Date(Date.now() + 185*24*60*60*1000).toISOString().split('T')[0], // ~6 months from now
      status: "valid",
      inspector: "Dr. Environmental Inspector",
      emissions: {
        co: "0.12%",
        hc: "85 ppm",
        nox: "120 ppm",
      },
    }
  ];
}

// Helper function to calculate vehicle value
async function calculateVehicleValue(vehicle) {
  const currentYear = new Date().getFullYear();
  const vehicleYear = parseInt(vehicle.vehicleDetails?.year) || currentYear;
  const age = currentYear - vehicleYear;

  // Simple depreciation calculation (would be more complex in real implementation)
  const baseValue = getBaseValue(vehicle.vehicleDetails?.make, vehicle.vehicleDetails?.model);
  const depreciationRate = 0.15; // 15% per year
  const currentValue = baseValue * Math.pow(1 - depreciationRate, age);

  return {
    estimatedValue: Math.round(currentValue),
    currency: "LKR",
    lastUpdated: new Date().toISOString().split('T')[0],
    depreciationRate: `${(depreciationRate * 100)}% per year`,
    factors: [
      "Vehicle age and mileage",
      "Service history and maintenance",
      "Market conditions",
      "Vehicle condition"
    ]
  };
}

// Helper function to get base vehicle value
function getBaseValue(make, model) {
  // Simplified base values - in real implementation, this would query a vehicle valuation database
  const baseValues = {
    'Toyota': { 'Camry': 4500000, 'Corolla': 3200000, 'Prius': 3800000 },
    'Honda': { 'Civic': 3500000, 'Accord': 4200000, 'CR-V': 4800000 },
    'Nissan': { 'Sunny': 2800000, 'Sylphy': 3600000, 'X-Trail': 5200000 },
    'Suzuki': { 'Alto': 1800000, 'Swift': 2500000, 'Vitara': 3800000 }
  };

  return baseValues[make]?.[model] || 3000000; // Default value
}

// Helper function to get recent activity
async function getRecentActivity(registrationNumber, ownerId) {
  const activities = await Booking.aggregate([
    {
      $match: {
        "vehicle.registrationNumber": registrationNumber,
        vehicleOwner: ownerId,
        isActive: true
      }
    },
    {
      $lookup: {
        from: "service_reports",
        localField: "_id",
        foreignField: "booking",
        as: "serviceReport"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "serviceCenter",
        foreignField: "_id",
        as: "serviceCenterDetails"
      }
    },
    {
      $project: {
        type: { $literal: "service" },
        date: "$timestamps.bookedAt",
        title: { $arrayElemAt: ["$services", 0] },
        provider: {
          $ifNull: [
            "$serviceCenterDetails.businessInfo.businessName",
            { $concat: [
              { $arrayElemAt: ["$serviceCenterDetails.firstName", 0] },
              " ",
              { $arrayElemAt: ["$serviceCenterDetails.lastName", 0] }
            ]}
          ]
        },
        status: "$status"
      }
    },
    { $sort: { date: -1 } },
    { $limit: 10 }
  ]);

  return activities;
}

// Helper function to calculate vehicle health score
function calculateVehicleHealthScore(serviceRecords, vehicle) {
  const currentYear = new Date().getFullYear();
  const vehicleYear = parseInt(vehicle.vehicleDetails?.year) || currentYear;
  const age = currentYear - vehicleYear;

  let score = 100;

  // Reduce score based on age
  score -= age * 2;

  // Improve score based on regular maintenance
  const completedServices = serviceRecords.filter(record => record.status === 'completed');
  if (completedServices.length > 0) {
    score += Math.min(completedServices.length * 2, 20);
  }

  // Reduce score if no recent maintenance
  const lastService = serviceRecords[0];
  if (lastService) {
    const daysSinceLastService = (new Date() - new Date(lastService.date)) / (1000 * 60 * 60 * 24);
    if (daysSinceLastService > 365) {
      score -= 15;
    } else if (daysSinceLastService > 180) {
      score -= 5;
    }
  } else {
    score -= 20; // No service history
  }

  return {
    score: Math.max(Math.min(Math.round(score), 100), 0),
    category: score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 55 ? 'Fair' : 'Poor',
    factors: [
      `Vehicle age: ${age} years`,
      `Total services: ${serviceRecords.length}`,
      `Last service: ${lastService ?
        Math.round((new Date() - new Date(lastService.date)) / (1000 * 60 * 60 * 24)) + ' days ago' :
        'Never'}`
    ]
  };
}

// Helper function to generate recommendations
function generateRecommendations(serviceRecords, vehicle) {
  const recommendations = [];

  // Check for overdue maintenance
  const lastService = serviceRecords[0];
  if (lastService) {
    const daysSinceLastService = (new Date() - new Date(lastService.date)) / (1000 * 60 * 60 * 24);
    if (daysSinceLastService > 180) {
      recommendations.push({
        type: 'maintenance',
        priority: 'high',
        title: 'Service Overdue',
        description: 'Your vehicle is overdue for regular maintenance service',
        dueDate: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0]
      });
    } else if (daysSinceLastService > 120) {
      recommendations.push({
        type: 'maintenance',
        priority: 'medium',
        title: 'Service Due Soon',
        description: 'Schedule your next service within the next month',
        dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
      });
    }
  } else {
    recommendations.push({
      type: 'maintenance',
      priority: 'high',
      title: 'Initial Service Needed',
      description: 'Schedule your first service to establish maintenance history',
      dueDate: new Date(Date.now() + 14*24*60*60*1000).toISOString().split('T')[0]
    });
  }

  // Insurance reminder
  recommendations.push({
    type: 'insurance',
    priority: 'medium',
    title: 'Insurance Renewal',
    description: 'Review your insurance policy and renewal date',
    dueDate: new Date(Date.now() + 60*24*60*60*1000).toISOString().split('T')[0]
  });

  // Emission test reminder
  recommendations.push({
    type: 'emission',
    priority: 'low',
    title: 'Emission Test',
    description: 'Annual emission test required for vehicle registration',
    dueDate: new Date(Date.now() + 120*24*60*60*1000).toISOString().split('T')[0]
  });

  return recommendations;
}