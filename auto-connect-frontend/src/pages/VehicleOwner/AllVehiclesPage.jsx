import React from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Chip,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

// Sample vehicle data (would come from RMV/database)
const allVehicles = [
  {
    id: "VH001",
    type: "Car",
    make: "Toyota",
    model: "Corolla",
    year: 2018,
    fuel: "Petrol",
    engineCapacity: "1500cc",
    transmission: "Automatic",
  },
  {
    id: "VH002",
    type: "SUV",
    make: "Nissan",
    model: "X-Trail",
    year: 2020,
    fuel: "Diesel",
    engineCapacity: "2000cc",
    transmission: "Manual",
  },
  {
    id: "CP-KD-3456",
    type: "SUV",
    make: "Mitsubishi",
    model: "Outlander",
    year: 2020,
    fuel: "Hybrid",
    engineCapacity: "2000cc",
    transmission: "Automatic",
  },
  {
    id: "VH004",
    type: "Truck",
    make: "Isuzu",
    model: "Elf",
    year: 2015,
    fuel: "Diesel",
    engineCapacity: "3000cc",
    transmission: "Manual",
  },
];

const AllVehiclesPage = () => {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f2f8f5", py: 5 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <DirectionsCarIcon sx={{ fontSize: 40, color: "#3c6e71", mb: 1 }} />
          <Typography sx={{ fontSize: 32, fontWeight: 700 }}>
            All Registered Vehicles in Sri Lanka
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.secondary" }}>
            View all RMV-registered vehicles and their basic details.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {allVehicles.map((vehicle) => (
            <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  backgroundColor: "#fff",
                }}
              >
                <Typography sx={{ fontSize: 18, fontWeight: 600, mb: 1 }}>
                  {vehicle.make} {vehicle.model}
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  <Chip label={`Type: ${vehicle.type}`} size="small" sx={{ fontSize: 12, fontWeight: 500 }} />
                  <Chip label={`Year: ${vehicle.year}`} size="small" sx={{ fontSize: 12, fontWeight: 500 }} />
                  <Chip label={`Fuel: ${vehicle.fuel}`} size="small" sx={{ fontSize: 12, fontWeight: 500 }} />
                  <Chip label={`Engine: ${vehicle.engineCapacity}`} size="small" sx={{ fontSize: 12, fontWeight: 500 }} />
                  <Chip label={`Transmission: ${vehicle.transmission}`} size="small" sx={{ fontSize: 12, fontWeight: 500 }} />
                </Box>

                <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.secondary" }}>
                  Vehicle Number: {vehicle.id}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default AllVehiclesPage;
