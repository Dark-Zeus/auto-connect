// src/pages/VehicleOwner/AddedVehicles.jsx - UPDATED WITH FULL FUNCTIONALITY

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Pagination,
  IconButton,
  Tooltip,
  Skeleton,
  Fade,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import {
  Search as SearchIcon,
  DirectionsCar as CarIcon,
  Verified as VerifiedIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CompletedIcon,
  Cancel as CancelledIcon,
  Warning as WarningIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  CloudDownload as ExportIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  DateRange as DateIcon,
  Notes as NotesIcon,
  Build as ServiceIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { UserContext } from "../../contexts/UserContext";
import { addedVehicleAPI } from "../../services/addedVehicleApiService";
import EditVehicleDialog from "../../components/dialogs/EditVehicleDialog";
import CompletionDialog from "../../components/dialogs/CompletionDialog";
import "./AddedVehicles.css";

const AddedVehicles = () => {
  const navigate = useNavigate();
  const { userContext: user } = useContext(UserContext);

  // State management
  const [addedVehicles, setAddedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPurpose, setFilterPurpose] = useState("all");
  const [exporting, setExporting] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
  const [vehicleStats, setVehicleStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    scheduledRequests: 0,
    completedRequests: 0,
    cancelledRequests: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 1,
    totalCount: 0,
  });

  // Initial data loading
  useEffect(() => {
    if (!user) {
      toast.error("Please log in to access this page.");
      navigate("/login");
      return;
    }

    fetchAddedVehicles();
    fetchStats();
  }, [user, navigate]);

  // Fetch added vehicles from backend
  const fetchAddedVehicles = async (
    page = 1,
    search = "",
    status = "all",
    purpose = "all"
  ) => {
    try {
      setLoading(true);

      const params = {
        page: page,
        limit: pagination.limit,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (status !== "all") {
        params.status = status;
      }

      if (purpose !== "all") {
        params.purpose = purpose;
      }

      console.log("🚀 Fetching added vehicles with params:", params);

      const response = await addedVehicleAPI.getAddedVehicles(params);

      if (response.success) {
        console.log("✅ Added vehicles response:", response.data);
        setAddedVehicles(response.data.addedVehicles || []);
        setPagination({
          ...pagination,
          page: response.data.pagination?.currentPage || 1,
          totalPages: response.data.pagination?.totalPages || 1,
          totalCount: response.data.pagination?.totalCount || 0,
        });
      } else {
        console.error("❌ Failed to fetch added vehicles:", response.message);
        toast.error(response.message || "Failed to fetch added vehicles");
      }
    } catch (error) {
      console.error("❌ Error fetching added vehicles:", error);
      toast.error("Failed to fetch added vehicles");
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await addedVehicleAPI.getAddedVehicleStats();

      if (response.success) {
        console.log("📊 Stats response:", response.data);
        setVehicleStats(response.data);
      } else {
        console.warn("⚠️ Stats fetch failed:", response.message);
      }
    } catch (error) {
      console.error("❌ Error fetching stats:", error);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchAddedVehicles(
        pagination.page,
        searchTerm,
        filterStatus,
        filterPurpose
      ),
      fetchStats(),
    ]);
    setRefreshing(false);
    toast.success("Data refreshed successfully");
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination({ ...pagination, page: 1 });

    const timeoutId = setTimeout(() => {
      fetchAddedVehicles(1, value, filterStatus, filterPurpose);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  // Handle filter change
  const handleFilterChange = (event, newValue, filterType) => {
    if (filterType === "status") {
      setFilterStatus(newValue);
    } else {
      setFilterPurpose(newValue);
    }
    setPagination({ ...pagination, page: 1 });
    fetchAddedVehicles(
      1,
      searchTerm,
      filterType === "status" ? newValue : filterStatus,
      filterType === "purpose" ? newValue : filterPurpose
    );
  };

  // Handle pagination
  const handlePageChange = (event, page) => {
    setPagination({ ...pagination, page });
    fetchAddedVehicles(page, searchTerm, filterStatus, filterPurpose);
  };

  // Handle update added vehicle - REAL IMPLEMENTATION
  const handleUpdateVehicle = async (updatedData) => {
    try {
      console.log("🔧 Updating vehicle:", selectedVehicle._id, updatedData);

      const response = await addedVehicleAPI.updateAddedVehicle(
        selectedVehicle._id,
        updatedData
      );

      if (response.success) {
        toast.success("Vehicle updated successfully");
        setEditDialogOpen(false);
        setSelectedVehicle(null);
        // Refresh the data to show updated information
        await fetchAddedVehicles(
          pagination.page,
          searchTerm,
          filterStatus,
          filterPurpose
        );
        await fetchStats();
      } else {
        toast.error(response.message || "Failed to update vehicle");
      }
    } catch (error) {
      console.error("Error updating vehicle:", error);
      toast.error("Failed to update vehicle");
    }
  };

  // Handle delete added vehicle - REAL IMPLEMENTATION
  const handleDeleteVehicle = async () => {
    try {
      console.log("🗑️ Deleting vehicle:", selectedVehicle._id);

      const response = await addedVehicleAPI.deleteAddedVehicle(
        selectedVehicle._id
      );

      if (response.success) {
        toast.success("Vehicle request removed successfully");
        setDeleteDialogOpen(false);
        setSelectedVehicle(null);
        // Refresh the data to remove deleted item
        await fetchAddedVehicles(
          pagination.page,
          searchTerm,
          filterStatus,
          filterPurpose
        );
        await fetchStats();
      } else {
        toast.error(response.message || "Failed to remove vehicle");
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error("Failed to remove vehicle");
    }
  };

  // Handle mark as completed - REAL IMPLEMENTATION
  const handleMarkCompleted = async (completionData) => {
    try {
      console.log(
        "✅ Marking vehicle as completed:",
        selectedVehicle._id,
        completionData
      );

      const response = await addedVehicleAPI.markCompleted(
        selectedVehicle._id,
        completionData
      );

      if (response.success) {
        toast.success("Vehicle service marked as completed successfully");
        setCompletionDialogOpen(false);
        setSelectedVehicle(null);
        // Refresh the data to show updated status
        await fetchAddedVehicles(
          pagination.page,
          searchTerm,
          filterStatus,
          filterPurpose
        );
        await fetchStats();
      } else {
        toast.error(response.message || "Failed to mark vehicle as completed");
      }
    } catch (error) {
      console.error("Error marking as completed:", error);
      toast.error("Failed to mark vehicle as completed");
    }
  };

  // Handle export (placeholder for now)
  const handleExport = async () => {
    try {
      toast.info("Export functionality will be implemented soon");
    } catch (error) {
      console.error("Error exporting vehicles:", error);
      toast.error("Failed to export vehicles");
    }
  };

  // Utility functions
  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "primary";
      case "COMPLETED":
        return "success";
      case "CANCELLED":
        return "error";
      case "PENDING":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "ACTIVE":
        return <VerifiedIcon />;
      case "COMPLETED":
        return <CompletedIcon />;
      case "CANCELLED":
        return <CancelledIcon />;
      case "PENDING":
        return <ScheduleIcon />;
      default:
        return <WarningIcon />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "#ef4444";
      case "MEDIUM":
        return "#f59e0b";
      case "LOW":
        return "#10b981";
      case "URGENT":
        return "#dc2626";
      default:
        return "#6b7280";
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

  // Added Vehicle Card Component
  const AddedVehicleCard = ({ addedVehicle, index }) => {
    const vehicle = addedVehicle.vehicleId;

    return (
      <Fade in={true} timeout={300 + index * 50}>
        <Card
          className={`added-vehicle-card status-${addedVehicle.status?.toLowerCase()}`}
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            borderLeft: `4px solid ${
              getStatusColor(addedVehicle.status) === "primary"
                ? "#1976d2"
                : getStatusColor(addedVehicle.status) === "success"
                ? "#2e7d32"
                : getStatusColor(addedVehicle.status) === "error"
                ? "#d32f2f"
                : "#ed6c02"
            }`,
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: 4,
            },
            transition: "all 0.3s ease",
          }}
        >
          <CardContent
            sx={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {vehicle?.registrationNumber || "Unknown Vehicle"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {vehicle
                    ? `${vehicle.make} ${vehicle.model} (${vehicle.yearOfManufacture})`
                    : "Vehicle details unavailable"}
                </Typography>
              </Box>
              <Chip
                icon={getStatusIcon(addedVehicle.status)}
                label={addedVehicle.status}
                color={getStatusColor(addedVehicle.status)}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Box>

            {/* Vehicle Details */}
            <Box sx={{ mb: 2, flex: 1 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <ServiceIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {addedVehicle.purpose?.replace("_", " ")}
                </Typography>
                <Chip
                  label={addedVehicle.priority}
                  size="small"
                  sx={{
                    backgroundColor: getPriorityColor(addedVehicle.priority),
                    color: "white",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                  }}
                />
              </Box>

              {addedVehicle.scheduledDate && (
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <DateIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="body2">
                    Scheduled: {formatDate(addedVehicle.scheduledDate)}
                  </Typography>
                </Box>
              )}

              {addedVehicle.contactInfo?.phone && (
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <PhoneIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="body2">
                    {addedVehicle.contactInfo.phone}
                  </Typography>
                </Box>
              )}

              {addedVehicle.location?.address && (
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <LocationIcon
                    sx={{ fontSize: 16, color: "text.secondary" }}
                  />
                  <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                    {addedVehicle.location.address}
                  </Typography>
                </Box>
              )}

              {addedVehicle.notes && (
                <Box
                  sx={{
                    mt: 1,
                    p: 1,
                    backgroundColor: "grey.50",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "grey.200",
                  }}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                  >
                    <NotesIcon
                      sx={{ fontSize: 16, color: "text.secondary", mt: 0.2 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "0.85rem", lineHeight: 1.4 }}
                    >
                      {addedVehicle.notes.length > 100
                        ? `${addedVehicle.notes.substring(0, 100)}...`
                        : addedVehicle.notes}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Footer */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pt: 1,
                borderTop: "1px solid",
                borderColor: "grey.200",
                mt: "auto",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Added: {formatDate(addedVehicle.createdAt)}
              </Typography>
              <Box sx={{ display: "flex", gap: 0.5 }}>
                {addedVehicle.status === "ACTIVE" && (
                  <Tooltip title="Mark as completed">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedVehicle(addedVehicle);
                        setCompletionDialogOpen(true);
                      }}
                      sx={{ color: "success.main" }}
                    >
                      <CompletedIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedVehicle(addedVehicle);
                      setEditDialogOpen(true);
                    }}
                    sx={{ color: "primary.main" }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Remove">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedVehicle(addedVehicle);
                      setDeleteDialogOpen(true);
                    }}
                    sx={{ color: "error.main" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    );
  };

  // Stats Card Component
  const StatsCard = ({ title, value, icon, color, subtitle, loading }) => (
    <Zoom in={true} timeout={300}>
      <Card
        sx={{
          height: "100%",
          "&:hover": { transform: "translateY(-2px)", boxShadow: 3 },
          transition: "all 0.3s ease",
        }}
      >
        <CardContent>
          {loading ? (
            <Box>
              <Skeleton variant="text" width={60} height={40} />
              <Skeleton variant="text" width={100} height={24} />
              {subtitle && <Skeleton variant="text" width={80} height={16} />}
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 800, color, mb: 0.5 }}
                >
                  {value}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "text.primary", mb: 0.25 }}
                >
                  {title}
                </Typography>
                {subtitle && (
                  <Typography variant="body2" color="text.secondary">
                    {subtitle}
                  </Typography>
                )}
              </Box>
              <Box sx={{ color, fontSize: "2.5rem", opacity: 0.8 }}>{icon}</Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Zoom>
  );

  // Delete Dialog Component
  const DeleteDialog = () => (
    <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
      <DialogTitle sx={{ color: "error.main" }}>Confirm Removal</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to remove{" "}
          <strong>{selectedVehicle?.vehicleId?.registrationNumber}</strong> from
          your service requests?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          This action cannot be undone. The vehicle request will be permanently
          removed from your list.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleDeleteVehicle} variant="contained" color="error">
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Loading skeleton
  const AddedVehicleCardSkeleton = () => (
    <Card sx={{ height: "300px" }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Skeleton variant="text" width={120} height={32} />
            <Skeleton variant="text" width={160} height={20} />
          </Box>
          <Skeleton variant="rectangular" width={80} height={24} />
        </Box>
        {[...Array(4)].map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            width="100%"
            height={20}
            sx={{ mb: 1 }}
          />
        ))}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Skeleton variant="text" width={80} height={16} />
          <Box sx={{ display: "flex", gap: 1 }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading && addedVehicles.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "60vh",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading your service requests...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
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
              variant="h3"
              sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}
            >
              Added Vehicles
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Manage your vehicles added for service requests
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Tooltip title="Refresh data">
              <IconButton
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
                  "&:hover": { transform: "rotate(180deg)" },
                  transition: "transform 0.3s ease",
                }}
              >
                <RefreshIcon className={refreshing ? "spinning" : ""} />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              startIcon={
                exporting ? <CircularProgress size={20} /> : <ExportIcon />
              }
              onClick={handleExport}
              disabled={addedVehicles.length === 0 || exporting}
            >
              {exporting ? "Exporting..." : "Export Data"}
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/add-vehicles")}
              startIcon={<AddIcon />}
            >
              Add More Vehicles
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatsCard
              title="Total Requests"
              value={vehicleStats.totalRequests}
              icon={<CarIcon />}
              color="#3b82f6"
              subtitle="All service requests"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatsCard
              title="Active"
              value={vehicleStats.scheduledRequests}
              icon={<VerifiedIcon />}
              color="#10b981"
              subtitle="Currently active"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatsCard
              title="Pending"
              value={vehicleStats.pendingRequests}
              icon={<ScheduleIcon />}
              color="#f59e0b"
              subtitle="Awaiting action"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatsCard
              title="Completed"
              value={vehicleStats.completedRequests}
              icon={<CompletedIcon />}
              color="#06b6d4"
              subtitle="Finished requests"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatsCard
              title="Cancelled"
              value={vehicleStats.cancelledRequests}
              icon={<CancelledIcon />}
              color="#ef4444"
              subtitle="Cancelled requests"
              loading={loading}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Search and Filter */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <TextField
            placeholder="Search by registration number, make, model, or notes..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Tabs
              value={filterStatus}
              onChange={(e, v) => handleFilterChange(e, v, "status")}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label={`All (${vehicleStats.totalRequests})`} value="all" />
              <Tab
                label={`Active (${vehicleStats.scheduledRequests})`}
                value="active"
              />
              <Tab
                label={`Pending (${vehicleStats.pendingRequests})`}
                value="pending"
              />
              <Tab
                label={`Completed (${vehicleStats.completedRequests})`}
                value="completed"
              />
              <Tab
                label={`Cancelled (${vehicleStats.cancelledRequests})`}
                value="cancelled"
              />
            </Tabs>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Purpose</InputLabel>
              <Select
                value={filterPurpose}
                onChange={(e) =>
                  handleFilterChange(e, e.target.value, "purpose")
                }
                label="Filter by Purpose"
              >
                <MenuItem value="all">All Purposes</MenuItem>
                <MenuItem value="service_booking">Service Booking</MenuItem>
                <MenuItem value="insurance_claim">Insurance Claim</MenuItem>
                <MenuItem value="maintenance_schedule">
                  Maintenance Schedule
                </MenuItem>
                <MenuItem value="repair_request">Repair Request</MenuItem>
                <MenuItem value="inspection">Inspection</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Added Vehicles Grid */}
      <Box sx={{ mb: 4 }}>
        {loading ? (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <AddedVehicleCardSkeleton />
              </Grid>
            ))}
          </Grid>
        ) : addedVehicles.length > 0 ? (
          <>
            <Grid container spacing={3}>
              {addedVehicles.map((addedVehicle, index) => (
                <Grid item xs={12} sm={6} md={4} key={addedVehicle._id}>
                  <AddedVehicleCard addedVehicle={addedVehicle} index={index} />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        ) : (
          /* Empty State */
          <Card
            sx={{
              border: "2px dashed",
              borderColor: "grey.300",
              textAlign: "center",
              py: 6,
            }}
          >
            <CardContent>
              <CarIcon sx={{ fontSize: "4rem", color: "grey.300", mb: 2 }} />
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}
              >
                {searchTerm || filterStatus !== "all" || filterPurpose !== "all"
                  ? "No vehicles found"
                  : "No vehicles added yet"}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 2, maxWidth: 400, mx: "auto" }}
              >
                {searchTerm || filterStatus !== "all" || filterPurpose !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Start by adding vehicles from your registered vehicles"}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/add-vehicles")}
                startIcon={<AddIcon />}
                size="large"
              >
                Add Your First Vehicle
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Dialogs */}
      <EditVehicleDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedVehicle(null);
        }}
        selectedVehicle={selectedVehicle}
        onUpdate={handleUpdateVehicle}
      />

      <CompletionDialog
        open={completionDialogOpen}
        onClose={() => {
          setCompletionDialogOpen(false);
          setSelectedVehicle(null);
        }}
        selectedVehicle={selectedVehicle}
        onComplete={handleMarkCompleted}
      />

      <DeleteDialog />
    </Container>
  );
};

export default AddedVehicles;
