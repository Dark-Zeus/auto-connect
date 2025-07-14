import React from "react";
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
} from "@mui/material";
import {
  LocationOn,
  Phone,
  Email,
  Verified,
  Star,
  Build,
} from "@mui/icons-material";

const ServiceProviderProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const center = location.state?.center;

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

  return (
    <Box
      sx={{ minHeight: "100vh", width: "100%", backgroundColor: "#DFF2EB", py: 5 }}
    >
      <Container maxWidth="md">
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(74, 98, 138, 0.15)",
          }}
        >
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            <Avatar sx={{ width: 150, height: 150, flexShrink: 0 }}>
              {name.charAt(0)}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}
              >
                <Typography variant="h4" fontWeight={700}>
                  {name}
                </Typography>
                {verified && (
                  <Chip
                    icon={<Verified />}
                    label="Verified"
                    color="success"
                    size="small"
                  />
                )}
                {premium && (
                  <Chip label="Premium" color="warning" size="small" sx={{ ml: 1 }} />
                )}
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 1 }}>
                <LocationOn color="action" />
                <Typography variant="body1">{loc}</Typography>
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
                  <Typography variant="body2">{phone}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Email color="action" />
                  <Typography variant="body2">{email}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mt: 2, gap: 1 }}>
                <Star color="warning" />
                <Rating
                  name="read-only"
                  value={rating}
                  precision={0.1}
                  readOnly
                  size="small"
                />
                <Typography variant="body2" color="text.secondary">
                  ({reviews} reviews)
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box>
            <Typography variant="h6" gutterBottom>
              Performance
            </Typography>
            <Typography variant="body2">
              <strong>{onTime}</strong> On-time
            </Typography>
            <Typography variant="body2">
              <strong>{cost}</strong> Avg. Cost
            </Typography>
            <Typography variant="body2">
              <strong>{waitTime}</strong> Wait Time
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box>
            <Typography variant="h6" gutterBottom>
              Services Offered
            </Typography>
            <List dense>
              {services.map((service) => (
                <ListItem key={service}>
                  <ListItemIcon>
                    <Build />
                  </ListItemIcon>
                  <ListItemText primary={service} />
                </ListItem>
              ))}
            </List>
          </Box>

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
