import React from "react";
import {
  Box, Grid, Paper, Typography, Table, TableHead, TableBody, TableRow,
  TableCell, Rating, Chip
} from "@mui/material";
import {
  CalendarToday, CheckCircleOutline, PendingActions, CancelOutlined,
} from "@mui/icons-material";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from "recharts";

const kpiData = [
  { icon: <CheckCircleOutline sx={{ color: "#4caf50" }} />, title: "Total Bookings", value: 120 },
  { icon: <PendingActions sx={{ color: "#ffc107" }} />, title: "Ongoing", value: 18 },
  { icon: <CancelOutlined sx={{ color: "#f44336" }} />, title: "Cancelled", value: 6 },
  { icon: <CalendarToday sx={{ color: "#2196f3" }} />, title: "Upcoming", value: 15 },
];

const pieData = [
  { name: "Completed", value: 70, color: "#4caf50" },
  { name: "Ongoing", value: 18, color: "#ffc107" },
  { name: "Cancelled", value: 6, color: "#f44336" },
  { name: "Pending", value: 26, color: "#2196f3" },
];

const monthlyBookingData = [
  { month: "Jan", bookings: 25 },
  { month: "Feb", bookings: 35 },
  { month: "Mar", bookings: 40 },
  { month: "Apr", bookings: 45 },
  { month: "May", bookings: 38 },
  { month: "Jun", bookings: 50 },
  { month: "Jul", bookings: 60 },
];

const upcomingAppointments = [
  {
    date: "2025-07-22",
    time: "09:30 AM",
    customer: "Ruwan Perera",
    service: "Engine Repair",
    status: "Ongoing",
  },
  {
    date: "2025-07-22",
    time: "11:00 AM",
    customer: "Nisansala Silva",
    service: "Battery Replacement",
    status: "Pending",
  },
  {
    date: "2025-07-23",
    time: "10:00 AM",
    customer: "Chandika Gayan",
    service: "Oil Change, Tire Alignment",
    status: "Ongoing",
  },
];

const topServices = [
  { rank: 1, service: "Oil Change", times: 35 },
  { rank: 2, service: "Engine Repair", times: 30 },
  { rank: 3, service: "Battery Replacement", times: 18 },
  { rank: 4, service: "AC Service", times: 14 },
  { rank: 5, service: "Suspension Repair", times: 12 },
];

const reviews = [
  {
    customer: "Ashen Rodrigo",
    rating: 5,
    comment: "Excellent work and always on time.",
  },
  {
    customer: "Dilani Madushani",
    rating: 4,
    comment: "Good service, a bit slow when busy but very responsive.",
  },
  {
    customer: "Priyan Jayasinghe",
    rating: 5,
    comment: "Friendly and informative staff. Really trust this place!",
  },
];

const ServiceProviderDashboard = () => {
  return (
    <Box
      p={4}
      bgcolor="#f9fafb"
      minHeight="100vh"
      sx={{ boxSizing: "border-box" }}
    >
      <Typography
        variant="h4"
        fontWeight={700}
        mb={4}
        color="primary"
        sx={{ userSelect: "none" }}
      >
        Service Provider Dashboard
      </Typography>

      {/* KPI Cards */}
      <Grid
        container
        spacing={3}
        mb={5}
        justifyContent="center"
        alignItems="center"
      >
        {kpiData.map(({ icon, title, value }, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
                borderRadius: 3,
                boxShadow: "0 6px 20px rgba(0,0,0,0.10)",
                minWidth: 220,
                justifyContent: "flex-start",
                backgroundColor: "white",
              }}
            >
              <Box sx={{ fontSize: 45 }}>{icon}</Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ fontWeight: 600 }}
                >
                  {title}
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {value}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={4} mb={5} alignItems="stretch">
        <Grid item xs={12} md={4}>
          <Typography
            variant="h6"
            fontWeight={700}
            gutterBottom
            sx={{ userSelect: "none" }}
          >
            Booking Status Breakdown
          </Typography>
          <Paper
            elevation={3}
            sx={{
              height: 320,
              p: 2,
              borderRadius: 3,
              backgroundColor: "white",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography
            variant="h6"
            fontWeight={700}
            gutterBottom
            sx={{ userSelect: "none" }}
          >
            Monthly Bookings Trend
          </Typography>
          <Paper
            elevation={3}
            sx={{
              height: 320,
              p: 2,
              borderRadius: 3,
              backgroundColor: "white",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyBookingData} margin={{ top: 20 }}>
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="bookings"
                  fill="#1976d2"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Tables Row */}
      <Grid container spacing={4} mb={5} alignItems="stretch">
        {/* Upcoming Appointments */}
        <Grid item xs={12} md={4}>
          <Typography
            variant="h6"
            fontWeight={700}
            mb={2}
            sx={{ userSelect: "none" }}
          >
            Upcoming Appointments
          </Typography>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: 3,
              height: "100%",
              minHeight: 380,
              overflowX: "auto",
              backgroundColor: "white",
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Service</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {upcomingAppointments.map(
                  ({ date, time, customer, service, status }, i) => (
                    <TableRow key={i} hover>
                      <TableCell>
                        {new Date(date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{time}</TableCell>
                      <TableCell>{customer}</TableCell>
                      <TableCell>{service}</TableCell>
                      <TableCell>
                        <Chip
                          label={status}
                          color={
                            status === "Completed"
                              ? "success"
                              : status === "Ongoing"
                              ? "primary"
                              : status === "Pending"
                              ? "warning"
                              : "default"
                          }
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        {/* Top Services */}
        <Grid item xs={12} md={4}>
          <Typography
            variant="h6"
            fontWeight={700}
            mb={2}
            sx={{ userSelect: "none" }}
          >
            Top Services
          </Typography>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: 3,
              height: "100%",
              minHeight: 380,
              overflowX: "auto",
              backgroundColor: "white",
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Rank</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Service</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Times Booked</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topServices.map(({ rank, service, times }) => (
                  <TableRow key={rank} hover>
                    <TableCell>{rank}</TableCell>
                    <TableCell>{service}</TableCell>
                    <TableCell>{times}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        {/* Customer Reviews */}
        <Grid item xs={12} md={4}>
          <Typography
            variant="h6"
            fontWeight={700}
            mb={2}
            sx={{ userSelect: "none" }}
          >
            Customer Reviews
          </Typography>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: 3,
              height: "100%",
              minHeight: 380,
              overflowX: "auto",
              backgroundColor: "white",
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Review</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviews.map(({ customer, rating, comment }, i) => (
                  <TableRow key={i} hover>
                    <TableCell>{customer}</TableCell>
                    <TableCell>
                      <Rating value={rating} readOnly size="small" />
                    </TableCell>
                    <TableCell>{comment}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ServiceProviderDashboard;
