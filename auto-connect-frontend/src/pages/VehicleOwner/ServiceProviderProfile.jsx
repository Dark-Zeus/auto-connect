
import React, { useState, useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import galleryImages from "@components/ServiceProvider/ServiceProviderImages";

import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  LocationOn,
  Star,
  Phone,
  Email,
  CheckCircle,
  Schedule,
  AccessTime,
  Verified,
} from "@mui/icons-material";
import { serviceCenterApi } from "../../services/serviceCenterApi";
import "./ServiceProviderProfile.css";


const ServiceProviderProfile = ({ center }) => {
  const [serviceCenter, setServiceCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Fetch detailed service center data including operating hours
  useEffect(() => {
    const fetchServiceCenterDetails = async () => {
      if (!center?.id) {
        console.log("No center ID provided, using passed data");
        setServiceCenter(center);
        setLoading(false);
        return;
      }

      // Validate the ID format before making API call
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(center.id);
      if (!isValidObjectId) {
        console.warn("Invalid ObjectId format, using passed data:", center.id);
        setServiceCenter(center);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching service center details for ID:", center.id);
        const response = await serviceCenterApi.getServiceCenter(center.id);

        if (response.success) {
          setServiceCenter(response.data.serviceCenter);
          console.log("Successfully fetched service center details");
        } else {
          console.warn("API response not successful, using passed data");
          setServiceCenter(center); // Fallback to passed data
        }
      } catch (err) {
        console.error("Error fetching service center details:", err);
        console.log("Using passed center data as fallback");
        setError("Failed to load detailed service center information");
        setServiceCenter(center); // Fallback to passed data
      } finally {
        setLoading(false);
      }
    };

    fetchServiceCenterDetails();
  }, [center]);

  // Mock reviews data (you can fetch this from API later)
  const reviewsData = [
    {
      name: "Tharindu Perera",
      rating: 5,
      comment: "Excellent service! Very professional and timely.",
      date: "2025-01-10",
    },
    {
      name: "Kasuni Silva",
      rating: 4,
      comment: "Good work quality, reasonable prices.",
      date: "2025-01-08",
    },
    {
      name: "Roshan Fernando",
      rating: 5,
      comment: "Highly recommended! Great customer service.",
      date: "2025-01-05",
    },
  ];

  // Format operating hours for display
  const formatOperatingHours = (operatingHours) => {
    if (!operatingHours) return {};

    const daysOrder = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const dayNames = {
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday",
    };

    return daysOrder.map((day) => ({
      day: dayNames[day],
      ...operatingHours[day],
      key: day,
    }));
  };

  const isCurrentlyOpen = (operatingHours) => {
    if (!operatingHours) return false;

    const now = new Date();
    const currentDay = now
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase(); // ✅ Correct way to get day name
    const dayMap = {
      sun: "sunday",
      mon: "monday",
      tue: "tuesday",
      wed: "wednesday",
      thu: "thursday",
      fri: "friday",
      sat: "saturday",
    };

    const todayKey = dayMap[currentDay];
    const todayHours = operatingHours[todayKey];

    if (!todayHours || !todayHours.isOpen) return false;

    const currentTime = now.getHours() * 100 + now.getMinutes();
    const openTime = parseInt(todayHours.open.replace(":", ""));
    const closeTime = parseInt(todayHours.close.replace(":", ""));

    return currentTime >= openTime && currentTime <= closeTime;
  };

  if (loading) {
    return (
      <div className="service-provider-profile">
        <Container maxWidth="md">
          <div className="loading-container">
            <CircularProgress className="loading-spinner" />
            <Typography sx={{ ml: 2, color: "var(--navy-blue)" }}>
              Loading service center details...
            </Typography>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="service-provider-profile">
        <Container maxWidth="md">
          <Alert severity="error" className="error-alert">
            {error}
          </Alert>
        </Container>
      </div>
    );
  }

  if (!serviceCenter) {
    return (
      <div className="service-provider-profile">
        <Container maxWidth="md">
          <Alert severity="warning" className="error-alert">
            Service center details not available
          </Alert>
        </Container>
      </div>
    );
  }

  const operatingHoursData = formatOperatingHours(serviceCenter.operatingHours);
  const isOpen = isCurrentlyOpen(serviceCenter.operatingHours);

  return (
    <div className="service-provider-profile">
      <Container maxWidth="md">
        <Paper className="service-provider-card">
          {/* Header */}
          <Box className="profile-header">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  className="profile-title"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {serviceCenter.name}
                  {serviceCenter.verified && (
                    <Verified
                      className="profile-verified-icon"
                      sx={{ fontSize: 28 }}
                    />
                  )}
                </Typography>

                <Box className="profile-rating">
                  <Star className="star-icon" />
                  <Typography className="profile-rating-text">
                    {serviceCenter.rating || 0}
                  </Typography>
                  <Typography className="profile-rating-count">
                    ({serviceCenter.reviews || 0} reviews)
                  </Typography>
                  {serviceCenter.premium && (
                    <Chip
                      label="Premium"
                      className="premium-chip"
                      size="small"
                    />
                  )}
                </Box>

                <Box className="location-text">
                  <LocationOn className="location-icon" />
                  <Typography>{serviceCenter.location}</Typography>
                </Box>
              </Box>

              {/* Status Badge */}
              <Box className="status-badge-container">
                <Chip
                  icon={<AccessTime />}
                  label={isOpen ? "Open Now" : "Closed"}
                  className={isOpen ? "status-open" : "status-closed"}
                  variant="filled"
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" sx={{ color: "var(--navy-light)" }}>
                  Since {new Date(serviceCenter.joinedDate).getFullYear()}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Contact Information */}
          <div className="profile-section">
            <Typography variant="h6" className="section-title">
              <Phone />
              Contact Information
            </Typography>
            <Grid container className="contact-info-grid">
              <Grid item xs={12} sm={6}>
                <div className="contact-item">
                  <Phone className="contact-icon" />
                  <Typography className="contact-text">
                    {serviceCenter.phone}
                  </Typography>
                </div>
              </Grid>
              {serviceCenter.email && (
                <Grid item xs={12} sm={6}>
                  <div className="contact-item">
                    <Email className="contact-icon" />
                    <Typography className="contact-text">
                      {serviceCenter.email}
                    </Typography>
                  </div>
                </Grid>
              )}
            </Grid>
          </div>

          {/* Services Offered */}
          <Divider className="divider" />
          <div className="profile-section">
            <Typography variant="h6" className="section-title">
              <CheckCircle />
              Services Offered
            </Typography>
            <div className="services-container">
              {serviceCenter.services?.map((service, index) => (
                <Chip
                  key={index}
                  label={service}
                  className="service-chip"
                  variant="outlined"
                />
              ))}
            </div>
          </div>

          {/* Operating Hours */}
          <Divider className="divider" />
          <div className="profile-section">
            <Typography variant="h6" className="section-title">
              <Schedule />
              Operating Hours
            </Typography>

            {operatingHoursData.length > 0 ? (
              <TableContainer className="operating-hours-table">
                <Table size="small">
                  <TableHead className="table-header">
                    <TableRow>
                      <TableCell className="table-header-cell">Day</TableCell>
                      <TableCell className="table-header-cell">Hours</TableCell>
                      <TableCell className="table-header-cell">
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {operatingHoursData.map((dayInfo) => (
                      <TableRow key={dayInfo.key} className="table-row">
                        <TableCell className="table-cell day-cell">
                          {dayInfo.day}
                        </TableCell>
                        <TableCell className="table-cell">
                          {dayInfo.isOpen ? (
                            <span className="hours-text">
                              {dayInfo.open} - {dayInfo.close}
                            </span>
                          ) : (
                            <Typography className="hours-closed">
                              Closed
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell className="table-cell">
                          <Chip
                            label={dayInfo.isOpen ? "Open" : "Closed"}
                            className={
                              dayInfo.isOpen
                                ? "status-chip-open"
                                : "status-chip-closed"
                            }
                            size="small"
                            variant="filled"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info" className="error-alert">
                Operating hours information not available
              </Alert>
            )}
          </div>

          {/* Business Information */}
          {serviceCenter.businessInfo && (
            <>
              <Divider className="divider" />
              <div className="profile-section">
                <Typography variant="h6" className="section-title">
                  <CheckCircle />
                  Business Information
                </Typography>
                <Grid container spacing={2} className="contact-info-grid">
                  {serviceCenter.businessInfo.licenseNumber && (
                    <Grid item xs={12} sm={6}>
                      <div className="contact-item">
                        <Typography
                          variant="body2"
                          sx={{ color: "var(--navy-light)", fontWeight: 600 }}
                        >
                          License Number
                        </Typography>
                        <Typography
                          className="contact-text"
                          sx={{ fontWeight: 500, fontFamily: "monospace" }}
                        >
                          {serviceCenter.businessInfo.licenseNumber}
                        </Typography>
                      </div>
                    </Grid>
                  )}
                  {serviceCenter.businessInfo.businessRegistrationNumber && (
                    <Grid item xs={12} sm={6}>
                      <div className="contact-item">
                        <Typography
                          variant="body2"
                          sx={{ color: "var(--navy-light)", fontWeight: 600 }}
                        >
                          Registration Number
                        </Typography>
                        <Typography
                          className="contact-text"
                          sx={{ fontWeight: 500, fontFamily: "monospace" }}
                        >
                          {
                            serviceCenter.businessInfo
                              .businessRegistrationNumber
                          }
                        </Typography>
                      </div>
                    </Grid>
                  )}
                  {serviceCenter.businessInfo.taxIdentificationNumber && (
                    <Grid item xs={12} sm={6}>
                      <div className="contact-item">
                        <Typography
                          variant="body2"
                          sx={{ color: "var(--navy-light)", fontWeight: 600 }}
                        >
                          Tax ID Number
                        </Typography>
                        <Typography
                          className="contact-text"
                          sx={{ fontWeight: 500, fontFamily: "monospace" }}
                        >
                          {serviceCenter.businessInfo.taxIdentificationNumber}
                        </Typography>
                      </div>
                    </Grid>
                  )}
                  {serviceCenter.businessInfo.businessName && (
                    <Grid item xs={12} sm={6}>
                      <div className="contact-item">
                        <Typography
                          variant="body2"
                          sx={{ color: "var(--navy-light)", fontWeight: 600 }}
                        >
                          Business Name
                        </Typography>
                        <Typography
                          className="contact-text"
                          sx={{ fontWeight: 500 }}
                        >
                          {serviceCenter.businessInfo.businessName}
                        </Typography>
                      </div>
                    </Grid>
                  )}
                </Grid>
              </div>
            </>
          )}

          {/* Customer Reviews */}
          <Divider className="divider" />
          <div className="profile-section">
            <Typography variant="h6" className="section-title">
              <Star />
              Customer Reviews
            </Typography>

            <div className="reviews-section">
              {(showAllReviews ? reviewsData : reviewsData.slice(0, 2)).map(
                (review, index) => (
                  <div key={index} className="review-item">
                    <div className="review-header">
                      <Typography className="review-author">
                        {review.name}
                      </Typography>
                      <Typography className="review-date">
                        {new Date(review.date).toLocaleDateString()}
                      </Typography>
                    </div>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="review-star"
                          sx={{
                            opacity: i < review.rating ? 1 : 0.3,
                          }}
                        />
                      ))}
                    </div>
                    <Typography className="review-comment">
                      {review.comment}
                    </Typography>
                  </div>
                )
              )}
            </div>

            {reviewsData.length > 2 && (
              <Box textAlign="center">
                <Button
                  className="show-more-button"
                  onClick={() => setShowAllReviews(!showAllReviews)}
                >
                  {showAllReviews ? "Hide Reviews" : "View All Reviews"}
                </Button>
              </Box>
            )}
          </div>
        </Paper>
      </Container>
    </div>
  );
};

export default ServiceProviderProfile;
