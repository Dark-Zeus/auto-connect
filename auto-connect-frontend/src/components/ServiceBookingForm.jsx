import React, { useState, useEffect, useContext } from "react";
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
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  Divider,
} from "@mui/material";
import {
  Build as BuildIcon,
  Notes as NotesIcon,
  Check as CheckIcon,
  LocationOn,
  Phone,
  Email,
  Star,
  AccessTime,
  DirectionsCar,
  Person,
} from "@mui/icons-material";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { bookingApi } from "../services/bookingApi";
import { vehicleApi } from "../services/vehicleApi";
import { toast } from "react-toastify";

const timeSlots = ["09:00-11:00", "11:00-13:00", "13:00-15:00", "15:00-17:00"];

const ServiceBookingForm = ({ center: propCenter, booking: propBooking }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userContext } = useContext(UserContext);

  // ✅ Use props if passed, else fallback to location.state
  const center = propCenter || location.state?.center;
  const booking = propBooking || location.state?.booking;

  // Redirect if no center info or user not logged in as vehicle owner
  if (!center) {
    navigate("/service-booking");
    return null;
  }

  if (!userContext || userContext.role !== "vehicle_owner") {
    toast.error("Only vehicle owners can book appointments");
    navigate("/login");
    return null;
  }

  const serviceOptions = center.services || [];

  const [formData, setFormData] = useState({
    // Services
    services: booking?.services || [],

    // Booking details
    preferredDate: booking?.date || "",
    preferredTimeSlot: booking?.time || "",

    // Vehicle information
    vehicle: {
      registrationNumber: booking?.vehicle?.registrationNumber || "",
      make: booking?.vehicle?.make || "",
      model: booking?.vehicle?.model || "",
      year: booking?.vehicle?.year || new Date().getFullYear(),
    },

    // Contact information
    contactInfo: {
      phone: userContext?.phone || "",
      email: userContext?.email || "",
      alternatePhone: "",
    },

    // Additional details
    specialRequests: booking?.additionalNotes || "",
    estimatedCost: 0,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize available slots with service center's operating hours or default time slots
  const getInitialTimeSlots = () => {
    // Try to get operating hours from service center data
    const operatingHours =
      center.operatingHours || center.businessInfo?.operatingHours;
    if (
      operatingHours &&
      Array.isArray(operatingHours) &&
      operatingHours.length > 0
    ) {
      // Convert operating hours to time slots if needed
      return timeSlots; // For now, use default but log the operating hours
    }
    return timeSlots;
  };

  const [availableSlots, setAvailableSlots] = useState(getInitialTimeSlots());
  const [userVehicles, setUserVehicles] = useState([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");

  // Add a debug effect to watch userVehicles state changes
  useEffect(() => {
    console.log("🔄 userVehicles state changed:", userVehicles);
    console.log("📊 userVehicles.length:", userVehicles.length);
    if (userVehicles.length > 0) {
      console.log("🚗 First vehicle:", userVehicles[0]);
    }
  }, [userVehicles]);

  // Add a debug effect to watch availableSlots state changes
  useEffect(() => {
    console.log("🕒 availableSlots state changed:", availableSlots);
    console.log("📊 availableSlots.length:", availableSlots.length);
  }, [availableSlots]);

  // Fetch user vehicles on component mount
  useEffect(() => {
    fetchUserVehicles();
    // Also log service center details for debugging
    console.log("🏢 Service center details:", center);
    console.log(
      "🕐 Service center operating hours:",
      center.operatingHours || center.businessInfo?.operatingHours
    );
  }, []);

  // Fetch available time slots when date changes
  useEffect(() => {
    if (formData.preferredDate && center.id) {
      fetchAvailableSlots();
    }
  }, [formData.preferredDate, center.id]);

  const fetchUserVehicles = async () => {
    console.log("🔍 Starting fetchUserVehicles...");
    console.log("User context:", userContext);

    setIsLoadingVehicles(true);
    try {
      const response = await vehicleApi.getUserVehiclesForBooking();
      console.log("📋 Vehicle API response:", response);

      if (response.success) {
        const vehicles = response.data.vehicles || [];
        setUserVehicles(vehicles);
        console.log("✅ User vehicles loaded:", vehicles);
        console.log("📝 Vehicle structure check:");
        vehicles.forEach((vehicle, index) => {
          console.log(`Vehicle ${index}:`, {
            id: vehicle.id,
            value: vehicle.value,
            label: vehicle.label,
            hasDetails: !!vehicle.details,
          });
        });

        if (vehicles.length === 0) {
          console.log("⚠️ No vehicles found for user");
        } else {
          console.log(`✅ Found ${vehicles.length} vehicles for dropdown`);
        }
      }
    } catch (error) {
      console.error("❌ Error fetching user vehicles:", error);
      toast.error("Failed to load your vehicles");
    } finally {
      setIsLoadingVehicles(false);
      console.log("🏁 fetchUserVehicles completed");
    }
  };

  const fetchAvailableSlots = async () => {
    console.log("🕒 Fetching available time slots...");
    console.log("📅 Selected date:", formData.preferredDate);
    console.log("🏢 Service center ID:", center.id);

    try {
      const response = await bookingApi.getAvailableTimeSlots(
        center.id,
        formData.preferredDate
      );

      console.log("📋 Available slots response:", response);

      if (response.success) {
        const slots = response.data.availableSlots || timeSlots;
        setAvailableSlots(slots);
        console.log("✅ Available slots updated:", slots);
      } else {
        console.log("⚠️ No success in response, using fallback slots");
        setAvailableSlots(timeSlots);
      }
    } catch (error) {
      console.error("❌ Error fetching available slots:", error);
      console.log("🔄 Using fallback time slots:", timeSlots);
      setAvailableSlots(timeSlots); // Fallback to all slots
    }
  };

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

  const handleVehicleSelection = (e) => {
    const vehicleId = e.target.value;
    console.log("🚗 Vehicle selected:", vehicleId);
    setSelectedVehicleId(vehicleId);

    if (vehicleId) {
      const selectedVehicle = userVehicles.find((v) => v.id === vehicleId);
      console.log("📋 Selected vehicle details:", selectedVehicle);

      if (selectedVehicle) {
        setFormData((prev) => ({
          ...prev,
          vehicle: {
            registrationNumber: selectedVehicle.details.registrationNumber,
            make: selectedVehicle.details.make,
            model: selectedVehicle.details.model,
            year: selectedVehicle.details.year,
          },
        }));

        console.log("✅ Form data updated with vehicle details");

        // Clear vehicle-related errors
        setErrors((prev) => ({
          ...prev,
          "vehicle.registrationNumber": "",
          "vehicle.make": "",
          "vehicle.model": "",
          "vehicle.year": "",
        }));
      }
    } else {
      // Reset vehicle form data if no vehicle selected
      console.log("🔄 Resetting vehicle form data");
      setFormData((prev) => ({
        ...prev,
        vehicle: {
          registrationNumber: "",
          make: "",
          model: "",
          year: new Date().getFullYear(),
        },
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested objects
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Service validation
    if (formData.services.length === 0) {
      newErrors.services = "Please select at least one service";
    }

    // Date validation
    if (!formData.preferredDate) {
      newErrors.preferredDate = "Please select a preferred date";
    } else {
      const selectedDate = new Date(formData.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.preferredDate = "Date cannot be in the past";
      }
    }

    // Time slot validation
    if (!formData.preferredTimeSlot) {
      newErrors.preferredTimeSlot = "Please select a preferred time slot";
    }

    // Vehicle validation
    if (!formData.vehicle.registrationNumber.trim()) {
      newErrors["vehicle.registrationNumber"] =
        "Vehicle registration number is required";
    }
    if (!formData.vehicle.make.trim()) {
      newErrors["vehicle.make"] = "Vehicle make is required";
    }
    if (!formData.vehicle.model.trim()) {
      newErrors["vehicle.model"] = "Vehicle model is required";
    }
    if (
      !formData.vehicle.year ||
      formData.vehicle.year < 1900 ||
      formData.vehicle.year > new Date().getFullYear() + 1
    ) {
      newErrors["vehicle.year"] = "Please enter a valid year";
    }

    // Contact validation
    if (!formData.contactInfo.phone.trim()) {
      newErrors["contactInfo.phone"] = "Phone number is required";
    }
    if (!formData.contactInfo.email.trim()) {
      newErrors["contactInfo.email"] = "Email is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare booking data for API
      const bookingData = {
        serviceCenterId: center.id,
        vehicle: formData.vehicle,
        services: formData.services,
        preferredDate: formData.preferredDate,
        preferredTimeSlot: formData.preferredTimeSlot,
        contactInfo: formData.contactInfo,
        specialRequests: formData.specialRequests,
      };

      console.log("Submitting booking data:", bookingData);

      const response = await bookingApi.createBooking(bookingData);

      if (response.success) {
        // Navigate to confirmation page with booking details
        navigate("/booking-confirmation", {
          state: {
            booking: response.data.booking,
            serviceCenter: center,
          },
        });
      }
    } catch (error) {
      console.error("Booking submission failed:", error);
      // Error already handled by bookingApi with toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "1rem auto", p: 2 }}>
      {/* Service Provider Information */}
      <Card sx={{ mb: 3, border: "2px solid #7ab2d3" }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <BuildIcon sx={{ color: "#4a628a", fontSize: 32, mr: 2 }} />
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "#4a628a" }}
              >
                {center.name}
                {center.verified && (
                  <Chip
                    label="Verified"
                    color="success"
                    size="small"
                    sx={{ ml: 1 }}
                  />
                )}
                {center.premium && (
                  <Chip
                    label="Premium"
                    color="primary"
                    size="small"
                    sx={{ ml: 1 }}
                  />
                )}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Star sx={{ color: "#f39c12", mr: 0.5 }} />
                <Typography sx={{ fontWeight: 600, mr: 1 }}>
                  {center.rating || 0}
                </Typography>
                <Typography sx={{ color: "#666" }}>
                  ({center.reviews || 0} reviews)
                </Typography>
              </Box>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <LocationOn sx={{ color: "#7ab2d3", mr: 1 }} />
                <Typography>{center.location}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Phone sx={{ color: "#7ab2d3", mr: 1 }} />
                <Typography>{center.phone}</Typography>
              </Box>
            </Grid>
            {center.email && (
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Email sx={{ color: "#7ab2d3", mr: 1 }} />
                  <Typography>{center.email}</Typography>
                </Box>
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AccessTime sx={{ color: "#7ab2d3", mr: 1 }} />
                <Typography>
                  Since {new Date(center.joinedDate).getFullYear()}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Available Services */}
          {center.services && center.services.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Available Services:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {center.services.map((service, index) => (
                  <Chip
                    key={index}
                    label={service}
                    size="small"
                    variant="outlined"
                    sx={{ color: "#4a628a", borderColor: "#7ab2d3" }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Booking Form */}
      <Paper sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#4a628a",
            mb: 3,
            display: "flex",
            alignItems: "center",
          }}
        >
          <DirectionsCar sx={{ mr: 1 }} />
          Book Your Appointment
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Vehicle Information */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 2, color: "#4a628a" }}
            >
              Vehicle Information
            </Typography>

            {/* Vehicle Selection - Radio Buttons */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {isLoadingVehicles ? (
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CircularProgress size={20} sx={{ mr: 2 }} />
                    <Typography>Loading your vehicles...</Typography>
                  </Box>
                ) : (
                  <FormControl component="fieldset" sx={{ mb: 2 }}>
                    <FormLabel
                      component="legend"
                      sx={{ color: "#4a628a", fontWeight: 600 }}
                    >
                      Select Your Vehicle
                    </FormLabel>
                    <RadioGroup
                      value={selectedVehicleId}
                      onChange={handleVehicleSelection}
                      sx={{ mt: 1 }}
                    >
                      {userVehicles.length > 0 ? (
                        userVehicles.map((vehicle) => (
                          <FormControlLabel
                            key={vehicle.id}
                            value={vehicle.id}
                            control={<Radio />}
                            label={
                              <Box>
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {vehicle.details?.registrationNumber ||
                                    vehicle.value}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ color: "#666", ml: 1 }}
                                >
                                  {vehicle.details?.make}{" "}
                                  {vehicle.details?.model} (
                                  {vehicle.details?.year})
                                </Typography>
                              </Box>
                            }
                            sx={{
                              border: "1px solid #e0e0e0",
                              borderRadius: 1,
                              m: 0.5,
                              p: 1,
                              "&:hover": { backgroundColor: "#f5f5f5" },
                            }}
                          />
                        ))
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ color: "#666", fontStyle: "italic" }}
                        >
                          No verified vehicles found. You can enter vehicle
                          details manually below.
                        </Typography>
                      )}
                    </RadioGroup>
                  </FormControl>
                )}

                {userVehicles.length === 0 && !isLoadingVehicles && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    No verified vehicles found. Please register and verify your
                    vehicle first, or enter details manually below.
                  </Alert>
                )}
              </Grid>
            </Grid>

            {/* Vehicle Details (Auto-filled or Manual Entry) */}
            <Typography variant="body2" sx={{ mt: 2, mb: 2, color: "#666" }}>
              {selectedVehicleId
                ? "Vehicle details (auto-filled):"
                : "Or enter vehicle details manually:"}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Registration Number"
                  name="vehicle.registrationNumber"
                  value={formData.vehicle.registrationNumber}
                  onChange={handleChange}
                  error={!!errors["vehicle.registrationNumber"]}
                  helperText={errors["vehicle.registrationNumber"]}
                  placeholder="ABC-1234"
                  required
                  disabled={!!selectedVehicleId}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Vehicle Make"
                  name="vehicle.make"
                  value={formData.vehicle.make}
                  onChange={handleChange}
                  error={!!errors["vehicle.make"]}
                  helperText={errors["vehicle.make"]}
                  placeholder="Toyota, Honda, etc."
                  required
                  disabled={!!selectedVehicleId}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Vehicle Model"
                  name="vehicle.model"
                  value={formData.vehicle.model}
                  onChange={handleChange}
                  error={!!errors["vehicle.model"]}
                  helperText={errors["vehicle.model"]}
                  placeholder="Camry, Civic, etc."
                  required
                  disabled={!!selectedVehicleId}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Year"
                  name="vehicle.year"
                  type="number"
                  value={formData.vehicle.year}
                  onChange={handleChange}
                  error={!!errors["vehicle.year"]}
                  helperText={errors["vehicle.year"]}
                  inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
                  required
                  disabled={!!selectedVehicleId}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Services Selection */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 2, color: "#4a628a" }}
            >
              Select Services
            </Typography>
            {errors.services && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.services}
              </Alert>
            )}
            <FormGroup>
              {serviceOptions.map((service) => (
                <FormControlLabel
                  key={service}
                  control={
                    <Checkbox
                      checked={formData.services.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      sx={{ color: "#7ab2d3" }}
                    />
                  }
                  label={service}
                />
              ))}
            </FormGroup>
          </Box>

          {/* Booking Details */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 2, color: "#4a628a" }}
            >
              Appointment Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Preferred Date"
                  name="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  error={!!errors.preferredDate}
                  helperText={errors.preferredDate}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: new Date().toISOString().split("T")[0] }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset" sx={{ width: "100%" }}>
                  <FormLabel
                    component="legend"
                    sx={{ color: "#4a628a", fontWeight: 600, mb: 1 }}
                  >
                    Preferred Time Slot *
                  </FormLabel>
                  <RadioGroup
                    value={formData.preferredTimeSlot}
                    onChange={handleChange}
                    name="preferredTimeSlot"
                    sx={{ mt: 1 }}
                  >
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot) => (
                        <FormControlLabel
                          key={slot}
                          value={slot}
                          control={<Radio />}
                          label={
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <AccessTime
                                sx={{ mr: 1, color: "#7ab2d3", fontSize: 18 }}
                              />
                              <Typography variant="body1">{slot}</Typography>
                            </Box>
                          }
                          sx={{
                            border: "1px solid #e0e0e0",
                            borderRadius: 1,
                            m: 0.5,
                            p: 1,
                            "&:hover": { backgroundColor: "#f5f5f5" },
                            "& .MuiFormControlLabel-label": { width: "100%" },
                          }}
                        />
                      ))
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ color: "#666", fontStyle: "italic" }}
                      >
                        {formData.preferredDate
                          ? "No available slots for selected date"
                          : "Please select a date first"}
                      </Typography>
                    )}
                  </RadioGroup>
                  {errors.preferredTimeSlot && (
                    <Typography
                      variant="caption"
                      sx={{ color: "error.main", mt: 1 }}
                    >
                      {errors.preferredTimeSlot}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {/* Contact Information */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 2, color: "#4a628a" }}
            >
              Contact Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="contactInfo.phone"
                  value={formData.contactInfo.phone}
                  onChange={handleChange}
                  error={!!errors["contactInfo.phone"]}
                  helperText={errors["contactInfo.phone"]}
                  placeholder="+94 77 123 4567"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="contactInfo.email"
                  type="email"
                  value={formData.contactInfo.email}
                  onChange={handleChange}
                  error={!!errors["contactInfo.email"]}
                  helperText={errors["contactInfo.email"]}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Alternate Phone (Optional)"
                  name="contactInfo.alternatePhone"
                  value={formData.contactInfo.alternatePhone}
                  onChange={handleChange}
                  placeholder="+94 11 123 4567"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Special Requests */}
          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Special Requests or Notes (Optional)"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              placeholder="Any specific requirements or additional information..."
            />
          </Box>

          {/* Submit Button */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? <CircularProgress size={20} /> : <CheckIcon />
              }
              sx={{
                minWidth: 200,
                py: 1.5,
                fontSize: 16,
                fontWeight: 600,
                background: "linear-gradient(45deg, #7ab2d3, #4a628a)",
                "&:hover": {
                  background: "linear-gradient(45deg, #4a628a, #7ab2d3)",
                },
              }}
            >
              {isSubmitting ? "Submitting..." : "Book Appointment"}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              sx={{
                minWidth: 120,
                py: 1.5,
                fontSize: 16,
                fontWeight: 600,
                color: "#4a628a",
                borderColor: "#4a628a",
                "&:hover": {
                  borderColor: "#7ab2d3",
                  backgroundColor: "rgba(122, 178, 211, 0.04)",
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ServiceBookingForm;
