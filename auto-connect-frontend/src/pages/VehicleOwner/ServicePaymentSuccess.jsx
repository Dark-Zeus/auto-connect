// src/pages/VehicleOwner/ServicePaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Alert,
  Divider,
  Chip,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Receipt as ReceiptIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { servicePaymentApi } from "../../services/servicePaymentApi";
import { toast } from "react-toastify";

const ServicePaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [redirecting, setRedirecting] = useState(false);

  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("booking_id");

  useEffect(() => {
    if (!sessionId) {
      setError("Invalid payment session");
      setLoading(false);
      return;
    }

    verifyPayment();
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      setLoading(true);
      const response = await servicePaymentApi.verifyPayment(sessionId);

      if (response.success) {
        setPaymentData(response.data);

        // Show success toast
        toast.success("🎉 Payment successful! Thank you for your payment.", {
          position: "top-center",
          autoClose: 5000,
        });
      } else {
        setError("Payment verification failed");
      }
    } catch (err) {
      console.error("Error verifying payment:", err);
      setError(err.message || "Failed to verify payment");
    } finally {
      setLoading(false);
    }
  };

  // Auto-redirect after successful payment
  useEffect(() => {
    if (!loading && !error && paymentData) {
      const payment = paymentData?.payment;
      const isPaid = payment?.status === "COMPLETED";

      if (isPaid) {
        setRedirecting(true);

        // Start countdown
        const countdownInterval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              // Redirect to My Bookings with success state
              navigate("/services/appointments", {
                state: {
                  paymentSuccess: true,
                  paymentId: payment.paymentId,
                  amount: payment.amount,
                  bookingId: payment.booking?.bookingId || bookingId,
                },
              });
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(countdownInterval);
      }
    }
  }, [loading, error, paymentData, navigate, bookingId]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#e9f7ef",
        }}
      >
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            maxWidth: 400,
            borderRadius: 3,
          }}
        >
          <CircularProgress size={60} sx={{ mb: 2, color: "#7ab2d3" }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Verifying Payment...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please wait while we confirm your payment
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#e9f7ef",
          p: 2,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 3,
              border: "2px solid #f44336",
            }}
          >
            <ErrorIcon sx={{ fontSize: 80, color: "#f44336", mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              Payment Verification Failed
            </Typography>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We couldn't verify your payment. Please contact support if you
              were charged.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="contained"
                onClick={() => navigate("/services/appointments")}
                startIcon={<HomeIcon />}
                sx={{
                  background: "linear-gradient(45deg, #7ab2d3, #4a628a)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #4a628a, #7ab2d3)",
                  },
                }}
              >
                Go to My Bookings
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  const payment = paymentData?.payment;
  const isPaid = payment?.status === "COMPLETED";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#e9f7ef",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            border: isPaid ? "2px solid #4caf50" : "2px solid #ff9800",
          }}
        >
          {/* Success Icon and Title */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            {isPaid ? (
              <>
                <CheckCircleIcon
                  sx={{ fontSize: 100, color: "#4caf50", mb: 2 }}
                />
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 700, color: "#4caf50", mb: 1 }}
                >
                  Payment Successful!
                </Typography>
              </>
            ) : (
              <>
                <ErrorIcon sx={{ fontSize: 100, color: "#ff9800", mb: 2 }} />
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 700, color: "#ff9800", mb: 1 }}
                >
                  Payment Processing
                </Typography>
              </>
            )}
            <Typography variant="body1" color="text.secondary">
              {isPaid
                ? "Your payment has been processed successfully"
                : "Your payment is being processed"}
            </Typography>

            {isPaid && redirecting && countdown > 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2, fontStyle: "italic" }}
              >
                Redirecting to My Bookings in {countdown} second{countdown !== 1 ? 's' : ''}...
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Payment Details */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              <ReceiptIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Payment Details
            </Typography>

            <Box
              sx={{
                display: "grid",
                gap: 2,
                backgroundColor: "#f5f5f5",
                p: 3,
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Payment ID
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {payment?.paymentId || "N/A"}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Booking ID
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {payment?.booking?.bookingId || bookingId || "N/A"}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Amount Paid
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "#4a628a" }}
                >
                  LKR {payment?.amount?.toLocaleString() || "0"}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={payment?.status || "Unknown"}
                  color={isPaid ? "success" : "warning"}
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              {payment?.paymentCompletedAt && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Payment Date
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {new Date(payment.paymentCompletedAt).toLocaleString()}
                  </Typography>
                </Box>
              )}

              {payment?.booking?.vehicle && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Vehicle
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {payment.booking.vehicle.registrationNumber}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/services/appointments")}
              startIcon={<HomeIcon />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: 16,
                fontWeight: 600,
                background: "linear-gradient(45deg, #7ab2d3, #4a628a)",
                "&:hover": {
                  background: "linear-gradient(45deg, #4a628a, #7ab2d3)",
                },
              }}
            >
              Go to My Bookings
            </Button>
          </Box>

          {/* Additional Information */}
          {isPaid && (
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                A receipt has been sent to your email. You can also view this
                payment in your booking details.
              </Typography>
            </Alert>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ServicePaymentSuccess;
