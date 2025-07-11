import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating,
  Button,
  Grid,
  ImageList,
  ImageListItem,
} from "@mui/material";
import {
  LocationOn,
  Phone,
  Email,
  Verified,
  Star,
  Build,
  AccessTime,
  MonetizationOn,
  ThumbUp,
} from "@mui/icons-material";

const ServiceProviderProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const center = location.state?.center;

  const [showAllReviews, setShowAllReviews] = useState(false);

  if (!center) {
    return (
      <Container sx={{ py: 5 }}>
        <Typography variant="h6" color="error">
          No service provider data available.
        </Typography>
      </Container>
    );
  }

  const {
    name,
    location: loc,
    phone,
    email,
    services,
    rating,
    reviews,
    verified,
    premium,
    onTime,
    cost,
    waitTime,
  } = center;

  const pricedServices = services.map((service, i) => ({
    name: service,
    price: `Rs. ${(5000 + i * 750).toLocaleString()}`,
  }));

  const availableSlots = [
    "08:00 AM - 09:00 AM",
    "10:00 AM - 11:00 AM",
    "01:00 PM - 02:00 PM",
    "03:00 PM - 04:00 PM",
    "04:30 PM - 05:30 PM",
  ];

  const galleryImages = [
    { img: "https://source.unsplash.com/400x300/?garage", title: "Garage" },
    { img: "https://source.unsplash.com/400x300/?car-service", title: "Car Service" },
    { img: "https://source.unsplash.com/400x300/?auto-shop", title: "Workshop" },
  ];

  const reviewsData = [
    {
      name: "Nuwan Perera",
      comment: "Great service, very professional and timely. Highly recommended!",
      rating: 5,
    },
    {
      name: "Anushka Fernando",
      comment: "Clean workshop and knowledgeable staff. Will return.",
      rating: 4,
    },
    {
      name: "Dilani Madushani",
      comment: "Affordable and quick service. Minor delays but overall good.",
      rating: 4.5,
    },
    {
      name: "Ruwan Jayasuriya",
      comment: "Mechanics explained everything clearly. Trustworthy center.",
      rating: 5,
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", width: "100%", backgroundColor: "#DFF2EB", py: 5 }}>
      <Container maxWidth="md">
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(74, 98, 138, 0.15)",
          }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            <Avatar sx={{ width: 150, height: 150, flexShrink: 0 }}>
              {name.charAt(0)}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                <Typography variant="h4" fontWeight={700}>
                  {name}
                </Typography>
                {verified && (
                  <Chip icon={<Verified />} label="Verified" color="success" size="small" />
                )}
                {premium && (
                  <Chip label="Premium" color="warning" size="small" sx={{ ml: 1 }} />
                )}
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 1 }}>
                <LocationOn color="action" />
                <Typography variant="body1">{loc}</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 3, flexWrap: "wrap" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Phone color="action" />
                  <Typography variant="body2">{phone || "Not available"}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Email color="action" />
                  <Typography variant="body2">{email || "Not available"}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mt: 2, gap: 1 }}>
                <Star color="warning" />
                <Rating name="read-only" value={rating} precision={0.1} readOnly size="small" />
                <Typography variant="body2" color="text.secondary">
                  ({reviews} reviews)
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Services With Pricing */}
          <Divider sx={{ my: 4 }} />
          <Box>
            <Typography variant="h6" gutterBottom>
              Services & Pricing
            </Typography>
            <List dense>
              {pricedServices.map((item) => (
                <ListItem key={item.name}>
                  <ListItemIcon>
                    <Build />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    secondary={item.price}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Availability */}
          <Divider sx={{ my: 4 }} />
          <Box>
            <Typography variant="h6" gutterBottom>
              Available Time Slots
            </Typography>
            <Grid container spacing={2}>
              {availableSlots.map((slot, i) => (
                <Grid item key={i}>
                  <Chip label={slot} color="primary" variant="outlined" />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Image Gallery */}
          <Divider sx={{ my: 4 }} />
          <Box>
            <Typography variant="h6" gutterBottom>
              Workshop Gallery
            </Typography>
            <ImageList cols={3} rowHeight={120} gap={8}>
              {galleryImages.map((item, i) => (
                <ImageListItem key={i}>
                  <img
                    src={item.img}
                    alt={item.title}
                    loading="lazy"
                    style={{ borderRadius: 8 }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>

          {/* Reviews Section */}
          <Divider sx={{ my: 4 }} />
          <Box>
            <Typography variant="h6" gutterBottom>
              Customer Reviews
            </Typography>
            <List dense sx={{ bgcolor: "#f5f5f5", borderRadius: 2 }}>
              {(showAllReviews ? reviewsData : reviewsData.slice(0, 2)).map((review, i) => (
                <ListItem key={i} alignItems="flex-start" sx={{ mb: 1 }}>
                  <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>
                    {review.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {review.name}
                    </Typography>
                    <Rating
                      value={review.rating}
                      precision={0.5}
                      size="small"
                      readOnly
                      sx={{ mt: 0.5, mb: 0.5 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {review.comment}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
            {reviewsData.length > 2 && (
              <Box textAlign="center" mt={1}>
                <Button size="small" onClick={() => setShowAllReviews((prev) => !prev)}>
                  {showAllReviews ? "Hide Reviews" : "View All Reviews"}
                </Button>
              </Box>
            )}
          </Box>

          {/* Buttons */}
          <Box
            sx={{
              mt: 4,
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Button variant="contained" size="large" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/service-booking-form", { state: { center } })}
            >
              Book Appointment
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ServiceProviderProfile;
