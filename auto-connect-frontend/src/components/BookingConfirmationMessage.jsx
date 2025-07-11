import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const BookingConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Dummy booking fallback
  const dummyBooking = {
    reference: "BK-20250711-001",
    date: "2025-07-15",
    time: "10:00 AM",
    centerName: "City Auto Care Center",
    location: "Colombo 03, 2.5 km away",
  };

  const booking = location.state?.booking || dummyBooking;

  const { reference, date, time, centerName, location: loc } = booking;

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#e6f4ea", py: 6 }}>
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Booking Confirmed!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Thank you. Your appointment has been successfully booked.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Box textAlign="left">
            <Typography>
              <strong>Booking Reference:</strong> {reference}
            </Typography>
            <Typography>
              <strong>Date:</strong> {date}
            </Typography>
            <Typography>
              <strong>Time:</strong> {time}
            </Typography>
            <Typography>
              <strong>Service Provider:</strong> {centerName}
            </Typography>
            <Typography>
              <strong>Location:</strong> {loc}
            </Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 4 }}
            onClick={() => navigate("/my-bookings")}
          >
            Go to My Bookings
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default BookingConfirmationPage;
