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
  const [currentImage, setCurrentImage] = useState(0);

  if (!center) {
    return (
      <Container sx={{ py: 5 }}>
        <Typography sx={{ fontSize: 24, fontWeight: 600, color: "error.main" }}>
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
  
  {
    img: "https://picsum.photos/id/1015/600/400", // mechanical feel
    title: "Mechanic at Work"
  }
 
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
                <Typography sx={{ fontSize: 32, fontWeight: 700 }}>
                  {name}
                </Typography>
                {verified && (
                  <Chip
                    icon={<Verified />}
                    label="Verified"
                    color="success"
                    size="small"
                    sx={{ fontSize: 12, fontWeight: 500 }}
                  />
                )}
                {premium && (
                  <Chip
                    label="Premium"
                    color="warning"
                    size="small"
                    sx={{ fontSize: 12, fontWeight: 500, ml: 1 }}
                  />
                )}
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 1 }}>
                <LocationOn color="action" />
                <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{loc}</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 1,
                  gap: 3,
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Phone color="action" />
                  <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                    {phone || "Not available"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Email color="action" />
                  <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                    {email || "Not available"}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mt: 2, gap: 1 }}>
                <Star color="warning" />
                <Rating name="read-only" value={rating} precision={0.1} readOnly size="small" />
                <Typography sx={{ fontSize: 14, fontWeight: 500 }} color="text.secondary">
                  ({reviews} reviews)
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Services & Gallery Side by Side */}
          <Divider sx={{ my: 4 }} />
          <Grid container spacing={20}>
            {/* Services List */}
            <Grid item xs={12} md={6}>
              <Typography sx={{ fontSize: 24, fontWeight: 600 }} gutterBottom>
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
                      primaryTypographyProps={{ sx: { fontSize: 16, fontWeight: 500 } }}
                      secondaryTypographyProps={{ sx: { fontSize: 14, fontWeight: 500 } }}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>

            {/* Gallery Carousel */}
          <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "left",
                  width: "100%",
                  maxWidth: 300,
                  height: 250,
                  overflow: "hidden",
                  borderRadius: 2,
                  boxShadow: 1,
                  bgcolor: "#eee",
                }}
              >
                <Box
                  component="img"
                  src={galleryImages[currentImage].img}
                  alt={galleryImages[currentImage].title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    borderRadius: 2,
                  }}
                />

                <Button
                  onClick={() => setCurrentImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: -55,
                    transform: "translateY(-50%)",
                    minWidth: 0,
                    borderRadius: "25%",
                    zIndex: 1,
                    bgcolor: "#e9f7ef",
                    boxShadow: 2,
                  }}
                >
                  ‹
                </Button>
                <Button
                  onClick={() => setCurrentImage((prev) => (prev + 1) % galleryImages.length)}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: -55,
                    transform: "translateY(-50%)",
                    minWidth: 0,
                    borderRadius: "25%",
                    zIndex: 1,
                    bgcolor: "#e9f7ef",
                    boxShadow: 2,
                  }}
                >
                  ›
                </Button>
              </Box>
            </Grid>


          </Grid>

          {/* Availability */}
          <Divider sx={{ my: 4 }} />
          <Box>
            <Typography sx={{ fontSize: 24, fontWeight: 600 }} gutterBottom>
              Available Time Slots
            </Typography>
            <Grid container spacing={2}>
              {availableSlots.map((slot, i) => (
                <Grid item key={i}>
                  <Chip
                    label={slot}
                    color="primary"
                    variant="outlined"
                    sx={{ fontSize: 12, fontWeight: 500 }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Reviews Section */}
          <Divider sx={{ my: 4 }} />
          <Box>
            <Typography sx={{ fontSize: 24, fontWeight: 600 }} gutterBottom>
              Customer Reviews
            </Typography>
            <List dense sx={{ bgcolor: "#f5f5f5", borderRadius: 2 }}>
              {(showAllReviews ? reviewsData : reviewsData.slice(0, 2)).map((review, i) => (
                <ListItem key={i} alignItems="flex-start" sx={{ mb: 1 }}>
                  <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>
                    {review.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                      {review.name}
                    </Typography>
                    <Rating
                      value={review.rating}
                      precision={0.5}
                      size="small"
                      readOnly
                      sx={{ mt: 0.5, mb: 0.5 }}
                    />
                    <Typography sx={{ fontSize: 12, fontWeight: 500 }} color="text.secondary">
                      {review.comment}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
            {reviewsData.length > 2 && (
              <Box textAlign="center" mt={1}>
                <Button
                  size="small"
                  onClick={() => setShowAllReviews((prev) => !prev)}
                  sx={{ fontSize: 13, fontWeight: 500 }}
                >
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
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(-1)}
              sx={{ fontSize: 13, fontWeight: 500 }}
            >
              Back
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/service-booking-form", { state: { center } })}
              sx={{ fontSize: 13, fontWeight: 500 }}
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
