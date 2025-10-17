// controllers/vehicleHistory.controller.js
import Booking from "../models/Booking.model.js";
import ServiceReport from "../models/ServiceReport.model.js";
import User from "../models/user.model.js";
import Vehicle from "../models/vehicle.model.js";
import LOG from "../configs/log.config.js";
import { catchAsync } from "../utils/catchAsync.util.js";
import { AppError } from "../utils/appError.util.js";
import mongoose from "mongoose";

// Get dashboard statistics for service provider
export const getDashboardStats = catchAsync(async (req, res, next) => {
  // Only service centers can access dashboard stats
  if (req.user.role !== "service_center") {
    return next(new AppError("Only service centers can access dashboard statistics", 403));
  }

  const serviceCenterId = req.user._id;
  const { timeRange = "30days" } = req.query;

  // Calculate date range based on timeRange parameter
  const now = new Date();
  let startDate;
  
  switch (timeRange) {
    case "7days":
      startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
      break;
    case "90days":
      startDate = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
      break;
    case "1year":
      startDate = new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000));
      break;
    default: // 30days
      startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  }

  console.log(`Fetching dashboard stats for service center: ${serviceCenterId}, timeRange: ${timeRange}, startDate: ${startDate}`);

  // Aggregate dashboard statistics
  const [
    totalStats,
    revenueStats,
    serviceDistribution,
    monthlyData,
    completedBookings,
    pendingServices
  ] = await Promise.all([
    // Total vehicles serviced and services completed
    Booking.aggregate([
      {
        $match: {
          serviceCenter: serviceCenterId,
          status: "COMPLETED",
          isActive: true,
          "timestamps.completedAt": { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalVehiclesServiced: { $addToSet: "$vehicle.registrationNumber" },
          totalServices: { $sum: 1 }
        }
      },
      {
        $project: {
          totalVehiclesServiced: { $size: "$totalVehiclesServiced" },
          totalServices: 1
        }
      }
    ]),

    // Revenue statistics from service reports
    ServiceReport.aggregate([
      {
        $match: {
          serviceCenter: serviceCenterId,
          isActive: true,
          reportGeneratedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalCostBreakdown.finalTotal" },
          averageServiceValue: { $avg: "$totalCostBreakdown.finalTotal" },
          count: { $sum: 1 }
        }
      }
    ]),

    // Service category distribution
    ServiceReport.aggregate([
      {
        $match: {
          serviceCenter: serviceCenterId,
          isActive: true,
          reportGeneratedAt: { $gte: startDate }
        }
      },
      { $unwind: "$completedServices" },
      {
        $group: {
          _id: "$completedServices.serviceName",
          count: { $sum: 1 },
          revenue: { $sum: "$completedServices.serviceCost" }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]),

    // Monthly trend data (last 6 months)
    ServiceReport.aggregate([
      {
        $match: {
          serviceCenter: serviceCenterId,
          isActive: true,
          reportGeneratedAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$reportGeneratedAt" },
            month: { $month: "$reportGeneratedAt" }
          },
          services: { $sum: 1 },
          revenue: { $sum: "$totalCostBreakdown.finalTotal" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]),

    // Customer satisfaction from completed bookings with feedback
    Booking.aggregate([
      {
        $match: {
          serviceCenter: serviceCenterId,
          status: "COMPLETED",
          "feedback.rating": { $exists: true },
          isActive: true,
          "timestamps.completedAt": { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$feedback.rating" },
          totalRatings: { $sum: 1 }
        }
      }
    ]),

    // Pending services count
    Booking.countDocuments({
      serviceCenter: serviceCenterId,
      status: { $in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] },
      isActive: true
    })
  ]);

  // Format the data
  const stats = totalStats[0] || { totalVehiclesServiced: 0, totalServices: 0 };
  const revenue = revenueStats[0] || { totalRevenue: 0, averageServiceValue: 0 };
  const satisfaction = completedBookings[0] || { averageRating: 0, totalRatings: 0 };

  // Calculate monthly growth (compare current month with previous month)
  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];
  const monthlyGrowth = previousMonth ? 
    ((currentMonth?.revenue - previousMonth.revenue) / previousMonth.revenue * 100) : 0;

  // Format monthly data
  const formattedMonthlyData = monthlyData.map(item => ({
    month: new Date(item._id.year, item._id.month - 1).toLocaleString('default', { month: 'short' }),
    services: item.services,
    revenue: item.revenue
  }));

  // Calculate service category percentages
  const totalCategoryRevenue = serviceDistribution.reduce((sum, cat) => sum + cat.revenue, 0);
  const formattedServiceCategories = serviceDistribution.map(category => ({
    name: category._id,
    count: category.count,
    revenue: category.revenue,
    percentage: totalCategoryRevenue > 0 ? ((category.revenue / totalCategoryRevenue) * 100).toFixed(1) : 0
  }));

  // Calculate repeat customers (customers with more than one completed booking)
  const repeatCustomersResult = await Booking.aggregate([
    {
      $match: {
        serviceCenter: serviceCenterId,
        status: "COMPLETED",
        isActive: true
      }
    },
    {
      $group: {
        _id: "$vehicleOwner",
        bookingCount: { $sum: 1 }
      }
    },
    {
      $match: {
        bookingCount: { $gt: 1 }
      }
    },
    {
      $group: {
        _id: null,
        repeatCustomers: { $sum: 1 },
        totalCustomers: { $sum: 1 }
      }
    }
  ]);

  const totalCustomersResult = await Booking.aggregate([
    {
      $match: {
        serviceCenter: serviceCenterId,
        status: "COMPLETED",
        isActive: true
      }
    },
    {
      $group: {
        _id: "$vehicleOwner"
      }
    },
    {
      $group: {
        _id: null,
        totalCustomers: { $sum: 1 }
      }
    }
  ]);

  const repeatCustomersData = repeatCustomersResult[0];
  const totalCustomersData = totalCustomersResult[0];
  const repeatCustomerPercentage = totalCustomersData ? 
    ((repeatCustomersData?.repeatCustomers || 0) / totalCustomersData.totalCustomers * 100) : 0;

  const responseData = {
    dashboardStats: {
      totalVehiclesServiced: stats.totalVehiclesServiced,
      totalServices: stats.totalServices,
      totalRevenue: revenue.totalRevenue || 0,
      averageServiceValue: Math.round(revenue.averageServiceValue || 0),
      monthlyGrowth: Math.round(monthlyGrowth * 10) / 10,
      customerSatisfaction: Math.round((satisfaction.averageRating || 0) * 10) / 10,
      repeatCustomers: Math.round(repeatCustomerPercentage),
      pendingServices
    },
    serviceCategories: formattedServiceCategories,
    monthlyData: formattedMonthlyData,
    timeRange
  };

  console.log('Sending dashboard response:', responseData);

  res.status(200).json({
    success: true,
    data: responseData
  });
});

// Get recent services for the dashboard
export const getRecentServices = catchAsync(async (req, res, next) => {
  if (req.user.role !== "service_center") {
    return next(new AppError("Only service centers can access service history", 403));
  }

  const serviceCenterId = req.user._id;
  const { page = 1, limit = 10, status } = req.query;
  const skip = (page - 1) * limit;

  console.log(`Fetching recent services for service center: ${serviceCenterId}, status: ${status}`);

  // Build match conditions
  const matchConditions = {
    serviceCenter: serviceCenterId,
    isActive: true
  };

  if (status && status !== "all") {
    matchConditions.status = status.toUpperCase();
  }

  console.log('Match conditions:', matchConditions);

  // Get recent bookings with service reports
  const recentServices = await Booking.aggregate([
    { $match: matchConditions },
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
        localField: "vehicleOwner",
        foreignField: "_id",
        as: "customer"
      }
    },
    {
      $project: {
        bookingId: 1,
        "vehicle.registrationNumber": 1,
        "vehicle.make": 1,
        "vehicle.model": 1,
        "vehicle.year": 1,
        services: 1,
        status: 1,
        finalCost: 1,
        "timestamps.bookedAt": 1,
        "timestamps.completedAt": 1,
        "timestamps.startedAt": 1,
        customer: { $arrayElemAt: ["$customer", 0] },
        serviceReport: { $arrayElemAt: ["$serviceReport", 0] },
        feedback: 1
      }
    },
    { $sort: { "timestamps.bookedAt": -1 } },
    { $skip: skip },
    { $limit: parseInt(limit) }
  ]);

  // Format the response
  const formattedServices = recentServices.map(service => ({
    id: service.bookingId,
    vehicleReg: service.vehicle.registrationNumber,
    vehicleInfo: `${service.vehicle.year} ${service.vehicle.make} ${service.vehicle.model}`,
    serviceType: service.services.join(", "),
    date: service.timestamps.bookedAt?.toISOString().split('T')[0] || '',
    status: service.status.toLowerCase().replace('_', '-'),
    cost: service.finalCost || service.serviceReport?.totalCostBreakdown?.finalTotal || 0,
    customer: service.customer?.firstName ? 
      `${service.customer.firstName} ${service.customer.lastName}` : 'Unknown',
    technician: service.serviceReport?.technician?.name || 'Not assigned',
    nextService: service.timestamps.completedAt ? 
      new Date(service.timestamps.completedAt.getTime() + 90*24*60*60*1000).toISOString().split('T')[0] : '',
    rating: service.feedback?.rating || null
  }));

  // Get total count for pagination
  const totalCount = await Booking.countDocuments(matchConditions);

  console.log(`Found ${recentServices.length} recent services, formatted: ${formattedServices.length}, total count: ${totalCount}`);

  const responseData = {
    services: formattedServices,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
      totalItems: totalCount,
      itemsPerPage: parseInt(limit)
    }
  };

  console.log('Recent services response:', responseData);

  res.status(200).json({
    success: true,
    data: responseData
  });
});

// Get top vehicles by service history
export const getTopVehicles = catchAsync(async (req, res, next) => {
  if (req.user.role !== "service_center") {
    return next(new AppError("Only service centers can access vehicle history", 403));
  }

  const serviceCenterId = req.user._id;
  const { limit = 10 } = req.query;

  const topVehicles = await Booking.aggregate([
    {
      $match: {
        serviceCenter: serviceCenterId,
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
    },
    {
      $lookup: {
        from: "users",
        localField: "vehicleOwner",
        foreignField: "_id",
        as: "customer"
      }
    },
    {
      $group: {
        _id: "$vehicle.registrationNumber",
        vehicle: { $first: "$vehicle" },
        totalServices: { $sum: 1 },
        totalSpent: { 
          $sum: { 
            $ifNull: [
              { $arrayElemAt: ["$serviceReport.totalCostBreakdown.finalTotal", 0] },
              "$finalCost"
            ]
          }
        },
        lastService: { $max: "$timestamps.completedAt" },
        customer: { $first: { $arrayElemAt: ["$customer", 0] } },
        ratings: { $push: "$feedback.rating" }
      }
    },
    {
      $project: {
        registration: "$_id",
        make: "$vehicle.make",
        model: "$vehicle.model",
        year: "$vehicle.year",
        totalServices: 1,
        totalSpent: 1,
        lastService: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$lastService"
          }
        },
        customerName: {
          $concat: [
            { $ifNull: ["$customer.firstName", ""] },
            " ",
            { $ifNull: ["$customer.lastName", ""] }
          ]
        },
        status: {
          $switch: {
            branches: [
              { case: { $gte: ["$totalServices", 10] }, then: "vip" },
              { case: { $gte: ["$totalServices", 5] }, then: "regular" },
              { case: { $lt: ["$totalServices", 5] }, then: "new" }
            ],
            default: "new"
          }
        }
      }
    },
    { $sort: { totalSpent: -1, totalServices: -1 } },
    { $limit: parseInt(limit) }
  ]);

  res.status(200).json({
    success: true,
    data: {
      vehicles: topVehicles
    }
  });
});

// Get performance analytics
export const getPerformanceAnalytics = catchAsync(async (req, res, next) => {
  if (req.user.role !== "service_center") {
    return next(new AppError("Only service centers can access analytics", 403));
  }

  const serviceCenterId = req.user._id;
  const { timeRange = "30days" } = req.query;

  // Calculate date range
  const now = new Date();
  let startDate;
  
  switch (timeRange) {
    case "7days":
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case "90days":
      startDate = new Date(now.setDate(now.getDate() - 90));
      break;
    case "1year":
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(now.setDate(now.getDate() - 30));
  }

  const [
    serviceMetrics,
    technicianPerformance,
    serviceComplexity,
    trendAnalysis
  ] = await Promise.all([
    // Service completion metrics
    Booking.aggregate([
      {
        $match: {
          serviceCenter: serviceCenterId,
          isActive: true,
          "timestamps.completedAt": { $gte: startDate }
        }
      },
      {
        $project: {
          completionRate: {
            $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0]
          },
          averageRating: "$feedback.rating"
        }
      },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          completedBookings: { $sum: "$completionRate" },
          averageRating: { $avg: "$averageRating" }
        }
      },
      {
        $project: {
          serviceCompletionRate: {
            $multiply: [{ $divide: ["$completedBookings", "$totalBookings"] }, 100]
          },
          averageRating: 1,
          totalBookings: 1
        }
      }
    ]),

    // Top technician performance
    ServiceReport.aggregate([
      {
        $match: {
          serviceCenter: serviceCenterId,
          isActive: true,
          reportGeneratedAt: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: "bookings",
          localField: "booking",
          foreignField: "_id",
          as: "booking"
        }
      },
      {
        $group: {
          _id: "$technician.name",
          totalServices: { $sum: 1 },
          totalRevenue: { $sum: "$totalCostBreakdown.finalTotal" },
          ratings: { 
            $push: { 
              $arrayElemAt: ["$booking.feedback.rating", 0] 
            }
          }
        }
      },
      {
        $project: {
          technicianName: "$_id",
          totalServices: 1,
          totalRevenue: 1,
          averageRating: {
            $avg: {
              $filter: {
                input: "$ratings",
                cond: { $ne: ["$$this", null] }
              }
            }
          }
        }
      },
      { $sort: { totalServices: -1 } },
      { $limit: 5 }
    ]),

    // Service type complexity and trends
    ServiceReport.aggregate([
      {
        $match: {
          serviceCenter: serviceCenterId,
          isActive: true,
          reportGeneratedAt: { $gte: startDate }
        }
      },
      { $unwind: "$completedServices" },
      {
        $group: {
          _id: "$completedServices.serviceName",
          totalServices: { $sum: 1 },
          averageTime: { $avg: "$completedServices.laborDetails.hoursWorked" },
          averageCost: { $avg: "$completedServices.serviceCost" },
          totalRevenue: { $sum: "$completedServices.serviceCost" }
        }
      },
      { $sort: { totalServices: -1 } }
    ]),

    // Monthly trend analysis
    ServiceReport.aggregate([
      {
        $match: {
          serviceCenter: serviceCenterId,
          isActive: true,
          reportGeneratedAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$reportGeneratedAt" },
            month: { $month: "$reportGeneratedAt" }
          },
          serviceCount: { $sum: 1 },
          revenue: { $sum: "$totalCostBreakdown.finalTotal" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ])
  ]);

  // Format technician performance data
  const formattedTechnicians = technicianPerformance.map(tech => ({
    technicianName: tech.technicianName || 'Unknown',
    totalServices: tech.totalServices,
    averageRating: Math.round((tech.averageRating || 0) * 10) / 10
  }));

  // Format service trends
  const serviceTrends = serviceComplexity.slice(0, 5).map(service => ({
    serviceName: service._id,
    totalServices: service.totalServices,
    averageTime: Math.round((service.averageTime || 0) * 10) / 10,
    averageCost: Math.round(service.averageCost || 0),
    totalRevenue: service.totalRevenue
  }));

  res.status(200).json({
    success: true,
    data: {
      performanceMetrics: {
        serviceCompletionRate: Math.round((serviceMetrics[0]?.serviceCompletionRate || 0) * 10) / 10,
        averageServiceTime: 2.5, // This would need to be calculated from actual service reports
        firstTimeFixRate: 89.2, // This would need additional logic to calculate
        customerReturnRate: Math.round((serviceMetrics[0]?.averageRating || 0) * 20) // Convert rating to percentage
      },
      topTechnicians: formattedTechnicians,
      serviceTrends,
      revenueAnalysis: {
        averageServiceValue: serviceTrends.length > 0 ? 
          Math.round(serviceTrends.reduce((sum, s) => sum + s.averageCost, 0) / serviceTrends.length) : 0,
        highestValueService: Math.max(...serviceTrends.map(s => s.averageCost), 0),
        mostProfitableCategory: serviceTrends[0]?.serviceName || "N/A",
        revenuePerVehicle: 23500 // This would need to be calculated
      }
    }
  });
});

// Get vehicle owner's vehicles list
export const getOwnerVehicles = catchAsync(async (req, res, next) => {
  // Only vehicle owners can access their vehicles
  if (req.user.role !== "vehicle_owner") {
    return next(new AppError("Only vehicle owners can access vehicle history", 403));
  }

  const ownerNIC = req.user.nicNumber;

  // Get all vehicles owned by this user
  const vehicles = await Vehicle.find({
    ownerNIC: ownerNIC,
    isActive: true
  }).select({
    registrationNumber: 1,
    make: 1,
    model: 1,
    yearOfManufacture: 1,
    currentOwner: 1,
    createdAt: 1,
    engineNumber: 1,
    chassisNumber: 1,
    color: 1,
    fuelType: 1,
    mileage: 1
  }).sort({ createdAt: -1 });

  // Format the response
  const formattedVehicles = vehicles.map(vehicle => ({
    id: vehicle._id,
    registrationNumber: vehicle.registrationNumber,
    make: vehicle.make || 'Unknown',
    model: vehicle.model || 'Unknown',
    year: vehicle.yearOfManufacture || 'Unknown',
    engineNumber: vehicle.engineNumber,
    chassisNumber: vehicle.chassisNumber,
    color: vehicle.color,
    fuelType: vehicle.fuelType,
    mileage: vehicle.mileage,
    registeredDate: vehicle.createdAt?.toISOString().split('T')[0] || 'Unknown',
    ownerName: vehicle.currentOwner?.name || req.user.fullName
  }));

  res.status(200).json({
    success: true,
    data: {
      vehicles: formattedVehicles,
      totalVehicles: formattedVehicles.length
    }
  });
});

// Get complete history for a specific vehicle
export const getVehicleCompleteHistory = catchAsync(async (req, res, next) => {
  // Only vehicle owners can access their vehicle history
  if (req.user.role !== "vehicle_owner") {
    return next(new AppError("Only vehicle owners can access vehicle history", 403));
  }

  const { vehicleId } = req.params;
  const ownerNIC = req.user.nicNumber;

  // Validate vehicle ownership
  const vehicle = await Vehicle.findOne({
    _id: vehicleId,
    ownerNIC: ownerNIC,
    isActive: true
  });

  if (!vehicle) {
    return next(new AppError("Vehicle not found or you don't have access to this vehicle", 404));
  }

  // Get all bookings for this vehicle
  const bookings = await Booking.aggregate([
    {
      $match: {
        $or: [
          { "vehicle.registrationNumber": vehicle.registrationNumber },
          { vehicleOwner: req.user._id }
        ],
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
        "timestamps.confirmedAt": 1,
        "timestamps.startedAt": 1,
        "timestamps.completedAt": 1,
        feedback: 1,
        serviceReport: { $arrayElemAt: ["$serviceReport", 0] },
        serviceCenterDetails: { $arrayElemAt: ["$serviceCenterDetails", 0] },
        specialRequests: 1,
        notes: 1
      }
    },
    { $sort: { "timestamps.bookedAt": -1 } }
  ]);

  // Get registration history (from vehicle collection)
  const registrationHistory = {
    registeredDate: vehicle.createdAt,
    registrationNumber: vehicle.registrationNumber,
    chassisNumber: vehicle.chassisNumber,
    engineNumber: vehicle.engineNumber,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.yearOfManufacture,
    engineCapacity: vehicle.cylinderCapacity,
    fuelType: vehicle.fuelType,
    transmission: vehicle.transmission,
    bodyType: vehicle.classOfVehicle,
    color: vehicle.color,
    mileage: vehicle.mileage,
    seatingCapacity: vehicle.seatingCapacity,
    weight: vehicle.weight,
    country: vehicle.country,
    ownershipHistory: vehicle.ownershipHistory || [],
    currentOwner: vehicle.currentOwner
  };

  // Format service history
  const serviceHistory = bookings.map(booking => {
    const serviceReport = booking.serviceReport;

    return {
      id: booking.bookingId,
      type: 'service',
      date: booking.timestamps.bookedAt,
      status: booking.status,
      description: booking.services.join(", "),
      serviceCenter: booking.serviceCenterDetails ?
        `${booking.serviceCenterDetails.businessInfo?.businessName || booking.serviceCenterDetails.firstName + ' ' + booking.serviceCenterDetails.lastName}` :
        'Unknown Service Center',
      cost: booking.finalCost || booking.estimatedCost || 0,
      technician: serviceReport?.technician?.name || 'Not assigned',
      completedServices: serviceReport?.completedServices || [],
      partsUsed: serviceReport?.completedServices?.flatMap(service => service.partsUsed || []) || [],
      laborDetails: serviceReport?.completedServices?.map(service => service.laborDetails) || [],
      totalCostBreakdown: serviceReport?.totalCostBreakdown || null,
      nextServiceDue: serviceReport?.nextServiceRecommendation || null,
      feedback: booking.feedback,
      specialRequests: booking.specialRequests,
      notes: booking.notes,
      timestamps: booking.timestamps,
      supportingDocuments: serviceReport?.supportingDocuments || []
    };
  });

  // Placeholder for accident history (to be implemented)
  const accidentHistory = [
    // This will be implemented when accident model is created
    // {
    //   id: 'accident_001',
    //   type: 'accident',
    //   date: '2024-01-15',
    //   description: 'Minor collision - front bumper damage',
    //   location: 'Colombo-Kandy Road, Kegalle',
    //   severity: 'Minor',
    //   insuranceClaim: 'CLM-2024-001',
    //   repairCost: 45000,
    //   status: 'Resolved'
    // }
  ];

  // Combine all history and sort by date
  const completeHistory = [
    {
      id: 'registration',
      type: 'registration',
      date: vehicle.createdAt,
      description: `Vehicle registered in the system`,
      details: registrationHistory
    },
    ...serviceHistory,
    ...accidentHistory
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calculate statistics
  const statistics = {
    totalServices: serviceHistory.length,
    totalServiceCost: serviceHistory.reduce((sum, service) => sum + (service.cost || 0), 0),
    averageServiceCost: serviceHistory.length > 0 ?
      serviceHistory.reduce((sum, service) => sum + (service.cost || 0), 0) / serviceHistory.length : 0,
    lastServiceDate: serviceHistory.length > 0 ? serviceHistory[0].date : null,
    totalAccidents: accidentHistory.length,
    averageRating: serviceHistory
      .filter(service => service.feedback?.rating)
      .reduce((sum, service, _, array) => sum + service.feedback.rating / array.length, 0) || 0,
    servicesCompleted: serviceHistory.filter(service => service.status === 'COMPLETED').length,
    servicesPending: serviceHistory.filter(service => ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(service.status)).length
  };

  res.status(200).json({
    success: true,
    data: {
      vehicle: {
        id: vehicle._id,
        registrationNumber: vehicle.registrationNumber,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.yearOfManufacture,
        engineNumber: vehicle.engineNumber,
        chassisNumber: vehicle.chassisNumber,
        color: vehicle.color,
        fuelType: vehicle.fuelType
      },
      registrationHistory,
      completeHistory,
      serviceHistory,
      accidentHistory, // Placeholder for future implementation
      statistics
    }
  });
});