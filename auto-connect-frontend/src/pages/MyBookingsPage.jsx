import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Button,
  Stack,
} from "@mui/material";
import {
  LocationOn,
  CalendarToday,
  AssignmentTurnedIn,
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
    services: ["Oil Change", "AC Checkup"],
    status: "Confirmed",
  },
  {
    id: "BOOK12346",
    centerName: "Express Motor Works",
    location: "Colombo 05, 3.2 km away",
    date: "2025-07-25",
    time: "01:00 PM",
    services: ["Engine Repair"],
    status: "Pending",
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
];

const MyBookings = () => {
  const navigate = useNavigate();

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
          center: matchedProvider, // ✅ full service center info
          booking, // ✅ current booking to prefill
        },
      });
    } else {
      alert("Provider not found for edit.");
    }
  };

  const handleCancel = (bookingId) => {
    alert(`Booking ${bookingId} cancelled.`);
    // Actual cancel logic goes here
  };

  return (
    <Box sx={{ backgroundColor: "#e9f7ef", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <AssignmentTurnedIn sx={{ fontSize: 36, color: "#4a628a" }} />
          <Typography variant="h5" fontWeight={700}>
            My Bookings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review your upcoming and past vehicle service appointments.
          </Typography>
        </Box>

        <Stack spacing={2}>
          {mockBookings.map((booking) => (
            <Paper
              key={booking.id}
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 3,
                backgroundColor: "#ffffff",
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  {booking.centerName}
                </Typography>
                <Chip
                  label={booking.status}
                  color={
                    booking.status === "Confirmed" ? "success" : "warning"
                  }
                  variant="outlined"
                  size="small"
                  sx={{ fontWeight: "bold" }}
                />
              </Box>

              {/* Location & Time */}
              <Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <LocationOn fontSize="small" color="action" />
                  <Typography variant="body2">{booking.location}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                  <CalendarToday fontSize="small" color="action" />
                  <Typography variant="body2">
                    {booking.date} at {booking.time}
                  </Typography>
                </Box>
              </Box>

              {/* Booking ID and Services */}
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Booking ID: {booking.id}
                </Typography>
                <Typography variant="body2" fontWeight={500} mt={0.5}>
                  Services:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 0.5 }}>
                  {booking.services.map((s, idx) => (
                    <Chip
                      key={idx}
                      label={s}
                      variant="outlined"
                      color="primary"
                      size="small"
                    />
                  ))}
                </Box>
              </Box>

              {/* Actions */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 1,
                  mt: 1,
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleViewProvider(booking)}
                  sx={{ borderRadius: 2, textTransform: "none" }}
                >
                  View Provider
                </Button>

                {booking.status === "Pending" && (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleEdit(booking)}
                    sx={{ borderRadius: 2, textTransform: "none" }}
                  >
                    Edit
                  </Button>
                )}

                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleCancel(booking.id)}
                  sx={{ borderRadius: 2, textTransform: "none" }}
                >
                  Cancel
                </Button>
              </Box>
            </Paper>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default MyBookings;
