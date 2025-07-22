// src/pages/AddVehicles.jsx (Final Complete Version)
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Pagination,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Skeleton,
  Fade,
  Zoom,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  DirectionsCar as CarIcon,
  Verified as VerifiedIcon,
  HourglassEmpty as PendingIcon,
  Cancel as RejectedIcon,
  Warning as WarningIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  MoreVert as MoreVertIcon,
  InsertDriveFile as DocumentIcon,
  PhotoCamera as PhotoIcon,
  LocalGasStation as FuelIcon,
  DateRange as DateIcon,
  Speed as SpeedIcon,
  Refresh as RefreshIcon,
  CloudDownload as ExportIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { UserContext } from "../../contexts/UserContext";
import {
  vehicleAPI,
  handleVehicleError,
  handleVehicleSuccess,
  apiDownloadFile,
} from "../../utils/axios";
import VehicleRegistrationForm from "../../components/VehicleRegistrationForm";
import "./AddVehicle.css";

const AddVehicles = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  // State management
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [vehicleStats, setVehicleStats] = useState({
    totalVehicles: 0,
    verifiedVehicles: 0,
    pendingVehicles: 0,
    rejectedVehicles: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 1,
    totalCount: 0,
  });
  const [expiryWarnings, setExpiryWarnings] = useState([]);

  // Check if user is vehicle owner
  useEffect(() => {
    if (!user) {
      toast.error("Please log in to access this page.");
      navigate("/auth");
      return;
    }

    if (user.role !== "vehicle_owner") {
      toast.error("Access denied. Only vehicle owners can access this page.");
      navigate("/dashboard");
      return;
    }

    if (!user.nicNumber) {
      toast.error(
        "NIC number is required to manage vehicles. Please complete your profile."
      );
      navigate("/profile");
      return;
    }

    // Initial data fetch
    fetchVehicles();
    fetchVehicleStats();
  }, [user, navigate]);

  // Fetch vehicles from backend using enhanced API
  const fetchVehicles = async (page = 1, search = "", status = "all") => {
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
        params.verificationStatus = status.toUpperCase();
      }

      const response = await vehicleAPI.getVehicles(params);

      if (response.success) {
        setVehicles(response.data.vehicles || []);
        setPagination({
          ...pagination,
          page: response.data.pagination?.currentPage || 1,
          totalPages: response.data.pagination?.totalPages || 1,
          totalCount: response.data.pagination?.totalCount || 0,
        });

        // Update stats from response
        if (response.data.summary) {
          setVehicleStats({
            totalVehicles: response.data.summary.totalVehicles || 0,
            verifiedVehicles: response.data.summary.verified || 0,
            pendingVehicles: response.data.summary.pending || 0,
            rejectedVehicles: response.data.summary.rejected || 0,
          });
        }

        // Check for expiry warnings
        checkExpiryWarnings(response.data.vehicles || []);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      handleVehicleError(error, "fetch vehicles");
    } finally {
      setLoading(false);
    }
  };

  // Fetch vehicle statistics using enhanced API
  const fetchVehicleStats = async () => {
    try {
      const response = await vehicleAPI.getStats();

      if (response.success) {
        const overview = response.data.overview;
        setVehicleStats({
          totalVehicles: overview.totalVehicles || 0,
          verifiedVehicles: overview.verifiedVehicles || 0,
          pendingVehicles: overview.pendingVehicles || 0,
          rejectedVehicles: overview.rejectedVehicles || 0,
        });

        // Set expiry warnings
        const warnings = response.data.warnings;
        const allWarnings = [
          ...(warnings.insuranceExpiring || []).map((v) => ({
            ...v,
            type: "insurance",
            expiryDate: v.insuranceDetails?.validTo,
          })),
          ...(warnings.licenseExpiring || []).map((v) => ({
            ...v,
            type: "license",
            expiryDate: v.revenueLicense?.validTo,
          })),
        ];
        setExpiryWarnings(allWarnings);
      }
    } catch (error) {
      console.error("Error fetching vehicle stats:", error);
      // Don't show error toast for stats as it's secondary data
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchVehicles(pagination.page, searchTerm, filterStatus),
      fetchVehicleStats(),
    ]);
    setRefreshing(false);
    toast.success("Data refreshed successfully");
  };

  // Check for expiry warnings
  const checkExpiryWarnings = (vehicleList) => {
    const warnings = [];
    vehicleList.forEach((vehicle) => {
      if (
        vehicle.insuranceDetails?.validTo &&
        isExpiringSoon(vehicle.insuranceDetails.validTo)
      ) {
        warnings.push({
          ...vehicle,
          type: "insurance",
          expiryDate: vehicle.insuranceDetails.validTo,
        });
      }
      if (
        vehicle.revenueLicense?.validTo &&
        isExpiringSoon(vehicle.revenueLicense.validTo)
      ) {
        warnings.push({
          ...vehicle,
          type: "license",
          expiryDate: vehicle.revenueLicense.validTo,
        });
      }
    });
    setExpiryWarnings(warnings);
  };

  // Helper function to check if date is expiring soon
  const isExpiringSoon = (dateString) => {
    if (!dateString) return false;
    const expiryDate = new Date(dateString);
    const today = new Date();
    const thirtyDaysFromNow = new Date(
      today.getTime() + 30 * 24 * 60 * 60 * 1000
    );
    return expiryDate <= thirtyDaysFromNow && expiryDate >= today;
  };

  // Handle search with debouncing
  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination({ ...pagination, page: 1 });

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchVehicles(1, value, filterStatus);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  // Handle filter change
  const handleFilterChange = (event, newValue) => {
    setFilterStatus(newValue);
    setPagination({ ...pagination, page: 1 });
    fetchVehicles(1, searchTerm, newValue);
  };

  // Handle pagination
  const handlePageChange = (event, page) => {
    setPagination({ ...pagination, page });
    fetchVehicles(page, searchTerm, filterStatus);
  };

  // Handle vehicle registration submission
  const handleVehicleSubmit = async (vehicleData) => {
    try {
      const response = await vehicleAPI.createVehicle(vehicleData);

      if (response.success) {
        handleVehicleSuccess(response, "registration");
        setShowRegistrationForm(false);
        await Promise.all([
          fetchVehicles(pagination.page, searchTerm, filterStatus),
          fetchVehicleStats(),
        ]);
      }
    } catch (error) {
      console.error("Error registering vehicle:", error);
      handleVehicleError(error, "registration");
      throw error; // Re-throw to let form handle it
    }
  };

  // Handle vehicle actions
  const handleViewVehicle = (vehicleId) => {
    navigate(`/vehicles/${vehicleId}`);
  };

  const handleEditVehicle = (vehicleId) => {
    navigate(`/vehicles/${vehicleId}/edit`);
  };

  const handleDeleteVehicle = async (vehicleId) => {
    const vehicle = vehicles.find((v) => v._id === vehicleId);
    const vehicleReg = vehicle?.registrationNumber || "this vehicle";

    if (
      !window.confirm(
        `Are you sure you want to delete ${vehicleReg}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await vehicleAPI.deleteVehicle(vehicleId);

      if (response.success) {
        handleVehicleSuccess(response, "deletion");
        await Promise.all([
          fetchVehicles(pagination.page, searchTerm, filterStatus),
          fetchVehicleStats(),
        ]);
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      handleVehicleError(error, "deletion");
    }
  };

  // Handle export vehicles with enhanced functionality
  const handleExportVehicles = async () => {
    try {
      setExporting(true);
      const response = await vehicleAPI.exportVehicles();

      if (response.success) {
        // Convert to CSV and download
        const csvData = convertToCSV(response.data.vehicles);
        const filename = `vehicles_${user.nicNumber}_${
          new Date().toISOString().split("T")[0]
        }.csv`;

        // Create and download file
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
          `${response.data.totalCount} vehicles exported successfully`
        );
      }
    } catch (error) {
      console.error("Error exporting vehicles:", error);
      handleVehicleError(error, "export");
    } finally {
      setExporting(false);
    }
  };

  // Utility functions
  const convertToCSV = (data) => {
    if (!data || data.length === 0) return "";

    // Define headers for CSV
    const headers = [
      "Registration Number",
      "Make",
      "Model",
      "Year",
      "Color",
      "Fuel Type",
      "Engine Capacity",
      "Chassis Number",
      "Engine Number",
      "Class",
      "Status",
      "Mileage",
      "Registration Date",
      "Insurance Company",
      "Insurance Policy",
      "Insurance Valid From",
      "Insurance Valid To",
      "License Number",
      "License Valid From",
      "License Valid To",
      "Owner Name",
      "Owner NIC",
      "Owner Email",
      "Created Date",
    ];

    const csvHeaders = headers.join(",");

    const csvRows = data.map((vehicle) =>
      [
        vehicle.registrationNumber || "",
        vehicle.make || "",
        vehicle.model || "",
        vehicle.yearOfManufacture || "",
        vehicle.color || "",
        vehicle.fuelType || "",
        vehicle.engineCapacity || "",
        vehicle.chassisNumber || "",
        vehicle.engineNumber || "",
        vehicle.classOfVehicle || "",
        vehicle.verificationStatus || "",
        vehicle.mileage || "",
        vehicle.dateOfRegistration || "",
        vehicle.insuranceCompany || "",
        vehicle.insurancePolicyNumber || "",
        vehicle.insuranceValidFrom || "",
        vehicle.insuranceValidTo || "",
        vehicle.revenueLicenseNumber || "",
        vehicle.revenueLicenseValidFrom || "",
        vehicle.revenueLicenseValidTo || "",
        vehicle.ownerName || "",
        vehicle.ownerNIC || "",
        vehicle.ownerEmail || "",
        vehicle.createdAt || "",
      ]
        .map((field) => `"${field}"`)
        .join(",")
    );

    return [csvHeaders, ...csvRows].join("\n");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "VERIFIED":
        return "success";
      case "PENDING":
        return "warning";
      case "REJECTED":
        return "error";
      case "INCOMPLETE":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "VERIFIED":
        return <VerifiedIcon />;
      case "PENDING":
        return <PendingIcon />;
      case "REJECTED":
        return <RejectedIcon />;
      case "INCOMPLETE":
        return <WarningIcon />;
      default:
        return <WarningIcon />;
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

  // Vehicle Card Component
  const VehicleCard = ({ vehicle, index }) => {
    const [menuAnchor, setMenuAnchor] = useState(null);

    const hasInsuranceWarning =
      vehicle.insuranceDetails?.validTo &&
      isExpiringSoon(vehicle.insuranceDetails.validTo);
    const hasLicenseWarning =
      vehicle.revenueLicense?.validTo &&
      isExpiringSoon(vehicle.revenueLicense.validTo);

    return (
      <Fade in={true} timeout={300 + index * 100}>
        <Card
          className={`vehicle-card status-${vehicle.verificationStatus?.toLowerCase()}`}
          sx={{
            height: "100%",
            transition: "all 0.3s ease",
            cursor: "pointer",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 6,
            },
          }}
          onClick={() => handleViewVehicle(vehicle._id)}
        >
          <CardContent>
            {/* Header */}
            <Box className="vehicle-header">
              <Box>
                <Typography variant="h6" className="vehicle-registration">
                  {vehicle.registrationNumber}
                </Typography>
                <Typography variant="body2" className="vehicle-model">
                  {vehicle.make} {vehicle.model} ({vehicle.yearOfManufacture})
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Chip
                  icon={getStatusIcon(vehicle.verificationStatus)}
                  label={vehicle.verificationStatus}
                  color={getStatusColor(vehicle.verificationStatus)}
                  size="small"
                  variant="outlined"
                  className="vehicle-status-chip"
                />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuAnchor(e.currentTarget);
                    setSelectedVehicle(vehicle);
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Vehicle Details */}
            <Grid container spacing={1} className="vehicle-details">
              <Grid item xs={6}>
                <Box className="vehicle-detail-item">
                  <Box
                    className="vehicle-color-dot"
                    sx={{ bgcolor: vehicle.color?.toLowerCase() || "grey.400" }}
                  />
                  <Typography variant="body2" className="vehicle-detail-text">
                    {vehicle.color}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box className="vehicle-detail-item">
                  <FuelIcon fontSize="small" className="vehicle-detail-icon" />
                  <Typography variant="body2" className="vehicle-detail-text">
                    {vehicle.fuelType}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box className="vehicle-detail-item">
                  <SpeedIcon fontSize="small" className="vehicle-detail-icon" />
                  <Typography variant="body2" className="vehicle-detail-text">
                    {vehicle.mileage?.toLocaleString() || 0} km
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box className="vehicle-detail-item">
                  <DateIcon fontSize="small" className="vehicle-detail-icon" />
                  <Typography variant="body2" className="vehicle-detail-text">
                    {formatDate(vehicle.dateOfRegistration)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Expiry Warnings */}
            {(hasInsuranceWarning || hasLicenseWarning) && (
              <Box mb={2}>
                {hasInsuranceWarning && (
                  <Alert
                    severity="warning"
                    size="small"
                    sx={{ mb: 1 }}
                    className="expiry-warning insurance-warning"
                  >
                    Insurance expires{" "}
                    {formatDate(vehicle.insuranceDetails.validTo)}
                  </Alert>
                )}
                {hasLicenseWarning && (
                  <Alert
                    severity="error"
                    size="small"
                    className="expiry-warning license-warning"
                  >
                    License expires {formatDate(vehicle.revenueLicense.validTo)}
                  </Alert>
                )}
              </Box>
            )}

            {/* Footer */}
            <Box className="vehicle-footer">
              <Box className="vehicle-meta">
                <Box className="vehicle-meta-item">
                  <DocumentIcon
                    fontSize="small"
                    className="vehicle-detail-icon"
                  />
                  <Typography variant="caption" className="vehicle-meta-text">
                    {vehicle.documents?.length || 0} docs
                  </Typography>
                </Box>
                <Box className="vehicle-meta-item">
                  <PhotoIcon fontSize="small" className="vehicle-detail-icon" />
                  <Typography variant="caption" className="vehicle-meta-text">
                    {vehicle.images?.length || 0} photos
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" className="vehicle-class">
                Class: {vehicle.classOfVehicle}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    );
  };

  // Stats Card Component with enhanced animations
  const StatsCard = ({ title, value, icon, color, subtitle, loading }) => (
    <Zoom in={true} timeout={500}>
      <Card className={`stats-card ${title.toLowerCase().replace(" ", "-")}`}>
        <CardContent>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              {loading ? (
                <>
                  <Skeleton variant="text" width={60} height={40} />
                  <Skeleton variant="text" width={100} height={24} />
                  {subtitle && (
                    <Skeleton variant="text" width={80} height={16} />
                  )}
                </>
              ) : (
                <>
                  <Typography
                    variant="h3"
                    className="stats-value"
                    sx={{ color }}
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
                </>
              )}
            </Box>
            <Box className="stats-icon" sx={{ color }}>
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Zoom>
  );

  // Loading skeleton for vehicle cards
  const VehicleCardSkeleton = () => (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Box>
            <Skeleton variant="text" width={120} height={32} />
            <Skeleton variant="text" width={160} height={20} />
          </Box>
          <Skeleton variant="rectangular" width={80} height={24} />
        </Box>
        <Grid container spacing={1} mb={2}>
          {[...Array(4)].map((_, i) => (
            <Grid item xs={6} key={i}>
              <Skeleton variant="text" width="100%" height={20} />
            </Grid>
          ))}
        </Grid>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Skeleton variant="text" width={80} height={16} />
          <Skeleton variant="text" width={60} height={16} />
        </Box>
      </CardContent>
    </Card>
  );

  if (loading && vehicles.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box className="loading-container">
          <CircularProgress size={60} className="loading-spinner" />
          <Typography variant="h6" className="loading-text">
            Loading your vehicles...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }} className="add-vehicles-container">
      {/* Header */}
      <Box className="page-header">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h3" className="header-title">
              My Vehicles
            </Typography>
            <Typography variant="h6" className="header-subtitle">
              Manage your registered vehicles - NIC: {user?.nicNumber}
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            <Tooltip title="Refresh data">
              <IconButton
                onClick={handleRefresh}
                disabled={refreshing}
                className="action-button secondary"
              >
                <RefreshIcon
                  sx={{
                    animation: refreshing ? "spin 1s linear infinite" : "none",
                  }}
                />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              startIcon={
                exporting ? <CircularProgress size={20} /> : <ExportIcon />
              }
              onClick={handleExportVehicles}
              disabled={vehicles.length === 0 || exporting}
              className="action-button secondary"
            >
              {exporting ? "Exporting..." : "Export Data"}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowRegistrationForm(true)}
              size="large"
              className="action-button primary"
            >
              Register Vehicle
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Expiry Warnings */}
      {expiryWarnings.length > 0 && (
        <Alert severity="warning" className="warning-alert">
          <Typography variant="h6" className="warning-alert-title">
            Action Required: {expiryWarnings.length} vehicle(s) have expiring
            documents
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
            {expiryWarnings.slice(0, 3).map((warning, index) => (
              <Chip
                key={index}
                label={`${warning.registrationNumber} - ${
                  warning.type
                } expires ${formatDate(warning.expiryDate)}`}
                className="warning-chip"
                onClick={() => handleViewVehicle(warning._id)}
              />
            ))}
            {expiryWarnings.length > 3 && (
              <Chip
                label={`+${expiryWarnings.length - 3} more`}
                className="warning-chip"
              />
            )}
          </Box>
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} className="stats-grid">
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Vehicles"
            value={vehicleStats.totalVehicles}
            icon={<CarIcon />}
            color="#2196f3"
            subtitle="Registered vehicles"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Verified"
            value={vehicleStats.verifiedVehicles}
            icon={<VerifiedIcon />}
            color="#4caf50"
            subtitle="Approved by authorities"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Pending"
            value={vehicleStats.pendingVehicles}
            icon={<PendingIcon />}
            color="#ff9800"
            subtitle="Under review"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Badge badgeContent={vehicleStats.rejectedVehicles} color="error">
            <StatsCard
              title="Action Required"
              value={vehicleStats.rejectedVehicles}
              icon={<RejectedIcon />}
              color="#f44336"
              subtitle="Need attention"
              loading={loading}
            />
          </Badge>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Card className="search-filter-card">
        <Box display="flex" gap={3} alignItems="center" flexWrap="wrap">
          <TextField
            placeholder="Search vehicles by registration, make, or model..."
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
          />
          <Box>
            <Tabs
              value={filterStatus}
              onChange={handleFilterChange}
              variant="scrollable"
              scrollButtons="auto"
              className="filter-tabs"
            >
              <Tab label={`All (${vehicleStats.totalVehicles})`} value="all" />
              <Tab
                label={`Verified (${vehicleStats.verifiedVehicles})`}
                value="verified"
              />
              <Tab
                label={`Pending (${vehicleStats.pendingVehicles})`}
                value="pending"
              />
              <Tab
                label={`Rejected (${vehicleStats.rejectedVehicles})`}
                value="rejected"
              />
            </Tabs>
          </Box>
        </Box>
      </Card>

      {/* Vehicles Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <VehicleCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : vehicles.length > 0 ? (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {vehicles.map((vehicle, index) => (
              <Grid item xs={12} md={6} lg={4} key={vehicle._id}>
                <VehicleCard vehicle={vehicle} index={index} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box className="pagination-container">
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
        <Card className="empty-state">
          <CarIcon className="empty-state-icon" />
          <Typography variant="h4" className="empty-state-title">
            {searchTerm || filterStatus !== "all"
              ? "No vehicles found"
              : "No vehicles registered"}
          </Typography>
          <Typography variant="body1" className="empty-state-subtitle">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Start by registering your first vehicle with us"}
          </Typography>
          {!searchTerm && filterStatus === "all" && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="large"
              onClick={() => setShowRegistrationForm(true)}
              className="action-button primary"
            >
              Register Your First Vehicle
            </Button>
          )}
        </Card>
      )}

      {/* Vehicle Registration Dialog */}
      <Dialog
        open={showRegistrationForm}
        onClose={() => setShowRegistrationForm(false)}
        maxWidth="lg"
        fullWidth
        fullScreen
        className="vehicle-dialog"
      >
        <VehicleRegistrationForm
          onSubmit={handleVehicleSubmit}
          onCancel={() => setShowRegistrationForm(false)}
          isSubmitting={false}
        />
      </Dialog>

      {/* Vehicle Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.2)",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleViewVehicle(selectedVehicle?._id);
            setAnchorEl(null);
          }}
          className="vehicle-menu-item"
        >
          <ViewIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleEditVehicle(selectedVehicle?._id);
            setAnchorEl(null);
          }}
          className="vehicle-menu-item"
        >
          <EditIcon sx={{ mr: 1 }} />
          Edit Vehicle
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleDeleteVehicle(selectedVehicle?._id);
            setAnchorEl(null);
          }}
          className="vehicle-menu-item delete-item"
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Vehicle
        </MenuItem>
      </Menu>

      {/* Floating Action Button */}
      <Tooltip title="Register New Vehicle" placement="left">
        <Fab
          color="primary"
          className="fab-add-vehicle"
          onClick={() => setShowRegistrationForm(true)}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(33, 150, 243, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(33, 150, 243, 0);
          }
        }

        .fab-add-vehicle {
          animation: pulse 2s infinite;
        }

        .vehicle-card {
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stats-card {
          animation: fadeInUp 0.6s ease-out;
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </Container>
  );
};

export default AddVehicles;
