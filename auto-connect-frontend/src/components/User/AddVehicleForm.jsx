// components/AddVehicleForm.jsx - Create this new component
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Alert,
  Box,
  Chip,
  FormHelperText,
  Autocomplete,
} from "@mui/material";
import {
  DirectionsCar as CarIcon,
  CalendarToday as CalendarIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Notes as NotesIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";

const AddVehicleForm = ({
  open,
  onClose,
  vehicle,
  user,
  onSubmit,
  loading = false,
}) => {
  // Form state
  const [formData, setFormData] = useState({
    purpose: "SERVICE_BOOKING",
    priority: "MEDIUM",
    scheduledDate: getDefaultScheduledDate(),
    serviceType: "",
    notes: "",
    urgency: false,
    contactInfo: {
      phone: user?.phone || "",
      email: user?.email || "",
      preferredContactMethod: "PHONE",
    },
    location: {
      address: "",
      city: "Colombo",
      district: "Colombo",
    },
    estimatedCost: "",
  });

  const [errors, setErrors] = useState({});

  // Get default scheduled date (tomorrow)
  function getDefaultScheduledDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }

  // Purpose options
  const purposeOptions = [
    {
      value: "SERVICE_BOOKING",
      label: "Service Booking",
      description: "Regular maintenance or service",
    },
    {
      value: "REPAIR_REQUEST",
      label: "Repair Request",
      description: "Vehicle needs repair work",
    },
    {
      value: "MAINTENANCE_SCHEDULE",
      label: "Maintenance Schedule",
      description: "Scheduled maintenance",
    },
    {
      value: "INSPECTION",
      label: "Inspection",
      description: "Safety or technical inspection",
    },
    {
      value: "INSURANCE_CLAIM",
      label: "Insurance Claim",
      description: "Insurance-related service",
    },
    { value: "OTHER", label: "Other", description: "Other purpose" },
  ];

  // Service type options based on purpose
  const serviceTypeOptions = {
    SERVICE_BOOKING: [
      "OIL_CHANGE",
      "BRAKE_SERVICE",
      "AC_SERVICE",
      "TIRE_SERVICE",
      "GENERAL_MAINTENANCE",
      "ENGINE_TUNING",
    ],
    REPAIR_REQUEST: [
      "ENGINE_REPAIR",
      "TRANSMISSION_SERVICE",
      "ELECTRICAL_REPAIR",
      "BODY_WORK",
      "SUSPENSION_REPAIR",
    ],
    MAINTENANCE_SCHEDULE: [
      "OIL_CHANGE",
      "BRAKE_SERVICE",
      "TIRE_SERVICE",
      "AC_SERVICE",
      "GENERAL_MAINTENANCE",
    ],
    INSPECTION: ["INSPECTION"],
    INSURANCE_CLAIM: ["BODY_WORK", "ENGINE_REPAIR", "OTHER"],
    OTHER: ["OTHER"],
  };

  // Priority options
  const priorityOptions = [
    {
      value: "LOW",
      label: "Low",
      color: "#10b981",
      description: "Can wait, no rush",
    },
    {
      value: "MEDIUM",
      label: "Medium",
      color: "#f59e0b",
      description: "Normal priority",
    },
    {
      value: "HIGH",
      label: "High",
      color: "#ef4444",
      description: "Needs attention soon",
    },
    {
      value: "URGENT",
      label: "Urgent",
      color: "#dc2626",
      description: "Immediate attention required",
    },
  ];

  // Handle form field changes
  const handleChange = (field, value) => {
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

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.purpose) {
      newErrors.purpose = "Purpose is required";
    }

    if (!formData.scheduledDate) {
      newErrors.scheduledDate = "Scheduled date is required";
    } else {
      const selectedDate = new Date(formData.scheduledDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.scheduledDate = "Scheduled date cannot be in the past";
      }
    }

    if (!formData.contactInfo.phone && !formData.contactInfo.email) {
      newErrors.contact = "At least one contact method is required";
    }

    if (
      formData.contactInfo.phone &&
      !formData.contactInfo.phone.match(/^[\+]?[1-9][\d]{0,15}$/)
    ) {
      newErrors.phone = "Invalid phone number format";
    }

    if (
      formData.contactInfo.email &&
      !formData.contactInfo.email.match(/^\S+@\S+\.\S+$/)
    ) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.location.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    // Prepare data for submission
    const submissionData = {
      vehicleId: vehicle._id,
      purpose: formData.purpose,
      priority: formData.priority,
      scheduledDate: formData.scheduledDate,
      notes: generateDetailedNotes(),
      contactInfo: formData.contactInfo,
      location: formData.location,
      serviceDetails: {
        requestType: formData.serviceType || "GENERAL_SERVICE",
        urgency: formData.urgency ? "HIGH" : "NORMAL",
        serviceCategory: getServiceCategory(formData.purpose),
        estimatedCost: formData.estimatedCost
          ? parseFloat(formData.estimatedCost)
          : null,
      },
    };

    onSubmit(submissionData);
  };

  // Generate detailed notes
  const generateDetailedNotes = () => {
    const purposeLabel = purposeOptions.find(
      (p) => p.value === formData.purpose
    )?.label;
    const priorityLabel = priorityOptions.find(
      (p) => p.value === formData.priority
    )?.label;

    let notes = `Vehicle Service Request - ${purposeLabel}
    
Vehicle Details:
- Registration: ${vehicle.registrationNumber}
- Make/Model: ${vehicle.make} ${vehicle.model} (${vehicle.yearOfManufacture})
- Color: ${vehicle.color}
- Fuel Type: ${vehicle.fuelType}
- Class: ${vehicle.classOfVehicle}
- Current Mileage: ${vehicle.mileage?.toLocaleString() || "Not specified"} km

Request Details:
- Purpose: ${purposeLabel}
- Priority: ${priorityLabel}
- Service Type: ${formData.serviceType || "General Service"}
- Scheduled Date: ${new Date(formData.scheduledDate).toLocaleDateString()}
- Urgency: ${formData.urgency ? "Urgent" : "Normal"}
${
  formData.estimatedCost
    ? `- Estimated Cost: LKR ${parseFloat(
        formData.estimatedCost
      ).toLocaleString()}`
    : ""
}

Customer: ${user.firstName} ${user.lastName} (${user.nicNumber})`;

    if (formData.notes.trim()) {
      notes += `\n\nAdditional Notes:\n${formData.notes.trim()}`;
    }

    return notes;
  };

  // Get service category based on purpose
  const getServiceCategory = (purpose) => {
    const categoryMap = {
      SERVICE_BOOKING: "MAINTENANCE",
      REPAIR_REQUEST: "REPAIR",
      MAINTENANCE_SCHEDULE: "MAINTENANCE",
      INSPECTION: "INSPECTION",
      INSURANCE_CLAIM: "INSURANCE",
      OTHER: "GENERAL",
    };
    return categoryMap[purpose] || "GENERAL";
  };

  if (!vehicle || !user) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, maxHeight: "90vh" },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <CarIcon color="primary" />
          <Box>
            <Typography variant="h6">
              Add Vehicle to Service Requests
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {vehicle.registrationNumber} - {vehicle.make} {vehicle.model}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Vehicle Information Display */}
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Vehicle Information (Auto-filled)
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                <Chip label={`${vehicle.make} ${vehicle.model}`} size="small" />
                <Chip label={vehicle.yearOfManufacture} size="small" />
                <Chip label={vehicle.color} size="small" />
                <Chip label={vehicle.fuelType} size="small" />
                <Chip
                  label={`${vehicle.mileage?.toLocaleString() || 0} km`}
                  size="small"
                />
              </Box>
            </Alert>
          </Grid>

          {/* Purpose Selection */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.purpose}>
              <InputLabel>Purpose *</InputLabel>
              <Select
                value={formData.purpose}
                onChange={(e) => {
                  handleChange("purpose", e.target.value);
                  handleChange("serviceType", ""); // Reset service type
                }}
                label="Purpose *"
              >
                {purposeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box>
                      <Typography variant="body1">{option.label}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {option.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {errors.purpose && (
                <FormHelperText>{errors.purpose}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Priority Selection */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
                label="Priority"
              >
                {priorityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: option.color,
                        }}
                      />
                      <Box>
                        <Typography variant="body1">{option.label}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {option.description}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Service Type */}
          {formData.purpose && serviceTypeOptions[formData.purpose] && (
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Service Type</InputLabel>
                <Select
                  value={formData.serviceType}
                  onChange={(e) => handleChange("serviceType", e.target.value)}
                  label="Service Type"
                >
                  {serviceTypeOptions[formData.purpose].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type
                        .replace(/_/g, " ")
                        .toLowerCase()
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {/* Scheduled Date */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Scheduled Date *"
              value={formData.scheduledDate}
              onChange={(e) => handleChange("scheduledDate", e.target.value)}
              error={!!errors.scheduledDate}
              helperText={errors.scheduledDate}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: getDefaultScheduledDate() }}
            />
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <PhoneIcon /> Contact Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.contactInfo.phone}
              onChange={(e) =>
                handleChange("contactInfo.phone", e.target.value)
              }
              error={!!errors.phone}
              helperText={errors.phone || "Format: +94771234567"}
              placeholder="+94771234567"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.contactInfo.email}
              onChange={(e) =>
                handleChange("contactInfo.email", e.target.value)
              }
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>

          {errors.contact && (
            <Grid item xs={12}>
              <Alert severity="error">{errors.contact}</Alert>
            </Grid>
          )}

          {/* Location Information */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <LocationIcon /> Service Location
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address *"
              multiline
              rows={2}
              value={formData.location.address}
              onChange={(e) => handleChange("location.address", e.target.value)}
              error={!!errors.address}
              helperText={
                errors.address || "Where should the service be performed?"
              }
              placeholder="Street address, building name, area..."
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="City"
              value={formData.location.city}
              onChange={(e) => handleChange("location.city", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="District"
              value={formData.location.district}
              onChange={(e) =>
                handleChange("location.district", e.target.value)
              }
            />
          </Grid>

          {/* Estimated Cost */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Estimated Cost (Optional)"
              type="number"
              value={formData.estimatedCost}
              onChange={(e) => handleChange("estimatedCost", e.target.value)}
              helperText="Estimated cost in LKR"
              InputProps={{
                startAdornment: (
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    LKR
                  </Typography>
                ),
              }}
            />
          </Grid>

          {/* Additional Notes */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Additional Notes (Optional)"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              helperText="Any specific requirements, issues, or additional information"
              placeholder="Describe any specific issues, requirements, or special instructions..."
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: "space-between" }}>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? "Adding..." : "Add to Service Requests"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddVehicleForm;
