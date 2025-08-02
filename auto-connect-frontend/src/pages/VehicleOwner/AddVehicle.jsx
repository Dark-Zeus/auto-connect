// src/pages/AddVehicles.jsx (Simplified Display Only Version)
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
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  DirectionsCar as CarIcon,
  Verified as VerifiedIcon,
  HourglassEmpty as PendingIcon,
  Cancel as RejectedIcon,
  Warning as WarningIcon,
  InsertDriveFile as DocumentIcon,
  PhotoCamera as PhotoIcon,
  LocalGasStation as FuelIcon,
  DateRange as DateIcon,
  Speed as SpeedIcon,
  Refresh as RefreshIcon,
  CloudDownload as ExportIcon,
} from "@mui/icons-material";
import { UserContext } from "../../contexts/UserContext";
import {
  vehicleAPI,
  handleVehicleError,
} from "../../services/vehicleApiService";
import { addedVehicleAPI } from "../../services/addedVehicleApiService";
import "./AddVehicles.css";

const AddVehicles = () => {
  const navigate = useNavigate();
  const { userContext: user } = useContext(UserContext);

  // State management
  const [vehicles, setVehicles] = useState([]);
  const [addedVehicles, setAddedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
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

  // Initial data loading
  useEffect(() => {
    console.log("User context:", user);
    if (!user) {
      toast.error("Please log in to access this page.");
      return;
    }

    if (user.role !== "vehicle_owner") {
      toast.error("Access denied. Only vehicle owners can access this page.");
      return;
    }

    if (!user.nicNumber) {
      toast.error(
        "NIC number is required to manage vehicles. Please complete your profile."
      );
      return;
    }

    // Initial data fetch
    fetchVehicles();
    fetchVehicleStats();
    loadAddedVehicleIds();
  }, [user]);

  // Fetch vehicles from backend - FILTERED BY USER NIC
  const fetchVehicles = async (page = 1, search = "", status = "all") => {
    try {
      setLoading(true);

      const params = {
        page: page,
        limit: pagination.limit,
        ownerNIC: user.nicNumber,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (status !== "all") {
        params.verificationStatus = status.toUpperCase();
      }

      console.log("Fetching vehicles with params:", params);

      const response = await vehicleAPI.getVehicles(params);

      if (response.success) {
        console.log("Vehicles response:", response.data);
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
      } else {
        console.error("Failed to fetch vehicles:", response.message);
        toast.error(response.message || "Failed to fetch vehicles");
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      handleVehicleError(error, "fetch vehicles");
    } finally {
      setLoading(false);
    }
  };

  // Fetch vehicle statistics - FILTERED BY USER NIC
  const fetchVehicleStats = async () => {
    try {
      const response = await vehicleAPI.getStats({
        ownerNIC: user.nicNumber,
      });

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
    }
  };

  // Load already added vehicle IDs
  // (Removed duplicate declaration to fix redeclaration error)

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchVehicles(pagination.page, searchTerm, filterStatus),
      fetchVehicleStats(),
      loadAddedVehicleIds(),
    ]);
    setRefreshing(false);
    toast.success("Data refreshed successfully");
  };


  const handleAddVehicle = async (vehicleId) => {
    const vehicle = vehicles.find((v) => v._id === vehicleId);
    if (!vehicle) {
      toast.error("Vehicle not found");
      return;
    }

    // Check if vehicle is verified before allowing addition
    if (vehicle.verificationStatus !== "VERIFIED") {
      toast.warning(
        `${vehicle.registrationNumber} must be verified before adding to service. Current status: ${vehicle.verificationStatus}`
      );
      return;
    }

    // Check if already added
    if (addedVehicles.includes(vehicleId)) {
      toast.info(
        `${vehicle.registrationNumber} is already added to service requests`
      );
      return;
    }

    try {
      console.log(
        "🚀 Adding vehicle to service requests:",
        vehicle.registrationNumber
      );

      // Set scheduled date to tomorrow to avoid past date validation
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + 1);

      // Prepare vehicle data according to the EXACT backend schema requirements
      const addVehicleData = {
        // REQUIRED: Vehicle ID (ObjectId)
        vehicleId: vehicle._id,

        // REQUIRED: Purpose (enum value)
        purpose: "SERVICE_BOOKING", // Must match enum exactly

        // REQUIRED: Priority (enum value)
        priority: "MEDIUM", // Must match enum exactly

        // REQUIRED: Scheduled date (future date)
        scheduledDate: scheduledDate.toISOString().split("T")[0], // Format: YYYY-MM-DD

        // Service details object with CORRECT enum values
        serviceDetails: {
          serviceType: "GENERAL_MAINTENANCE", // Must match backend enum exactly
          urgency: false, // Boolean, not string
          estimatedDuration: "2-3 hours",
          estimatedCost: 0, // Number, must be >= 0
        },

        // Contact info object with proper validation
        contactInfo: {
          phone: user.phone || "+94771234567", // Must match phone pattern
          email: user.email || `${user.nicNumber}@autoconnect.lk`, // Must match email pattern
          preferredContactMethod: "PHONE", // Must be exact enum value
        },

        // Location object
        location: {
          address: "Service location to be confirmed",
          city: "Colombo",
          district: "Colombo",
          coordinates: {
            latitude: null,
            longitude: null,
          },
        },

        // Notes with length validation (max 500 characters as per schema)
        notes: `Vehicle added for service booking from vehicle management page.

Vehicle Details:
- Registration: ${vehicle.registrationNumber}
- Make/Model: ${vehicle.make} ${vehicle.model} (${vehicle.yearOfManufacture})
- Color: ${vehicle.color}
- Fuel Type: ${vehicle.fuelType}
- Class: ${vehicle.classOfVehicle}
- Current Mileage: ${vehicle.mileage || "Not specified"}km

Owner: ${user.firstName} ${user.lastName} (${user.nicNumber})`.substring(
          0,
          490
        ), // Ensure under 500 chars

        // NOTE: The following fields are automatically set by the backend:
        // - addedBy: req.user._id (from JWT token)
        // - vehicleOwner: vehicle.ownerId (from vehicle record)
        // - ownerNIC: vehicle.ownerNIC (from vehicle record)
        // - createdBy: req.user._id (from JWT token)
        // - status: "ACTIVE" (default)
        // - isActive: true (default)
        // - tracking: { submittedAt, lastUpdated, etc. }
        // - metadata: { source, ipAddress, userAgent, etc. }
      };

      console.log("📝 Sending vehicle data to API:", addVehicleData);

      // Call the API
      const response = await addedVehicleAPI.addVehicle(addVehicleData);

      console.log("📊 API Response:", response);

      if (response.success) {
        // Add to local state to prevent re-adding
        setAddedVehicles((prev) => [...prev, vehicleId]);

        toast.success(
          `✅ ${vehicle.registrationNumber} added to service requests successfully!`
        );

        console.log(
          "✅ Vehicle successfully added to added_vehicles collection:",
          {
            addedVehicleId: response.data?.addedVehicle?._id,
            registrationNumber: vehicle.registrationNumber,
            status: response.data?.addedVehicle?.status,
            purpose: response.data?.addedVehicle?.purpose,
          }
        );

        // Show additional info after success
        setTimeout(() => {
          toast.info(
            `📋 Service request created for ${vehicle.registrationNumber}. View it in "Added Vehicles" page.`,
            { autoClose: 6000 }
          );
        }, 1000);

        // Refresh the added vehicles list
        await loadAddedVehicleIds();
      } else {
        // Handle API errors with detailed feedback
        console.error("❌ Add vehicle API error:", response.message);
        handleAddVehicleError(response.message, vehicle.registrationNumber);
      }
    } catch (error) {
      console.error("❌ Exception in handleAddVehicle:", error);
      handleAddVehicleError(error.message, vehicle.registrationNumber);
    }
  };

  // Enhanced error handling function
  const handleAddVehicleError = (errorMessage, registrationNumber = "") => {
    console.error("❌ Add vehicle error:", errorMessage);

    if (errorMessage.toLowerCase().includes("validation")) {
      // Parse validation details if available
      if (errorMessage.includes("Details:")) {
        const detailsStart = errorMessage.indexOf("Details:");
        const details = errorMessage.substring(detailsStart + 8);
        try {
          const parsedDetails = JSON.parse(details);
          console.error("🔍 Validation Details:", parsedDetails);

          // Show more specific error based on validation details
          if (parsedDetails.vehicleId) {
            toast.error("❌ Invalid vehicle ID. Please refresh and try again.");
          } else if (parsedDetails.scheduledDate) {
            toast.error(
              "❌ Invalid scheduled date. Please check the date and try again."
            );
          } else if (parsedDetails.contactInfo) {
            toast.error(
              "❌ Invalid contact information. Please check your profile details."
            );
          } else {
            toast.error(
              "❌ Validation error. Please check the vehicle data and try again."
            );
          }
        } catch (parseError) {
          toast.error(
            "❌ Validation error. Please check the vehicle data and try again."
          );
        }
      } else {
        toast.error(
          "❌ Validation error. Please check the vehicle data and try again."
        );
      }
    } else if (errorMessage.toLowerCase().includes("already added")) {
      toast.warning(
        `⚠️ ${registrationNumber} is already in your service requests!`
      );
      // Add to local state if it was already added
      const vehicleId = vehicles.find(
        (v) => v.registrationNumber === registrationNumber
      )?._id;
      if (vehicleId) {
        setAddedVehicles((prev) => [...prev, vehicleId]);
      }
    } else if (
      errorMessage.toLowerCase().includes("session") ||
      errorMessage.toLowerCase().includes("authentication")
    ) {
      toast.error("🔐 Session expired. Please log in again.");
      // Optionally redirect to login
      // navigate('/login');
    } else if (
      errorMessage.toLowerCase().includes("permission") ||
      errorMessage.toLowerCase().includes("access")
    ) {
      toast.error("🚫 You don't have permission to add this vehicle.");
    } else if (errorMessage.toLowerCase().includes("not found")) {
      if (errorMessage.toLowerCase().includes("vehicle owner")) {
        toast.error(
          "❌ Vehicle owner information not found. Please contact support."
        );
      } else {
        toast.error(
          "❌ Vehicle not found. Please refresh the page and try again."
        );
      }
    } else if (
      errorMessage.toLowerCase().includes("network") ||
      errorMessage.toLowerCase().includes("fetch")
    ) {
      toast.error(
        "🌐 Cannot connect to server. Please check your internet connection."
      );
    } else if (
      errorMessage.toLowerCase().includes("server") ||
      errorMessage.toLowerCase().includes("500")
    ) {
      toast.error("🔧 Server error. Please try again in a few moments.");
    } else {
      toast.error(
        `❌ ${
          errorMessage ||
          "An unexpected error occurred while adding the vehicle."
        }`
      );
    }
  };

  // Enhanced loadAddedVehicleIds function with better error handling
  const loadAddedVehicleIds = async () => {
    try {
      console.log("🔍 Refreshing added vehicles list...");
      const response = await addedVehicleAPI.getAddedVehicles({
        limit: 100,
        status: "all",
      });

      if (response.success && response.data?.addedVehicles) {
        const addedIds = response.data.addedVehicles
          .map((av) => av.vehicleId?._id || av.vehicleId)
          .filter((id) => id);

        setAddedVehicles(addedIds);
        console.log(
          "📋 Updated added vehicles list:",
          addedIds.length,
          "vehicles"
        );
      }
    } catch (error) {
      console.error("Error refreshing added vehicles list:", error);
      // Don't show toast error for this as it's not critical to the main functionality
    }
  };

  // Simple add vehicle function - adds to added_vehicles collection


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

  // Handle export vehicles
  const handleExportVehicles = async () => {
    try {
      setExporting(true);
      const response = await vehicleAPI.exportVehicles({
        ownerNIC: user.nicNumber,
      });

      if (response.success) {
        const csvData = convertToCSV(response.data.vehicles);
        const filename = `my_vehicles_${user.nicNumber}_${
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
        vehicle.cylinderCapacity || "",
        vehicle.chassisNumber || "",
        vehicle.engineNumber || "",
        vehicle.classOfVehicle || "",
        vehicle.verificationStatus || "",
        vehicle.mileage || "",
        vehicle.dateOfRegistration || "",
        vehicle.insuranceDetails?.provider || "",
        vehicle.insuranceDetails?.policyNumber || "",
        vehicle.insuranceDetails?.validFrom || "",
        vehicle.insuranceDetails?.validTo || "",
        vehicle.revenueLicense?.licenseNumber || "",
        vehicle.revenueLicense?.validFrom || "",
        vehicle.revenueLicense?.validTo || "",
        vehicle.currentOwner?.name || "",
        vehicle.ownerNIC || "",
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

  const getColorDotStyle = (color) => {
    const colorMap = {
      white: "#f8f9fa",
      black: "#212529",
      red: "#dc3545",
      blue: "#0d6efd",
      silver: "#adb5bd",
      grey: "#6c757d",
      gray: "#6c757d",
      green: "#198754",
      yellow: "#ffc107",
      orange: "#fd7e14",
      brown: "#8b4513",
      purple: "#6f42c1",
      pink: "#d63384",
      gold: "#ffd700",
      maroon: "#800000",
      navy: "#000080",
      cream: "#f5f5dc",
      beige: "#f5f5dc",
    };

    return {
      backgroundColor: colorMap[color?.toLowerCase()] || "#e9ecef",
      border: color?.toLowerCase() === "white" ? "2px solid #dee2e6" : "none",
    };
  };

  // Vehicle Card Component
  const VehicleCard = ({ vehicle, index }) => {
    const hasInsuranceWarning =
      vehicle.insuranceDetails?.validTo &&
      isExpiringSoon(vehicle.insuranceDetails.validTo);
    const hasLicenseWarning =
      vehicle.revenueLicense?.validTo &&
      isExpiringSoon(vehicle.revenueLicense.validTo);

    // Check if vehicle can be added (must be verified and not already added)
    const canAddVehicle = vehicle.verificationStatus === "VERIFIED";
    const isAlreadyAdded = addedVehicles.includes(vehicle._id);

    return (
      <Fade in={true} timeout={300 + index * 50}>
        <Card
          className={`vehicle-card status-${vehicle.verificationStatus?.toLowerCase()}`}
        >
          <CardContent className="vehicle-card-content">
            {/* Header */}
            <div className="vehicle-header">
              <div className="vehicle-title-section">
                <Typography variant="h6" className="vehicle-registration">
                  {vehicle.registrationNumber}
                </Typography>
                <Typography variant="body2" className="vehicle-model">
                  {vehicle.make} {vehicle.model} ({vehicle.yearOfManufacture})
                </Typography>
              </div>
              <div className="vehicle-status-section">
                <Chip
                  icon={getStatusIcon(vehicle.verificationStatus)}
                  label={vehicle.verificationStatus}
                  color={getStatusColor(vehicle.verificationStatus)}
                  size="small"
                  variant="outlined"
                  className="vehicle-status-chip"
                />
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="vehicle-details-grid">
              <div className="vehicle-detail-item">
                <div
                  className="vehicle-color-dot"
                  style={getColorDotStyle(vehicle.color)}
                />
                <span className="vehicle-detail-text">{vehicle.color}</span>
              </div>
              <div className="vehicle-detail-item">
                <FuelIcon className="vehicle-detail-icon" />
                <span className="vehicle-detail-text">{vehicle.fuelType}</span>
              </div>
              <div className="vehicle-detail-item">
                <SpeedIcon className="vehicle-detail-icon" />
                <span className="vehicle-detail-text">
                  {vehicle.mileage?.toLocaleString() || 0} km
                </span>
              </div>
              <div className="vehicle-detail-item">
                <DateIcon className="vehicle-detail-icon" />
                <span className="vehicle-detail-text">
                  {formatDate(vehicle.dateOfRegistration)}
                </span>
              </div>
            </div>

            {/* Expiry Warnings */}
            {(hasInsuranceWarning || hasLicenseWarning) && (
              <div className="expiry-warnings">
                {hasInsuranceWarning && (
                  <Alert
                    severity="warning"
                    size="small"
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
              </div>
            )}

            {/* Status Warnings */}
            {!canAddVehicle && (
              <Alert
                severity="info"
                size="small"
                className="verification-warning"
              >
                Vehicle must be verified before adding to service
              </Alert>
            )}

            {isAlreadyAdded && (
              <Alert
                severity="success"
                size="small"
                className="already-added-warning"
              >
                Already added to service requests
              </Alert>
            )}

            {/* Footer */}
            <div className="vehicle-footer">
              <div className="vehicle-meta">
                <div className="vehicle-meta-item">
                  <DocumentIcon className="vehicle-meta-icon" />
                  <span className="vehicle-meta-text">
                    {vehicle.documents?.length || 0} docs
                  </span>
                </div>
                <div className="vehicle-meta-item">
                  <PhotoIcon className="vehicle-meta-icon" />
                  <span className="vehicle-meta-text">
                    {vehicle.images?.length || 0} photos
                  </span>
                </div>
                <div className="vehicle-class">
                  Class: {vehicle.classOfVehicle}
                </div>
              </div>
              <Tooltip
                title={
                  isAlreadyAdded
                    ? "Vehicle already added to service requests"
                    : canAddVehicle
                    ? "Add vehicle to service request"
                    : "Vehicle must be verified first"
                }
              >
                <span>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddVehicle(vehicle._id);
                    }}
                    size="small"
                    className="add-vehicle-btn"
                    disabled={!canAddVehicle || isAlreadyAdded}
                    color={
                      isAlreadyAdded
                        ? "success"
                        : canAddVehicle
                        ? "primary"
                        : "inherit"
                    }
                  >
                    {isAlreadyAdded ? "Added" : "Add"}
                  </Button>
                </span>
              </Tooltip>
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

  // Loading skeleton for vehicle cards
  const VehicleCardSkeleton = () => (
    <Card className="vehicle-card vehicle-card-skeleton">
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
          <Skeleton variant="rectangular" width={60} height={32} />
        </div>
      </CardContent>
    </Card>
  );

  if (loading && vehicles.length === 0) {
    return (
      <Container maxWidth="xl" className="vehicles-container">
        <div className="loading-container">
          <CircularProgress size={60} className="loading-spinner" />
          <Typography variant="h6" className="loading-text">
            Loading your vehicles...
          </Typography>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="vehicles-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-info">
            <Typography variant="h3" className="header-title">
              My Vehicles
            </Typography>
            <Typography variant="h6" className="header-subtitle">
              Select your vehicles for service - NIC: {user?.nicNumber}
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
              onClick={handleExportVehicles}
              disabled={vehicles.length === 0 || exporting}
              className="export-btn"
            >
              {exporting ? "Exporting..." : "Export Data"}
            </Button>
          </div>
        </div>
      </div>

      {/* Expiry Warnings */}
      {expiryWarnings.length > 0 && (
        <Alert severity="warning" className="warning-alert">
          <Typography variant="h6" className="warning-title">
            Action Required: {expiryWarnings.length} vehicle(s) have expiring
            documents
          </Typography>
          <div className="warning-chips">
            {expiryWarnings.slice(0, 3).map((warning, index) => (
              <Chip
                key={index}
                label={`${warning.registrationNumber} - ${
                  warning.type
                } expires ${formatDate(warning.expiryDate)}`}
                className="warning-chip"
              />
            ))}
            {expiryWarnings.length > 3 && (
              <Chip
                label={`+${expiryWarnings.length - 3} more`}
                className="warning-chip"
              />
            )}
          </div>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="stats-section">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Vehicles"
              value={vehicleStats.totalVehicles}
              icon={<CarIcon />}
              color="#3b82f6"
              subtitle="Your registered vehicles"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Verified"
              value={vehicleStats.verifiedVehicles}
              icon={<VerifiedIcon />}
              color="#10b981"
              subtitle="Ready for service"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Pending"
              value={vehicleStats.pendingVehicles}
              icon={<PendingIcon />}
              color="#f59e0b"
              subtitle="Under review"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Action Required"
              value={vehicleStats.rejectedVehicles}
              icon={<RejectedIcon />}
              color="#ef4444"
              subtitle="Need attention"
              loading={loading}
            />
          </Grid>
        </Grid>
      </div>

      {/* Search and Filter */}
      <Card className="search-filter-section">
        <CardContent className="search-filter-content">
          <TextField
            placeholder="Search your vehicles by registration, make, or model..."
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
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Grid */}
      <div className="vehicles-section">
        {loading ? (
          <div className="vehicles-grid">
            {[...Array(6)].map((_, index) => (
              <VehicleCardSkeleton key={index} />
            ))}
          </div>
        ) : vehicles.length > 0 ? (
          <>
            <div className="vehicles-grid">
              {vehicles.map((vehicle, index) => (
                <VehicleCard
                  key={vehicle._id}
                  vehicle={vehicle}
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
                {searchTerm || filterStatus !== "all"
                  ? "No vehicles found"
                  : "No vehicles registered"}
              </Typography>
              <Typography variant="body1" className="empty-state-subtitle">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : `No vehicles found for NIC: ${user?.nicNumber}`}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/vehicle-registration")}
                startIcon={<AddIcon />}
                sx={{ mt: 2 }}
              >
                Register Your First Vehicle
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Container>
  );
};

export default AddVehicles;
