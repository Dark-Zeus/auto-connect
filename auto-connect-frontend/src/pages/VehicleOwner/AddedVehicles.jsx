// src/pages/AddedVehicles.jsx - Simple display for your MongoDB data
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Box,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  DirectionsCar as CarIcon,
  Pending as PendingIcon,
  CheckCircle as CompletedIcon,
  Cancel as CancelledIcon,
  PlayArrow as ActiveIcon,
  Refresh as RefreshIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { UserContext } from "../../contexts/UserContext";
import { addedVehicleAPI } from "../../services/addedVehicleApiService";
import AddVehicleForm from "../components/AddVehicleForm";

const [showAddForm, setShowAddForm] = useState(false);
const [selectedVehicleForAdd, setSelectedVehicleForAdd] = useState(null);
const [submittingVehicle, setSubmittingVehicle] = useState(false);

const AddedVehicles = () => {
  const navigate = useNavigate();
  const { userContext: user } = useContext(UserContext);

  // Simple state
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    completed: 0,
    cancelled: 0,
  });

  // Check authentication
  useEffect(() => {
    if (!user) {
      toast.error("Please log in to access this page.");
      navigate("/login");
      return;
    }

    fetchData();
  }, [user, navigate]);

  // Fetch data from MongoDB
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🚀 Fetching added vehicles data...");

      // Call your API
      const response = await addedVehicleAPI.getAddedVehicles({
        page: 1,
        limit: 50, // Get more records to see all your data
      });

      console.log("📡 API Response:", response);

      if (response.success) {
        const vehicleData = response.data?.addedVehicles || [];
        setVehicles(vehicleData);

        // Calculate simple stats from the data
        const statsData = {
          total: vehicleData.length,
          pending: vehicleData.filter((v) => v.status === "PENDING").length,
          active: vehicleData.filter((v) => v.status === "ACTIVE").length,
          completed: vehicleData.filter((v) => v.status === "COMPLETED").length,
          cancelled: vehicleData.filter((v) => v.status === "CANCELLED").length,
        };
        setStats(statsData);

        console.log("✅ Loaded", vehicleData.length, "vehicles");
        console.log("📊 Stats:", statsData);
      } else {
        setError(response.message || "Failed to load vehicles");
        toast.error(response.message || "Failed to load vehicles");
      }
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      setError("Failed to load vehicle data");
      toast.error("Failed to load vehicle data");
    } finally {
      setLoading(false);
    }
  };

  // Utility functions
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "ACTIVE":
        return "info";
      case "COMPLETED":
        return "success";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <PendingIcon />;
      case "ACTIVE":
        return <ActiveIcon />;
      case "COMPLETED":
        return <CompletedIcon />;
      case "CANCELLED":
        return <CancelledIcon />;
      default:
        return <AssignmentIcon />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Vehicle Card Component
  const VehicleCard = ({ vehicle }) => (
    <Card
      sx={{
        mb: 2,
        border: 1,
        borderColor: "grey.300",
        "&:hover": { boxShadow: 3 },
      }}
    >
      <CardContent>
        {/* Header with registration and status */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box>
            <Typography variant="h6" color="primary" fontWeight="bold">
              {vehicle.vehicleId?.registrationNumber || "No Registration"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {vehicle.vehicleId?.make} {vehicle.vehicleId?.model}
              {vehicle.vehicleId?.yearOfManufacture &&
                ` (${vehicle.vehicleId.yearOfManufacture})`}
            </Typography>
          </Box>
          <Chip
            icon={getStatusIcon(vehicle.status)}
            label={vehicle.status || "UNKNOWN"}
            color={getStatusColor(vehicle.status)}
            size="small"
          />
        </Box>

        {/* Vehicle and service details */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <AssignmentIcon
                sx={{ mr: 1, color: "text.secondary", fontSize: 18 }}
              />
              <Typography variant="body2">
                <strong>Purpose:</strong> {vehicle.purpose || "N/A"}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={1}>
              <PersonIcon
                sx={{ mr: 1, color: "text.secondary", fontSize: 18 }}
              />
              <Typography variant="body2">
                <strong>Priority:</strong> {vehicle.priority || "N/A"}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={1}>
              <CalendarIcon
                sx={{ mr: 1, color: "text.secondary", fontSize: 18 }}
              />
              <Typography variant="body2">
                <strong>Scheduled:</strong> {formatDate(vehicle.scheduledDate)}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <PhoneIcon
                sx={{ mr: 1, color: "text.secondary", fontSize: 18 }}
              />
              <Typography variant="body2">
                <strong>Contact:</strong> {vehicle.contactInfo?.phone || "N/A"}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={1}>
              <LocationIcon
                sx={{ mr: 1, color: "text.secondary", fontSize: 18 }}
              />
              <Typography variant="body2">
                <strong>Location:</strong> {vehicle.location?.address || "N/A"}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={1}>
              <PersonIcon
                sx={{ mr: 1, color: "text.secondary", fontSize: 18 }}
              />
              <Typography variant="body2">
                <strong>Owner NIC:</strong> {vehicle.ownerNIC || "N/A"}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Notes */}
        {vehicle.notes && (
          <Box mt={2} p={1} bgcolor="grey.50" borderRadius={1}>
            <Typography variant="body2" color="textSecondary">
              <strong>Notes:</strong> {vehicle.notes}
            </Typography>
          </Box>
        )}

        {/* Timestamps */}
        <Box mt={2} pt={1} borderTop={1} borderColor="grey.200">
          <Typography variant="caption" color="textSecondary">
            Created: {formatDateTime(vehicle.createdAt)} | Updated:{" "}
            {formatDateTime(vehicle.updatedAt)}
          </Typography>
        </Box>

        {/* Debug info */}
        <Box mt={1}>
          <Typography variant="caption" color="textSecondary">
            ID: {vehicle._id}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  // Stats Card Component
  const StatsCard = ({ title, value, color, icon }) => (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" color={color} fontWeight="bold">
              {value}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              {title}
            </Typography>
          </Box>
          <Box sx={{ color, fontSize: 40 }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          minHeight="400px"
          justifyContent="center"
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading your vehicle requests...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchData}>
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography variant="h3" color="primary" fontWeight="bold">
            My Vehicle Service Requests
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Track and manage your vehicle service requests
          </Typography>
        </Box>
        <Tooltip title="Refresh data">
          <IconButton onClick={fetchData} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatsCard
            title="Total"
            value={stats.total}
            color="primary.main"
            icon={<AssignmentIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatsCard
            title="Pending"
            value={stats.pending}
            color="warning.main"
            icon={<PendingIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatsCard
            title="Active"
            value={stats.active}
            color="info.main"
            icon={<ActiveIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatsCard
            title="Completed"
            value={stats.completed}
            color="success.main"
            icon={<CompletedIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatsCard
            title="Cancelled"
            value={stats.cancelled}
            color="error.main"
            icon={<CancelledIcon />}
          />
        </Grid>
      </Grid>

      {/* Vehicles List */}
      <Typography variant="h5" sx={{ mb: 3 }}>
        Vehicle Requests ({vehicles.length})
      </Typography>

      {vehicles.length > 0 ? (
        <Box>
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} />
          ))}
        </Box>
      ) : (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <CarIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
            <Typography variant="h5" color="textSecondary" gutterBottom>
              No vehicle requests found
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
              You haven't added any vehicle service requests yet.
            </Typography>
            <Button
              variant="contained"
              startIcon={<CarIcon />}
              onClick={() => navigate("/vehicles")}
            >
              Go to My Vehicles
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Debug Info (Development only) */}
      {process.env.NODE_ENV === "development" && (
        <Card sx={{ mt: 4, bgcolor: "grey.100" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Debug Information
            </Typography>
            <Typography
              variant="body2"
              component="pre"
              sx={{ fontSize: "12px", overflow: "auto" }}
            >
              {JSON.stringify(
                {
                  vehicleCount: vehicles.length,
                  stats,
                  sampleVehicle: vehicles[0] || "No vehicles",
                  user: user?.email,
                },
                null,
                2
              )}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default AddedVehicles;
