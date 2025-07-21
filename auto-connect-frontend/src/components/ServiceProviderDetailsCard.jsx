import React from "react";
import { Paper, Typography, Chip, Box, Button } from "@mui/material";
import { LocationOn, Star } from "@mui/icons-material";

const ServiceProviderCard = ({
  center,
  onBookAppointment,
  onViewDetails,
}) => {
  return (
    <Paper
      sx={{
        p: 3,
        minHeight: 450,
        width: 350,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}
    >
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Typography sx={{ fontSize:18, fontWeight: 1000 }}>
          {center.name}
        </Typography>
        
        <Typography sx={{ fontSize: 10, fontWeight: 500 }}>
          {center.rating} ({center.reviews} reviews)
        </Typography>
        <Star fontSize="small" sx={{ color: "#f39c12", mr: 0 }} />
       
      </Typography>
      <Box display="flex" alignItems="center" mt={1}>
        <LocationOn fontSize="small" sx={{ mr: 1 }} />
        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
          {center.location}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mt={1}>
        <Typography sx={{ fontSize: 14, fontWeight: 500, mr: 2 }}>
          📞 {center.phone}
        </Typography>
        
        
      </Box>
      <Box mt={2}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 0.5 }}>
          Service Categories:
        </Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 500 }} color="text.secondary">
          {center.serviceCategories.join(", ")}
        </Typography>
      </Box>
      <Box mt={1}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 0.5 }}>
          Services Offered:
        </Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 500 }} color="text.secondary">
          {center.services.join(", ")}
        </Typography>
      </Box>
      <Box mt={2}>
        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
          <strong>{center.onTime}</strong> On-time
        </Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
          <strong>{center.cost}</strong> Avg. Cost
        </Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
          <strong>{center.waitTime}</strong> Wait Time
        </Typography>
      </Box>
      <Box mt={2} display="flex" gap={1}>
        <Button
          variant="contained"
          onClick={() => onBookAppointment(center)}
          sx={{ fontSize: 13, fontWeight: 500 }}
        >
          Book Appointment
        </Button>
        <Button
          variant="outlined"
          onClick={() => onViewDetails(center)}
          sx={{ fontSize: 13, fontWeight: 500 }}
        >
          View Details
        </Button>
      </Box>
    </Paper>
  );
};

export default ServiceProviderCard;
