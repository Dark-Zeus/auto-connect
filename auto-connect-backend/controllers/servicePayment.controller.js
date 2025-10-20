// controllers/servicePayment.controller.js
import Stripe from "stripe";
import ServicePayment from "../models/ServicePayment.model.js";
import ServiceReport from "../models/ServiceReport.model.js";
import Booking from "../models/Booking.model.js";
import User from "../models/user.model.js";
import LOG from "../configs/log.config.js";
import { catchAsync } from "../utils/catchAsync.util.js";
import { AppError } from "../utils/appError.util.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create a Stripe checkout session for service payment
 */
export const createServicePaymentSession = catchAsync(async (req, res, next) => {
  // Only vehicle owners can initiate payments
  if (req.user.role !== "vehicle_owner") {
    return next(new AppError("Only vehicle owners can initiate payments", 403));
  }

  const { bookingId } = req.body;

  if (!bookingId) {
    return next(new AppError("Booking ID is required", 400));
  }

  // Find the booking and verify it belongs to the user
  const booking = await Booking.findOne({
    _id: bookingId,
    vehicleOwner: req.user._id,
    status: "COMPLETED",
    isActive: true,
  })
    .populate("serviceCenter", "businessInfo.businessName email phone")
    .lean();

  if (!booking) {
    return next(new AppError("Completed booking not found or you don't have permission", 404));
  }

  // Check if service report exists
  if (!booking.serviceReport) {
    return next(new AppError("Service report has not been created yet by the service center. Please contact the service center to complete the service report before making payment.", 400));
  }

  // Get the full service report
  const serviceReport = await ServiceReport.findById(booking.serviceReport).lean();

  if (!serviceReport) {
    return next(new AppError("Service report not found in database. Please contact support.", 404));
  }

  // Validate that the service report has a valid amount
  if (!serviceReport.totalCostBreakdown || !serviceReport.totalCostBreakdown.finalTotal) {
    return next(new AppError("Service report does not have a final cost. Please contact the service center to update the service report.", 400));
  }

  // Check if payment already exists
  const existingPayment = await ServicePayment.findOne({
    booking: bookingId,
    paymentStatus: { $in: ["COMPLETED", "PROCESSING"] },
    isActive: true,
  });

  if (existingPayment) {
    if (existingPayment.paymentStatus === "COMPLETED") {
      return next(new AppError("Payment has already been completed for this service", 400));
    }
    if (existingPayment.paymentStatus === "PROCESSING") {
      return next(new AppError("Payment is already being processed", 400));
    }
  }

  const amount = serviceReport.totalCostBreakdown.finalTotal;

  if (!amount || amount <= 0) {
    return next(new AppError("Invalid payment amount", 400));
  }

  try {
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "lkr",
            product_data: {
              name: `Service Payment - ${booking.bookingId}`,
              description: `Payment for vehicle service at ${booking.serviceCenter.businessInfo?.businessName || "Service Center"}`,
              metadata: {
                bookingId: booking.bookingId,
                serviceReportId: serviceReport.reportId,
                vehicleRegistration: booking.vehicle.registrationNumber,
              },
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      customer_email: req.user.email,
      metadata: {
        bookingId: booking._id.toString(),
        serviceReportId: serviceReport._id.toString(),
        customerId: req.user._id.toString(),
        serviceCenterId: booking.serviceCenter._id.toString(),
        paymentType: "service_payment",
      },
      success_url: `${process.env.FRONTEND_URL || "http://localhost:3001"}/services/payment-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking._id}`,
      cancel_url: `${process.env.FRONTEND_URL || "http://localhost:3001"}/services/appointments?payment_cancelled=true`,
    });

    // Create payment record in database
    const payment = await ServicePayment.create({
      booking: booking._id,
      serviceReport: serviceReport._id,
      customer: req.user._id,
      serviceCenter: booking.serviceCenter._id,
      amount: amount,
      currency: "LKR",
      paymentStatus: "PROCESSING",
      paymentMethod: "STRIPE",
      stripeDetails: {
        sessionId: session.id,
      },
      metadata: {
        bookingId: booking.bookingId,
        serviceReportId: serviceReport.reportId,
        vehicleRegistration: booking.vehicle.registrationNumber,
        serviceCenterName: booking.serviceCenter.businessInfo?.businessName,
      },
    });

    LOG.info({
      message: "Service payment session created",
      paymentId: payment.paymentId,
      bookingId: booking.bookingId,
      amount: amount,
      customerId: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Payment session created successfully",
      data: {
        sessionId: session.id,
        sessionUrl: session.url,
        payment: {
          paymentId: payment.paymentId,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.paymentStatus,
        },
      },
    });
  } catch (error) {
    LOG.error({
      message: "Error creating service payment session",
      error: error.message,
      stack: error.stack,
      bookingId: bookingId,
      userId: req.user._id,
    });
    console.error("Full error details:", error);
    return next(new AppError(`Failed to create payment session: ${error.message}`, 500));
  }
});

/**
 * Verify payment status after Stripe checkout
 */
export const verifyServicePayment = catchAsync(async (req, res, next) => {
  const { sessionId } = req.query;

  if (!sessionId) {
    return next(new AppError("Session ID is required", 400));
  }

  try {
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return next(new AppError("Payment session not found", 404));
    }

    // Find the payment in our database
    const payment = await ServicePayment.findOne({
      "stripeDetails.sessionId": sessionId,
      isActive: true,
    })
      .populate("booking", "bookingId vehicle services")
      .populate("serviceReport", "reportId totalCostBreakdown")
      .populate("customer", "firstName lastName email phone")
      .populate("serviceCenter", "businessInfo.businessName email phone");

    if (!payment) {
      return next(new AppError("Payment record not found", 404));
    }

    // Check if user has permission to view this payment
    if (
      payment.customer._id.toString() !== req.user._id.toString() &&
      payment.serviceCenter._id.toString() !== req.user._id.toString() &&
      req.user.role !== "system_admin"
    ) {
      return next(new AppError("You don't have permission to view this payment", 403));
    }

    // Update payment status based on Stripe session status
    if (session.payment_status === "paid" && payment.paymentStatus !== "COMPLETED") {
      await payment.markAsCompleted({
        paymentIntentId: session.payment_intent,
        transactionReference: session.payment_intent,
      });

      LOG.info({
        message: "Service payment completed",
        paymentId: payment.paymentId,
        bookingId: payment.metadata.bookingId,
        amount: payment.amount,
      });
    } else if (session.payment_status === "unpaid" && payment.paymentStatus === "PROCESSING") {
      await payment.markAsFailed("Payment not completed");
    }

    res.status(200).json({
      success: true,
      message: "Payment verification successful",
      data: {
        payment: {
          paymentId: payment.paymentId,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.paymentStatus,
          paymentCompletedAt: payment.paymentCompletedAt,
          booking: payment.booking,
          serviceReport: payment.serviceReport,
        },
        stripeStatus: session.payment_status,
      },
    });
  } catch (error) {
    LOG.error("Error verifying service payment:", error);
    return next(new AppError("Failed to verify payment. Please try again.", 500));
  }
});

/**
 * Get payment details by booking ID
 */
export const getPaymentByBooking = catchAsync(async (req, res, next) => {
  const { bookingId } = req.params;

  if (!bookingId) {
    return next(new AppError("Booking ID is required", 400));
  }

  const payment = await ServicePayment.findOne({
    booking: bookingId,
    isActive: true,
  })
    .populate("booking", "bookingId vehicle services preferredDate")
    .populate("serviceReport", "reportId totalCostBreakdown")
    .populate("customer", "firstName lastName email phone")
    .populate("serviceCenter", "businessInfo.businessName email phone")
    .sort({ createdAt: -1 });

  if (!payment) {
    return res.status(200).json({
      success: true,
      message: "No payment found for this booking",
      data: {
        payment: null,
      },
    });
  }

  // Check if user has permission to view this payment
  if (
    payment.customer._id.toString() !== req.user._id.toString() &&
    payment.serviceCenter._id.toString() !== req.user._id.toString() &&
    req.user.role !== "system_admin"
  ) {
    return next(new AppError("You don't have permission to view this payment", 403));
  }

  res.status(200).json({
    success: true,
    message: "Payment details retrieved successfully",
    data: {
      payment,
    },
  });
});

/**
 * Get all payments for the current user (customer or service center)
 */
export const getUserPayments = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let filter = { isActive: true };

  // Filter based on user role
  if (req.user.role === "vehicle_owner") {
    filter.customer = req.user._id;
  } else if (req.user.role === "service_center") {
    filter.serviceCenter = req.user._id;
  } else if (req.user.role !== "system_admin") {
    return next(new AppError("Unauthorized to view payments", 403));
  }

  // Additional filters
  if (req.query.status) {
    filter.paymentStatus = req.query.status;
  }

  try {
    const payments = await ServicePayment.find(filter)
      .populate("booking", "bookingId vehicle services preferredDate")
      .populate("serviceReport", "reportId totalCostBreakdown")
      .populate("customer", "firstName lastName email phone")
      .populate("serviceCenter", "businessInfo.businessName email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPayments = await ServicePayment.countDocuments(filter);
    const totalPages = Math.ceil(totalPayments / limit);

    res.status(200).json({
      success: true,
      message: "Payments retrieved successfully",
      data: {
        payments,
        pagination: {
          currentPage: page,
          totalPages,
          totalResults: totalPayments,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit,
        },
      },
    });
  } catch (error) {
    LOG.error("Error fetching user payments:", error);
    return next(new AppError("Failed to fetch payments", 500));
  }
});

/**
 * Get payment statistics for the current user
 */
export const getPaymentStats = catchAsync(async (req, res, next) => {
  let matchFilter = { isActive: true };

  // Filter based on user role
  if (req.user.role === "vehicle_owner") {
    matchFilter.customer = req.user._id;
  } else if (req.user.role === "service_center") {
    matchFilter.serviceCenter = req.user._id;
  } else if (req.user.role !== "system_admin") {
    return next(new AppError("Unauthorized to view payment statistics", 403));
  }

  try {
    const stats = await ServicePayment.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalPayments: { $sum: 1 },
          completedPayments: {
            $sum: { $cond: [{ $eq: ["$paymentStatus", "COMPLETED"] }, 1, 0] },
          },
          pendingPayments: {
            $sum: { $cond: [{ $eq: ["$paymentStatus", "PENDING"] }, 1, 0] },
          },
          processingPayments: {
            $sum: { $cond: [{ $eq: ["$paymentStatus", "PROCESSING"] }, 1, 0] },
          },
          failedPayments: {
            $sum: { $cond: [{ $eq: ["$paymentStatus", "FAILED"] }, 1, 0] },
          },
          totalAmount: {
            $sum: { $cond: [{ $eq: ["$paymentStatus", "COMPLETED"] }, "$amount", 0] },
          },
          averageAmount: { $avg: "$amount" },
        },
      },
    ]);

    const result = stats[0] || {
      totalPayments: 0,
      completedPayments: 0,
      pendingPayments: 0,
      processingPayments: 0,
      failedPayments: 0,
      totalAmount: 0,
      averageAmount: 0,
    };

    res.status(200).json({
      success: true,
      message: "Payment statistics retrieved successfully",
      data: result,
    });
  } catch (error) {
    LOG.error("Error fetching payment statistics:", error);
    return next(new AppError("Failed to fetch payment statistics", 500));
  }
});

/**
 * Webhook handler for Stripe events
 * This should be called by Stripe when payment status changes
 */
export const handleStripeWebhook = catchAsync(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    LOG.error("Stripe webhook secret not configured");
    return res.status(500).json({ error: "Webhook secret not configured" });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    LOG.error("Webhook signature verification failed:", err);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        // Find the payment by session ID
        const payment = await ServicePayment.findOne({
          "stripeDetails.sessionId": session.id,
        });

        if (payment && payment.paymentStatus !== "COMPLETED") {
          await payment.markAsCompleted({
            paymentIntentId: session.payment_intent,
            transactionReference: session.payment_intent,
          });

          LOG.info({
            message: "Payment completed via webhook",
            paymentId: payment.paymentId,
            sessionId: session.id,
          });
        }
        break;
      }

      case "checkout.session.async_payment_failed":
      case "checkout.session.expired": {
        const session = event.data.object;

        // Find the payment by session ID
        const payment = await ServicePayment.findOne({
          "stripeDetails.sessionId": session.id,
        });

        if (payment && payment.paymentStatus === "PROCESSING") {
          await payment.markAsFailed(event.type);

          LOG.info({
            message: "Payment failed via webhook",
            paymentId: payment.paymentId,
            sessionId: session.id,
            reason: event.type,
          });
        }
        break;
      }

      default:
        LOG.info(`Unhandled webhook event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    LOG.error("Error processing webhook:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

export default {
  createServicePaymentSession,
  verifyServicePayment,
  getPaymentByBooking,
  getUserPayments,
  getPaymentStats,
  handleStripeWebhook,
};
