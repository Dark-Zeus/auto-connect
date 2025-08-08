// src/components/dialogs/CompletionDialog.jsx - CREATE THIS NEW COMPONENT

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
  Alert,
  Box,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Build as BuildIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  BusinessCenter as BusinessIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";

const CompletionDialog = ({
  open,
  onClose,
  selectedVehicle,
  onComplete,
  loading = false,
}) => {
  const [completionData, setCompletionData] = useState({
    notes: "",
    serviceDetails: {
      actualCost: 0,
      actualDuration: "",
      serviceCenter: "",
      warranty: "",
      qualityRating: 5,
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (field, value, section = null) => {
    if (section) {
      setCompletionData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setCompletionData((prev) => ({
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

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Validate actual cost
    if (completionData.serviceDetails.actualCost < 0) {
      newErrors.actualCost = "Actual cost cannot be negative";
    }

    // Validate notes length
    if (completionData.notes && completionData.notes.length > 500) {
      newErrors.notes = "Notes cannot exceed 500 characters";
    }

    // Validate quality rating
    if (
      completionData.serviceDetails.qualityRating < 1 ||
      completionData.serviceDetails.qualityRating > 5
    ) {
      newErrors.qualityRating = "Quality rating must be between 1 and 5";
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
      console.log("✅ Marking vehicle as completed with data:", completionData);

      await onComplete(completionData);

      // Reset form
      setCompletionData({
        notes: "",
        serviceDetails: {
          actualCost: 0,
          actualDuration: "",
          serviceCenter: "",
          warranty: "",
          qualityRating: 5,
        },
      });

      onClose();
    } catch (error) {
      console.error("Error marking vehicle as completed:", error);
      toast.error("Failed to mark vehicle as completed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!selectedVehicle) return null;

  const vehicle = selectedVehicle.vehicleId;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <CheckCircleIcon />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Mark Service as Completed
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {/* Vehicle Information Card */}
        <Card sx={{ mb: 3, backgroundColor: "grey.50" }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {vehicle?.registrationNumber || "Unknown Vehicle"}
              </Typography>
              <Chip
                label={selectedVehicle.purpose?.replace("_", " ")}
                color="primary"
                size="small"
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {vehicle
                ? `${vehicle.make} ${vehicle.model} (${vehicle.yearOfManufacture})`
                : "Vehicle details unavailable"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Priority: <strong>{selectedVehicle.priority}</strong> | Scheduled:{" "}
              <strong>
                {new Date(selectedVehicle.scheduledDate).toLocaleDateString()}
              </strong>
            </Typography>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Service Details */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "success.main",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <BuildIcon />
              Service Completion Details
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Actual Cost (LKR)"
              type="number"
              value={completionData.serviceDetails.actualCost}
              onChange={(e) =>
                handleChange(
                  "actualCost",
                  parseFloat(e.target.value) || 0,
                  "serviceDetails"
                )
              }
              error={!!errors.actualCost}
              helperText={errors.actualCost || "Enter the final service cost"}
              InputProps={{
                inputProps: { min: 0 },
                startAdornment: (
                  <MoneyIcon sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Actual Duration"
              value={completionData.serviceDetails.actualDuration}
              onChange={(e) =>
                handleChange("actualDuration", e.target.value, "serviceDetails")
              }
              placeholder="e.g., 3 hours, 2 days"
              InputProps={{
                startAdornment: (
                  <ScheduleIcon sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Service Center"
              value={completionData.serviceDetails.serviceCenter}
              onChange={(e) =>
                handleChange("serviceCenter", e.target.value, "serviceDetails")
              }
              placeholder="e.g., AutoCare Service Center"
              InputProps={{
                startAdornment: (
                  <BusinessIcon sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Warranty Period"
              value={completionData.serviceDetails.warranty}
              onChange={(e) =>
                handleChange("warranty", e.target.value, "serviceDetails")
              }
              placeholder="e.g., 6 months, 1 year"
              InputProps={{
                startAdornment: (
                  <SecurityIcon sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Service Quality Rating</InputLabel>
              <Select
                value={completionData.serviceDetails.qualityRating}
                label="Service Quality Rating"
                onChange={(e) =>
                  handleChange(
                    "qualityRating",
                    e.target.value,
                    "serviceDetails"
                  )
                }
                error={!!errors.qualityRating}
              >
                <MenuItem value={5}>⭐⭐⭐⭐⭐ Excellent (5/5)</MenuItem>
                <MenuItem value={4}>⭐⭐⭐⭐ Very Good (4/5)</MenuItem>
                <MenuItem value={3}>⭐⭐⭐ Good (3/5)</MenuItem>
                <MenuItem value={2}>⭐⭐ Fair (2/5)</MenuItem>
                <MenuItem value={1}>⭐ Poor (1/5)</MenuItem>
              </Select>
              {errors.qualityRating && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, ml: 2 }}
                >
                  {errors.qualityRating}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Completion Notes */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, color: "success.main" }}>
              Completion Notes
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Service Completion Notes"
              value={completionData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              multiline
              rows={4}
              error={!!errors.notes}
              helperText={
                errors.notes ||
                `${completionData.notes.length}/500 characters - Describe what was done, any issues found, recommendations, etc.`
              }
              placeholder="Describe the service completed, any issues found, parts replaced, recommendations for future maintenance, etc."
            />
          </Grid>

          {/* Summary */}
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Summary:</strong> This will mark the service request as
                COMPLETED and cannot be undone. The vehicle owner will be
                notified of the completion with these details.
              </Typography>
            </Alert>
          </Grid>

          {/* Validation Errors */}
          {Object.keys(errors).length > 0 && (
            <Grid item xs={12}>
              <Alert severity="error">
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
          color="success"
          disabled={submitting}
          startIcon={
            submitting ? <CircularProgress size={20} /> : <CheckCircleIcon />
          }
          sx={{ minWidth: 140 }}
        >
          {submitting ? "Completing..." : "Mark Completed"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompletionDialog;
