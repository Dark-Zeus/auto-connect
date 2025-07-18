import React, { useState, useMemo } from "react";
import ServiceProviderCard from "@components/ServiceProviderDetailsCard"; // adjust the path if needed
import ServiceBookingForm from "@components/ServiceBookingForm";
import ServiceProviderProfile from "./ServiceProviderProfile";
import OverlayWindow from "@components/OverlayWindow"; // ✅ NEW IMPORT


import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { LocationOn, Star, Build, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const serviceCenters = [
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
    id: 3,
    name: "Green Garage Services",
    location: "Nugegoda, 4.1 km away",
    phone: "0774567890",
    rating: 4.3,
    reviews: 76,
    serviceCategories: ["Vehicle Maintenance"],
    services: ["Hybrid Diagnostics", "Full Service", "AC Service"],
    onTime: "88%",
    cost: "Rs. 9,300",
    waitTime: "3 days",
    verified: false,
    premium: false,
  },
  {
    id: 4,
    name: "AutoXpress Lanka",
    location: "Rajagiriya, 6.7 km away",
    phone: "0115678901",
    rating: 4.6,
    reviews: 105,
    serviceCategories: ["Emission Testing"],
    services: ["Quick Service", "Emission Testing", "Tire Replacement"],
    onTime: "90%",
    cost: "Rs. 6,800",
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
  {
    id: 6,
    name: "DriveSure Auto Zone",
    location: "Maharagama, 9.5 km away",
    phone: "0727890123",
    rating: 4.1,
    reviews: 65,
    serviceCategories: ["Vehicle Maintenance"],
    services: ["Transmission Service", "Coolant Flush", "AC Checkup"],
    onTime: "85%",
    cost: "Rs. 5,900",
    waitTime: "3 days",
    verified: false,
    premium: false,
  },
  {
    id: 7,
    name: "QuickFix Garage",
    location: "Bambalapitiya, 3.8 km away",
    phone: "0118901234",
    rating: 4.4,
    reviews: 88,
    serviceCategories: ["Vehicle Maintenance"],
    services: ["Oil Change", "Brake Pad Replacement", "Diagnostic Scan"],
    onTime: "91%",
    cost: "Rs. 6,200",
    waitTime: "1 day",
    verified: true,
    premium: false,
  },
  {
    id: 8,
    name: "SmartTune Services",
    location: "Kirulapone, 5.6 km away",
    phone: "0789012345",
    rating: 4.7,
    reviews: 113,
    serviceCategories: ["Emission Testing"],
    services: ["Tuning", "Emission Test", "Oil Change", "Battery Service"],
    onTime: "93%",
    cost: "Rs. 7,800",
    waitTime: "2 days",
    verified: true,
    premium: true,
  },
  {
    id: 9,
    name: "Elite Auto Haus",
    location: "Battaramulla, 10.1 km away",
    phone: "0112123456",
    rating: 4.2,
    reviews: 71,
    serviceCategories: ["Vehicle Maintenance"],
    services: ["Body Wash", "Waxing", "Interior Vacuuming"],
    onTime: "89%",
    cost: "Rs. 4,500",
    waitTime: "1 day",
    verified: false,
    premium: false,
  },
  {
    id: 10,
    name: "Titan Auto Experts",
    location: "Wellawatte, 4.3 km away",
    phone: "0728234567",
    rating: 4.6,
    reviews: 99,
    serviceCategories: ["Vehicle Repair"],
    services: ["Engine Overhaul", "Suspension Alignment", "Wheel Balancing"],
    onTime: "94%",
    cost: "Rs. 10,200",
    waitTime: "2 days",
    verified: true,
    premium: false,
  },
];

const categories = [
  "All Categories",
  "Vehicle Maintenance",
  "Vehicle Repair",
  "Emission Testing",
];

const ServiceBookingApp = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [overlay, setOverlay] = useState({open: false,type: null,center: null});

  const handleBookAppointment = (center) => {
  setOverlay({
    open: true,
    type: "book",
    center,
  });
};


  const handleViewDetails = (center) => {
  setOverlay({
    open: true,
    type: "profile",
    center,
  });
};

  const filteredCenters = useMemo(() => {
    return serviceCenters.filter((center) => {
      if (
        selectedCategory !== "All Categories" &&
        !center.serviceCategories.includes(selectedCategory)
      ) {
        return false;
      }

      const search = searchTerm.toLowerCase();
      return (
        center.name.toLowerCase().includes(search) ||
        center.location.toLowerCase().includes(search) ||
        (center.phone && center.phone.toLowerCase().includes(search)) ||
        center.services.some(service => service.toLowerCase().includes(search))
      );
    });
  }, [searchTerm, selectedCategory]);

  return (
    <Box sx={{ minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column" }}>
      {/* Main Content */}
      <Box sx={{ flex: 1, overflowY: "auto", backgroundColor: "#DFF2EB", p: 3 }}>
        <Container maxWidth="xl">
          {/* Title and description */}
          <Paper
            sx={{
              p: 2,
              mb: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 24, fontWeight: 600 }} gutterBottom>
                Service Booking
              </Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 500, mb: 0 }}>
                Find and book trusted service providers for your vehicle
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/services/appointments")}
              sx={{ whiteSpace: "nowrap", fontSize: 13, fontWeight: 500 }}
            >
              My Bookings
            </Button>
          </Paper>

          <Paper sx={{ p: 2, mb: 2 }}>
            {/* Search and Filter Controls */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 0 }}>
              <TextField
                placeholder="Search by name, location, or phone"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flex: 1, minWidth: 250 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                  sx: { fontSize: 14, fontWeight: 500 },
                }}
                size="medium"
              />
              <FormControl sx={{ minWidth: 220 }}>
                <InputLabel sx={{ fontSize: 14, fontWeight: 500 }}>
                  Main Service Category
                </InputLabel>
                <Select
                  value={selectedCategory}
                  label="Main Service Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  size="medium"
                  sx={{ fontSize: 14, fontWeight: 500 }}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat} sx={{ fontSize: 14, fontWeight: 500 }}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Paper>

          {/* Cards Grid */}
          <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: 1200 }}>
              {filteredCenters.length > 0 ? (
                filteredCenters.map((center) => (
                  <Grid item xs={12} sm={6} md={4} key={center.id}>
                    <ServiceProviderCard
                      center={center}
                      onBookAppointment={handleBookAppointment}
                      onViewDetails={handleViewDetails}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography sx={{ fontSize: 16, fontWeight: 500, mt: 4, textAlign: "center" }}>
                    No service providers found matching your criteria.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>

          {overlay.open && (
            <OverlayWindow closeWindowFunction={() => setOverlay({ open: false, type: null, center: null })}>
              {overlay.type === "book" && <ServiceBookingForm center={overlay.center} />}
              {overlay.type === "profile" && <ServiceProviderProfile center={overlay.center} />}
            </OverlayWindow>
          )}


        </Container>
      </Box>
    </Box>
  );
};

export default ServiceBookingApp;
