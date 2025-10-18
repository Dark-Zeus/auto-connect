// Temporary backup of working getDashboardStats function
export const getDashboardStats = catchAsync(async (req, res, next) => {
  try {
    // Simple response to test if the endpoint is working
    LOG.info("Dashboard stats request received");
    LOG.info(
      "User:",
      req.user ? { id: req.user._id, role: req.user.role } : "No user"
    );

    return res.status(200).json({
      success: true,
      message: "Dashboard endpoint is working",
      data: {
        debug: {
          userExists: !!req.user,
          userRole: req.user?.role,
          userId: req.user?._id,
          timestamp: new Date().toISOString(),
        },
        // Mock data for testing
        overview: {
          totalBookings: 0,
          pending: 0,
          confirmed: 0,
          inProgress: 0,
          completed: 0,
          cancelled: 0,
          rejected: 0,
          totalRevenue: 0,
          averageRating: 0,
          totalReviews: 0,
        },
        last30Days: {
          totalBookings: 0,
          completed: 0,
          cancelled: 0,
          revenue: 0,
        },
        upcomingAppointments: [],
        monthlyTrend: [],
        topServices: [],
      },
    });
  } catch (error) {
    LOG.error("Dashboard stats error:", error);
    return next(new AppError("Failed to fetch dashboard statistics", 500));
  }
});
