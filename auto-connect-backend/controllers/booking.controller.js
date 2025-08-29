// controllers/booking.controller.js
import Booking from "../models/booking.model.js";
import ServiceReport from "../models/ServiceReport.model.js";
import User from "../models/user.model.js";
import LOG from "../configs/log.config.js";
import { catchAsync } from "../utils/catchAsync.util.js";
import { AppError } from "../utils/appError.util.js";
import { sendEmail } from "../utils/email.util.js";

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

  // Validate time slot for today - cannot book past time slots
  const isToday = selectedDate.getTime() === today.getTime();
  if (isToday) {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Parse the time slot (could be HH:MM or HH:MM-HH:MM format)
    let slotStartTime;
    if (preferredTimeSlot.includes("-")) {
      // Format: HH:MM-HH:MM (take the start time)
      slotStartTime = preferredTimeSlot.split("-")[0];
    } else {
      // Format: HH:MM
      slotStartTime = preferredTimeSlot;
    }

    const [slotHour, slotMinute] = slotStartTime.split(":").map(Number);
    const slotTime = slotHour * 60 + slotMinute;

    if (slotTime <= currentTime) {
      return next(
        new AppError(
          "Cannot book a time slot that has already passed today. Please select a future time slot.",
          400
        )
      );
    }
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
    // Special handling: CONFIRMED automatically progresses to IN_PROGRESS
    if (status === "CONFIRMED") {
      booking.status = "IN_PROGRESS";
      booking.timestamps.confirmedAt = new Date();
      booking.timestamps.startedAt = new Date();
    } else {
      booking.status = status;
      
      // Set appropriate timestamps
      const now = new Date();
      switch (status) {
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
    }
    
    booking.lastModifiedBy = req.user._id;

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

    // Send email notification to customer
    if (updatedBooking.vehicleOwner && updatedBooking.vehicleOwner.email) {
      try {
        await sendBookingStatusUpdateEmail(updatedBooking, status, message);
      } catch (emailError) {
        LOG.error("Failed to send email notification:", emailError);
        // Don't fail the request if email fails
      }
    }

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

// Submit service completion report (Service centers only)
export const submitServiceCompletionReport = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    completedServices,
    additionalWork,
    totalCostBreakdown,
    workStartTime,
    workEndTime,
    totalTimeSpent,
    vehicleCondition,
    technician,
    qualityCheck,
    recommendations,
    customerNotification,
  } = req.body;

  // Only service centers can submit completion reports
  if (req.user.role !== "service_center") {
    return next(
      new AppError("Only service centers can submit completion reports", 403)
    );
  }

  try {
    const booking = await Booking.findOne({
      _id: id,
      serviceCenter: req.user._id,
      status: "IN_PROGRESS",
      isActive: true,
    });

    if (!booking) {
      return next(
        new AppError(
          "Booking not found, not in progress, or you don't have permission",
          404
        )
      );
    }

    // Check if service report already exists
    const existingReport = await ServiceReport.findOne({ booking: id });
    if (existingReport) {
      return next(new AppError("Service report already exists for this booking", 400));
    }

    // Validate required fields
    if (!completedServices || !Array.isArray(completedServices) || completedServices.length === 0) {
      return next(new AppError("At least one completed service is required", 400));
    }

    if (!technician || !technician.name) {
      return next(new AppError("Technician information is required", 400));
    }

    if (!workStartTime || !workEndTime) {
      return next(new AppError("Work start and end times are required", 400));
    }

    // Validate and calculate totals
    let calculatedPartsTotal = 0;
    let calculatedLaborTotal = 0;
    let calculatedServicesTotal = 0;
    let calculatedAdditionalWorkTotal = 0;

    // Calculate parts and labor totals from completed services
    completedServices.forEach(service => {
      if (service.partsUsed && Array.isArray(service.partsUsed)) {
        service.partsUsed.forEach(part => {
          calculatedPartsTotal += parseFloat(part.totalPrice) || 0;
        });
      }
      if (service.laborDetails) {
        calculatedLaborTotal += parseFloat(service.laborDetails.laborCost) || 0;
      }
      calculatedServicesTotal += parseFloat(service.serviceCost) || 0;
    });

    // Calculate additional work total
    if (additionalWork && Array.isArray(additionalWork)) {
      additionalWork.forEach(work => {
        calculatedAdditionalWorkTotal += parseFloat(work.cost) || 0;
      });
    }

    // Calculate final total
    const providedBreakdown = totalCostBreakdown || {};
    const calculatedFinalTotal = 
      calculatedPartsTotal + 
      calculatedLaborTotal + 
      calculatedServicesTotal + 
      calculatedAdditionalWorkTotal + 
      (parseFloat(providedBreakdown.taxes) || 0) - 
      (parseFloat(providedBreakdown.discount) || 0);

    // Create the service report
    const serviceReport = await ServiceReport.create({
      booking: booking._id,
      serviceCenter: req.user._id,
      vehicle: {
        registrationNumber: booking.vehicle.registrationNumber,
        make: booking.vehicle.make,
        model: booking.vehicle.model,
        year: booking.vehicle.year,
      },
      completedServices: completedServices.map(service => ({
        serviceName: service.serviceName,
        description: service.description || '',
        partsUsed: service.partsUsed || [],
        laborDetails: service.laborDetails || { hoursWorked: 0, laborRate: 0, laborCost: 0 },
        serviceCost: parseFloat(service.serviceCost) || 0,
        serviceStatus: service.serviceStatus || 'COMPLETED',
        notes: service.notes || '',
      })),
      additionalWork: additionalWork || [],
      totalCostBreakdown: {
        partsTotal: calculatedPartsTotal,
        laborTotal: calculatedLaborTotal,
        servicesTotal: calculatedServicesTotal,
        additionalWorkTotal: calculatedAdditionalWorkTotal,
        taxes: parseFloat(providedBreakdown.taxes) || 0,
        discount: parseFloat(providedBreakdown.discount) || 0,
        finalTotal: calculatedFinalTotal,
      },
      workStartTime: new Date(workStartTime),
      workEndTime: new Date(workEndTime),
      totalTimeSpent: totalTimeSpent || '',
      vehicleCondition: vehicleCondition || {},
      technician: {
        name: technician.name,
        employeeId: technician.employeeId || '',
        signature: technician.signature || '',
      },
      qualityCheck: qualityCheck || { performed: false },
      recommendations: recommendations || [],
      customerNotification: customerNotification || { notified: false },
      reportGeneratedBy: req.user._id,
    });

    // Update booking with service report reference and status
    booking.serviceReport = serviceReport._id;
    booking.status = "COMPLETED";
    booking.finalCost = calculatedFinalTotal;
    booking.timestamps.completedAt = new Date();
    booking.lastModifiedBy = req.user._id;

    await booking.save();

    // Populate and return updated booking
    const updatedBooking = await Booking.findById(booking._id)
      .populate("vehicleOwner", "firstName lastName email phone")
      .populate("serviceCenter", "businessInfo.businessName email phone")
      .populate("serviceReport")
      .lean();

    // Send completion notification email to customer
    if (updatedBooking.vehicleOwner && updatedBooking.vehicleOwner.email) {
      try {
        await sendServiceCompletionEmail(updatedBooking);
      } catch (emailError) {
        LOG.error("Failed to send service completion email:", emailError);
        // Don't fail the request if email fails
      }
    }

    LOG.info({
      message: "Service completion report submitted",
      bookingId: booking.bookingId,
      serviceReportId: serviceReport.reportId,
      serviceCenterId: req.user._id,
      finalCost: calculatedFinalTotal,
    });

    res.status(200).json({
      success: true,
      message: "Service completion report submitted successfully",
      data: {
        booking: updatedBooking,
        serviceReport: serviceReport,
      },
    });
  } catch (error) {
    LOG.error("Error submitting service completion report:", error);
    return next(
      new AppError("Failed to submit completion report. Please try again.", 500)
    );
  }
});

// Get service completion report (both service centers and vehicle owners)
export const getServiceCompletionReport = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  try {
    // First find the booking to check permissions
    const booking = await Booking.findOne({
      _id: id,
      status: "COMPLETED",
      isActive: true,
    })
      .populate("vehicleOwner", "firstName lastName email phone nicNumber")
      .populate("serviceCenter", "businessInfo.businessName email phone address")
      .lean();

    if (!booking) {
      return next(new AppError("Completed booking not found", 404));
    }

    // Check if user has permission to view this report
    const canView =
      booking.vehicleOwner._id.toString() === req.user._id.toString() ||
      booking.serviceCenter._id.toString() === req.user._id.toString() ||
      req.user.role === "system_admin";

    if (!canView) {
      return next(
        new AppError("You don't have permission to view this report", 403)
      );
    }

    // Get the service report
    const serviceReport = await ServiceReport.findOne({
      booking: id,
      isActive: true,
    })
      .populate("reportGeneratedBy", "firstName lastName businessInfo.businessName")
      .lean();

    if (!serviceReport) {
      return next(new AppError("Service completion report not available", 404));
    }

    res.status(200).json({
      success: true,
      message: "Service completion report retrieved successfully",
      data: {
        booking: booking,
        serviceReport: serviceReport,
      },
    });
  } catch (error) {
    LOG.error("Error fetching service completion report:", error);
    return next(
      new AppError("Failed to fetch completion report. Please try again.", 500)
    );
  }
});

// Helper function to send service completion notification email
const sendServiceCompletionEmail = async (booking) => {
  const customerName = `${booking.vehicleOwner.firstName} ${booking.vehicleOwner.lastName}`;
  const serviceCenterName =
    booking.serviceCenter.businessInfo?.businessName || "Service Center";
  
  const subject = `Service Completed - ${booking.bookingId}`;

  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4CAF50;">Service Completed Successfully!</h2>
      
      <p>Dear ${customerName},</p>
      
      <p>Great news! Your vehicle service has been completed successfully.</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Service Summary:</h3>
        <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
        <p><strong>Service Center:</strong> ${serviceCenterName}</p>
        <p><strong>Vehicle:</strong> ${booking.vehicle.registrationNumber} (${booking.vehicle.make} ${booking.vehicle.model})</p>
        <p><strong>Completion Date:</strong> ${new Date(booking.timestamps.completedAt).toLocaleDateString()}</p>
        <p><strong>Final Cost:</strong> LKR ${booking.finalCost?.toLocaleString() || 'N/A'}</p>
      </div>
      
      <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h4>What's Next?</h4>
        <ul>
          <li>You can view the detailed service report in your dashboard</li>
          <li>Please rate your experience to help us improve</li>
          <li>Contact the service center if you have any questions</li>
        </ul>
      </div>
      
      <p>Your vehicle is ready for pickup. Please contact the service center to arrange collection:</p>
      <p><strong>Phone:</strong> ${booking.serviceCenter.phone || "Not provided"}</p>
      <p><strong>Email:</strong> ${booking.serviceCenter.email}</p>
      
      <hr style="margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">
        This is an automated notification from AutoConnect. Please do not reply to this email.
      </p>
    </div>
  `;

  await sendEmail({
    email: booking.vehicleOwner.email,
    subject: subject,
    html: emailContent,
    message: `Your vehicle service (${booking.bookingId}) has been completed successfully. Final cost: LKR ${booking.finalCost?.toLocaleString() || 'N/A'}`,
  });
};

// Helper function to send booking status update email
const sendBookingStatusUpdateEmail = async (booking, status, message) => {
  const customerName = `${booking.vehicleOwner.firstName} ${booking.vehicleOwner.lastName}`;
  const serviceCenterName =
    booking.serviceCenter.businessInfo?.businessName || "Service Center";

  const statusMessages = {
    CONFIRMED: "Your booking has been confirmed!",
    IN_PROGRESS: "Work has started on your vehicle",
    COMPLETED: "Your vehicle service has been completed",
    REJECTED: "Your booking has been rejected",
    CANCELLED: "Your booking has been cancelled",
  };

  const subject = `Booking Update - ${booking.bookingId}`;

  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2196F3;">Booking Status Update</h2>
      
      <p>Dear ${customerName},</p>
      
      <p>${statusMessages[status] || "Your booking status has been updated"}</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Booking Details:</h3>
        <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
        <p><strong>Service Center:</strong> ${serviceCenterName}</p>
        <p><strong>Vehicle:</strong> ${booking.vehicle.registrationNumber} (${
    booking.vehicle.make
  } ${booking.vehicle.model})</p>
        <p><strong>New Status:</strong> <span style="color: #4CAF50; font-weight: bold;">${status}</span></p>
        ${
          booking.serviceCenterResponse?.proposedDate
            ? `<p><strong>Proposed Date:</strong> ${new Date(
                booking.serviceCenterResponse.proposedDate
              ).toLocaleDateString()}</p>`
            : ""
        }
        ${
          booking.serviceCenterResponse?.proposedTimeSlot
            ? `<p><strong>Proposed Time:</strong> ${booking.serviceCenterResponse.proposedTimeSlot}</p>`
            : ""
        }
        ${
          booking.serviceCenterResponse?.estimatedDuration
            ? `<p><strong>Estimated Duration:</strong> ${booking.serviceCenterResponse.estimatedDuration}</p>`
            : ""
        }
      </div>
      
      ${
        message
          ? `
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4>Message from Service Center:</h4>
          <p>${message}</p>
        </div>
      `
          : ""
      }
      
      <p>If you have any questions, please contact the service center directly:</p>
      <p><strong>Phone:</strong> ${
        booking.serviceCenter.phone || "Not provided"
      }</p>
      <p><strong>Email:</strong> ${booking.serviceCenter.email}</p>
      
      <hr style="margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">
        This is an automated notification from AutoConnect. Please do not reply to this email.
      </p>
    </div>
  `;

  await sendEmail({
    email: booking.vehicleOwner.email,
    subject: subject,
    html: emailContent,
    message: `Booking ${booking.bookingId} status updated to ${status}. ${
      message ? "Message: " + message : ""
    }`,
  });
};

export default {
  createBooking,
  getUserBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking,
  submitFeedback,
  getBookingStats,
  getAvailableTimeSlots,
  submitServiceCompletionReport,
  getServiceCompletionReport,
};
