// BookingDetailsPage.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Divider,
  Button,
  Grid,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import CompletedServicesInvoice from "./CompletedServicesInvioce";

const BookingDetailsPage = ({ booking: bookingProp }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = bookingProp || location.state?.booking;
  const [openInvoice, setOpenInvoice] = useState(false);

  if (!booking) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography fontSize={18} fontWeight={600} color="error">
          No booking information provided.
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#e6f4f0", py: 5 }}>
      <Container sx={{ maxWidth: { xs: "95%", sm: 540, md: 600 }, mx: "auto" }}>
        <Paper sx={{ p: { xs: 3, sm: 4, md: 5 }, borderRadius: 4, boxShadow: 3 }}>
          <Typography fontSize={32} fontWeight={700} gutterBottom>
            Booking Details
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Typography fontSize={16} fontWeight={500}>
            <strong>Booking ID:</strong> {booking.id}
          </Typography>
          <Typography fontSize={16} fontWeight={500}>
            <strong>Date:</strong> {booking.date}
          </Typography>
          <Typography fontSize={16} fontWeight={500}>
            <strong>Time:</strong> {booking.time}
          </Typography>
          <Typography fontSize={16} fontWeight={500}>
            <strong>Service Center:</strong> {booking.centerName}
          </Typography>
          <Typography fontSize={14} fontWeight={400}>
            <strong>Location:</strong> {booking.location}
          </Typography>

          <Box sx={{ my: 2 }}>
            <Typography fontSize={18} fontWeight={600} gutterBottom>
              Services:
            </Typography>
            <Grid container spacing={1}>
              {booking.services.map((s, idx) => (
                <Grid item key={idx}>
                  <Chip
                    label={s}
                    color="primary"
                    variant="outlined"
                    sx={{ fontSize: 12, fontWeight: 500 }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Typography fontSize={16} fontWeight={500}>
            <strong>Status:</strong> {booking.status}
          </Typography>
          <Typography fontSize={16} fontWeight={500}>
            <strong>Estimated Price:</strong> Rs. 9,500
          </Typography>
          <Typography fontSize={16} fontWeight={500}>
            <strong>Booking Fee Paid:</strong> Rs. 500
          </Typography>

          {booking.status === "Completed" && (
            <Box mt={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenInvoice(true)}
                sx={{ fontSize: 13, fontWeight: 500, mr: 2 }}
              >
                View Invoice
              </Button>
              <Button variant="outlined" sx={{ fontSize: 13, fontWeight: 500 }}>
                Rate & Review
              </Button>
              <CompletedServicesInvoice
                open={openInvoice}
                onClose={() => setOpenInvoice(false)}
                booking={booking}
              />
            </Box>
          )}

          {booking.status === "Pending" && (
            <Box mt={3}>
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 2, fontSize: 13, fontWeight: 500 }}
                onClick={() => navigate("/service-booking-form", { state: { booking, isEdit: true } })}
              >
                Edit
              </Button>
              <Button variant="outlined" sx={{ fontSize: 13, fontWeight: 500 }}>
                Cancel
              </Button>
            </Box>
          )}

          {booking.status === "Confirmed" && (
            <Box mt={3}>
              <Button variant="outlined" sx={{ fontSize: 13, fontWeight: 500 }}>
                Cancel
              </Button>
            </Box>
          )}

          {booking.status === "Cancelled" && (
            <Box mt={3}>
              <Button
                variant="contained"
                color="primary"
                sx={{ fontSize: 13, fontWeight: 500 }}
                onClick={() => navigate("/service-booking-form")}
              >
                Reschedule
              </Button>
            </Box>
          )}

          <Box mt={3}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{ fontSize: 13, fontWeight: 500 }}
            >
              Back to Bookings
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

BookingDetailsPage.propTypes = {
  booking: PropTypes.object,
};

export default BookingDetailsPage;
