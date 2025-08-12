// controllers/serviceCenter.controller.js
import User from "../models/user.model.js";
import LOG from "../configs/log.config.js";
import { catchAsync } from "../utils/catchAsync.util.js";
import { AppError } from "../utils/appError.util.js";

// Get all service centers for vehicle owners to book services
export const getServiceCenters = catchAsync(async (req, res, next) => {
  // Only vehicle owners should access this endpoint
  if (req.user.role !== "vehicle_owner") {
    return next(
      new AppError("Only vehicle owners can view service centers", 403)
    );
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build filter object for service centers
  const filter = {
    role: "service_center",
    isActive: true,
    //isVerified: true, // Only show verified service centers
  };

  // Search functionality
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, "i");
    filter.$or = [
      { "businessInfo.businessName": searchRegex },
      { "address.city": searchRegex },
      { "address.district": searchRegex },
      { phone: searchRegex },
      { "businessInfo.servicesOffered": { $in: [searchRegex] } },
    ];
  }

  // Filter by service category
  if (
    req.query.serviceCategory &&
    req.query.serviceCategory !== "All Categories"
  ) {
    filter["businessInfo.servicesOffered"] = {
      $regex: new RegExp(req.query.serviceCategory, "i"),
    };
  }

  // Filter by location (city/district)
  if (req.query.location) {
    const locationRegex = new RegExp(req.query.location, "i");
    filter.$or = [
      { "address.city": locationRegex },
      { "address.district": locationRegex },
    ];
  }

  // Sort options
  let sortOption = { createdAt: -1 }; // Default: newest first

  if (req.query.sortBy) {
    switch (req.query.sortBy) {
      case "rating":
        sortOption = { "rating.average": -1 };
        break;
      case "reviews":
        sortOption = { "rating.totalReviews": -1 };
        break;
      case "name":
        sortOption = { "businessInfo.businessName": 1 };
        break;
      case "location":
        sortOption = { "address.city": 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
  }

  try {
    // Fetch service centers with pagination
    const serviceCenters = await User.find(filter)
      .select(
        "firstName lastName email phone businessInfo address rating createdAt profileImage isVerified"
      )
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalCenters = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalCenters / limit);

    // Transform data to match frontend expectations
    const transformedCenters = serviceCenters.map((center, index) => ({
      id: center._id,
      name:
        center.businessInfo?.businessName ||
        `${center.firstName} ${center.lastName}`,
      location: `${center.address?.city || "N/A"}, ${
        center.address?.district || "N/A"
      }`,
      phone: center.phone || "N/A",
      rating: center.rating?.average || 0,
      reviews: center.rating?.totalReviews || 0,
      serviceCategories: categorizeServices(
        center.businessInfo?.servicesOffered || []
      ),
      services: center.businessInfo?.servicesOffered || [],
      onTime: "95%", // Default value - you can implement this based on booking history
      cost: "Rs. 8,500", // Default value - you can implement dynamic pricing
      waitTime: "2 days", // Default value - you can implement based on availability
      verified: center.isVerified,
      premium: center.rating?.average >= 4.5, // Premium if rating is high
      profileImage: center.profileImage,
      licenseNumber: center.businessInfo?.licenseNumber,
      businessRegistrationNumber:
        center.businessInfo?.businessRegistrationNumber,
      address: center.address,
      joinedDate: center.createdAt,
    }));

    // Log successful request
    LOG.info({
      message: "Service centers fetched successfully",
      userId: req.user._id,
      filtersApplied: {
        search: req.query.search || null,
        serviceCategory: req.query.serviceCategory || null,
        location: req.query.location || null,
        sortBy: req.query.sortBy || null,
      },
      resultCount: transformedCenters.length,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      message: "Service centers retrieved successfully",
      data: {
        serviceCenters: transformedCenters,
        pagination: {
          currentPage: page,
          totalPages,
          totalResults: totalCenters,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit,
        },
        filters: {
          search: req.query.search || null,
          serviceCategory: req.query.serviceCategory || null,
          location: req.query.location || null,
          sortBy: req.query.sortBy || null,
        },
      },
    });
  } catch (error) {
    LOG.error("Error fetching service centers:", error);
    return next(
      new AppError("Failed to fetch service centers. Please try again.", 500)
    );
  }
});

// Get a specific service center by ID
export const getServiceCenter = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Only vehicle owners should access this endpoint
  if (req.user.role !== "vehicle_owner") {
    return next(
      new AppError("Only vehicle owners can view service center details", 403)
    );
  }

  try {
    const serviceCenter = await User.findOne({
      _id: id,
      role: "service_center",
      isActive: true,
    })
      .select(
        "firstName lastName email phone businessInfo address rating createdAt profileImage isVerified"
      )
      .lean();

    if (!serviceCenter) {
      return next(new AppError("Service center not found", 404));
    }

    // Transform data for frontend
    const transformedCenter = {
      id: serviceCenter._id,
      name:
        serviceCenter.businessInfo?.businessName ||
        `${serviceCenter.firstName} ${serviceCenter.lastName}`,
      location: `${serviceCenter.address?.city || "N/A"}, ${
        serviceCenter.address?.district || "N/A"
      }`,
      phone: serviceCenter.phone || "N/A",
      email: serviceCenter.email,
      rating: serviceCenter.rating?.average || 0,
      reviews: serviceCenter.rating?.totalReviews || 0,
      serviceCategories: categorizeServices(
        serviceCenter.businessInfo?.servicesOffered || []
      ),
      services: serviceCenter.businessInfo?.servicesOffered || [],
      verified: serviceCenter.isVerified,
      premium: serviceCenter.rating?.average >= 4.5,
      profileImage: serviceCenter.profileImage,
      businessInfo: serviceCenter.businessInfo,
      address: serviceCenter.address,
      joinedDate: serviceCenter.createdAt,
    };

    LOG.info({
      message: "Service center details fetched",
      userId: req.user._id,
      serviceCenterId: id,
    });

    res.status(200).json({
      success: true,
      message: "Service center details retrieved successfully",
      data: {
        serviceCenter: transformedCenter,
      },
    });
  } catch (error) {
    LOG.error("Error fetching service center details:", error);
    return next(
      new AppError(
        "Failed to fetch service center details. Please try again.",
        500
      )
    );
  }
});

// Get service categories (for filtering)
export const getServiceCategories = catchAsync(async (req, res, next) => {
  try {
    // Get all unique services offered by verified service centers
    const serviceCenters = await User.find({
      role: "service_center",
      isActive: true,
      isVerified: true,
    })
      .select("businessInfo.servicesOffered")
      .lean();

    // Extract and categorize all services
    const allServices = serviceCenters
      .flatMap((center) => center.businessInfo?.servicesOffered || [])
      .filter((service) => service && service.trim());

    // Create unique categories
    const uniqueServices = [...new Set(allServices)];
    const categories = categorizeAllServices(uniqueServices);

    res.status(200).json({
      success: true,
      message: "Service categories retrieved successfully",
      data: {
        categories: ["All Categories", ...categories],
        allServices: uniqueServices.sort(),
      },
    });
  } catch (error) {
    LOG.error("Error fetching service categories:", error);
    return next(new AppError("Failed to fetch service categories", 500));
  }
});

// Helper function to categorize services
function categorizeServices(services) {
  if (!services || !Array.isArray(services)) return [];

  const categories = [];
  const maintenanceServices = [
    "oil change",
    "brake service",
    "ac service",
    "tire service",
    "full service",
    "ac checkup",
    "coolant flush",
    "transmission service",
    "battery service",
    "diagnostic scan",
    "body wash",
    "waxing",
    "interior vacuuming",
    "interior detailing",
  ];

  const repairServices = [
    "engine repair",
    "engine overhaul",
    "suspension repair",
    "suspension alignment",
    "wheel alignment",
    "wheel balancing",
    "battery replacement",
    "engine tuning",
    "brake pad replacement",
  ];

  const emissionServices = [
    "emission testing",
    "emission test",
    "tuning",
    "hybrid diagnostics",
  ];

  // Check which categories this service center offers
  const lowerServices = services.map((s) => s.toLowerCase());

  if (
    lowerServices.some((service) =>
      maintenanceServices.some((ms) => service.includes(ms))
    )
  ) {
    categories.push("Vehicle Maintenance");
  }

  if (
    lowerServices.some((service) =>
      repairServices.some((rs) => service.includes(rs))
    )
  ) {
    categories.push("Vehicle Repair");
  }

  if (
    lowerServices.some((service) =>
      emissionServices.some((es) => service.includes(es))
    )
  ) {
    categories.push("Emission Testing");
  }

  return categories.length > 0 ? categories : ["General Services"];
}

// Helper function to categorize all services
function categorizeAllServices(services) {
  const categories = new Set();

  services.forEach((service) => {
    const serviceCats = categorizeServices([service]);
    serviceCats.forEach((cat) => categories.add(cat));
  });

  return Array.from(categories).sort();
}

// Get service center statistics (for dashboard)
export const getServiceCenterStats = catchAsync(async (req, res, next) => {
  try {
    const stats = await User.aggregate([
      {
        $match: {
          role: "service_center",
          isActive: true,
        },
      },
      {
        $group: {
          _id: null,
          totalCenters: { $sum: 1 },
          verifiedCenters: {
            $sum: { $cond: [{ $eq: ["$isVerified", true] }, 1, 0] },
          },
          averageRating: { $avg: "$rating.average" },
          totalReviews: { $sum: "$rating.totalReviews" },
        },
      },
    ]);

    const result = stats[0] || {
      totalCenters: 0,
      verifiedCenters: 0,
      averageRating: 0,
      totalReviews: 0,
    };

    res.status(200).json({
      success: true,
      message: "Service center statistics retrieved successfully",
      data: result,
    });
  } catch (error) {
    LOG.error("Error fetching service center stats:", error);
    return next(new AppError("Failed to fetch service center statistics", 500));
  }
});

export default {
  getServiceCenters,
  getServiceCenter,
  getServiceCategories,
  getServiceCenterStats,
};
