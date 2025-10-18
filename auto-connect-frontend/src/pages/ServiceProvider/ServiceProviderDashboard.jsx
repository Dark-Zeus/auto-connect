import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import bookingAPI from "../../services/bookingApiService";
import "./ServiceProviderDashboard.css";

const ServiceProviderDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      total: 0,
      pending: 0,
      confirmed: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
      rejected: 0,
    },
    bookings: [],
    serviceReports: [],
    weeklySchedule: [],
  });

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch bookings from API
      const bookingsResponse = await bookingAPI.getBookings();

      console.log("=== BOOKINGS API RESPONSE ===");
      console.log("Full Response:", bookingsResponse);

      // Extract bookings array
      const bookings = bookingsResponse?.data?.bookings || [];
      console.log("Total Bookings Fetched:", bookings.length);

      if (bookings.length > 0) {
        console.log("First Booking Sample:", bookings[0]);
        console.log("All Booking Statuses:", bookings.map(b => b.status));
      }

      // Calculate stats directly from bookings status column
      const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === "PENDING").length,
        confirmed: bookings.filter(b => b.status === "CONFIRMED").length,
        inProgress: bookings.filter(b => b.status === "IN_PROGRESS").length,
        completed: bookings.filter(b => b.status === "COMPLETED").length,
        cancelled: bookings.filter(b => b.status === "CANCELLED").length,
        rejected: bookings.filter(b => b.status === "REJECTED").length,
      };

      console.log("=== CALCULATED STATS FROM BOOKINGS ===");
      console.log("Total:", stats.total);
      console.log("Pending:", stats.pending);
      console.log("Confirmed:", stats.confirmed);
      console.log("In Progress:", stats.inProgress);
      console.log("Completed:", stats.completed);
      console.log("Cancelled:", stats.cancelled);
      console.log("Rejected:", stats.rejected);

      // Extract service reports from bookings
      const serviceReports = bookings
        .filter((booking) => booking.serviceReport)
        .map((booking) => ({
          bookingId: booking.bookingId,
          vehicle: booking.vehicle,
          completedAt: booking.timestamps?.completedAt,
          finalCost: booking.finalCost,
          rating: booking.feedback?.rating,
        }));

      console.log("Service Reports Count:", serviceReports.length);

      // Generate weekly schedule from bookings
      const weeklySchedule = generateWeeklySchedule(bookings);
      console.log("Weekly Schedule Count:", weeklySchedule.length);

      setDashboardData({
        stats,
        bookings,
        serviceReports,
        weeklySchedule,
      });

      console.log("=== DASHBOARD DATA SET SUCCESSFULLY ===");
    } catch (err) {
      console.error("=== ERROR FETCHING DASHBOARD DATA ===");
      console.error("Error:", err);
      console.error("Error Message:", err.message);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Generate weekly schedule from bookings
  const generateWeeklySchedule = (bookings) => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const weeklyBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.preferredDate);
      return (
        bookingDate >= weekStart &&
        bookingDate < weekEnd &&
        ["PENDING", "CONFIRMED", "IN_PROGRESS"].includes(booking.status)
      );
    });

    return weeklyBookings;
  };

  // Prepare chart data
  const getBookingTrendsData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split("T")[0];
    });

    const trendData = last7Days.map((date) => {
      const dayBookings = dashboardData.bookings.filter((b) => {
        if (!b.createdAt) return false;
        const bookingDate = new Date(b.createdAt).toISOString().split("T")[0];
        return bookingDate === date;
      });

      return {
        date: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        bookings: dayBookings.length,
        completed: dayBookings.filter((b) => b.status === "COMPLETED").length,
      };
    });

    console.log("Booking Trends Data:", trendData);
    return trendData;
  };

  const getRevenueData = () => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return {
        month: date.toLocaleDateString("en-US", { month: "short" }),
        year: date.getFullYear(),
        monthIndex: date.getMonth(),
      };
    });

    const revenueData = last6Months.map((monthInfo) => {
      // Filter bookings by creation date
      const monthBookings = dashboardData.bookings.filter((b) => {
        if (!b.createdAt) return false;
        const bookingDate = new Date(b.createdAt);
        return (
          bookingDate.getMonth() === monthInfo.monthIndex &&
          bookingDate.getFullYear() === monthInfo.year &&
          b.status === "COMPLETED"
        );
      });

      // Calculate revenue from completed bookings
      const revenue = monthBookings.reduce(
        (sum, b) => sum + (b.finalCost || b.estimatedCost || 0),
        0
      );

      return {
        month: monthInfo.month,
        revenue: revenue,
        bookings: monthBookings.length,
      };
    });

    console.log("Revenue Data:", revenueData);
    console.log("Total bookings:", dashboardData.bookings.length);
    console.log("Completed bookings:", dashboardData.bookings.filter(b => b.status === "COMPLETED").length);

    return revenueData;
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-text">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-container">
          <div className="error-title">Error</div>
          <div className="error-message">{error}</div>
          <button className="retry-button" onClick={fetchDashboardData}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const trendData = getBookingTrendsData();
  const revenueData = getRevenueData();

  console.log("=== CHART DATA ===");
  console.log("Trend Data:", trendData);
  console.log("Revenue Data:", revenueData);
  console.log("Stats for Display:", dashboardData.stats);

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1>Service Center Dashboard</h1>
        <p>Comprehensive overview of your service operations</p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card total">
          <div className="kpi-icon">&#128202;</div>
          <div className="kpi-title">Total Bookings</div>
          <div className="kpi-value">{dashboardData.stats.total || 0}</div>
          <div className="kpi-subtitle">All time</div>
        </div>

        <div className="kpi-card pending">
          <div className="kpi-icon">&#8987;</div>
          <div className="kpi-title">Pending</div>
          <div className="kpi-value">{dashboardData.stats.pending || 0}</div>
          <div className="kpi-subtitle">Awaiting confirmation</div>
        </div>

        <div className="kpi-card ongoing">
          <div className="kpi-icon">&#128295;</div>
          <div className="kpi-title">In Progress</div>
          <div className="kpi-value">{dashboardData.stats.inProgress || 0}</div>
          <div className="kpi-subtitle">Active services</div>
        </div>

        <div className="kpi-card completed">
          <div className="kpi-icon">&#9989;</div>
          <div className="kpi-title">Completed</div>
          <div className="kpi-value">{dashboardData.stats.completed || 0}</div>
          <div className="kpi-subtitle">Successfully finished</div>
        </div>
      </div>

      {/* Booking Trends Chart - Full Width */}
      <div className="chart-container chart-full-width">
        <h3 className="chart-title">&#128200; Booking Trends (Last 7 Days)</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                style={{ fontSize: '0.875rem' }}
              />
              <YAxis
                stroke="#64748b"
                style={{ fontSize: '0.875rem' }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #7AB2D3",
                  borderRadius: "8px",
                  padding: "12px",
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#7AB2D3"
                strokeWidth={3}
                name="Total Bookings"
                dot={{ fill: "#7AB2D3", r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#27ae60"
                strokeWidth={3}
                name="Completed"
                dot={{ fill: "#27ae60", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Chart - Full Width */}
      <div className="chart-container chart-full-width">
        <h3 className="chart-title">&#128176; Revenue Trends (Last 6 Months)</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="month"
                stroke="#64748b"
                style={{ fontSize: '0.875rem' }}
              />
              <YAxis
                stroke="#64748b"
                style={{ fontSize: '0.875rem' }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #7AB2D3",
                  borderRadius: "8px",
                  padding: "12px",
                }}
                formatter={(value) => `Rs. ${value.toLocaleString()}`}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
              />
              <Bar
                dataKey="revenue"
                fill="#7AB2D3"
                name="Revenue (Rs.)"
                radius={[8, 8, 0, 0]}
                maxBarSize={80}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables Section */}
      <div className="tables-section">
        {/* Weekly Schedule Chart */}
        <div className="chart-container">
          <h3 className="chart-title">&#128197; This Week's Schedule</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { day: "Mon", hours: 9.5, startTime: "8:30 AM", endTime: "6:00 PM" },
                  { day: "Tue", hours: 9.5, startTime: "8:30 AM", endTime: "6:00 PM" },
                  { day: "Wed", hours: 9.5, startTime: "8:30 AM", endTime: "6:00 PM" },
                  { day: "Thu", hours: 9.5, startTime: "8:30 AM", endTime: "6:00 PM" },
                  { day: "Fri", hours: 9.5, startTime: "8:30 AM", endTime: "6:00 PM" },
                  { day: "Sat", hours: 9.5, startTime: "8:30 AM", endTime: "6:00 PM" },
                  { day: "Sun", hours: 0, startTime: "Closed", endTime: "Closed" },
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="day"
                  stroke="#64748b"
                  style={{ fontSize: '0.875rem', fontWeight: '600' }}
                />
                <YAxis
                  stroke="#64748b"
                  style={{ fontSize: '0.875rem' }}
                  domain={[0, 10]}
                  ticks={[0, 2, 4, 6, 8, 10]}
                  label={{ value: 'Working Hours', angle: -90, position: 'insideLeft', style: { fontSize: '0.875rem' } }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #7AB2D3",
                    borderRadius: "8px",
                    padding: "12px",
                  }}
                  formatter={(value, name, props) => {
                    if (value === 0) return ["Closed", "Status"];
                    return [
                      `${props.payload.startTime} - ${props.payload.endTime}`,
                      "Working Hours"
                    ];
                  }}
                />
                <Bar
                  dataKey="hours"
                  fill="#7AB2D3"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Service Reports */}
        <div className="table-container">
          <h3 className="table-title">&#128221; Recent Service Reports</h3>
          {dashboardData.serviceReports.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">&#128221;</div>
              <div className="empty-state-text">
                No service reports available
              </div>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Vehicle</th>
                  <th>Completed</th>
                  <th>Cost</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.serviceReports.slice(0, 10).map((report) => (
                  <tr key={report.bookingId}>
                    <td>
                      <strong>{report.bookingId}</strong>
                    </td>
                    <td>
                      {report.vehicle.registrationNumber}
                      <br />
                      <small style={{ color: "#64748b" }}>
                        {report.vehicle.make} {report.vehicle.model}
                      </small>
                    </td>
                    <td>
                      {report.completedAt
                        ? new Date(report.completedAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>
                      <strong>Rs. {report.finalCost?.toLocaleString()}</strong>
                    </td>
                    <td>
                      {report.rating ? (
                        <div className="rating-display">
                          <span className="rating-stars">
                            {"\u2B50".repeat(report.rating)}
                          </span>
                          <span>({report.rating}/5)</span>
                        </div>
                      ) : (
                        <span style={{ color: "#94a3b8" }}>No rating</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Recent Bookings - Full Width */}
      <div className="table-container table-full-width">
        <h3 className="table-title">&#128278; Recent Bookings</h3>
        {dashboardData.bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">&#128278;</div>
            <div className="empty-state-text">No bookings available</div>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Vehicle</th>
                <th>Date</th>
                <th>Services</th>
                <th>Status</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.bookings.slice(0, 10).map((booking) => (
                <tr key={booking._id}>
                  <td>
                    <strong>{booking.bookingId}</strong>
                  </td>
                  <td>
                    {booking.vehicle.registrationNumber}
                    <br />
                    <small style={{ color: "#64748b" }}>
                      {booking.vehicle.make} {booking.vehicle.model} (
                      {booking.vehicle.year})
                    </small>
                  </td>
                  <td>
                    {new Date(booking.preferredDate).toLocaleDateString()}
                    <br />
                    <small style={{ color: "#64748b" }}>
                      {booking.preferredTimeSlot}
                    </small>
                  </td>
                  <td>
                    <small>{booking.services.slice(0, 2).join(", ")}</small>
                    {booking.services.length > 2 && (
                      <small style={{ color: "#7AB2D3" }}>
                        {" "}
                        +{booking.services.length - 2} more
                      </small>
                    )}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${booking.status.toLowerCase().replace("_", "-")}`}
                    >
                      {booking.status.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    <strong>
                      Rs.{" "}
                      {(
                        booking.finalCost ||
                        booking.estimatedCost ||
                        0
                      ).toLocaleString()}
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ServiceProviderDashboard;
