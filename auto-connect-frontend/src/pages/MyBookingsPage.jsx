import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Button,
  Stack,
  Divider,
  TextField,
  InputAdornment,
  MenuItem,
  Grid,
} from "@mui/material";
import {
  LocationOn,
  CalendarToday,
  AssignmentTurnedIn,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// ✅ Full service center data
const serviceCenters = [
  {
    id: 1,
    name: "City Auto Care Center",
    location: "Colombo 03, 2.5 km away",
    phone: "0112345678",
    rating: 4.8,
    reviews: 127,
    serviceCategories: ["Vehicle Maintenance", "Vehicle Repair"],
    services: [
      "Oil Change",
      "Brake Service",
      "Engine Repair",
      "AC Service",
      "Tire Service",
    ],
    onTime: "95%",
    cost: "Rs. 8,500",
    waitTime: "2 days",
    verified: true,
    premium: true,
  },
  {
    id: 2,
    name: "Express Motor Works",
    location: "Colombo 05, 3.2 km away",
    phone: "0113456789",
    rating: 4.5,
    reviews: 94,
    serviceCategories: ["Vehicle Repair"],
    services: ["Battery Replacement", "Engine Tuning", "Wheel Alignment"],
    onTime: "92%",
    cost: "Rs. 7,200",
    waitTime: "1 day",
    verified: true,
    premium: false,
  },
  {
    id: 5,
    name: "Premium Motors & Repairs",
    location: "Kollupitiya, 2.0 km away",
    phone: "0716789012",
    rating: 4.9,
    reviews: 158,
    serviceCategories: ["Vehicle Repair"],
    services: [
      "Full Vehicle Inspection",
      "Suspension Repair",
      "Interior Detailing",
    ],
    onTime: "97%",
    cost: "Rs. 11,500",
    waitTime: "2 days",
    verified: true,
    premium: true,
  },
];

// ✅ Mock bookings
const mockBookings = [
  {
    id: "BOOK12345",
    centerName: "City Auto Care Center",
    location: "Colombo 03, 2.5 km away",
    date: "2025-07-20",
    time: "10:00 AM",
    services: ["Oil Change", "AC Service"],
    status: "Pending",
  },
  {
    id: "BOOK12346",
    centerName: "Express Motor Works",
    location: "Colombo 05, 3.2 km away",
    date: "2025-07-25",
    time: "01:00 PM",
    services: ["Engine Tuning"],
    status: "Completed",
  },
  {
    id: "BOOK12347",
    centerName: "Premium Motors & Repairs",
    location: "Kollupitiya, 2.0 km away",
    date: "2025-08-02",
    time: "03:00 PM",
    services: ["Full Vehicle Inspection"],
    status: "Confirmed",
  },
  {
    id: "BOOK12345",
    centerName: "City Auto Care Center",
    location: "Colombo 03, 2.5 km away",
    date: "2025-07-20",
    time: "10:00 AM",
    services: ["Oil Change", "AC Service"],
    status: "Pending",
  },
  {
    id: "BOOK12345",
    centerName: "City Auto Care Center",
    location: "Colombo 03, 2.5 km away",
    date: "2025-07-20",
    time: "10:00 AM",
    services: ["Oil Change"],
    status: "Confirmed",
  },
  {
    id: "BOOK12345",
    centerName: "City Auto Care Center",
    location: "Colombo 03, 2.5 km away",
    date: "2025-07-20",
    time: "10:00 AM",
    services: ["Oil Change", "AC Service"],
    status: "Completed",
  },
  {
    id: "BOOK12345",
    centerName: "City Auto Care Center",
    location: "Colombo 03, 2.5 km away",
    date: "2025-07-20",
    time: "10:00 AM",
    services: ["Oil Change", "AC Service"],
    status: "Pending",
  },
  {
    id: "BOOK12345",
    centerName: "City Auto Care Center",
    location: "Colombo 03, 2.5 km away",
    date: "2025-07-20",
    time: "10:00 AM",
    services: ["Oil Change", "AC Service"],
    status: "Confirmed",
  },
  {
    id: "BOOK12345",
    centerName: "City Auto Care Center",
    location: "Colombo 03, 2.5 km away",
    date: "2025-07-20",
    time: "10:00 AM",
    services: ["Oil Change", "AC Service"],
    status: "Completed",
  },
];

const MyBookings = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const handleViewProvider = (booking) => {
    const matchedProvider = serviceCenters.find(
      (center) =>
        center.name === booking.centerName &&
        center.location === booking.location
    );
    if (matchedProvider) {
      navigate("/service-provider-profile", {
        state: { center: matchedProvider },
      });
    } else {
      alert("Provider not found.");
    }
  };

  const handleEdit = (booking) => {
    const matchedProvider = serviceCenters.find(
      (center) =>
        center.name === booking.centerName &&
        center.location === booking.location
    );
    if (matchedProvider) {
      navigate("/service-booking-form", {
        state: {
          center: matchedProvider,
          booking,
        },
      });
    } else {
      alert("Provider not found for edit.");
    }
  };

  const handleCancel = (bookingId) => {
    alert(`Booking ${bookingId} cancelled.`);
  };

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.centerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.services.some((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "All" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const groupedBookings = {
    Confirmed: filteredBookings.filter((b) => b.status === "Confirmed"),
    Pending: filteredBookings.filter((b) => b.status === "Pending"),
    Completed: filteredBookings.filter((b) => b.status === "Completed"),
  };

  const sectionOrder = ["Confirmed", "Pending", "Completed"];

  return (
    <Box sx={{ backgroundColor: "#e9f7ef", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="lg">
        {/* Home button */}
        <Box sx={{ mb: 0, textAlign: "left" }}>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{ fontSize: 13, fontWeight: 500 }}
          >
            Home
          </Button>
        </Box>

        {/* Page Title */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <AssignmentTurnedIn sx={{ fontSize: 40, color: "#4a628a" }} />
          <Typography sx={{ fontSize: 32, fontWeight: 700 }}>
            My Bookings
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 500 }} color="text.secondary">
            Review your upcoming and past vehicle service appointments.
          </Typography>
        </Box>

        {/* Search and Filter */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 0,
            }}
          >
            <TextField
              placeholder="Search by ID, center, or service"
              fullWidth
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              inputProps={{ sx: { fontSize: 14, fontWeight: 500 } }}
            />
            <TextField
              select
              label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 200 }}
              inputProps={{ sx: { fontSize: 14, fontWeight: 500 } }}
            >
              <MenuItem value="All" sx={{ fontSize: 16, fontWeight: 500 }}>All</MenuItem>
              <MenuItem value="Confirmed" sx={{ fontSize: 16, fontWeight: 500 }}>Confirmed</MenuItem>
              <MenuItem value="Pending" sx={{ fontSize: 16, fontWeight: 500 }}>Pending</MenuItem>
              <MenuItem value="Completed" sx={{ fontSize: 16, fontWeight: 500 }}>Completed</MenuItem>
            </TextField>
          </Box>
        </Paper>

        {/* Bookings Sections */}
        {sectionOrder.map(
          (status) =>
            groupedBookings[status].length > 0 && (
              <Box key={status} sx={{ mb: 4 }}>
                <Typography sx={{ fontSize: 24, fontWeight: 600, mb: 1 }}>
                  {status} Services
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 1200 }}>
                  {groupedBookings[status].map((booking) => (
                    <Grid item xs={12} sm={6} md={4} sx={{ display: "flex", justifyContent: "center" }} key={booking.id + booking.time}>
                      <Paper
                        elevation={3}
                        sx={{
                          p: 2,
                          minHeight: 280,
                          maxHeight: 350,
                          minWidth: 350,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          borderRadius: 2,
                          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                        }}
                      >
                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
                              {booking.centerName}
                            </Typography>
                            <Chip
                              label={booking.status}
                              color={
                                booking.status === "Confirmed"
                                  ? "success"
                                  : booking.status === "Pending"
                                  ? "warning"
                                  : "default"
                              }
                              variant="outlined"
                              size="small"
                              sx={{ fontSize: 12, fontWeight: 500 }}
                            />
                          </Box>

                          <Box display="flex" alignItems="center" gap={1}>
                            <LocationOn fontSize="small" color="action" />
                            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                              {booking.location}
                            </Typography>
                          </Box>

                          <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                            <CalendarToday fontSize="small" color="action" />
                            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                              {booking.date} at {booking.time}
                            </Typography>
                          </Box>

                          <Typography
                            sx={{ fontSize: 14, fontWeight: 500, mt: 1 }}
                            color="text.secondary"
                          >
                            Booking ID: {booking.id}
                          </Typography>

                          <Typography
                            sx={{ fontSize: 16, fontWeight: 500, mt: 1, mb: 0.5 }}
                          >
                            Services:
                          </Typography>

                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            {booking.services.map((s, idx) => (
                              <Chip
                                key={idx}
                                label={s}
                                size="small"
                                variant="outlined"
                                color="primary"
                                sx={{ fontSize: 12, fontWeight: 500 }}
                              />
                            ))}
                          </Box>
                        </Box>

                        {/* Buttons */}
                        <Box
                          sx={{
                            mt: 2,
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleViewProvider(booking)}
                            sx={{ fontSize: 13, fontWeight: 500 }}
                          >
                            View Provider
                          </Button>

                          {booking.status === "Pending" && (
                            <>
                              <Button
                                variant="outlined"
                                size="small"
                                color="primary"
                                onClick={() => handleEdit(booking)}
                                sx={{ fontSize: 13, fontWeight: 500 }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="contained"
                                size="small"
                                color="error"
                                onClick={() => handleCancel(booking.id)}
                                sx={{ fontSize: 13, fontWeight: 500 }}
                              >
                                Cancel
                              </Button>
                            </>
                          )}

                          {booking.status === "Confirmed" && (
                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              onClick={() => handleCancel(booking.id)}
                              sx={{ fontSize: 13, fontWeight: 500 }}
                            >
                              Cancel
                            </Button>
                          )}
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )
        )}
      </Container>
    </Box>
  );
};

export default MyBookings;