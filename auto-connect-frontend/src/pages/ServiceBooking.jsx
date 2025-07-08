import React from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Chip,
} from "@mui/material";
import { LocationOn, Star, Build } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const serviceCenters = [
   {
    id: 1,
    name: 'City Auto Care Center',
    location: 'Colombo 03, 2.5 km away',
    rating: 4.8,
    reviews: 127,
    services: ['Oil Change', 'Brake Service', 'Engine Repair', 'AC Service', 'Tire Service'],
    onTime: '95%',
    cost: 'Rs. 8,500',
    waitTime: '2 days',
    verified: true,
    premium: true
  },
  {
    id: 2,
    name: 'Express Motor Works',
    location: 'Colombo 05, 3.2 km away',
    rating: 4.5,
    reviews: 94,
    services: ['Battery Replacement', 'Engine Tuning', 'Wheel Alignment'],
    onTime: '92%',
    cost: 'Rs. 7,200',
    waitTime: '1 day',
    verified: true,
    premium: false
  },
  {
    id: 3,
    name: 'Green Garage Services',
    location: 'Nugegoda, 4.1 km away',
    rating: 4.3,
    reviews: 76,
    services: ['Hybrid Diagnostics', 'Full Service', 'AC Service'],
    onTime: '88%',
    cost: 'Rs. 9,300',
    waitTime: '3 days',
    verified: false,
    premium: false
  },
  {
    id: 4,
    name: 'AutoXpress Lanka',
    location: 'Rajagiriya, 6.7 km away',
    rating: 4.6,
    reviews: 105,
    services: ['Quick Service', 'Emission Testing', 'Tire Replacement'],
    onTime: '90%',
    cost: 'Rs. 6,800',
    waitTime: '1 day',
    verified: true,
    premium: false
  },
  {
    id: 5,
    name: 'Premium Motors & Repairs',
    location: 'Kollupitiya, 2.0 km away',
    rating: 4.9,
    reviews: 158,
    services: ['Full Vehicle Inspection', 'Suspension Repair', 'Interior Detailing'],
    onTime: '97%',
    cost: 'Rs. 11,500',
    waitTime: '2 days',
    verified: true,
    premium: true
  },
  {
    id: 6,
    name: 'DriveSure Auto Zone',
    location: 'Maharagama, 9.5 km away',
    rating: 4.1,
    reviews: 65,
    services: ['Transmission Service', 'Coolant Flush', 'AC Checkup'],
    onTime: '85%',
    cost: 'Rs. 5,900',
    waitTime: '3 days',
    verified: false,
    premium: false
  },
  {
    id: 7,
    name: 'QuickFix Garage',
    location: 'Bambalapitiya, 3.8 km away',
    rating: 4.4,
    reviews: 88,
    services: ['Oil Change', 'Brake Pad Replacement', 'Diagnostic Scan'],
    onTime: '91%',
    cost: 'Rs. 6,200',
    waitTime: '1 day',
    verified: true,
    premium: false
  },
  {
    id: 8,
    name: 'SmartTune Services',
    location: 'Kirulapone, 5.6 km away',
    rating: 4.7,
    reviews: 113,
    services: ['Tuning', 'Emission Test', 'Oil Change', 'Battery Service'],
    onTime: '93%',
    cost: 'Rs. 7,800',
    waitTime: '2 days',
    verified: true,
    premium: true
  },
  {
    id: 9,
    name: 'Elite Auto Haus',
    location: 'Battaramulla, 10.1 km away',
    rating: 4.2,
    reviews: 71,
    services: ['Body Wash', 'Waxing', 'Interior Vacuuming'],
    onTime: '89%',
    cost: 'Rs. 4,500',
    waitTime: '1 day',
    verified: false,
    premium: false
  },
  {
    id: 10,
    name: 'Titan Auto Experts',
    location: 'Wellawatte, 4.3 km away',
    rating: 4.6,
    reviews: 99,
    services: ['Engine Overhaul', 'Suspension Alignment', 'Wheel Balancing'],
    onTime: '94%',
    cost: 'Rs. 10,200',
    waitTime: '2 days',
    verified: true,
    premium: false
  }
  
];

const ServiceBookingApp = () => {
  const navigate = useNavigate();

  const handleBookAppointment = (centerId) => {
    navigate("/service-booking-form", { state: { centerId } });
  };

  const handleViewDetails = (center) => {
    navigate("/service-provider-profile", { state: { center } });
  };

  return (
    <Box
      sx={{ minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column" }}
    >
      {/* Header */}
      <Box sx={{ backgroundColor: "#7AB2D3", p: 2, color: "white" }}>
        <Container maxWidth="xl">
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Build />
              <Typography variant="h4">Auto Connect - Service Providers</Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: "orange", fontWeight: 500 }}>
                Dashboard&nbsp;&nbsp;My Bookings&nbsp;&nbsp;Service History
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, overflowY: "auto", backgroundColor: "#DFF2EB", p: 3 }}>
        <Container maxWidth="xl">
          <Paper sx={{ p: 2, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Service Booking
            </Typography>
            <Typography variant="body1">
              Find and book trusted service providers for your vehicle
            </Typography>
          </Paper>

          <Grid container spacing={4}>
            {serviceCenters.map((center) => (
              <Grid item xs={12} sm={6} md={4} key={center.id}>
                <Paper sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}
                  >
                    {center.name}
                    {center.verified && (
                      <Chip label="Verified" size="small" color="success" sx={{ ml: 1 }} />
                    )}
                    {center.premium && (
                      <Chip label="Premium" size="small" color="warning" sx={{ ml: 1 }} />
                    )}
                  </Typography>

                  <Box display="flex" alignItems="center" mt={1}>
                    <LocationOn fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">{center.location}</Typography>
                  </Box>

                  <Box display="flex" alignItems="center" mt={1}>
                    <Star fontSize="small" sx={{ color: "#f39c12", mr: 1 }} />
                    <Typography variant="body2">
                      {center.rating} ({center.reviews} reviews)
                    </Typography>
                  </Box>

                  <Box mt={2}>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                      Services Offered:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {center.services.join(", ")}
                    </Typography>
                  </Box>

                  <Box mt={2}>
                    <Typography variant="body2">
                      <strong>{center.onTime}</strong> On-time
                    </Typography>
                    <Typography variant="body2">
                      <strong>{center.cost}</strong> Avg. Cost
                    </Typography>
                    <Typography variant="body2">
                      <strong>{center.waitTime}</strong> Wait Time
                    </Typography>
                  </Box>

                  <Box mt={2} display="flex" gap={1}>
                    <Button variant="contained" onClick={() => handleBookAppointment(center.id)}>
                      Book Appointment
                    </Button>
                    <Button variant="outlined" onClick={() => handleViewDetails(center)}>
                      View Details
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default ServiceBookingApp;
