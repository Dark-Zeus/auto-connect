import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Rating,
  Chip,
  Container,
} from "@mui/material";
import {
  CalendarToday,
  CheckCircleOutline,
  PendingActions,
  CancelOutlined,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
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
      sx={{
        maxWidth: "1440px",
        margin: "0 auto",
        background: "linear-gradient(135deg, #DFF2EB 0%, #f8f9fa 100%)",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        padding: 4,
        boxSizing: "border-box",
      }}
    >

      {/* KPI Cards */}
      <Grid container spacing={3} mb={5} justifyContent="center">
        {kpiData.map(({ icon, title, value }, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper
              sx={{
                p: 7,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: 2,
                borderRadius: "1rem",
                border: "1px solid #DFF2EB",
                boxShadow: "0 4px 24px rgba(74, 98, 138, 0.1)",
                height: "100%",
              }}
            >
              <Box sx={{ fontSize: 20 }}>{icon}</Box>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} color="#374151" fontSize={24}>
                  {title}
                </Typography>
                <Typography variant="h5" fontWeight={800} color="#1a2637" fontSize={16}>
                  {value}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={4} mb={5} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h6" fontWeight={700} mb={1} color="#1a2637">
            Booking Status Breakdown
          </Typography>
          <Paper
            sx={{
              height: 350,
              width: 500,
              p: 4,
              borderRadius: "1rem",
              backgroundColor: "white",
              border: "1px solid #DFF2EB",
              boxShadow: "0 4px 24px rgba(74, 98, 138, 0.08)",
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
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" fontWeight={700} mb={1} color="#1a2637">
            Monthly Bookings Trend
          </Typography>
          <Paper
            sx={{
              height: 350,
              width: 500,
              p: 4,
              borderRadius: "1rem",
              backgroundColor: "white",
              border: "1px solid #DFF2EB",
              boxShadow: "0 4px 24px rgba(74, 98, 138, 0.08)",
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
      <Grid container spacing={4}>
        {/* Appointments */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight={700} mb={2} color="#1a2637">
            Upcoming Appointments
          </Typography>
          <Paper
            sx={{
              p: 2,
              borderRadius: "1rem",
              minHeight: 380,
              backgroundColor: "white",
              border: "1px solid #DFF2EB",
              boxShadow: "0 4px 24px rgba(74, 98, 138, 0.08)",
              overflowX: "auto",
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
                {upcomingAppointments.map((a, i) => (
                  <TableRow key={i} hover>
                    <TableCell>{new Date(a.date).toLocaleDateString()}</TableCell>
                    <TableCell>{a.time}</TableCell>
                    <TableCell>{a.customer}</TableCell>
                    <TableCell>{a.service}</TableCell>
                    <TableCell>
                      <Chip
                        label={a.status}
                        color={
                          a.status === "Completed"
                            ? "success"
                            : a.status === "Ongoing"
                            ? "primary"
                            : a.status === "Pending"
                            ? "warning"
                            : "default"
                        }
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        {/* Top Services */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight={700} mb={2} color="#1a2637">
            Top Services
          </Typography>
          <Paper
            sx={{
              p: 2,
              borderRadius: "1rem",
              minHeight: 380,
              backgroundColor: "white",
              border: "1px solid #DFF2EB",
              boxShadow: "0 4px 24px rgba(74, 98, 138, 0.08)",
              overflowX: "auto",
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
                {topServices.map((s) => (
                  <TableRow key={s.rank} hover>
                    <TableCell>{s.rank}</TableCell>
                    <TableCell>{s.service}</TableCell>
                    <TableCell>{s.times}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        {/* Reviews */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight={700} mb={2} color="#1a2637">
            Customer Reviews
          </Typography>
          <Paper
            sx={{
              p: 2,
              borderRadius: "1rem",
              minHeight: 380,
              backgroundColor: "white",
              border: "1px solid #DFF2EB",
              boxShadow: "0 4px 24px rgba(74, 98, 138, 0.08)",
              overflowX: "auto",
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
                {reviews.map((r, i) => (
                  <TableRow key={i} hover>
                    <TableCell>{r.customer}</TableCell>
                    <TableCell>
                      <Rating value={r.rating} readOnly size="small" />
                    </TableCell>
                    <TableCell>{r.comment}</TableCell>
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
