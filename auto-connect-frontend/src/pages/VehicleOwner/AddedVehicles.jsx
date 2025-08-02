// src/pages/VehicleOwner/AddedVehicles.jsx
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
} from "@mui/icons-material";
import { UserContext } from "../../contexts/UserContext";
import { addedVehicleAPI } from "../../services/addedVehicleApiService";
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
  const [vehicleStats, setVehicleStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    pending: 0,
    cancelled: 0,
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
      return;
    }

    fetchAddedVehicles();
    fetchStats();
  }, [user]);

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
        params.status = status.toUpperCase();
      }

      if (purpose !== "all") {
        params.purpose = purpose.toUpperCase();
      }

      const response = await addedVehicleAPI.getAddedVehicles(params);

      if (response.success) {
        setAddedVehicles(response.data.addedVehicles || []);
        setPagination({
          ...pagination,
          page: response.data.pagination?.currentPage || 1,
          totalPages: response.data.pagination?.totalPages || 1,
          totalCount: response.data.pagination?.totalCount || 0,
        });
      } else {
        toast.error(response.message || "Failed to fetch added vehicles");
      }
    } catch (error) {
      console.error("Error fetching added vehicles:", error);
      toast.error("Failed to fetch added vehicles");
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await addedVehicleAPI.getStats();

      if (response.success) {
        const overview = response.data.overview;
        setVehicleStats({
          total: overview.total || 0,
          active: overview.active || 0,
          completed: overview.completed || 0,
          pending: overview.pending || 0,
          cancelled: overview.cancelled || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
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

  // Handle update added vehicle
  const handleUpdateVehicle = async (updatedData) => {
    try {
      const response = await addedVehicleAPI.updateAddedVehicle(
        selectedVehicle._id,
        updatedData
      );

      if (response.success) {
        toast.success("Vehicle updated successfully");
        setEditDialogOpen(false);
        fetchAddedVehicles(
          pagination.page,
          searchTerm,
          filterStatus,
          filterPurpose
        );
      }
    } catch (error) {
      console.error("Error updating vehicle:", error);
      toast.error("Failed to update vehicle");
    }
  };

  // Handle delete added vehicle
  const handleDeleteVehicle = async () => {
    try {
      const response = await addedVehicleAPI.deleteAddedVehicle(
        selectedVehicle._id
      );

      if (response.success) {
        toast.success("Vehicle removed successfully");
        setDeleteDialogOpen(false);
        fetchAddedVehicles(
          pagination.page,
          searchTerm,
          filterStatus,
          filterPurpose
        );
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error("Failed to remove vehicle");
    }
  };

  // Handle mark as completed
  const handleMarkCompleted = async (vehicleId) => {
    try {
      const response = await addedVehicleAPI.markCompleted(
        vehicleId,
        "Service completed"
      );

      if (response.success) {
        toast.success("Vehicle marked as completed");
        fetchAddedVehicles(
          pagination.page,
          searchTerm,
          filterStatus,
          filterPurpose
        );
        fetchStats();
      }
    } catch (error) {
      console.error("Error marking as completed:", error);
      toast.error("Failed to mark as completed");
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await addedVehicleAPI.exportAddedVehicles({
        status: filterStatus !== "all" ? filterStatus : undefined,
        purpose: filterPurpose !== "all" ? filterPurpose : undefined,
      });

      if (response.success) {
        const csvData = convertToCSV(response.data.addedVehicles);
        const filename = `added_vehicles_${
          new Date().toISOString().split("T")[0]
        }.csv`;

        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(
          `${response.data.totalCount} added vehicles exported successfully`
        );
      }
    } catch (error) {
      console.error("Error exporting vehicles:", error);
      toast.error("Failed to export vehicles");
    } finally {
      setExporting(false);
    }
  };

  // Utility functions
  const convertToCSV = (data) => {
    if (!data || data.length === 0) return "";

    const headers = [
      "Added Date",
      "Registration Number",
      "Make",
      "Model",
      "Year",
      "Color",
      "Status",
      "Purpose",
      "Priority",
      "Scheduled Date",
      "Contact Phone",
      "Contact Email",
      "Location",
      "Notes",
    ];

    const csvHeaders = headers.join(",");

    const csvRows = data.map((item) =>
      [
        item.createdAt || "",
        item.vehicleId?.registrationNumber || "",
        item.vehicleId?.make || "",
        item.vehicleId?.model || "",
        item.vehicleId?.yearOfManufacture || "",
        item.vehicleId?.color || "",
        item.status || "",
        item.purpose || "",
        item.priority || "",
        item.scheduledDate || "",
        item.contactInfo?.phone || "",
        item.contactInfo?.email || "",
        item.location?.address || "",
        item.notes || "",
      ]
        .map((field) => `"${field}"`)
        .join(",")
    );

    return [csvHeaders, ...csvRows].join("\n");
  };

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

  // Added Vehicle Card Component
  const AddedVehicleCard = ({ addedVehicle, index }) => {
    const vehicle = addedVehicle.vehicleId;

    return (
      <Fade in={true} timeout={300 + index * 50}>
        <Card
          className={`added-vehicle-card status-${addedVehicle.status?.toLowerCase()}`}
        >
          <CardContent className="added-vehicle-card-content">
            {/* Header */}
            <div className="added-vehicle-header">
              <div className="added-vehicle-title-section">
                <Typography variant="h6" className="added-vehicle-registration">
                  {vehicle?.registrationNumber}
                </Typography>
                <Typography variant="body2" className="added-vehicle-model">
                  {vehicle?.make} {vehicle?.model} ({vehicle?.yearOfManufacture}
                  )
                </Typography>
              </div>
              <div className="added-vehicle-status-section">
                <Chip
                  icon={getStatusIcon(addedVehicle.status)}
                  label={addedVehicle.status}
                  color={getStatusColor(addedVehicle.status)}
                  size="small"
                  variant="outlined"
                  className="added-vehicle-status-chip"
                />
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="added-vehicle-details">
              <div className="added-vehicle-detail-row">
                <ServiceIcon className="added-vehicle-detail-icon" />
                <span className="added-vehicle-detail-text">
                  {addedVehicle.purpose?.replace("_", " ")}
                </span>
                <Chip
                  label={addedVehicle.priority}
                  size="small"
                  style={{
                    backgroundColor: getPriorityColor(addedVehicle.priority),
                    color: "white",
                    fontSize: "0.7rem",
                  }}
                />
              </div>

              {addedVehicle.scheduledDate && (
                <div className="added-vehicle-detail-row">
                  <DateIcon className="added-vehicle-detail-icon" />
                  <span className="added-vehicle-detail-text">
                    Scheduled: {formatDate(addedVehicle.scheduledDate)}
                  </span>
                </div>
              )}

              {addedVehicle.contactInfo?.phone && (
                <div className="added-vehicle-detail-row">
                  <PhoneIcon className="added-vehicle-detail-icon" />
                  <span className="added-vehicle-detail-text">
                    {addedVehicle.contactInfo.phone}
                  </span>
                </div>
              )}

              {addedVehicle.location?.address && (
                <div className="added-vehicle-detail-row">
                  <LocationIcon className="added-vehicle-detail-icon" />
                  <span className="added-vehicle-detail-text">
                    {addedVehicle.location.address}
                  </span>
                </div>
              )}

              {addedVehicle.notes && (
                <div className="added-vehicle-notes">
                  <NotesIcon className="added-vehicle-detail-icon" />
                  <span className="added-vehicle-notes-text">
                    {addedVehicle.notes.substring(0, 100)}
                    {addedVehicle.notes.length > 100 && "..."}
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="added-vehicle-footer">
              <div className="added-vehicle-meta">
                <Typography
                  variant="caption"
                  className="added-vehicle-meta-text"
                >
                  Added: {formatDate(addedVehicle.createdAt)}
                </Typography>
              </div>
              <div className="added-vehicle-actions">
                {addedVehicle.status === "ACTIVE" && (
                  <Tooltip title="Mark as completed">
                    <IconButton
                      size="small"
                      onClick={() => handleMarkCompleted(addedVehicle._id)}
                      className="action-btn complete-btn"
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
                    className="action-btn edit-btn"
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
                    className="action-btn delete-btn"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </CardContent>
        </Card>
      </Fade>
    );
  };

  // Stats Card Component
  const StatsCard = ({ title, value, icon, color, subtitle, loading }) => (
    <Zoom in={true} timeout={300}>
      <Card className="stats-card">
        <CardContent className="stats-card-content">
          {loading ? (
            <div className="stats-loading">
              <Skeleton variant="text" width={60} height={40} />
              <Skeleton variant="text" width={100} height={24} />
              {subtitle && <Skeleton variant="text" width={80} height={16} />}
            </div>
          ) : (
            <>
              <div className="stats-main">
                <div className="stats-info">
                  <Typography
                    variant="h3"
                    className="stats-value"
                    style={{ color }}
                  >
                    {value}
                  </Typography>
                  <Typography variant="h6" className="stats-title">
                    {title}
                  </Typography>
                  {subtitle && (
                    <Typography variant="body2" className="stats-subtitle">
                      {subtitle}
                    </Typography>
                  )}
                </div>
                <div className="stats-icon" style={{ color }}>
                  {icon}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </Zoom>
  );

  // Edit Dialog Component
  const EditDialog = () => {
    const [editData, setEditData] = useState({
      purpose: selectedVehicle?.purpose || "",
      priority: selectedVehicle?.priority || "",
      status: selectedVehicle?.status || "",
      notes: selectedVehicle?.notes || "",
      scheduledDate: selectedVehicle?.scheduledDate?.split("T")[0] || "",
    });

    const handleSave = () => {
      handleUpdateVehicle(editData);
    };

    return (
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Added Vehicle</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Purpose</InputLabel>
              <Select
                value={editData.purpose}
                label="Purpose"
                onChange={(e) =>
                  setEditData({ ...editData, purpose: e.target.value })
                }
              >
                <MenuItem value="SERVICE_BOOKING">Service Booking</MenuItem>
                <MenuItem value="INSURANCE_CLAIM">Insurance Claim</MenuItem>
                <MenuItem value="MAINTENANCE_SCHEDULE">
                  Maintenance Schedule
                </MenuItem>
                <MenuItem value="REPAIR_REQUEST">Repair Request</MenuItem>
                <MenuItem value="INSPECTION">Inspection</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={editData.priority}
                label="Priority"
                onChange={(e) =>
                  setEditData({ ...editData, priority: e.target.value })
                }
              >
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="URGENT">Urgent</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={editData.status}
                label="Status"
                onChange={(e) =>
                  setEditData({ ...editData, status: e.target.value })
                }
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="date"
              label="Scheduled Date"
              value={editData.scheduledDate}
              onChange={(e) =>
                setEditData({ ...editData, scheduledDate: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Notes"
              value={editData.notes}
              onChange={(e) =>
                setEditData({ ...editData, notes: e.target.value })
              }
              placeholder="Add notes about this service request..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Delete Dialog Component
  const DeleteDialog = () => (
    <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
      <DialogTitle>Confirm Removal</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to remove{" "}
          {selectedVehicle?.vehicleId?.registrationNumber} from your service
          requests? This action cannot be undone.
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
    <Card className="added-vehicle-card added-vehicle-card-skeleton">
      <CardContent>
        <div className="skeleton-header">
          <div>
            <Skeleton variant="text" width={120} height={32} />
            <Skeleton variant="text" width={160} height={20} />
          </div>
          <Skeleton variant="rectangular" width={80} height={24} />
        </div>
        <div className="skeleton-details">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant="text" width="100%" height={20} />
          ))}
        </div>
        <div className="skeleton-footer">
          <Skeleton variant="text" width={80} height={16} />
          <div style={{ display: "flex", gap: "8px" }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading && addedVehicles.length === 0) {
    return (
      <Container maxWidth="xl" className="added-vehicles-container">
        <div className="loading-container">
          <CircularProgress size={60} className="loading-spinner" />
          <Typography variant="h6" className="loading-text">
            Loading your service requests...
          </Typography>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="added-vehicles-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-info">
            <Typography variant="h3" className="header-title">
              Added Vehicles
            </Typography>
            <Typography variant="h6" className="header-subtitle">
              Manage your vehicles added for service requests
            </Typography>
          </div>
          <div className="header-actions">
            <Tooltip title="Refresh data">
              <IconButton
                onClick={handleRefresh}
                disabled={refreshing}
                className="refresh-btn"
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
              className="export-btn"
            >
              {exporting ? "Exporting..." : "Export Data"}
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/add-vehicles")}
              startIcon={<CarIcon />}
              className="add-vehicle-btn"
            >
              Add More Vehicles
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-section">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatsCard
              title="Total Requests"
              value={vehicleStats.total}
              icon={<CarIcon />}
              color="#3b82f6"
              subtitle="All service requests"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatsCard
              title="Active"
              value={vehicleStats.active}
              icon={<VerifiedIcon />}
              color="#10b981"
              subtitle="Currently active"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatsCard
              title="Pending"
              value={vehicleStats.pending}
              icon={<ScheduleIcon />}
              color="#f59e0b"
              subtitle="Awaiting action"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatsCard
              title="Completed"
              value={vehicleStats.completed}
              icon={<CompletedIcon />}
              color="#06b6d4"
              subtitle="Finished requests"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatsCard
              title="Cancelled"
              value={vehicleStats.cancelled}
              icon={<CancelledIcon />}
              color="#ef4444"
              subtitle="Cancelled requests"
              loading={loading}
            />
          </Grid>
        </Grid>
      </div>

      {/* Search and Filter */}
      <Card className="search-filter-section">
        <CardContent className="search-filter-content">
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
            className="search-input"
            fullWidth
          />
          <div className="filter-tabs-container">
            <Tabs
              value={filterStatus}
              onChange={(e, v) => handleFilterChange(e, v, "status")}
              variant="scrollable"
              scrollButtons="auto"
              className="filter-tabs"
            >
              <Tab label={`All (${vehicleStats.total})`} value="all" />
              <Tab label={`Active (${vehicleStats.active})`} value="active" />
              <Tab
                label={`Pending (${vehicleStats.pending})`}
                value="pending"
              />
              <Tab
                label={`Completed (${vehicleStats.completed})`}
                value="completed"
              />
              <Tab
                label={`Cancelled (${vehicleStats.cancelled})`}
                value="cancelled"
              />
            </Tabs>
          </div>
          <div className="purpose-filter">
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
          </div>
        </CardContent>
      </Card>

      {/* Added Vehicles Grid */}
      <div className="added-vehicles-section">
        {loading ? (
          <div className="added-vehicles-grid">
            {[...Array(6)].map((_, index) => (
              <AddedVehicleCardSkeleton key={index} />
            ))}
          </div>
        ) : addedVehicles.length > 0 ? (
          <>
            <div className="added-vehicles-grid">
              {addedVehicles.map((addedVehicle, index) => (
                <AddedVehicleCard
                  key={addedVehicle._id}
                  addedVehicle={addedVehicle}
                  index={index}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="pagination-section">
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <Card className="empty-state">
            <CardContent className="empty-state-content">
              <CarIcon className="empty-state-icon" />
              <Typography variant="h4" className="empty-state-title">
                {searchTerm || filterStatus !== "all" || filterPurpose !== "all"
                  ? "No vehicles found"
                  : "No vehicles added yet"}
              </Typography>
              <Typography variant="body1" className="empty-state-subtitle">
                {searchTerm || filterStatus !== "all" || filterPurpose !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Start by adding vehicles from your registered vehicles"}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/add-vehicles")}
                startIcon={<CarIcon />}
                sx={{ mt: 2 }}
              >
                Add Your First Vehicle
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialogs */}
      <EditDialog />
      <DeleteDialog />
    </Container>
  );
};

export default AddedVehicles;
