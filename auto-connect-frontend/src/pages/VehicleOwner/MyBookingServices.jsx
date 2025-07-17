import React, { useState } from "react";
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
} from "@mui/material";
import {
  LocationOn,
  CalendarToday,
  AssignmentTurnedIn,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

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
  { key: "Confirmed", label: "Confirmed Services" },
  { key: "Pending", label: "Pending Services" },
  { key: "Completed", label: "Completed Services" },
  { key: "Cancelled", label: "Cancelled Services" },
];

const MyBookings = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  // Store ratings keyed by booking id
  const [bookingRatings, setBookingRatings] = useState({});
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [bookingToRate, setBookingToRate] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSearchTerm(""); // clear search on tab change
  };

  const groupedBookings = {
    Confirmed: mockBookings.filter((b) => b.status === "Confirmed"),
    Pending: mockBookings.filter((b) => b.status === "Pending"),
    Completed: mockBookings.filter((b) => b.status === "Completed"),
    Cancelled: mockBookings.filter((b) => b.status === "Cancelled"),
  };

  const activeKey = tabStatusOrder[activeTab].key;
  const allBookings = groupedBookings[activeKey];

  const searchedBookings = searchTerm
    ? allBookings.filter((booking) => {
        const s = searchTerm.toLowerCase();
        return (
          booking.id.toLowerCase().includes(s) ||
          booking.centerName.toLowerCase().includes(s) ||
          booking.services.some((service) => service.toLowerCase().includes(s))
        );
      })
    : allBookings;

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

  const handleReschedule = (booking) => {
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
      alert("Provider not found for reschedule.");
    }
  };

  // Open rating dialog for selected booking
  const openRatingForBooking = (booking) => {
    setBookingToRate(booking);
    setCurrentRating(bookingRatings[booking.id] || 0);
    setRatingDialogOpen(true);
  };

  // Submit rating
  const submitRating = () => {
    if (!currentRating || currentRating < 1) {
      alert("Please select a rating.");
      return;
    }
    setBookingRatings((prev) => ({ ...prev, [bookingToRate.id]: currentRating }));
    setRatingDialogOpen(false);
    alert(`Thanks for rating booking ID: ${bookingToRate.id} with ${currentRating} stars.`);
  };

  return (
    <Box sx={{ backgroundColor: "#e9f7ef", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 0, textAlign: "left" }}>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{ fontSize: 13, fontWeight: 500 }}
          >
            Home
          </Button>
        </Box>

        <Box sx={{ textAlign: "center", mb: 3 }}>
          <AssignmentTurnedIn sx={{ fontSize: 40, color: "#4a628a" }} />
          <Typography sx={{ fontSize: 32, fontWeight: 700 }}>
            My Bookings
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 500 }} color="text.secondary">
            Review your upcoming and past vehicle service appointments.
          </Typography>
        </Box>

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
        <Box key={activeKey} sx={{ width: "100%" }}>
          <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 1200, mt: 0 }}>
            {searchedBookings && searchedBookings.length > 0 ? (
              searchedBookings.map((booking) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  sx={{ display: "flex", justifyContent: "center" }}
                  key={booking.id + booking.time + booking.status}
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
                          {booking.centerName}
                        </Typography>
                        <Chip
                          label={booking.status}
                          color={
                            booking.status === "Confirmed"
                              ? "success"
                              : booking.status === "Pending"
                              ? "warning"
                              : booking.status === "Completed"
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
                        alignItems: "center"
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

                      {booking.status === "Completed" && (
                        <>
                          {bookingRatings[booking.id] ? (
                            <Rating
                              value={bookingRatings[booking.id]}
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

                      {booking.status === "Cancelled" && (
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
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ mt: 4, textAlign: "center", color: "#aaa" }}>
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
          <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, p: 3 }}>
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
      </Container>
    </Box>
  );
};

export default MyBookings;
