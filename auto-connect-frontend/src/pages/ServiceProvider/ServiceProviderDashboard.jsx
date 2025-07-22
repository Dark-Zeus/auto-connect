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
  { 
    icon: <CheckCircleOutline/>, 
    title: "Total Bookings", 
    value: 120, color: "#4caf50", 
    subtitle: "Last 30 days", 
    trend: 15 
  },
  { 
    icon: <PendingActions/>, 
    title: "Ongoing", 
    value: 18, 
    color: "#ffc107", 
    subtitle: "Current", 
    trend: -5 
  },
  { 
    icon: <CheckCircleOutline/>, 
    title: "Completed", 
    value: 70, 
    color: "#2196f3", 
    subtitle: "Last 30 days", 
    trend: 10 
  },
  { 
    icon: <CancelOutlined/>, 
    title: "Cancelled", 
    value: 6, 
    color: "#f44336", 
    subtitle: "Last 30 days", 
    trend: -2 
  },
  { 
    icon: <CalendarToday/>, 
    title: "Upcoming", 
    value: 15, 
    color: "#2196f3", 
    subtitle: "Next 7 days", 
    trend: 20 
  },
];

const pieData = [
  { 
    name: "Completed", 
    value: 70, 
    color: "#4caf50" 
  },
  { 
    name: "Ongoing", 
    value: 18, 
    color: "#ffc107" 
  },
  { 
    name: "Cancelled", 
    value: 6, 
    color: "#f44336" 
  },
  { 
    name: "Pending", 
    value: 26, 
    color: "#2196f3" 
  },
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
    id: "ABC001",
    customer: "Ruwan Perera",
    service: "Engine Repair",
    status: "Ongoing",
  },
  {
    date: "2025-07-22",
    time: "11:00 AM",
    id: "WWE002",
    customer: "Nisansala Silva",
    service: "Battery Replacement",
    status: "Pending",
  },
  {
    date: "2025-07-23",
    time: "10:00 AM",
    id: "QSA003",
    customer: "Chandika Gayan",
    service: "Oil Change, Tire Alignment",
    status: "Ongoing",
  },
];

const topServices = [
  { 
    rank: 1, 
    service: "Oil Change", 
    times: 35 
  },
  { rank: 2, 
    service: "Engine Repair", 
    times: 30 
  },
  { rank: 3, 
    service: "Battery Replacement", 
    times: 18 
  },
  { rank: 4, 
    service: "AC Service", 
    times: 14 
  },
  { rank: 5, 
    service: "Suspension Repair", 
    times: 12 
  },
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
  {
    customer: "Jaith Lomitha",
    rating: 3,
    comment: "Friendly and informative staff. Really trust this place!",
  },
  {
    customer: "Rumain Cooray",
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
      <Grid container spacing={1} mb={5} justifyContent="center">
        {kpiData.map(({ icon, title, value, subtitle, trend, color }, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper
                sx={{
                display: "flex",
                flexDirection: "column",
                p: 4,
                pl: 3,
                borderRadius: "12px",
                position: "relative",
                backgroundColor: "#fff",
                boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.03)",
                overflow: "hidden",
                width: 230,
                height: 180,
                }}
            >
                {/* Left vertical colored stripe */}
                <Box
                sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: "20px",
                    backgroundColor: color,
                    borderTopLeftRadius: "12px",
                    borderBottomLeftRadius: "12px",
                }}
                />

                {/* Icon and title */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                    sx={{
                    backgroundColor: color,
                    borderRadius: "0.5rem",
                    width: 40,
                    minHeight: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 18,
                    }}
                >
                    {icon}
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: 16, color: "#1e293b" }}>
                    {title}
                </Typography>
                </Box>

                {/* Value */}
                <Typography
                sx={{
                    mt: 1.5,
                    fontSize: 24,
                    fontWeight: 800,
                    color: "#0f172a",
                }}
                >
                {value}
                </Typography>

                {/* Subtitle */}
                <Typography sx={{ fontSize: 13, color: "#64748b" }}>
                {subtitle}
                </Typography>

                {/* Trend */}
                <Typography
                sx={{
                    mt: 1,
                    fontSize: 13,
                    fontWeight: 600,
                    color: trend >= 0 ? "#22c55e" : "#ef4444",
                }}
                >
                {trend >= 0 ? `▲ ${trend}%` : `▼ ${Math.abs(trend)}%`}
                </Typography>
            </Paper>
            </Grid>
        ))}
        </Grid>


      {/* Charts Row */}
      <Grid container spacing={10} mb={4} justifyContent="center">
        <Grid item xs={12} md={10}>
          <Typography variant="h5" fontWeight={700} mb={1} color="#1a2637">
            Booking Status Breakdown
          </Typography>
          <Paper
            sx={{
              height: 350,
              width: 500,
              p: 3,
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
          <Typography variant="h5" fontWeight={700} mb={1} color="#1a2637">
            Monthly Bookings Trend
          </Typography>
          <Paper
            sx={{
              height: 350,
              width: 500,
              p: 3,
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
      <Grid container spacing={5} mb={4} justifyContent="center">
        {/* Appointments */}
        <Grid item xs={12} md={4}>
          <Typography variant="h5" fontWeight={700} mb={2} color="#1a2637">
            Upcoming Appointments
          </Typography>
          <Paper
            sx={{
              p: 2,
              borderRadius: "1rem",
              minHeight:100,
              backgroundColor: "white",
              border: "1px solid #DFF2EB",
              boxShadow: "0 4px 24px rgba(74, 98, 138, 0.08)",
              overflowX: "auto",
              minWidth: 1000,
            }}
          >
            <Table size="medium" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize:16 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize:16 }}>Time</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize:16 }}>Appointment ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize:16 }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize:16 }}>Service</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize:16 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {upcomingAppointments.map((a, i) => (
                  <TableRow key={i} hover>
                    <TableCell sx={{ fontSize:12 }}>{new Date(a.date).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ fontSize:12 }}>{a.time}</TableCell>
                    <TableCell sx={{ fontSize:12 }}>{a.id}</TableCell>
                    <TableCell sx={{ fontSize:12 }}>{a.customer}</TableCell>
                    <TableCell sx={{ fontSize:12 }}>{a.service}</TableCell>
                    <TableCell sx={{ fontSize:12 }}>
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
          <Typography variant="h5" fontWeight={700} mb={2} color="#1a2637">
            Top Services
          </Typography>
          <Paper
            sx={{
              p: 2,
              borderRadius: "1rem",
              minHeight: 100,
              minWidth: 500,
              backgroundColor: "white",
              border: "1px solid #DFF2EB",
              boxShadow: "0 4px 24px rgba(74, 98, 138, 0.08)",
              overflowX: "auto",
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize:16 }}>Rank</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize:16 }}>Service</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize:16 }}>Times Booked</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topServices.map((s) => (
                  <TableRow key={s.rank} hover>
                    <TableCell sx={{ fontSize:12 }}>{s.rank}</TableCell>
                    <TableCell sx={{ fontSize:12 }}>{s.service}</TableCell>
                    <TableCell sx={{ fontSize:12 }}>{s.times}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        {/* Reviews */}
        <Grid item xs={12} md={4}>
          <Typography variant="h5" fontWeight={700} mb={2} color="#1a2637">
            Customer Reviews
          </Typography>
          <Paper
            sx={{
              p: 2,
              borderRadius: "1rem",
              minHeight: 100,
              minWidth: 500,
              backgroundColor: "white",
              border: "1px solid #DFF2EB",
              boxShadow: "0 4px 24px rgba(74, 98, 138, 0.08)",
              overflowX: "auto",
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize:16 }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize:16 }}>Rating</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize:16 }}>Review</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviews.map((r, i) => (
                  <TableRow key={i} hover>
                    <TableCell sx={{ fontSize:12 }}>{r.customer}</TableCell>
                    <TableCell sx={{ fontSize:12 }}>
                      <Rating value={r.rating} readOnly size="small" />
                    </TableCell>
                    <TableCell sx={{ fontSize:12 }}>{r.comment}</TableCell>
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
