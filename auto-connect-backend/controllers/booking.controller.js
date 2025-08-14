// controllers/booking.controller.js
import Booking from "../models/Booking.model.js";
import User from "../models/user.model.js";
import LOG from "../configs/log.config.js";
import { catchAsync } from "../utils/catchAsync.util.js";
import { AppError } from "../utils/appError.util.js";

// Create a new booking (Vehicle owners only)
export const createBooking = catchAsync(async (req, res, next) => {
  // Only vehicle owners can create bookings
  if (req.user.role !== "vehicle_owner") {
    return next(new AppError("Only vehicle owners can create bookings", 403));
  }

  const {
    serviceCenterId,
    vehicle,
    services,
    preferredDate,
    preferredTimeSlot,
    contactInfo,
    specialRequests,
  } = req.body;

  // Debug logging
  console.log("🔍 === BOOKING DEBUG START ===");
  console.log("📋 Received serviceCenterId:", serviceCenterId);
  console.log("📝 ServiceCenter ID type:", typeof serviceCenterId);
  console.log("📏 ServiceCenter ID length:", serviceCenterId?.length);
  console.log("🔍 === BOOKING DEBUG END ===");

  // Validate service center exists and is active
  console.log("🔍 Looking for service center with query:", {
    _id: serviceCenterId,
    role: "service_center",
    isActive: true,
    isVerified: true,
  });

  // First, let's check if the service center exists at all
  const anyServiceCenter = await User.findById(serviceCenterId);
  console.log(
    "🔍 Service center (any):",
    anyServiceCenter
      ? {
          id: anyServiceCenter._id,
          role: anyServiceCenter.role,
          isActive: anyServiceCenter.isActive,
          isVerified: anyServiceCenter.isVerified,
          email: anyServiceCenter.email,
          businessName: anyServiceCenter.businessInfo?.businessName,
        }
      : "NOT FOUND"
  );

  // Now check with the strict criteria
  const serviceCenter = await User.findOne({
    _id: serviceCenterId,
    role: "service_center",
    isActive: true,
    // Temporarily remove isVerified requirement for testing
    // isVerified: true,
  });

  console.log("🏢 Found service center:", serviceCenter ? "YES" : "NO");
  if (serviceCenter) {
    console.log("📊 Service center details:", {
      id: serviceCenter._id,
      businessName: serviceCenter.businessInfo?.businessName,
      email: serviceCenter.email,
      role: serviceCenter.role,
      isActive: serviceCenter.isActive,
      isVerified: serviceCenter.isVerified,
    });
  }

  if (!serviceCenter) {
    return next(new AppError("Service center not found or not available", 404));
  }

  // Validate preferred date is not in the past
  const selectedDate = new Date(preferredDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return next(new AppError("Preferred date cannot be in the past", 400));
  }

  // Check for existing bookings at the same time slot
  const existingBooking = await Booking.findOne({
    serviceCenter: serviceCenterId,
    preferredDate: selectedDate,
    preferredTimeSlot,
    status: { $in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] },
    isActive: true,
  });

  if (existingBooking) {
    return next(
      new AppError(
        "This time slot is not available. Please choose a different time.",
        409
      )
    );
  }

  try {
    // Generate a unique booking ID
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    const bookingId = `BK-${timestamp}-${random}`.toUpperCase();

    console.log("🚀 Creating booking with data:", {
      bookingId,
      vehicleOwner: req.user._id,
      ownerNIC: req.user.nicNumber,
      serviceCenter: serviceCenterId,
      vehicle,
      services,
      preferredDate: selectedDate,
      preferredTimeSlot,
      contactInfo,
      specialRequests,
      createdBy: req.user._id,
    });

    // Create the booking
    const newBooking = await Booking.create({
      bookingId,
      vehicleOwner: req.user._id,
      ownerNIC: req.user.nicNumber,
      serviceCenter: serviceCenterId,
      vehicle,
      services,
      preferredDate: selectedDate,
      preferredTimeSlot,
      contactInfo,
      specialRequests,
      createdBy: req.user._id,
    });

    console.log("✅ Booking created successfully:", newBooking._id);

    // Populate the booking with related data
    const populatedBooking = await Booking.findById(newBooking._id)
      .populate("vehicleOwner", "firstName lastName email phone")
      .populate(
        "serviceCenter",
        "businessInfo.businessName email phone address"
      )
      .lean();

    // Log successful booking creation
    LOG.info({
      message: "New booking created",
      bookingId: newBooking.bookingId,
      userId: req.user._id,
      serviceCenterId,
      preferredDate: selectedDate,
      services,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        booking: populatedBooking,
      },
    });
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);
    if (error.name === "ValidationError") {
      console.error("❌ Validation errors:", error.errors);
    }

    LOG.error("Error creating booking:", error);
    return next(
      new AppError("Failed to create booking. Please try again.", 500)
    );
  }
});

// Get user's bookings (Vehicle owners and Service centers)
export const getUserBookings = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build filter based on user role
  let filter = { isActive: true };

  if (req.user.role === "vehicle_owner") {
    filter.vehicleOwner = req.user._id;
  } else if (req.user.role === "service_center") {
    filter.serviceCenter = req.user._id;
  } else {
    return next(
      new AppError(
        "Only vehicle owners and service centers can view bookings",
        403
      )
    );
  }

  // Additional filters
  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.dateFrom || req.query.dateTo) {
    filter.preferredDate = {};
    if (req.query.dateFrom) {
      filter.preferredDate.$gte = new Date(req.query.dateFrom);
    }
    if (req.query.dateTo) {
      filter.preferredDate.$lte = new Date(req.query.dateTo);
    }
  }

  // Search functionality
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, "i");
    filter.$or = [
      { bookingId: searchRegex },
      { "vehicle.registrationNumber": searchRegex },
      { services: { $in: [searchRegex] } },
    ];
  }

  try {
    // Fetch bookings with pagination
    const bookings = await Booking.find(filter)
      .populate("vehicleOwner", "firstName lastName email phone nicNumber")
      .populate(
        "serviceCenter",
        "businessInfo.businessName email phone address"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalBookings = await Booking.countDocuments(filter);
    const totalPages = Math.ceil(totalBookings / limit);

    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: {
        bookings,
        pagination: {
          currentPage: page,
          totalPages,
          totalResults: totalBookings,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit,
        },
      },
    });
  } catch (error) {
    LOG.error("Error fetching bookings:", error);
    return next(
      new AppError("Failed to fetch bookings. Please try again.", 500)
    );
  }
});

// Get specific booking details
export const getBooking = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findOne({
      _id: id,
      isActive: true,
    })
      .populate("vehicleOwner", "firstName lastName email phone nicNumber")
      .populate(
        "serviceCenter",
        "businessInfo.businessName email phone address"
      )
      .lean();

    if (!booking) {
      return next(new AppError("Booking not found", 404));
    }

    // Check if user has permission to view this booking
    const canView =
      booking.vehicleOwner._id.toString() === req.user._id.toString() ||
      booking.serviceCenter._id.toString() === req.user._id.toString() ||
      req.user.role === "system_admin";

    if (!canView) {
      return next(
        new AppError("You don't have permission to view this booking", 403)
      );
    }

    res.status(200).json({
      success: true,
      message: "Booking details retrieved successfully",
      data: {
        booking,
      },
    });
  } catch (error) {
    LOG.error("Error fetching booking details:", error);
    return next(
      new AppError("Failed to fetch booking details. Please try again.", 500)
    );
  }
});

// Update booking status (Service centers only)
export const updateBookingStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status, message, proposedDate, proposedTimeSlot, estimatedDuration } =
    req.body;

  // Only service centers can update booking status
  if (req.user.role !== "service_center") {
    return next(
      new AppError("Only service centers can update booking status", 403)
    );
  }

  try {
    const booking = await Booking.findOne({
      _id: id,
      serviceCenter: req.user._id,
      isActive: true,
    });

    if (!booking) {
      return next(
        new AppError("Booking not found or you don't have permission", 404)
      );
    }

    // Update booking status and response
    booking.status = status;
    booking.lastModifiedBy = req.user._id;

    // Set appropriate timestamps
    const now = new Date();
    switch (status) {
      case "CONFIRMED":
        booking.timestamps.confirmedAt = now;
        break;
      case "IN_PROGRESS":
        booking.timestamps.startedAt = now;
        break;
      case "COMPLETED":
        booking.timestamps.completedAt = now;
        break;
      case "CANCELLED":
      case "REJECTED":
        booking.timestamps.cancelledAt = now;
        break;
    }

    // Update service center response
    if (message || proposedDate || proposedTimeSlot || estimatedDuration) {
      booking.serviceCenterResponse = {
        responseDate: now,
        message: message || booking.serviceCenterResponse?.message,
        proposedDate:
          proposedDate || booking.serviceCenterResponse?.proposedDate,
        proposedTimeSlot:
          proposedTimeSlot || booking.serviceCenterResponse?.proposedTimeSlot,
        estimatedDuration:
          estimatedDuration || booking.serviceCenterResponse?.estimatedDuration,
      };
    }

    await booking.save();

    // Populate and return updated booking
    const updatedBooking = await Booking.findById(booking._id)
      .populate("vehicleOwner", "firstName lastName email phone")
      .populate("serviceCenter", "businessInfo.businessName email phone")
      .lean();

    LOG.info({
      message: "Booking status updated",
      bookingId: booking.bookingId,
      oldStatus: booking.status,
      newStatus: status,
      serviceCenterId: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: {
        booking: updatedBooking,
      },
    });
  } catch (error) {
    LOG.error("Error updating booking status:", error);
    return next(
      new AppError("Failed to update booking status. Please try again.", 500)
    );
  }
});

// Cancel booking (Vehicle owners only)
export const cancelBooking = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { reason } = req.body;

  // Only vehicle owners can cancel their bookings
  if (req.user.role !== "vehicle_owner") {
    return next(new AppError("Only vehicle owners can cancel bookings", 403));
  }

  try {
    const booking = await Booking.findOne({
      _id: id,
      vehicleOwner: req.user._id,
      isActive: true,
    });

    if (!booking) {
      return next(
        new AppError("Booking not found or you don't have permission", 404)
      );
    }

    // Check if booking can be cancelled
    if (!booking.canBeCancelled()) {
      return next(
        new AppError(
          "Booking cannot be cancelled. It may already be in progress or completed.",
          400
        )
      );
    }

    // Update booking
    booking.status = "CANCELLED";
    booking.timestamps.cancelledAt = new Date();
    booking.notes = reason
      ? `Cancelled by customer: ${reason}`
      : "Cancelled by customer";
    booking.lastModifiedBy = req.user._id;

    await booking.save();

    LOG.info({
      message: "Booking cancelled by customer",
      bookingId: booking.bookingId,
      userId: req.user._id,
      reason: reason || "No reason provided",
    });

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: {
        bookingId: booking.bookingId,
      },
    });
  } catch (error) {
    LOG.error("Error cancelling booking:", error);
    return next(
      new AppError("Failed to cancel booking. Please try again.", 500)
    );
  }
});

// Submit feedback for completed booking (Vehicle owners only)
export const submitFeedback = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  // Only vehicle owners can submit feedback
  if (req.user.role !== "vehicle_owner") {
    return next(new AppError("Only vehicle owners can submit feedback", 403));
  }

  try {
    const booking = await Booking.findOne({
      _id: id,
      vehicleOwner: req.user._id,
      status: "COMPLETED",
      isActive: true,
    });

    if (!booking) {
      return next(
        new AppError("Booking not found or not eligible for feedback", 404)
      );
    }

    // Check if feedback already exists
    if (booking.feedback?.rating) {
      return next(new AppError("Feedback has already been submitted", 400));
    }

    // Add feedback
    booking.feedback = {
      rating,
      comment,
      submittedAt: new Date(),
    };

    await booking.save();

    // Update service center's overall rating
    await updateServiceCenterRating(booking.serviceCenter, rating);

    LOG.info({
      message: "Feedback submitted for booking",
      bookingId: booking.bookingId,
      userId: req.user._id,
      rating,
    });

    res.status(200).json({
      success: true,
      message: "Feedback submitted successfully",
      data: {
        feedback: booking.feedback,
      },
    });
  } catch (error) {
    LOG.error("Error submitting feedback:", error);
    return next(
      new AppError("Failed to submit feedback. Please try again.", 500)
    );
  }
});

// Helper function to update service center rating
async function updateServiceCenterRating(serviceCenterId, newRating) {
  try {
    // Get all completed bookings with feedback for this service center
    const bookingsWithFeedback = await Booking.find({
      serviceCenter: serviceCenterId,
      status: "COMPLETED",
      "feedback.rating": { $exists: true },
      isActive: true,
    }).select("feedback.rating");

    if (bookingsWithFeedback.length > 0) {
      const totalRating = bookingsWithFeedback.reduce(
        (sum, booking) => sum + booking.feedback.rating,
        0
      );
      const averageRating = totalRating / bookingsWithFeedback.length;

      // Update service center's rating
      await User.findByIdAndUpdate(serviceCenterId, {
        $set: {
          "rating.average": Math.round(averageRating * 10) / 10, // Round to 1 decimal
          "rating.totalReviews": bookingsWithFeedback.length,
        },
      });
    }
  } catch (error) {
    LOG.error("Error updating service center rating:", error);
  }
}

// Get booking statistics
export const getBookingStats = catchAsync(async (req, res, next) => {
  let matchFilter = { isActive: true };

  // Filter based on user role
  if (req.user.role === "vehicle_owner") {
    matchFilter.vehicleOwner = req.user._id;
  } else if (req.user.role === "service_center") {
    matchFilter.serviceCenter = req.user._id;
  } else if (req.user.role !== "system_admin") {
    return next(new AppError("Unauthorized to view booking statistics", 403));
  }

  try {
    const stats = await Booking.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          pendingBookings: {
            $sum: { $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0] },
          },
          confirmedBookings: {
            $sum: { $cond: [{ $eq: ["$status", "CONFIRMED"] }, 1, 0] },
          },
          completedBookings: {
            $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] },
          },
          cancelledBookings: {
            $sum: { $cond: [{ $eq: ["$status", "CANCELLED"] }, 1, 0] },
          },
          averageRating: { $avg: "$feedback.rating" },
          totalRevenue: { $sum: "$finalCost" },
        },
      },
    ]);

    const result = stats[0] || {
      totalBookings: 0,
      pendingBookings: 0,
      confirmedBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
      averageRating: 0,
      totalRevenue: 0,
    };

    res.status(200).json({
      success: true,
      message: "Booking statistics retrieved successfully",
      data: result,
    });
  } catch (error) {
    LOG.error("Error fetching booking statistics:", error);
    return next(new AppError("Failed to fetch booking statistics", 500));
  }
});

// Get available time slots for a specific date and service center
export const getAvailableTimeSlots = catchAsync(async (req, res, next) => {
  const { serviceCenterId, date } = req.query;

  if (!serviceCenterId || !date) {
    return next(new AppError("Service center ID and date are required", 400));
  }

  // Validate service center exists
  const serviceCenter = await User.findOne({
    _id: serviceCenterId,
    role: "service_center",
    isActive: true,
  });

  if (!serviceCenter) {
    return next(new AppError("Service center not found", 404));
  }

  // Validate date is not in the past
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return next(new AppError("Date cannot be in the past", 400));
  }

  try {
    // Get all booked time slots for this date and service center
    const bookedSlots = await Booking.find({
      serviceCenter: serviceCenterId,
      preferredDate: selectedDate,
      status: { $in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] },
      isActive: true,
    }).select("preferredTimeSlot");

    const bookedTimeSlots = bookedSlots.map(
      (booking) => booking.preferredTimeSlot
    );

    // All available time slots
    // Import TimeSlot model dynamically to avoid circular dependency
    const { default: TimeSlot } = await import("../models/TimeSlot.model.js");

    try {
      // Get available slots using the TimeSlot model
      const availableSlots = await TimeSlot.getAvailableSlots(
        serviceCenterId,
        selectedDate
      );

      const dayOfWeek = [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
      ][selectedDate.getDay()];

      // Filter out booked slots and format response
      const availableTimeSlots = availableSlots
        .filter((slot) => !bookedTimeSlots.includes(slot.timeRange))
        .map((slot) => slot.timeRange);

      console.log("TimeSlot system - Available slots result:", {
        date: selectedDate,
        dayOfWeek,
        totalSlots: availableSlots.length,
        bookedSlots: bookedTimeSlots.length,
        availableSlots: availableTimeSlots.length,
      });

      // Filter out booked slots
      const finalAvailableSlots =
        availableTimeSlots.length > 0 ? availableTimeSlots : [];

      res.status(200).json({
        success: true,
        message: "Available time slots retrieved successfully",
        data: {
          date: selectedDate,
          serviceCenterId,
          availableSlots: finalAvailableSlots,
          bookedSlots: bookedTimeSlots,
          totalAvailable: finalAvailableSlots.length,
        },
      });

      LOG.info({
        message: "Available time slots retrieved via TimeSlot system",
        serviceCenterId,
        date,
        availableSlots: finalAvailableSlots.length,
      });
    } catch (timeSlotError) {
      console.log(
        "TimeSlot system failed, using fallback:",
        timeSlotError.message
      );

      // Fallback to default slots if TimeSlot system fails
      const allTimeSlots = [
        "09:00-11:00",
        "11:00-13:00",
        "13:00-15:00",
        "15:00-17:00",
      ];

      // Filter out booked slots
      const availableSlots = allTimeSlots.filter(
        (slot) => !bookedTimeSlots.includes(slot)
      );

      res.status(200).json({
        success: true,
        message: "Available time slots retrieved successfully (fallback)",
        data: {
          date: selectedDate,
          serviceCenterId,
          availableSlots,
          bookedSlots: bookedTimeSlots,
          totalAvailable: availableSlots.length,
        },
      });

      LOG.info({
        message: "Available time slots retrieved (fallback system)",
        serviceCenterId,
        date,
        availableSlots: availableSlots.length,
      });
    }
  } catch (error) {
    LOG.error("Error fetching available time slots:", error);
    return next(new AppError("Failed to fetch available time slots", 500));
  }
});

export default {
  createBooking,
  getUserBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking,
  submitFeedback,
  getBookingStats,
  getAvailableTimeSlots,
};
