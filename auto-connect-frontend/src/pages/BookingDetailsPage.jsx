// BookingDetailsPage.jsx
import React, { useState } from "react";
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

const BookingDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;
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
    <Box sx={{ minHeight: "100vh", py: 5 }}>
        <Paper sx={{ p: 10, borderRadius: 3 }} elevation={3}>
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

           {/* Action Buttons */}
                <Box mt={3} sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {/* Confirmed: Cancel */}
                {booking.status === "Confirmed" && (
                    <Button
                    variant="contained"
                    color="error"
                    sx={{ fontSize: 13, fontWeight: 500 }}
                    onClick={() => alert(`Booking ${booking.id} cancelled.`)}
                    >
                    Cancel
                    </Button>
                )}

                {/* Pending: Edit + Cancel */}
                {booking.status === "Pending" && (
                    <>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ fontSize: 13, fontWeight: 500 }}
                        onClick={() =>
                        navigate("/service-booking-form", {
                            state: { booking },
                        })
                        }
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        sx={{ fontSize: 13, fontWeight: 500 }}
                        onClick={() => alert(`Booking ${booking.id} cancelled.`)}
                    >
                        Cancel
                    </Button>
                    </>
                )}

                {/* Completed: Rate & Review + Invoice */}
                {booking.status === "Completed" && (
                    <>
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{ fontSize: 13, fontWeight: 500 }}
                        onClick={() => alert(`Rate & Review for ${booking.centerName}`)}
                    >
                        Rate & Review
                    </Button>
                   <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenInvoice(true)}
                sx={{ fontSize: 13, fontWeight: 500 }}
              >
                View Invoice
              </Button>
              <CompletedServicesInvoice
                open={openInvoice}
                onClose={() => setOpenInvoice(false)}
                booking={booking}
              />
                    </>
                )}

                {/* Cancelled: Reschedule */}
                {booking.status === "Cancelled" && (
                    <Button
                    variant="contained"
                    color="primary"
                    sx={{ fontSize: 13, fontWeight: 500 }}
                    onClick={() => navigate("/service-booking-form")}
                    >
                    Reschedule
                    </Button>
                )}

                {/* Back Button (Always shown) */}
                <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    sx={{ fontSize: 13, fontWeight: 500 }}
                >
                    Back to Bookings
                </Button>
                </Box>

        </Paper>
    </Box>
);
};

export default BookingDetailsPage;
