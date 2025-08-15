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
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import OverlayWindow from "@components/OverlayWindow";
import BookingDetailsPage from "./BookingDetailsPage";
import ServiceBookingForm from "@components/ServiceBookingForm";
import { UserContext } from "@contexts/UserContext";
import { bookingApi } from "@services/bookingApi";

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

  // Check for success message from booking creation
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
        setBookings(response.data.bookings || []);
        setPagination(response.data.pagination || {});
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
  const [bookingToRate, setBookingToRate] = useState(null);
  const [overlayBooking, setOverlayBooking] = useState(null); //overlay window
  const [overlayContent, setOverlayContent] = useState(null);

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
    setCurrentRating(bookingRatings[booking._id] || 0);
    setRatingDialogOpen(true);
  };

  // Submit rating
  const submitRating = () => {
    if (!currentRating || currentRating < 1) {
      toast.error("Please select a rating.");
      return;
    }
    setBookingRatings((prev) => ({
      ...prev,
      [bookingToRate._id]: currentRating,
    }));
    setRatingDialogOpen(false);
    toast.success(
      `Thank you for rating ${bookingToRate.serviceCenter?.businessInfo?.businessName}!`
    );
  };

  return (
    <Box sx={{ backgroundColor: "#e9f7ef", minHeight: "100vh", py: 3 }}>
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
          <Grid
            container
            spacing={2}
            justifyContent="center"
            sx={{ maxWidth: 1200, mt: 0 }}
          >
            {isLoadingBookings ? (
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center", py: 4 }}
              >
                <CircularProgress />
              </Grid>
            ) : filteredBookings && filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => {
                const canModify = canModifyBooking(booking);
                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    sx={{ display: "flex", justifyContent: "center" }}
                    key={booking._id || booking.bookingId}
                  >
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

                        <Box display="flex" alignItems="center" gap={1}>
                          <LocationOn fontSize="small" color="action" />
                          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                            {booking.serviceCenter?.address?.fullAddress ||
                              "No address provided"}
                          </Typography>
                        </Box>

                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1}
                          mt={0.5}
                        >
                          <CalendarToday fontSize="small" color="action" />
                          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                            {new Date(
                              booking.preferredDate
                            ).toLocaleDateString()}{" "}
                            at {booking.preferredTimeSlot}
                          </Typography>
                        </Box>

                        <Typography
                          sx={{ fontSize: 14, fontWeight: 500, mt: 1 }}
                          color="text.secondary"
                        >
                          Booking ID: {booking.bookingId || booking._id}
                        </Typography>

                        <Typography
                          sx={{ fontSize: 16, fontWeight: 500, mt: 1, mb: 0.5 }}
                        >
                          Services:
                        </Typography>

                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
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
                          mt: 2,
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 1,
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleViewDetails(booking)}
                          sx={{ fontSize: 13, fontWeight: 500 }}
                        >
                          View Details
                        </Button>

                        {booking.status === "PENDING" && (
                          <>
                            <Button
                              variant="outlined"
                              size="small"
                              color="primary"
                              startIcon={<EditIcon />}
                              onClick={() => handleEdit(booking)}
                              sx={{ fontSize: 13, fontWeight: 500 }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              startIcon={<CancelIcon />}
                              onClick={() => handleCancel(booking._id)}
                              sx={{ fontSize: 13, fontWeight: 500 }}
                            >
                              Cancel
                            </Button>
                          </>
                        )}

                        {booking.status === "CONFIRMED" && canModify && (
                          <>
                            <Button
                              variant="outlined"
                              size="small"
                              color="primary"
                              startIcon={<EditIcon />}
                              onClick={() => handleEdit(booking)}
                              sx={{ fontSize: 13, fontWeight: 500 }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              startIcon={<CancelIcon />}
                              onClick={() => handleCancel(booking._id)}
                              sx={{ fontSize: 13, fontWeight: 500 }}
                            >
                              Cancel
                            </Button>
                          </>
                        )}

                        {booking.status === "CONFIRMED" && !canModify && (
                          <Button
                            variant="outlined"
                            size="small"
                            disabled
                            sx={{ fontSize: 13, fontWeight: 500 }}
                          >
                            Too late to modify (&lt; 6h)
                          </Button>
                        )}

                        {booking.status === "COMPLETED" && (
                          <>
                            {bookingRatings[booking._id] ? (
                              <Rating
                                value={bookingRatings[booking._id]}
                                readOnly
                                size="small"
                              />
                            ) : (
                              <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                sx={{ fontSize: 13, fontWeight: 500 }}
                                onClick={() => openRatingForBooking(booking)}
                              >
                                Rate
                              </Button>
                            )}
                          </>
                        )}

                        {booking.status === "CANCELLED" && (
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            onClick={() => handleReschedule(booking)}
                            sx={{ fontSize: 13, fontWeight: 500 }}
                          >
                            Reschedule
                          </Button>
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                );
              })
            ) : (
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  sx={{ mt: 4, textAlign: "center", color: "#aaa" }}
                >
                  No {tabStatusOrder[activeTab].label.toLowerCase()} found.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Rating Dialog */}
        <Dialog
          open={ratingDialogOpen}
          onClose={() => setRatingDialogOpen(false)}
        >
          <DialogTitle>Rate Completed Service</DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              p: 3,
            }}
          >
            <Typography>
              Rate your experience with {bookingToRate?.centerName}
            </Typography>
            <Rating
              name="rating"
              value={currentRating}
              onChange={(e, newValue) => setCurrentRating(newValue)}
              size="large"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRatingDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={submitRating}>
              Submit
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
