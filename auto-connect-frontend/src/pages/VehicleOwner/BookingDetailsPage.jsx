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
    <Box sx={{ minHeight: "90vh", py: 10 }}>
      <Paper sx={{ p: { xs: 3, sm: 4, md: 5 }, borderRadius: 4, boxShadow: 3 }}>
        <Typography fontSize={24} fontWeight={700} gutterBottom>
          Booking Details
        </Typography>
        <Divider sx={{ my: 2 }} />

        {/* Basic Information */}
        <Box sx={{ mb: 3 }}>
          <Typography fontSize={18} fontWeight={600} gutterBottom>
            Basic Information:
          </Typography>
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
        </Box>

        {/* Vehicle Information */}
        {booking.vehicle && (
          <Box sx={{ mb: 3 }}>
            <Typography fontSize={18} fontWeight={600} gutterBottom>
              Vehicle Information:
            </Typography>
            <Typography fontSize={16} fontWeight={500}>
              <strong>Registration:</strong>{" "}
              {booking.vehicle.registrationNumber}
            </Typography>
            <Typography fontSize={16} fontWeight={500}>
              <strong>Make & Model:</strong> {booking.vehicle.make}{" "}
              {booking.vehicle.model}
            </Typography>
            <Typography fontSize={16} fontWeight={500}>
              <strong>Year:</strong> {booking.vehicle.year}
            </Typography>
          </Box>
        )}

        {/* Services */}
        <Box sx={{ mb: 3 }}>
          <Typography fontSize={18} fontWeight={600} gutterBottom>
            Requested Services:
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

        {/* Special Requests */}
        {booking.specialRequests && (
          <Box sx={{ mb: 3 }}>
            <Typography fontSize={18} fontWeight={600} gutterBottom>
              Special Requests:
            </Typography>
            <Typography fontSize={16} fontWeight={400}>
              {booking.specialRequests}
            </Typography>
          </Box>
        )}

        {/* Status */}
        <Box sx={{ mb: 3 }}>
          <Typography fontSize={18} fontWeight={600} gutterBottom>
            Current Status:
          </Typography>
          <Chip
            label={booking.status}
            color={
              booking.status === "COMPLETED"
                ? "success"
                : booking.status === "CONFIRMED"
                ? "primary"
                : booking.status === "IN_PROGRESS"
                ? "warning"
                : booking.status === "CANCELLED" ||
                  booking.status === "REJECTED"
                ? "error"
                : "default"
            }
            sx={{ fontSize: 14, fontWeight: 500, px: 2, py: 1 }}
          />
        </Box>

        {/* Service Center Response */}
        {booking.serviceCenterResponse && (
          <Box
            sx={{ my: 3, p: 2, backgroundColor: "#f5f5f5", borderRadius: 2 }}
          >
            <Typography fontSize={18} fontWeight={600} gutterBottom>
              Service Center Response:
            </Typography>

            {booking.serviceCenterResponse.message && (
              <Typography fontSize={16} fontWeight={400} sx={{ mb: 2 }}>
                <strong>Message:</strong>{" "}
                {booking.serviceCenterResponse.message}
              </Typography>
            )}

            {booking.serviceCenterResponse.proposedDate && (
              <Typography fontSize={16} fontWeight={400}>
                <strong>Proposed Date:</strong>{" "}
                {new Date(
                  booking.serviceCenterResponse.proposedDate
                ).toLocaleDateString()}
              </Typography>
            )}

            {booking.serviceCenterResponse.proposedTimeSlot && (
              <Typography fontSize={16} fontWeight={400}>
                <strong>Proposed Time:</strong>{" "}
                {booking.serviceCenterResponse.proposedTimeSlot}
              </Typography>
            )}

            {booking.serviceCenterResponse.estimatedDuration && (
              <Typography fontSize={16} fontWeight={400}>
                <strong>Estimated Duration:</strong>{" "}
                {booking.serviceCenterResponse.estimatedDuration}
              </Typography>
            )}

            {booking.serviceCenterResponse.responseDate && (
              <Typography
                fontSize={14}
                fontWeight={400}
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                <strong>Response Date:</strong>{" "}
                {new Date(
                  booking.serviceCenterResponse.responseDate
                ).toLocaleString()}
              </Typography>
            )}
          </Box>
        )}

        {/* Customer Feedback */}
        {booking.feedback && (
          <Box
            sx={{ my: 3, p: 2, backgroundColor: "#e8f5e8", borderRadius: 2 }}
          >
            <Typography fontSize={18} fontWeight={600} gutterBottom>
              Your Feedback:
            </Typography>

            <Typography fontSize={16} fontWeight={400}>
              <strong>Rating:</strong> {booking.feedback.rating}/5 stars
            </Typography>

            {booking.feedback.comment && (
              <Typography fontSize={16} fontWeight={400} sx={{ mt: 1 }}>
                <strong>Comment:</strong> {booking.feedback.comment}
              </Typography>
            )}

            {booking.feedback.submittedAt && (
              <Typography
                fontSize={14}
                fontWeight={400}
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                <strong>Submitted:</strong>{" "}
                {new Date(booking.feedback.submittedAt).toLocaleString()}
              </Typography>
            )}
          </Box>
        )}

        {/* Contact Information */}
        {booking.contactInfo && (
          <Box sx={{ mb: 3 }}>
            <Typography fontSize={18} fontWeight={600} gutterBottom>
              Contact Information:
            </Typography>
            <Typography fontSize={16} fontWeight={400}>
              <strong>Phone:</strong> {booking.contactInfo.phone}
            </Typography>
            <Typography fontSize={16} fontWeight={400}>
              <strong>Email:</strong> {booking.contactInfo.email}
            </Typography>
            {booking.contactInfo.preferredContactMethod && (
              <Typography fontSize={16} fontWeight={400}>
                <strong>Preferred Contact:</strong>{" "}
                {booking.contactInfo.preferredContactMethod}
              </Typography>
            )}
          </Box>
        )}

        {/* Pricing Information */}
        <Box sx={{ mb: 3 }}>
          <Typography fontSize={18} fontWeight={600} gutterBottom>
            Pricing:
          </Typography>
          <Typography fontSize={16} fontWeight={500}>
            <strong>Estimated Price:</strong> Rs.{" "}
            {booking.estimatedCost || 9500}
          </Typography>
          <Typography fontSize={16} fontWeight={500}>
            <strong>Booking Fee Paid:</strong> Rs. 500
          </Typography>
        </Box>

        {/* Booking Timeline */}
        <Box sx={{ mb: 3 }}>
          <Typography fontSize={18} fontWeight={600} gutterBottom>
            Booking Timeline:
          </Typography>
          {booking.createdAt && (
            <Typography fontSize={14} fontWeight={400} color="text.secondary">
              <strong>Booked on:</strong>{" "}
              {new Date(booking.createdAt).toLocaleString()}
            </Typography>
          )}
          {booking.updatedAt && booking.updatedAt !== booking.createdAt && (
            <Typography fontSize={14} fontWeight={400} color="text.secondary">
              <strong>Last updated:</strong>{" "}
              {new Date(booking.updatedAt).toLocaleString()}
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

BookingDetailsPage.propTypes = {
  booking: PropTypes.object,
};

export default BookingDetailsPage;
