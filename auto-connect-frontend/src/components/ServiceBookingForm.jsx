import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  CircularProgress,
  FormGroup,
  FormControlLabel,
  Checkbox,
  MenuItem,
} from "@mui/material";
import {
  Build as BuildIcon,
  Notes as NotesIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import { useLocation, useNavigate } from "react-router-dom";

const timeSlots = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

const ServiceBookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const center = location.state?.center;
  const booking = location.state?.booking;

  if (!center) {
    navigate("/service-booking");
    return null;
  }

  const serviceOptions = center.services || [];

  const [formData, setFormData] = useState({
    services: booking?.services || [],
    preferredDate: booking?.date || "",
    preferredTime: booking?.time || "",
    additionalNotes: booking?.additionalNotes || "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleServiceToggle = (service) => {
    setFormData((prev) => {
      const selected = prev.services.includes(service);
      const newServices = selected
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service];
      return { ...prev, services: newServices };
    });

    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.services.length === 0) {
      newErrors.services = "Please select at least one service";
    }
    if (!formData.preferredDate) {
      newErrors.preferredDate = "Please select a preferred date";
    }
    if (!formData.preferredTime) {
      newErrors.preferredTime = "Please select a preferred time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await new Promise((r) => setTimeout(r, 1500));

      const newBooking = {
        id: booking?.id || `BK-${Date.now()}`,
        date: formData.preferredDate,
        time: formData.preferredTime,
        centerName: center.name,
        location: center.location,
        services: formData.services,
        additionalNotes: formData.additionalNotes,
        status: booking?.status || "Pending",
      };

      navigate("/booking-confirmation", { state: { booking: newBooking } });
    } catch (error) {
      alert("Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-form-container">
      <Paper
        className="register-form-paper"
        elevation={0}
        sx={{ maxWidth: 600, margin: "2rem auto" }}
      >
        <Box sx={{ textAlign: "center", mb: 4, mt: 3 }}>
          <BuildIcon sx={{ color: "var(--primary-blue)", fontSize: 40, mb: 1 }} />
          <Typography sx={{ fontSize: 32, fontWeight: 700, color: "var(--primary-blue)" }}>
            {booking ? "Edit Booking" : "Book Service Appointment"}
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: "var(--gray-medium)" }}>
            {booking ? "Update your booking details" : "Schedule your vehicle service with ease"}
          </Typography>
        </Box>

        <Box sx={{ mb: 2, px: 3 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 700 }} color="primary">
            Provider: {center.name}
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 500 }} color="text.secondary">
            {center.location}
          </Typography>
        </Box>

        {/* Vehicle Info */}
        <Box
          sx={{
            background: "var(--primary-light)",
            borderRadius: 2,
            p: 2,
            mb: 4,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <DirectionsCarFilledRoundedIcon sx={{ color: "var(--primary-dark)", fontSize: 32 }} />
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "var(--primary-dark)" }}>
              Toyota Corolla 2020
            </Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: "var(--gray-medium)" }}>
              ABC-1234 &nbsp;•&nbsp; 45,000 km &nbsp;•&nbsp; Next service due
            </Typography>
          </Box>
        </Box>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Services */}
          <Box>
            <Typography sx={{ fontSize: 24, fontWeight: 600, mb: 1 }}>
              Select Services
            </Typography>
            <FormGroup sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {serviceOptions.map((service) => (
                <FormControlLabel
                  key={service}
                  control={
                    <Checkbox
                      checked={formData.services.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      sx={{
                        color: "var(--primary-blue)",
                        "&.Mui-checked": { color: "var(--primary-blue)" },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                      {service}
                    </Typography>
                  }
                  sx={{
                    minWidth: 160,
                    backgroundColor: "var(--primary-light)",
                    borderRadius: 2,
                    px: 2,
                    py: 0.5,
                  }}
                />
              ))}
            </FormGroup>
            {errors.services && (
              <Typography
                color="var(--error-color)"
                variant="caption"
                sx={{ mt: 0.5, fontSize: 12, fontWeight: 500 }}
              >
                {errors.services}
              </Typography>
            )}
          </Box>

          {/* Date */}
          <TextField
            label="Preferred Date"
            type="date"
            name="preferredDate"
            value={formData.preferredDate}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: new Date().toISOString().split("T")[0] }}
            error={!!errors.preferredDate}
            helperText={
              errors.preferredDate && (
                <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                  {errors.preferredDate}
                </Typography>
              )
            }
            InputProps={{
              sx: { fontSize: 16, fontWeight: 500 },
            }}
          />

          {/* Time */}
          <TextField
            select
            label="Preferred Time"
            name="preferredTime"
            value={formData.preferredTime}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.preferredTime}
            helperText={
              errors.preferredTime && (
                <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                  {errors.preferredTime}
                </Typography>
              )
            }
            InputProps={{
              sx: { fontSize: 16, fontWeight: 500 },
            }}
          >
            <MenuItem value="" sx={{ fontSize: 16, fontWeight: 500 }}>
              Select Time
            </MenuItem>
            {timeSlots.map((slot) => (
              <MenuItem key={slot} value={slot} sx={{ fontSize: 16, fontWeight: 500 }}>
                {slot}
              </MenuItem>
            ))}
          </TextField>

          {/* Notes */}
          <TextField
            label="Additional Notes"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            placeholder="Add any specific instructions or requests"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <NotesIcon />
                </InputAdornment>
              ),
              sx: { fontSize: 16, fontWeight: 500 },
            }}
            InputLabelProps={{ sx: { fontSize: 16, fontWeight: 500 } }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <CheckIcon />}
            sx={{
              mt: 2,
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {isSubmitting
              ? "Submitting..."
              : booking
              ? "Update Booking"
              : "Submit Booking"}
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default ServiceBookingForm;
