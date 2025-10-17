// src/components/dialogs/EditVehicleDialog.jsx - CREATE THIS NEW COMPONENT

import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";

const EditVehicleDialog = ({
  open,
  onClose,
  selectedVehicle,
  onUpdate,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    purpose: "",
    priority: "",
    status: "",
    scheduledDate: "",
    notes: "",
    contactInfo: {
      phone: "",
      email: "",
      preferredContactMethod: "PHONE",
    },
    location: {
      address: "",
      city: "",
      district: "",
    },
    serviceDetails: {
      serviceType: "",
      urgency: false,
      estimatedDuration: "",
      estimatedCost: 0,
    },
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Initialize form data when selectedVehicle changes
  useEffect(() => {
    if (selectedVehicle) {
      setFormData({
        purpose: selectedVehicle.purpose || "",
        priority: selectedVehicle.priority || "",
        status: selectedVehicle.status || "",
        scheduledDate: selectedVehicle.scheduledDate
          ? selectedVehicle.scheduledDate.split("T")[0]
          : "",
        notes: selectedVehicle.notes || "",
        contactInfo: {
          phone: selectedVehicle.contactInfo?.phone || "",
          email: selectedVehicle.contactInfo?.email || "",
          preferredContactMethod:
            selectedVehicle.contactInfo?.preferredContactMethod || "PHONE",
        },
        location: {
          address: selectedVehicle.location?.address || "",
          city: selectedVehicle.location?.city || "",
          district: selectedVehicle.location?.district || "",
        },
        serviceDetails: {
          serviceType: selectedVehicle.serviceDetails?.serviceType || "",
          urgency: selectedVehicle.serviceDetails?.urgency || false,
          estimatedDuration:
            selectedVehicle.serviceDetails?.estimatedDuration || "",
          estimatedCost: selectedVehicle.serviceDetails?.estimatedCost || 0,
        },
      });
      setErrors({});
    }
  }, [selectedVehicle]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Validate scheduled date
    if (formData.scheduledDate) {
      const scheduledDate = new Date(formData.scheduledDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (scheduledDate < today) {
        newErrors.scheduledDate = "Scheduled date cannot be in the past";
      }
    }

    // Validate notes length
    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = "Notes cannot exceed 500 characters";
    }

    // Validate phone number
    if (formData.contactInfo.phone) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(formData.contactInfo.phone)) {
        newErrors.phone = "Invalid phone number format";
      }
    }

    // Validate email
    if (formData.contactInfo.email) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(formData.contactInfo.email)) {
        newErrors.email = "Invalid email format";
      }
    }

    // Validate estimated cost
    if (formData.serviceDetails.estimatedCost < 0) {
      newErrors.estimatedCost = "Estimated cost cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setSubmitting(true);

    try {
      // Prepare update data (only send changed fields)
      const updateData = {};

      if (formData.purpose !== selectedVehicle.purpose) {
        updateData.purpose = formData.purpose;
      }
      if (formData.priority !== selectedVehicle.priority) {
        updateData.priority = formData.priority;
      }
      if (formData.status !== selectedVehicle.status) {
        updateData.status = formData.status;
      }
      if (
        formData.scheduledDate !==
        (selectedVehicle.scheduledDate?.split("T")[0] || "")
      ) {
        updateData.scheduledDate = formData.scheduledDate;
      }
      if (formData.notes !== (selectedVehicle.notes || "")) {
        updateData.notes = formData.notes;
      }

      // Check contact info changes
      const contactInfoChanged =
        formData.contactInfo.phone !==
          (selectedVehicle.contactInfo?.phone || "") ||
        formData.contactInfo.email !==
          (selectedVehicle.contactInfo?.email || "") ||
        formData.contactInfo.preferredContactMethod !==
          (selectedVehicle.contactInfo?.preferredContactMethod || "PHONE");

      if (contactInfoChanged) {
        updateData.contactInfo = formData.contactInfo;
      }

      // Check location changes
      const locationChanged =
        formData.location.address !==
          (selectedVehicle.location?.address || "") ||
        formData.location.city !== (selectedVehicle.location?.city || "") ||
        formData.location.district !==
          (selectedVehicle.location?.district || "");

      if (locationChanged) {
        updateData.location = formData.location;
      }

      // Check service details changes
      const serviceDetailsChanged =
        formData.serviceDetails.serviceType !==
          (selectedVehicle.serviceDetails?.serviceType || "") ||
        formData.serviceDetails.urgency !==
          (selectedVehicle.serviceDetails?.urgency || false) ||
        formData.serviceDetails.estimatedDuration !==
          (selectedVehicle.serviceDetails?.estimatedDuration || "") ||
        formData.serviceDetails.estimatedCost !==
          (selectedVehicle.serviceDetails?.estimatedCost || 0);

      if (serviceDetailsChanged) {
        updateData.serviceDetails = formData.serviceDetails;
      }

      console.log("📝 Update data to send:", updateData);

      if (Object.keys(updateData).length === 0) {
        toast.info("No changes detected");
        onClose();
        return;
      }

      await onUpdate(updateData);
      onClose();
    } catch (error) {
      console.error("Error updating vehicle:", error);
      toast.error("Failed to update vehicle");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle input changes
  const handleChange = (field, value, section = null) => {
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    // Clear error when field is fixed
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  if (!selectedVehicle) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Edit Vehicle Request
        </Typography>
        <Chip
          label={selectedVehicle.vehicleId?.registrationNumber || "Unknown"}
          sx={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}
        />
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
              Basic Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.purpose}>
              <InputLabel>Purpose</InputLabel>
              <Select
                value={formData.purpose}
                label="Purpose"
                onChange={(e) => handleChange("purpose", e.target.value)}
              >
                <MenuItem value="SERVICE_BOOKING">Service Booking</MenuItem>
                <MenuItem value="INSURANCE_CLAIM">Insurance Claim</MenuItem>
                <MenuItem value="MAINTENANCE_SCHEDULE">
                  Maintenance Schedule
                </MenuItem>
                <MenuItem value="REPAIR_REQUEST">Repair Request</MenuItem>
                <MenuItem value="INSPECTION">Inspection</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.priority}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                label="Priority"
                onChange={(e) => handleChange("priority", e.target.value)}
              >
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="URGENT">Urgent</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.status}>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Scheduled Date"
              value={formData.scheduledDate}
              onChange={(e) => handleChange("scheduledDate", e.target.value)}
              InputLabelProps={{ shrink: true }}
              error={!!errors.scheduledDate}
              helperText={errors.scheduledDate}
            />
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{ mb: 2, mt: 2, color: "primary.main" }}
            >
              Contact Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.contactInfo.phone}
              onChange={(e) =>
                handleChange("phone", e.target.value, "contactInfo")
              }
              error={!!errors.phone}
              helperText={errors.phone || "Format: +94771234567"}
              placeholder="+94771234567"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.contactInfo.email}
              onChange={(e) =>
                handleChange("email", e.target.value, "contactInfo")
              }
              error={!!errors.email}
              helperText={errors.email}
              placeholder="user@example.com"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Preferred Contact Method</InputLabel>
              <Select
                value={formData.contactInfo.preferredContactMethod}
                label="Preferred Contact Method"
                onChange={(e) =>
                  handleChange(
                    "preferredContactMethod",
                    e.target.value,
                    "contactInfo"
                  )
                }
              >
                <MenuItem value="PHONE">Phone</MenuItem>
                <MenuItem value="EMAIL">Email</MenuItem>
                <MenuItem value="SMS">SMS</MenuItem>
                <MenuItem value="WHATSAPP">WhatsApp</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Location Information */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{ mb: 2, mt: 2, color: "primary.main" }}
            >
              Location Information
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              value={formData.location.address}
              onChange={(e) =>
                handleChange("address", e.target.value, "location")
              }
              multiline
              rows={2}
              placeholder="Enter the service location address"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              value={formData.location.city}
              onChange={(e) => handleChange("city", e.target.value, "location")}
              placeholder="e.g., Colombo"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="District"
              value={formData.location.district}
              onChange={(e) =>
                handleChange("district", e.target.value, "location")
              }
              placeholder="e.g., Colombo"
            />
          </Grid>

          {/* Service Details */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{ mb: 2, mt: 2, color: "primary.main" }}
            >
              Service Details
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Service Type</InputLabel>
              <Select
                value={formData.serviceDetails.serviceType}
                label="Service Type"
                onChange={(e) =>
                  handleChange("serviceType", e.target.value, "serviceDetails")
                }
              >
                <MenuItem value="OIL_CHANGE">Oil Change</MenuItem>
                <MenuItem value="BRAKE_SERVICE">Brake Service</MenuItem>
                <MenuItem value="ENGINE_REPAIR">Engine Repair</MenuItem>
                <MenuItem value="TRANSMISSION_SERVICE">
                  Transmission Service
                </MenuItem>
                <MenuItem value="ELECTRICAL_REPAIR">Electrical Repair</MenuItem>
                <MenuItem value="BODY_WORK">Body Work</MenuItem>
                <MenuItem value="TIRE_SERVICE">Tire Service</MenuItem>
                <MenuItem value="AC_SERVICE">AC Service</MenuItem>
                <MenuItem value="GENERAL_MAINTENANCE">
                  General Maintenance
                </MenuItem>
                <MenuItem value="INSPECTION">Inspection</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Urgency</InputLabel>
              <Select
                value={formData.serviceDetails.urgency}
                label="Urgency"
                onChange={(e) =>
                  handleChange("urgency", e.target.value, "serviceDetails")
                }
              >
                <MenuItem value={false}>Normal</MenuItem>
                <MenuItem value={true}>Urgent</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Estimated Duration"
              value={formData.serviceDetails.estimatedDuration}
              onChange={(e) =>
                handleChange(
                  "estimatedDuration",
                  e.target.value,
                  "serviceDetails"
                )
              }
              placeholder="e.g., 2-3 hours, 1 day"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Estimated Cost (LKR)"
              type="number"
              value={formData.serviceDetails.estimatedCost}
              onChange={(e) =>
                handleChange(
                  "estimatedCost",
                  parseFloat(e.target.value) || 0,
                  "serviceDetails"
                )
              }
              error={!!errors.estimatedCost}
              helperText={errors.estimatedCost}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>

          {/* Notes */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{ mb: 2, mt: 2, color: "primary.main" }}
            >
              Additional Notes
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              multiline
              rows={4}
              error={!!errors.notes}
              helperText={
                errors.notes || `${formData.notes.length}/500 characters`
              }
              placeholder="Add any additional notes about this service request..."
            />
          </Grid>

          {/* Validation Errors */}
          {Object.keys(errors).length > 0 && (
            <Grid item xs={12}>
              <Alert severity="error" icon={<WarningIcon />}>
                <Typography variant="body2">
                  Please fix the following errors:
                </Typography>
                <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                  {Object.values(errors)
                    .filter(Boolean)
                    .map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                </ul>
              </Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={onClose} disabled={submitting} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
          sx={{ minWidth: 120 }}
        >
          {submitting ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditVehicleDialog;
