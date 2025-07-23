// src/components/dialogs/AddVehicleDialog.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  Box,
  IconButton,
  Tooltip,
  Fade,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import {
  Close as CloseIcon,
  DirectionsCar as CarIcon,
  Add as AddIcon,
  Verified as VerifiedIcon,
  Schedule as ScheduleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";

// AddedVehicle API Service
const addedVehicleApiService = {
  async addVehicle(data) {
    try {
      // Get auth token from localStorage or sessionStorage
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken") ||
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch("/api/v1/added-vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle different error status codes
        if (response.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        } else if (response.status === 403) {
          throw new Error("You do not have permission to add this vehicle.");
        } else if (response.status === 400) {
          throw new Error(result.message || "Invalid data provided.");
        }
        throw new Error(result.message || "Failed to add vehicle");
      }

      return result;
    } catch (error) {
      console.error("AddedVehicle API Error:", error);
      throw error;
    }
  },
};

const AddVehicleDialog = ({
  open,
  onClose,
  vehicle,
  onSuccess,
  userContext,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Form data state based on your backend schema
  const [formData, setFormData] = useState({
    vehicleId: vehicle?._id || "",
    purpose: "SERVICE_BOOKING",
    notes: "",
    priority: "MEDIUM",
    scheduledDate: "",
    serviceDetails: {
      serviceType: "",
      estimatedCost: "",
      estimatedDuration: "",
      urgency: false,
    },
    contactInfo: {
      phone: userContext?.phone || "",
      email: userContext?.email || "",
      preferredContactMethod: "PHONE",
    },
    location: {
      address: "",
      city: "",
      district: "",
    },
  });

  const steps = ["Service Details", "Schedule & Contact", "Location & Notes"];

  // Options based on your backend schema
  const purposeOptions = [
    { value: "SERVICE_BOOKING", label: "Service Booking", icon: "🔧" },
    { value: "INSURANCE_CLAIM", label: "Insurance Claim", icon: "🛡️" },
    {
      value: "MAINTENANCE_SCHEDULE",
      label: "Maintenance Schedule",
      icon: "📅",
    },
    { value: "REPAIR_REQUEST", label: "Repair Request", icon: "🛠️" },
    { value: "INSPECTION", label: "Vehicle Inspection", icon: "🔍" },
    { value: "SALE_LISTING", label: "Sale Listing", icon: "💰" },
    { value: "RENTAL", label: "Rental", icon: "🚗" },
    { value: "OTHER", label: "Other", icon: "📋" },
  ];

  const serviceTypes = [
    { value: "OIL_CHANGE", label: "Oil Change" },
    { value: "BRAKE_SERVICE", label: "Brake Service" },
    { value: "ENGINE_REPAIR", label: "Engine Repair" },
    { value: "TRANSMISSION_SERVICE", label: "Transmission Service" },
    { value: "ELECTRICAL_REPAIR", label: "Electrical Repair" },
    { value: "BODY_WORK", label: "Body Work" },
    { value: "TIRE_SERVICE", label: "Tire Service" },
    { value: "AC_SERVICE", label: "AC Service" },
    { value: "GENERAL_MAINTENANCE", label: "General Maintenance" },
    { value: "INSPECTION", label: "Inspection" },
    { value: "OTHER", label: "Other" },
  ];

  const priorityLevels = [
    {
      value: "LOW",
      label: "Low Priority",
      color: "#10b981",
      description: "Non-urgent, can wait",
    },
    {
      value: "MEDIUM",
      label: "Medium Priority",
      color: "#3b82f6",
      description: "Standard processing",
    },
    {
      value: "HIGH",
      label: "High Priority",
      color: "#f59e0b",
      description: "Needs attention soon",
    },
    {
      value: "URGENT",
      label: "Urgent",
      color: "#ef4444",
      description: "Immediate attention required",
    },
  ];

  const contactMethods = [
    { value: "PHONE", label: "Phone" },
    { value: "EMAIL", label: "Email" },
    { value: "SMS", label: "SMS" },
    { value: "WHATSAPP", label: "WhatsApp" },
  ];

  // Reset form data when vehicle changes
  React.useEffect(() => {
    if (vehicle) {
      setFormData((prev) => ({
        ...prev,
        vehicleId: vehicle._id,
      }));
    }
  }, [vehicle]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  // Validate current step
  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 0: // Service Details
        if (!formData.purpose) {
          newErrors.purpose = "Purpose is required";
        }
        if (!formData.serviceDetails.serviceType) {
          newErrors.serviceType = "Service type is required";
        }
        if (
          formData.serviceDetails.estimatedCost &&
          formData.serviceDetails.estimatedCost < 0
        ) {
          newErrors.estimatedCost = "Estimated cost cannot be negative";
        }
        break;

      case 1: // Schedule & Contact
        if (!formData.scheduledDate) {
          newErrors.scheduledDate = "Scheduled date is required";
        } else if (
          new Date(formData.scheduledDate) < new Date().setHours(0, 0, 0, 0)
        ) {
          newErrors.scheduledDate = "Scheduled date cannot be in the past";
        }
        if (!formData.contactInfo.phone.trim()) {
          newErrors.phone = "Contact phone is required";
        } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.contactInfo.phone)) {
          newErrors.phone = "Invalid phone number format";
        }
        if (!formData.contactInfo.email.trim()) {
          newErrors.email = "Contact email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.contactInfo.email)) {
          newErrors.email = "Invalid email format";
        }
        break;

      case 2: // Location & Notes
        if (!formData.location.address.trim()) {
          newErrors.address = "Service address is required";
        }
        if (formData.notes && formData.notes.length > 500) {
          newErrors.notes = "Notes cannot exceed 500 characters";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setLoading(true);
    try {
      // Prepare data for submission according to your backend schema
      const submitData = {
        vehicleId: vehicle._id,
        purpose: formData.purpose,
        notes: formData.notes.trim(),
        priority: formData.priority,
        scheduledDate: formData.scheduledDate,
        serviceDetails: {
          serviceType: formData.serviceDetails.serviceType,
          estimatedCost: formData.serviceDetails.estimatedCost
            ? parseFloat(formData.serviceDetails.estimatedCost)
            : undefined,
          estimatedDuration:
            formData.serviceDetails.estimatedDuration.trim() || undefined,
          urgency: formData.serviceDetails.urgency,
        },
        contactInfo: {
          phone: formData.contactInfo.phone.trim(),
          email: formData.contactInfo.email.trim(),
          preferredContactMethod: formData.contactInfo.preferredContactMethod,
        },
        location: {
          address: formData.location.address.trim(),
          city: formData.location.city.trim() || undefined,
          district: formData.location.district.trim() || undefined,
        },
      };

      console.log("Submitting vehicle data:", submitData);

      const response = await addedVehicleApiService.addVehicle(submitData);

      if (response.success) {
        toast.success(
          `${vehicle.registrationNumber} added to service request successfully!`
        );
        onSuccess && onSuccess(response.data.addedVehicle);
        handleClose();
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
      toast.error(error.message || "Failed to add vehicle to service request");
      setErrors({ submit: error.message || "Failed to submit request" });
    } finally {
      setLoading(false);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    if (!loading) {
      setCurrentStep(0);
      setFormData({
        vehicleId: vehicle?._id || "",
        purpose: "SERVICE_BOOKING",
        notes: "",
        priority: "MEDIUM",
        scheduledDate: "",
        serviceDetails: {
          serviceType: "",
          estimatedCost: "",
          estimatedDuration: "",
          urgency: false,
        },
        contactInfo: {
          phone: userContext?.phone || "",
          email: userContext?.email || "",
          preferredContactMethod: "PHONE",
        },
        location: {
          address: "",
          city: "",
          district: "",
        },
      });
      setErrors({});
      onClose();
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Helper functions for status colors and icons
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
        return <ScheduleIcon />;
      case "REJECTED":
        return <ErrorIcon />;
      case "INCOMPLETE":
        return <WarningIcon />;
      default:
        return <InfoIcon />;
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.purpose}>
                <InputLabel>Purpose</InputLabel>
                <Select
                  value={formData.purpose}
                  onChange={(e) => handleInputChange("purpose", e.target.value)}
                  label="Purpose"
                >
                  {purposeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.purpose && (
                  <FormHelperText>{errors.purpose}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.serviceType}>
                <InputLabel>Service Type</InputLabel>
                <Select
                  value={formData.serviceDetails.serviceType}
                  onChange={(e) =>
                    handleInputChange(
                      "serviceDetails.serviceType",
                      e.target.value
                    )
                  }
                  label="Service Type"
                >
                  {serviceTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.serviceType && (
                  <FormHelperText>{errors.serviceType}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Priority Level</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={(e) =>
                    handleInputChange("priority", e.target.value)
                  }
                  label="Priority Level"
                >
                  {priorityLevels.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: level.color,
                          }}
                        />
                        <Box>
                          <Typography variant="body2">{level.label}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {level.description}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Estimated Cost (LKR)"
                type="number"
                value={formData.serviceDetails.estimatedCost}
                onChange={(e) =>
                  handleInputChange(
                    "serviceDetails.estimatedCost",
                    e.target.value
                  )
                }
                placeholder="Optional"
                error={!!errors.estimatedCost}
                helperText={errors.estimatedCost}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Estimated Duration"
                value={formData.serviceDetails.estimatedDuration}
                onChange={(e) =>
                  handleInputChange(
                    "serviceDetails.estimatedDuration",
                    e.target.value
                  )
                }
                placeholder="e.g., 2 hours, Half day, Full day"
                helperText="Optional: How long do you expect this service to take?"
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Scheduled Date"
                value={formData.scheduledDate}
                onChange={(e) =>
                  handleInputChange("scheduledDate", e.target.value)
                }
                error={!!errors.scheduledDate}
                helperText={errors.scheduledDate}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getMinDate() }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Phone"
                value={formData.contactInfo.phone}
                onChange={(e) =>
                  handleInputChange("contactInfo.phone", e.target.value)
                }
                error={!!errors.phone}
                helperText={errors.phone}
                placeholder="+94771234567"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Email"
                type="email"
                value={formData.contactInfo.email}
                onChange={(e) =>
                  handleInputChange("contactInfo.email", e.target.value)
                }
                error={!!errors.email}
                helperText={errors.email}
                placeholder="example@email.com"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Preferred Contact Method</InputLabel>
                <Select
                  value={formData.contactInfo.preferredContactMethod}
                  onChange={(e) =>
                    handleInputChange(
                      "contactInfo.preferredContactMethod",
                      e.target.value
                    )
                  }
                  label="Preferred Contact Method"
                >
                  {contactMethods.map((method) => (
                    <MenuItem key={method.value} value={method.value}>
                      {method.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Service Address *"
                value={formData.location.address}
                onChange={(e) =>
                  handleInputChange("location.address", e.target.value)
                }
                error={!!errors.address}
                helperText={
                  errors.address || "Where should the service be performed?"
                }
                placeholder="Full address for service location"
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={formData.location.city}
                onChange={(e) =>
                  handleInputChange("location.city", e.target.value)
                }
                placeholder="e.g., Colombo"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="District"
                value={formData.location.district}
                onChange={(e) =>
                  handleInputChange("location.district", e.target.value)
                }
                placeholder="e.g., Colombo"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any special instructions or additional information..."
                multiline
                rows={4}
                error={!!errors.notes}
                helperText={
                  errors.notes ||
                  `Optional: Provide any additional details for the service provider (${formData.notes.length}/500)`
                }
                inputProps={{ maxLength: 500 }}
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  if (!vehicle) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box>
          <Typography variant="h5" component="div" gutterBottom>
            Add Vehicle to Service
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {vehicle.registrationNumber} - {vehicle.make} {vehicle.model} (
            {vehicle.yearOfManufacture})
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          disabled={loading}
          sx={{ color: "grey.500" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Vehicle Info Card */}
        <Card sx={{ m: 3, mb: 2 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                <CarIcon />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">
                  {vehicle.registrationNumber}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {vehicle.make} {vehicle.model} ({vehicle.yearOfManufacture})
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <Chip
                    icon={getStatusIcon(vehicle.verificationStatus)}
                    label={vehicle.verificationStatus}
                    size="small"
                    color={getStatusColor(vehicle.verificationStatus)}
                  />
                  <Chip label={vehicle.color} size="small" variant="outlined" />
                  <Chip
                    label={vehicle.fuelType}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Progress Stepper */}
        <Box sx={{ px: 3, mb: 3 }}>
          <Stepper activeStep={currentStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Form Content */}
        <Box sx={{ px: 3, pb: 2 }}>
          <Fade in={true} key={currentStep}>
            <div>{renderStepContent()}</div>
          </Fade>
        </Box>

        {/* Error Display */}
        {errors.submit && (
          <Alert severity="error" sx={{ mx: 3, mb: 2 }}>
            {errors.submit}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: 1, borderColor: "divider" }}>
        <Button onClick={handleClose} disabled={loading} color="inherit">
          Cancel
        </Button>

        {currentStep > 0 && (
          <Button onClick={handlePrevious} disabled={loading} color="inherit">
            Previous
          </Button>
        )}

        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext} variant="contained" disabled={loading}>
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
          >
            {loading ? "Adding..." : "Add Vehicle"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddVehicleDialog;
