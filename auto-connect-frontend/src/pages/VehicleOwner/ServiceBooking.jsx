import React, { useState, useMemo, useEffect } from "react";
import ServiceProviderCard from "@components/ServiceProviderDetailsCard";
import ServiceBookingForm from "@components/ServiceBookingForm";
import ServiceProviderProfile from "./ServiceProviderProfile";
import OverlayWindow from "@components/OverlayWindow";
import { serviceCenterApi } from "../../services/serviceCenterApi";

import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Alert,
  Pagination,
} from "@mui/material";
import { LocationOn, Star, Build, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ServiceBookingApp = () => {
  const navigate = useNavigate();

  // State management
  const [serviceCenters, setServiceCenters] = useState([]);
  const [categories, setCategories] = useState(["All Categories"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overlay, setOverlay] = useState({
    open: false,
    type: null,
    center: null,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const itemsPerPage = 9; // 3x3 grid

  // Fetch service centers from backend
  const fetchServiceCenters = async (page = 1, resetResults = false) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        serviceCategory:
          selectedCategory !== "All Categories" ? selectedCategory : undefined,
        sortBy: sortBy !== "newest" ? sortBy : undefined,
      };

      const response = await serviceCenterApi.getServiceCenters(params);

      if (response.success) {
        if (resetResults || page === 1) {
          setServiceCenters(response.data.serviceCenters);
        } else {
          // For infinite scroll or load more functionality
          setServiceCenters((prev) => [
            ...prev,
            ...response.data.serviceCenters,
          ]);
        }

        setTotalPages(response.data.pagination.totalPages);
        setTotalResults(response.data.pagination.totalResults);
        setCurrentPage(response.data.pagination.currentPage);
      } else {
        throw new Error(response.message || "Failed to fetch service centers");
      }
    } catch (err) {
      console.error("Error fetching service centers:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load service centers"
      );
      setServiceCenters([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch service categories
  const fetchCategories = async () => {
    try {
      const response = await serviceCenterApi.getServiceCategories();
      if (response.success) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      // Keep default categories if fetch fails
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchCategories();
    fetchServiceCenters(1, true);
  }, []);

  // Fetch data when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchServiceCenters(1, true);
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, sortBy]);

  // Handle pagination
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    fetchServiceCenters(page, true);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle booking appointment
  const handleBookAppointment = (center) => {
    setOverlay({
      open: true,
      type: "book",
      center,
    });
  };

  // Handle view details
  const handleViewDetails = (center) => {
    setOverlay({
      open: true,
      type: "profile",
      center,
    });
  };

  // Close overlay
  const closeOverlay = () => {
    setOverlay({ open: false, type: null, center: null });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Main Content */}
      <Box
        sx={{ flex: 1, overflowY: "auto", backgroundColor: "#DFF2EB", p: 3 }}
      >
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
                {totalResults > 0 && (
                  <span style={{ color: "#666", marginLeft: 8 }}>
                    ({totalResults} service centers available)
                  </span>
                )}
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
                placeholder="Search by name, location, phone, or services"
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
              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel sx={{ fontSize: 14, fontWeight: 500 }}>
                  Service Category
                </InputLabel>
                <Select
                  value={selectedCategory}
                  label="Service Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  size="medium"
                  sx={{ fontSize: 14, fontWeight: 500 }}
                >
                  {categories.map((cat) => (
                    <MenuItem
                      key={cat}
                      value={cat}
                      sx={{ fontSize: 14, fontWeight: 500 }}
                    >
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 140 }}>
                <InputLabel sx={{ fontSize: 14, fontWeight: 500 }}>
                  Sort By
                </InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                  size="medium"
                  sx={{ fontSize: 14, fontWeight: 500 }}
                >
                  <MenuItem
                    value="newest"
                    sx={{ fontSize: 14, fontWeight: 500 }}
                  >
                    Newest
                  </MenuItem>
                  <MenuItem
                    value="rating"
                    sx={{ fontSize: 14, fontWeight: 500 }}
                  >
                    Highest Rated
                  </MenuItem>
                  <MenuItem
                    value="reviews"
                    sx={{ fontSize: 14, fontWeight: 500 }}
                  >
                    Most Reviews
                  </MenuItem>
                  <MenuItem value="name" sx={{ fontSize: 14, fontWeight: 500 }}>
                    Name A-Z
                  </MenuItem>
                  <MenuItem
                    value="location"
                    sx={{ fontSize: 14, fontWeight: 500 }}
                  >
                    Location
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 4,
              }}
            >
              <CircularProgress size={40} />
              <Typography sx={{ ml: 2, fontSize: 16, fontWeight: 500 }}>
                Loading service centers...
              </Typography>
            </Box>
          )}

          {/* Service Centers Grid */}
          {!loading && (
            <Box
              sx={{ display: "flex", justifyContent: "center", width: "100%" }}
            >
              <Grid
                container
                spacing={1}
                justifyContent="center"
                sx={{ maxWidth: 1200 }}
              >
                {serviceCenters.length > 0 ? (
                  serviceCenters.map((center) => (
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
                    <Paper sx={{ p: 4, textAlign: "center" }}>
                      <Typography
                        sx={{
                          fontSize: 18,
                          fontWeight: 500,
                          color: "#666",
                          mb: 2,
                        }}
                      >
                        No service centers found
                      </Typography>
                      <Typography sx={{ fontSize: 14, color: "#888" }}>
                        Try adjusting your search criteria or filters
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}

          {/* Pagination */}
          {!loading && serviceCenters.length > 0 && totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}

          {/* Overlay for booking and profile */}
          {overlay.open && (
            <OverlayWindow closeWindowFunction={closeOverlay}>
              {overlay.type === "book" && (
                <ServiceBookingForm center={overlay.center} />
              )}
              {overlay.type === "profile" && (
                <ServiceProviderProfile center={overlay.center} />
              )}
            </OverlayWindow>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default ServiceBookingApp;
