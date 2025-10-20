// controllers/reviews.controller.js
import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";
import LOG from "../configs/log.config.js";
import { catchAsync } from "../utils/catchAsync.util.js";
import { AppError } from "../utils/appError.util.js";

// Get all reviews for a service center (Service centers only)
export const getServiceCenterReviews = catchAsync(async (req, res, next) => {
  // Only service centers can access their reviews
  if (req.user.role !== "service_center") {
    return next(
      new AppError("Only service centers can access reviews", 403)
    );
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  // Filter by rating if provided
  let matchFilter = {
    serviceCenter: req.user._id,
    status: "COMPLETED",
    "feedback.rating": { $exists: true },
    isActive: true,
  };

  if (req.query.rating) {
    matchFilter["feedback.rating"] = parseInt(req.query.rating);
  }

  if (req.query.minRating) {
    matchFilter["feedback.rating"] = {
      ...matchFilter["feedback.rating"],
      $gte: parseInt(req.query.minRating),
    };
  }

  // Date filter
  if (req.query.dateFrom || req.query.dateTo) {
    matchFilter["feedback.submittedAt"] = {};
    if (req.query.dateFrom) {
      matchFilter["feedback.submittedAt"].$gte = new Date(req.query.dateFrom);
    }
    if (req.query.dateTo) {
      matchFilter["feedback.submittedAt"].$lte = new Date(req.query.dateTo);
    }
  }

  try {
    // Fetch reviews with pagination
    const reviews = await Booking.find(matchFilter)
      .populate("vehicleOwner", "firstName lastName email")
      .populate("serviceCenter", "businessInfo.businessName")
      .select(
        "bookingId vehicle services feedback timestamps.completedAt finalCost"
      )
      .sort({ "feedback.submittedAt": -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalReviews = await Booking.countDocuments(matchFilter);
    const totalPages = Math.ceil(totalReviews / limit);

    // Calculate rating statistics
    const ratingStats = await Booking.aggregate([
      {
        $match: {
          serviceCenter: req.user._id,
          status: "COMPLETED",
          "feedback.rating": { $exists: true },
          isActive: true,
        },
      },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: "$feedback.rating" },
          fiveStars: {
            $sum: { $cond: [{ $eq: ["$feedback.rating", 5] }, 1, 0] },
          },
          fourStars: {
            $sum: { $cond: [{ $eq: ["$feedback.rating", 4] }, 1, 0] },
          },
          threeStars: {
            $sum: { $cond: [{ $eq: ["$feedback.rating", 3] }, 1, 0] },
          },
          twoStars: {
            $sum: { $cond: [{ $eq: ["$feedback.rating", 2] }, 1, 0] },
          },
          oneStar: {
            $sum: { $cond: [{ $eq: ["$feedback.rating", 1] }, 1, 0] },
          },
        },
      },
    ]);

    const stats = ratingStats[0] || {
      totalReviews: 0,
      averageRating: 0,
      fiveStars: 0,
      fourStars: 0,
      threeStars: 0,
      twoStars: 0,
      oneStar: 0,
    };

    // Format reviews for response
    const formattedReviews = reviews.map((review) => ({
      id: review._id,
      bookingId: review.bookingId,
      customerName: review.vehicleOwner
        ? `${review.vehicleOwner.firstName} ${review.vehicleOwner.lastName}`
        : "Unknown Customer",
      customerEmail: review.vehicleOwner?.email || "",
      vehicle: {
        registrationNumber: review.vehicle?.registrationNumber || "",
        make: review.vehicle?.make || "",
        model: review.vehicle?.model || "",
        year: review.vehicle?.year || "",
      },
      services: review.services || [],
      rating: review.feedback?.rating || 0,
      comment: review.feedback?.comment || "",
      submittedAt: review.feedback?.submittedAt || review.timestamps?.completedAt,
      completedAt: review.timestamps?.completedAt,
      finalCost: review.finalCost || 0,
    }));

    res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully",
      data: {
        reviews: formattedReviews,
        stats: {
          totalReviews: stats.totalReviews,
          averageRating: Math.round(stats.averageRating * 10) / 10,
          distribution: {
            5: stats.fiveStars,
            4: stats.fourStars,
            3: stats.threeStars,
            2: stats.twoStars,
            1: stats.oneStar,
          },
          percentages: {
            5: stats.totalReviews > 0 ? Math.round((stats.fiveStars / stats.totalReviews) * 100) : 0,
            4: stats.totalReviews > 0 ? Math.round((stats.fourStars / stats.totalReviews) * 100) : 0,
            3: stats.totalReviews > 0 ? Math.round((stats.threeStars / stats.totalReviews) * 100) : 0,
            2: stats.totalReviews > 0 ? Math.round((stats.twoStars / stats.totalReviews) * 100) : 0,
            1: stats.totalReviews > 0 ? Math.round((stats.oneStar / stats.totalReviews) * 100) : 0,
          },
        },
        pagination: {
          currentPage: page,
          totalPages,
          totalResults: totalReviews,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit,
        },
      },
    });

    LOG.info({
      message: "Reviews retrieved",
      serviceCenterId: req.user._id,
      totalReviews,
      averageRating: stats.averageRating,
    });
  } catch (error) {
    LOG.error("Error fetching reviews:", error);
    return next(new AppError("Failed to fetch reviews. Please try again.", 500));
  }
});

export default {
  getServiceCenterReviews,
};
