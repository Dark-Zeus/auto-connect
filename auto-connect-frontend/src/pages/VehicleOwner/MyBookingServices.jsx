import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Button,
  Divider,
  TextField,
  InputAdornment,
  Grid,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Rating,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  LocationOn,
  CalendarToday,
  AssignmentTurnedIn,
  Search as SearchIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ThumbUp as ThumbUpIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";

import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { Snackbar } from "@mui/material";

import OverlayWindow from "@components/OverlayWindow";
import BookingDetailsPage from "./BookingDetailsPage";
import ServiceBookingForm from "@components/ServiceBookingForm";
import { UserContext } from "@contexts/UserContext";
import { bookingApi } from "@services/bookingApi";
import { servicePaymentApi } from "@services/servicePaymentApi";

const serviceCenters = [
  // Your serviceCenters data unchanged
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

const mockBookings = [
  // Your mockBookings data unchanged
  {
    id: "1",
    centerName: "City Auto Care Center",
    location: "Colombo 03, 2.5 km away",
    date: "2025-07-20",
    time: "10:00 AM",
    services: ["Oil Change", "AC Service"],
    status: "Pending",
  },
  {
    id: "2",
    centerName: "Express Motor Works",
    location: "Colombo 05, 3.2 km away",
    date: "2025-07-25",
    time: "01:00 PM",
    services: ["Engine Tuning"],
    status: "Completed",
  },
  {
    id: "3",
    centerName: "Premium Motors & Repairs",
    location: "Kollupitiya, 2.0 km away",
    date: "2025-08-02",
    time: "03:00 PM",
    services: ["Full Vehicle Inspection"],
    status: "Confirmed",
  },
  {
    id: "4",
    centerName: "City Auto Care Center",
    location: "Colombo 03, 2.5 km away",
    date: "2025-07-20",
    time: "10:00 AM",
    services: ["Oil Change", "AC Service"],
    status: "Pending",
  },
  {
    id: "5",
    centerName: "City Auto Care Center",
    location: "Colombo 03, 2.5 km away",
    date: "2025-07-20",
    time: "10:00 AM",
    services: ["Oil Change"],
    status: "Confirmed",
  },
  {
    id: "6",
    centerName: "City Auto Care Center",
    location: "Colombo 03, 2.5 km away",
    date: "2025-07-20",
    time: "10:00 AM",
    services: ["Oil Change", "AC Service"],
    status: "Completed",
  },
  {
    id: "7",
    centerName: "City Auto Care Center",
    location: "Colombo 03, 2.5 km away",
    date: "2025-07-20",
    time: "10:00 AM",
    services: ["Oil Change", "AC Service"],
    status: "Pending",
  },
  {
    id: "8",
    centerName: "City Auto Care Center",
    location: "Colombo 03, 2.5 km away",
    date: "2025-07-20",
    time: "10:00 AM",
    services: ["Oil Change", "AC Service"],
    status: "Confirmed",
  },
  {
    id: "9",
    centerName: "City Auto Care Center",
    location: "Colombo 03, 2.5 km away",
    date: "2025-07-20",
    time: "10:00 AM",
    services: ["Oil Change", "AC Service"],
    status: "Completed",
  },
  {
    id: "10",
    centerName: "City Auto Care Center",
    location: "Colombo 03, 2.5 km away",
    date: "2025-07-20",
    time: "10:00 AM",
    services: ["Oil Change", "AC Service"],
    status: "Cancelled",
  },
  {
    id: "11",
    centerName: "City Auto Care Center",
    location: "Colombo 03, 2.5 km away",
    date: "2025-07-20",
    time: "10:00 AM",
    services: ["Oil Change", "AC Service"],
    status: "Cancelled",
  },
  {
    id: "12",
    centerName: "City Auto Care Center",
    location: "Colombo 03, 2.5 km away",
    date: "2025-07-20",
    time: "10:00 AM",
    services: ["Oil Change", "AC Service"],
    status: "Cancelled",
  },
];

const tabStatusOrder = [
  { key: "PENDING", label: "Pending Services" },
  { key: "COMPLETED", label: "Completed Services" },
  { key: "CANCELLED", label: "Cancelled Services" },
];

const MyBookings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userContext = useContext(UserContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Real booking data state
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalResults: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Check for success message from booking creation or payment
  useEffect(() => {
    if (location.state?.successMessage) {
      setShowSuccessMessage(true);
      toast.success(location.state.successMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Clear the state to prevent showing message on refresh
      window.history.replaceState({}, document.title);

      // Hide the alert after 10 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 10000);
    }

    // Check for payment success
    if (location.state?.paymentSuccess) {
      const { paymentId, amount, bookingId } = location.state;

      toast.success(
        `💳 Payment completed successfully! LKR ${amount?.toLocaleString()} paid for booking ${bookingId}`,
        {
          position: "top-center",
          autoClose: 6000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            background: "linear-gradient(135deg, #4caf50, #2e7d32)",
            color: "white",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(76, 175, 80, 0.3)",
            fontSize: "14px",
            fontWeight: "600",
          },
        }
      );

      // Navigate to Completed Services tab to see the paid service
      setActiveTab(1); // Index 1 is "Completed Services"

      // Refresh bookings to show latest payment status
      const activeStatus = tabStatusOrder[1].key; // COMPLETED
      fetchBookings(activeStatus);

      // Clear the state to prevent showing message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Fetch user bookings
  const fetchBookings = async (status = null, page = 1) => {
    try {
      setIsLoadingBookings(true);
      const params = {
        page,
        limit: 10,
        ...(status && { status }),
        ...(searchTerm && { search: searchTerm }),
      };

      console.log("🔍 Fetching bookings with params:", params);
      const response = await bookingApi.getUserBookings(params);

      if (response.success) {
        console.log("✅ Bookings fetched successfully:", response.data);
        const fetchedBookings = response.data.bookings || [];
        setBookings(fetchedBookings);
        setPagination(response.data.pagination || {});

        // Fetch payment status for completed bookings
        if (status === "COMPLETED") {
          fetchedBookings.forEach((booking) => {
            if (booking.status === "COMPLETED") {
              fetchPaymentStatus(booking._id);
            }
          });
        }
      } else {
        console.error("❌ Failed to fetch bookings:", response);
        toast.error("Failed to load bookings");
        setBookings([]);
      }
    } catch (error) {
      console.error("❌ Error fetching bookings:", error);
      toast.error("Failed to load bookings");
      setBookings([]);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  // Fetch payment status for a booking
  const fetchPaymentStatus = async (bookingId) => {
    try {
      const response = await servicePaymentApi.getPaymentByBooking(bookingId);
      if (response.success && response.data.payment) {
        setBookingPayments((prev) => ({
          ...prev,
          [bookingId]: response.data.payment,
        }));
      }
    } catch (error) {
      // Silent fail - payment might not exist yet
      console.log("No payment found for booking:", bookingId);
    }
  };

  // Handle payment button click
  const handlePayment = async (booking) => {
    const bookingId = booking._id;

    // Check if service report exists
    if (!booking.serviceReport) {
      toast.warning(
        "Service report has not been created yet by the service center. Please contact them to complete the service report before making payment.",
        {
          autoClose: 7000,
        }
      );
      return;
    }

    // Check if already paid
    const payment = bookingPayments[bookingId];
    if (payment && payment.paymentStatus === "COMPLETED") {
      toast.info("This service has already been paid for!");
      return;
    }

    try {
      setLoadingPayments((prev) => ({ ...prev, [bookingId]: true }));

      // Create payment session
      const response = await servicePaymentApi.createPaymentSession(bookingId);

      if (response.success && response.data.sessionUrl) {
        // Redirect to Stripe checkout
        window.location.href = response.data.sessionUrl;
      } else {
        toast.error("Failed to create payment session");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);

      // Extract more specific error message
      const errorMessage =
        error.error?.message || error.message || "Failed to initiate payment";

      toast.error(errorMessage, {
        autoClose: 7000,
      });
    } finally {
      setLoadingPayments((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  // Load bookings on component mount and tab change
  useEffect(() => {
    const activeStatus = tabStatusOrder[activeTab].key;
    fetchBookings(activeStatus);
  }, [activeTab]);

  // Reload bookings when search term changes (with debounce)
  useEffect(() => {
    if (searchTerm.trim()) {
      const debounceTimer = setTimeout(() => {
        const activeStatus = tabStatusOrder[activeTab].key;
        fetchBookings(activeStatus);
      }, 500);

      return () => clearTimeout(debounceTimer);
    } else {
      // If search is cleared, reload without search
      const activeStatus = tabStatusOrder[activeTab].key;
      fetchBookings(activeStatus);
    }
  }, [searchTerm]);

  // Store ratings keyed by booking id
  const [bookingRatings, setBookingRatings] = useState({});
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [currentComment, setCurrentComment] = useState("");
  const [bookingToRate, setBookingToRate] = useState(null);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [overlayBooking, setOverlayBooking] = useState(null); //overlay window
  const [overlayContent, setOverlayContent] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Payment state
  const [bookingPayments, setBookingPayments] = useState({});
  const [loadingPayments, setLoadingPayments] = useState({});


  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSearchTerm(""); // clear search on tab change
  };

  // Helper function to check if booking can be edited/cancelled (6 hours before appointment)
  const canModifyBooking = (booking) => {
    const now = new Date();
    const appointmentDateTime = new Date(
      `${booking.preferredDate}T${booking.preferredTimeSlot}`
    );
    const timeDifference = appointmentDateTime.getTime() - now.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    return (
      hoursDifference >= 6 &&
      (booking.status === "CONFIRMED" || booking.status === "PENDING")
    );
  };

  // Filter bookings based on current tab
  const filteredBookings = bookings.filter((booking) => {
    const activeStatus = tabStatusOrder[activeTab].key;
    // Show CONFIRMED bookings in PENDING tab
    if (activeStatus === "PENDING") {
      return booking.status === "PENDING" || booking.status === "CONFIRMED";
    }
    return booking.status === activeStatus;
  });

  const handleViewDetails = (booking) => {
    // Convert booking data to match the existing BookingDetailsPage format
    const convertedBooking = {
      id: booking.bookingId || booking._id,
      centerName:
        booking.serviceCenter?.businessInfo?.businessName ||
        "Unknown Service Center",
      location:
        booking.serviceCenter?.address?.fullAddress || "No address provided",
      date: new Date(booking.preferredDate).toISOString().split("T")[0],
      time: booking.preferredTimeSlot,
      services: booking.services || [],
      status: booking.status,
      vehicle: booking.vehicle,
      contactInfo: booking.contactInfo,
      specialRequests: booking.additionalNotes,
      estimatedCost: booking.estimatedCost || 0,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      serviceCenterResponse: booking.serviceCenterResponse, // Include service center response
      feedback: booking.feedback, // Include feedback if available
    };

    setOverlayBooking(convertedBooking);
    setOverlayContent(
      <BookingDetailsPage
        booking={convertedBooking}
        onClose={() => setOverlayContent(null)}
      />
    );
  };

  const handleEdit = async (booking) => {
    if (!canModifyBooking(booking)) {
      toast.error("Cannot edit booking less than 6 hours before appointment");
      return;
    }

    // Navigate to booking form with edit mode
    navigate("/book-service", {
      state: {
        editMode: true,
        booking: booking,
        serviceCenter: booking.serviceCenter,
      },
    });
  };

  const handleCancel = async (bookingId, reason = "Cancelled by user") => {
    try {
      const response = await bookingApi.cancelBooking(bookingId, reason);
      if (response.success) {
        toast.success("Booking cancelled successfully!");
        // Refresh bookings
        const activeStatus = tabStatusOrder[activeTab].key;
        fetchBookings(activeStatus);
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    }
  };

  const handleReschedule = handleEdit;

  // Open rating dialog for selected booking
  const openRatingForBooking = (booking) => {
    setBookingToRate(booking);
    setCurrentRating(0);
    setCurrentComment("");
    setRatingDialogOpen(true);
  };

  // Submit rating
  const submitRating = async () => {
    if (!currentRating || currentRating < 1) {
      toast.error("Please select a rating.");
      return;
    }

    setSubmittingRating(true);

    try {
      const feedbackData = {
        rating: currentRating,
        comment: currentComment.trim() || undefined,
      };

      const response = await bookingApi.submitFeedback(
        bookingToRate._id,
        feedbackData
      );

      if (response.success) {
        // Update local state to show the rating was submitted
        setBookingRatings((prev) => ({
          ...prev,
          [bookingToRate._id]: currentRating,
        }));

        // Success animation feedback
        toast.success(
          `🌟 Rating submitted successfully! Thank you for your ${
            currentRating === 1
              ? "honest"
              : currentRating === 2
              ? "valuable"
              : currentRating === 3
              ? "helpful"
              : currentRating === 4
              ? "positive"
              : "excellent"
          } feedback!`,
          {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            style: {
              background: "linear-gradient(135deg, #7AB2D3, #4A628A)",
              color: "white",
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(122, 178, 211, 0.3)",
              fontSize: "14px",
              fontWeight: "600",
            },
          }
        );

        // Close dialog with slight delay to show success feedback
        setTimeout(() => {
          setRatingDialogOpen(false);
          setCurrentRating(0);
          setCurrentComment("");
        }, 1000);

        // Refresh bookings to get updated data
        const activeStatus = tabStatusOrder[activeTab].key;
        await fetchBookings(activeStatus);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating. Please try again.", {
        position: "top-center",
        style: {
          background: "linear-gradient(135deg, #495057, #6c757d)",
          color: "white",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: "600",
        },
      });
    } finally {
      setSubmittingRating(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#e9f7ef", minHeight: "100vh", py: 3 }}>
      <style>
        {`
          .booking-grid-container {
            display: grid !important;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)) !important;
            gap: 24px !important;
            max-width: 1200px !important;
            margin: 0 auto !important;
            padding: 0 16px !important;
            align-items: stretch !important;
          }
          
          .booking-grid-container > div {
            display: flex !important;
            height: 100% !important;
          }
          
          .booking-grid-container > div > .MuiPaper-root {
            width: 100% !important;
            height: 100% !important;
          }
          
          @media (min-width: 900px) {
            .booking-grid-container {
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 24px !important;
              padding: 0 32px !important;
            }
          }
          
          @media (max-width: 899px) and (min-width: 600px) {
            .booking-grid-container {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 20px !important;
              padding: 0 24px !important;
            }
          }
          
          @media (max-width: 599px) {
            .booking-grid-container {
              grid-template-columns: 1fr !important;
              gap: 16px !important;
              padding: 0 16px !important;
            }
          }
        `}
      </style>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <AssignmentTurnedIn sx={{ fontSize: 40, color: "#4a628a" }} />
          <Typography sx={{ fontSize: 32, fontWeight: 700 }}>
            My Bookings
          </Typography>
          <Typography
            sx={{ fontSize: 14, fontWeight: 500 }}
            color="text.secondary"
          >
            Review your upcoming and past vehicle service appointments.
          </Typography>
        </Box>

        {/* Success message */}
        {showSuccessMessage && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            onClose={() => setShowSuccessMessage(false)}
          >
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              🎉 Booking Confirmed!
            </Typography>
            <Typography variant="body2">
              Your service appointment has been successfully booked. You can
              view and manage it below.
            </Typography>
          </Alert>
        )}

        {/* Search bar only */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            placeholder={`Search by ID, center, or service in ${tabStatusOrder[activeTab].label}`}
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
        </Paper>

        {/* Tabs */}
        <Paper sx={{ boxShadow: "none", background: "#e9f7ef", mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="booking status tabs"
          >
            {tabStatusOrder.map(({ key, label }) => (
              <Tab
                key={key}
                label={label}
                sx={{
                  fontWeight: 600,
                  fontSize: 16,
                  textTransform: "none",
                  minWidth: 170,
                }}
              />
            ))}
          </Tabs>
        </Paper>

        <Divider sx={{ mb: 2 }} />

        {/* Tab Panel - only current tab's bookings with search */}
        <Box key={tabStatusOrder[activeTab].key} sx={{ width: "100%" }}>
          {isLoadingBookings ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredBookings && filteredBookings.length > 0 ? (
            <div className="booking-grid-container">
              {filteredBookings.map((booking) => {
                const canModify = canModifyBooking(booking);
                return (
                  <div key={booking._id || booking.bookingId}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 3,
                        minHeight: 450,
                        width: '100%',
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 3,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                        }
                      }}
                    >
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 2,
                            gap: 1,
                            minHeight: 60
                          }}
                        >
                          <Typography 
                            sx={{ 
                              fontSize: 18, 
                              fontWeight: 700,
                              flex: 1,
                              lineHeight: 1.3,
                              mr: 1
                            }}
                          >
                            {booking.serviceCenter?.businessInfo
                              ?.businessName || "Unknown Service Center"}
                          </Typography>
                          <Chip
                            label={booking.status}
                            color={
                              booking.status === "CONFIRMED"
                                ? "success"
                                : booking.status === "PENDING"
                                ? "warning"
                                : booking.status === "COMPLETED"
                                ? "default"
                                : "error"
                            }
                            variant="outlined"
                            size="small"
                            sx={{ fontSize: 12, fontWeight: 500 }}
                          />
                        </Box>

                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <LocationOn fontSize="small" color="action" />
                          <Typography 
                            sx={{ 
                              fontSize: 14, 
                              fontWeight: 500,
                              lineHeight: 1.4
                            }}
                          >
                            {booking.serviceCenter?.address?.fullAddress ||
                              "No address provided"}
                          </Typography>
                        </Box>

                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1}
                          mb={1}
                        >
                          <CalendarToday fontSize="small" color="action" />
                          <Typography 
                            sx={{ 
                              fontSize: 14, 
                              fontWeight: 500,
                              lineHeight: 1.4
                            }}
                          >
                            {new Date(
                              booking.preferredDate
                            ).toLocaleDateString()}{" "}
                            at {booking.preferredTimeSlot}
                          </Typography>
                        </Box>

                        <Typography
                          sx={{ 
                            fontSize: 14, 
                            fontWeight: 500, 
                            mt: 1,
                            mb: 1.5
                          }}
                          color="text.secondary"
                        >
                          Booking ID: {booking.bookingId || booking._id}
                        </Typography>

                        <Typography
                          sx={{ 
                            fontSize: 16, 
                            fontWeight: 600, 
                            mt: 1, 
                            mb: 1 
                          }}
                        >
                          Services:
                        </Typography>

                        <Box
                          sx={{ 
                            display: "flex", 
                            flexWrap: "wrap", 
                            gap: 0.8,
                            mb: 2,
                            flex: 1,
                            alignContent: 'flex-start'
                          }}
                        >
                          {(booking.services || []).map((s, idx) => (
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
                          mt: 'auto',
                          pt: 2,
                          display: "flex",
                          flexDirection: "column",
                          gap: 1.5,
                          borderTop: "1px solid #f0f0f0",
                          minHeight: 80
                        }}
                      >
                        {/* View Details Button - Always First */}
                        <Box sx={{ display: "flex", width: "100%" }}>
                          <Button
                            variant="outlined"
                            size="medium"
                            fullWidth
                            onClick={() => handleViewDetails(booking)}
                            sx={{
                              fontSize: 13,
                              fontWeight: 600,
                              py: 1.2,
                              borderWidth: 2,
                              "&:hover": {
                                borderWidth: 2
                              }
                            }}
                          >
                            View Details
                          </Button>
                        </Box>

                        {/* Status-specific actions - Second Row */}
                        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>

                          {booking.status === "PENDING" && (
                            <>
                              <Button
                                variant="outlined"
                                size="medium"
                                color="primary"
                                startIcon={<EditIcon />}
                                onClick={() => handleEdit(booking)}
                                sx={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  flex: 1,
                                  py: 1,
                                  minWidth: 110
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="contained"
                                size="medium"
                                color="error"
                                startIcon={<CancelIcon />}
                                onClick={() => handleCancel(booking._id)}
                                sx={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  flex: 1,
                                  py: 1,
                                  minWidth: 110
                                }}
                              >
                                Cancel
                              </Button>
                            </>
                          )}

                          {booking.status === "CONFIRMED" && canModify && (
                            <>
                              <Button
                                variant="outlined"
                                size="medium"
                                color="primary"
                                startIcon={<EditIcon />}
                                onClick={() => handleEdit(booking)}
                                sx={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  flex: 1,
                                  py: 1,
                                  minWidth: 110
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="contained"
                                size="medium"
                                color="error"
                                startIcon={<CancelIcon />}
                                onClick={() => handleCancel(booking._id)}
                                sx={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  flex: 1,
                                  py: 1,
                                  minWidth: 110
                                }}
                              >
                                Cancel
                              </Button>
                            </>
                          )}

                          {booking.status === "CONFIRMED" && !canModify && (
                            <Button
                              variant="outlined"
                              size="medium"
                              fullWidth
                              disabled
                              sx={{ fontSize: 12, fontWeight: 600, py: 1 }}
                            >
                              Too late to modify (&lt; 6h)
                            </Button>
                          )}

                          {booking.status === "COMPLETED" && (
                            <>
                              {/* Payment Button or Status */}
                              {(() => {
                                const payment = bookingPayments[booking._id];
                                const isLoading = loadingPayments[booking._id];
                                const isPaid = payment?.paymentStatus === "COMPLETED";

                                if (isPaid) {
                                  return (
                                    <Chip
                                      label="Paid ✓"
                                      color="success"
                                      size="medium"
                                      sx={{
                                        fontSize: 13,
                                        fontWeight: 700,
                                        height: 40,
                                        flex: 1,
                                        minWidth: 120,
                                        "& .MuiChip-label": {
                                          px: 2
                                        }
                                      }}
                                    />
                                  );
                                }

                                return (
                                  <Button
                                    variant="contained"
                                    size="medium"
                                    startIcon={
                                      isLoading ? (
                                        <CircularProgress size={18} sx={{ color: "white" }} />
                                      ) : (
                                        <PaymentIcon />
                                      )
                                    }
                                    onClick={() => handlePayment(booking)}
                                    disabled={isLoading}
                                    sx={{
                                      fontSize: 13,
                                      fontWeight: 700,
                                      borderRadius: 2,
                                      flex: 1,
                                      py: 1,
                                      minWidth: 120,
                                      background: "linear-gradient(45deg, #4caf50, #2e7d32)",
                                      "&:hover": {
                                        background: "linear-gradient(45deg, #2e7d32, #4caf50)",
                                      },
                                      "&:disabled": {
                                        background: "#ccc",
                                      },
                                    }}
                                  >
                                    {isLoading ? "Processing..." : "Pay Now"}
                                  </Button>
                                );
                              })()}

                              {/* Rating Button or Display */}
                              {booking.feedback?.rating ||
                              bookingRatings[booking._id] ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 1,
                                    px: 2,
                                    py: 1,
                                    borderRadius: 2,
                                    background: "linear-gradient(135deg, #DFF2EB 0%, #B9E5E8 100%)",
                                    border: "2px solid #7AB2D3",
                                    flex: 1,
                                    minWidth: 140,
                                    height: 40
                                  }}
                                >
                                  <StarIcon sx={{ color: "#7AB2D3", fontSize: 18 }} />
                                  <Rating
                                    value={
                                      booking.feedback?.rating ||
                                      bookingRatings[booking._id]
                                    }
                                    readOnly
                                    size="small"
                                    sx={{
                                      "& .MuiRating-iconFilled": {
                                        color: "#7AB2D3",
                                        fontSize: "1.1rem"
                                      },
                                    }}
                                  />
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "#4A628A",
                                      fontWeight: 700,
                                      fontSize: "0.8rem"
                                    }}
                                  >
                                    Rated
                                  </Typography>
                                </Box>
                              ) : (
                                <Button
                                  variant="contained"
                                  size="medium"
                                  startIcon={<StarIcon />}
                                  sx={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    borderRadius: 2,
                                    flex: 1,
                                    py: 1,
                                    minWidth: 140,
                                    background: "linear-gradient(45deg, #7AB2D3, #4A628A)",
                                    "&:hover": {
                                      background: "linear-gradient(45deg, #4A628A, #7AB2D3)",
                                    }
                                  }}
                                  onClick={() => openRatingForBooking(booking)}
                                >
                                  Rate Service
                                </Button>
                              )}
                            </>
                          )}

                          {booking.status === "CANCELLED" && (
                            <Button
                              variant="contained"
                              size="medium"
                              color="primary"
                              fullWidth
                              onClick={() => handleReschedule(booking)}
                              sx={{
                                fontSize: 13,
                                fontWeight: 600,
                                py: 1.2
                              }}
                            >
                              Reschedule
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  </div>
                );
              })}
            </div>
          ) : (
            <Box sx={{ width: "100%" }}>
              <Typography
                variant="body1"
                sx={{ mt: 4, textAlign: "center", color: "#aaa" }}
              >
                No {tabStatusOrder[activeTab].label.toLowerCase()} found.
              </Typography>
            </Box>
          )}
        </Box>

        {/* Enhanced Rating Dialog */}
        <Dialog
          open={ratingDialogOpen}
          onClose={() => setRatingDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              background: "linear-gradient(135deg, #DFF2EB 0%, #B9E5E8 100%)",
              boxShadow: "0 20px 40px rgba(74, 98, 138, 0.15)",
              overflow: "hidden",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background:
                  "linear-gradient(90deg, #DFF2EB, #B9E5E8, #7AB2D3, #4A628A)",
                animation: "shimmer 2s ease-in-out infinite",
              },
              "@keyframes shimmer": {
                "0%": { transform: "translateX(-100%)" },
                "100%": { transform: "translateX(100%)" },
              },
            },
          }}
        >
          <DialogTitle
            sx={{
              textAlign: "center",
              pb: 1,
              pt: 4,
              background: "transparent",
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mb: 1,
              }}
            >
              <StarIcon sx={{ color: "#7AB2D3", fontSize: 28 }} />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #7AB2D3, #4A628A)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Rate Your Experience
              </Typography>
              <StarIcon sx={{ color: "#7AB2D3", fontSize: 28 }} />
            </Box>
          </DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              p: 4,
              background: "transparent",
            }}
          >
            <Box
              sx={{
                textAlign: "center",
                p: 2,
                borderRadius: 3,
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(10px)",
                border: "1px solid #B9E5E8",
                boxShadow: "0 8px 32px rgba(74, 98, 138, 0.1)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  textAlign: "center",
                  color: "#2c3e50",
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                How was your experience with
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#4A628A",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                }}
              >
                {bookingToRate?.serviceCenter?.businessInfo?.businessName ||
                  bookingToRate?.centerName}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                p: 3,
                borderRadius: 3,
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid #B9E5E8",
                boxShadow: "0 8px 32px rgba(74, 98, 138, 0.1)",
                transition: "all 0.3s ease",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#6c757d",
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                Click to rate (1-5 stars)
              </Typography>

              <Rating
                name="rating"
                value={currentRating}
                onChange={(e, newValue) => setCurrentRating(newValue)}
                size="large"
                icon={
                  <StarIcon sx={{ color: "#7AB2D3", fontSize: "2.5rem" }} />
                }
                emptyIcon={
                  <StarBorderIcon
                    sx={{ color: "#B9E5E8", fontSize: "2.5rem" }}
                  />
                }
                sx={{
                  my: 1,
                  "& .MuiRating-iconFilled": {
                    color: "#7AB2D3",
                    filter: "drop-shadow(0 2px 4px rgba(122, 178, 211, 0.3))",
                    transform: "scale(1)",
                    transition: "all 0.2s ease",
                  },
                  "& .MuiRating-iconHover": {
                    color: "#4A628A",
                    transform: "scale(1.1)",
                    filter: "drop-shadow(0 4px 8px rgba(74, 98, 138, 0.4))",
                  },
                  "& .MuiRating-iconEmpty": {
                    color: "#B9E5E8",
                    transition: "all 0.2s ease",
                  },
                  "& .MuiRating-icon": {
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.15)",
                      filter:
                        "drop-shadow(0 4px 12px rgba(122, 178, 211, 0.5))",
                    },
                  },
                }}
              />

              {currentRating > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 1,
                    opacity: 0,
                    animation: "fadeIn 0.5s ease forwards",
                  }}
                >
                  <ThumbUpIcon sx={{ color: "#7AB2D3", fontSize: 20 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4A628A",
                      fontWeight: 600,
                    }}
                  >
                    {currentRating === 1 && "Poor"}
                    {currentRating === 2 && "Fair"}
                    {currentRating === 3 && "Good"}
                    {currentRating === 4 && "Very Good"}
                    {currentRating === 5 && "Excellent"}
                  </Typography>
                </Box>
              )}
            </Box>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Share your thoughts (Optional)"
              placeholder="Tell us about your experience..."
              value={currentComment}
              onChange={(e) => setCurrentComment(e.target.value)}
              variant="outlined"
              sx={{
                mt: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(255,255,255,0.95)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                  },
                  "&.Mui-focused": {
                    background: "rgba(255,255,255,1)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 35px rgba(0,0,0,0.15)",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#6c757d",
                  fontWeight: 500,
                },
              }}
            />

            <style>
              {`
                @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}
            </style>
          </DialogContent>
          <DialogActions
            sx={{
              p: 4,
              pt: 2,
              background: "transparent",
              gap: 2,
            }}
          >
            <Button
              onClick={() => setRatingDialogOpen(false)}
              disabled={submittingRating}
              variant="outlined"
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1,
                fontWeight: 600,
                border: "2px solid #6c757d",
                color: "#495057",
                background: "rgba(255,255,255,0.8)",
                transition: "all 0.3s ease",
                "&:hover": {
                  border: "2px solid #4A628A",
                  background: "rgba(255,255,255,0.95)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(74, 98, 138, 0.1)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={submitRating}
              disabled={!currentRating || currentRating < 1 || submittingRating}
              startIcon={
                submittingRating ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : (
                  <StarIcon sx={{ color: "white" }} />
                )
              }
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 700,
                fontSize: "1rem",
                background:
                  currentRating > 0
                    ? "linear-gradient(45deg, #7AB2D3, #4A628A)"
                    : "linear-gradient(45deg, #B9E5E8, #6c757d)",
                color: "white",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(122, 178, 211, 0.3)",
                "&:hover": {
                  background:
                    currentRating > 0
                      ? "linear-gradient(45deg, #4A628A, #7AB2D3)"
                      : "linear-gradient(45deg, #6c757d, #B9E5E8)",
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 25px rgba(122, 178, 211, 0.4)",
                },
                "&:disabled": {
                  background: "linear-gradient(45deg, #B9E5E8, #6c757d)",
                  color: "rgba(255,255,255,0.7)",
                  transform: "none",
                  boxShadow: "none",
                },
              }}
            >
              {submittingRating ? "Submitting..." : "Submit Rating"}
            </Button>
          </DialogActions>
        </Dialog>

        {overlayContent && (
          <OverlayWindow closeWindowFunction={() => setOverlayContent(null)}>
            {overlayContent}
          </OverlayWindow>
        )}
      </Container>
    </Box>
  );
};
export default MyBookings;
