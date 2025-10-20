import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  CircularProgress,
  Fade,
  LinearProgress,
  Chip,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
  ContactPage as NicIcon,
  Visibility,
  VisibilityOff,
  PersonAdd as RegisterIcon,
  Google as GoogleIcon,
  ArrowBack,
  ArrowForward,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import { UserContext } from "../contexts/UserContext";
import axios from "../utils/axios";
import "./RegisterForm.css";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { setUserContext } = useContext(UserContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    nicNumber: "",
    password: "",
    confirmPassword: "",
    // Address fields
    street: "",
    city: "",
    district: "",
    province: "",
    postalCode: "",
    // Business info (conditional)
    businessName: "",
    licenseNumber: "",
    businessRegistrationNumber: "",
    taxIdentificationNumber: "",
    servicesOffered: [],
    // Police info (conditional)
    badgeNumber: "",
    department: "",
    rank: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // User roles from your backend model
  const userRoles = [
    {
      value: "vehicle_owner",
      label: "Vehicle Owner",
      description: "Individual vehicle owner",
    },
    {
      value: "service_center",
      label: "Service Center",
      description: "Vehicle service provider",
    },
    {
      value: "repair_center",
      label: "Repair Center",
      description: "Vehicle repair specialist",
    },
    {
      value: "insurance_agent",
      label: "Insurance Agent",
      description: "Insurance service provider",
    },
    {
      value: "police",
      label: "Police Officer",
      description: "Law enforcement official",
    },
  ];

  // Sri Lankan provinces and districts (updated with correct data)
  const sriLankanProvinces = {
    "Western Province": ["Colombo", "Gampaha", "Kalutara"],
    "Central Province": ["Kandy", "Matale", "Nuwara Eliya"],
    "Southern Province": ["Galle", "Matara", "Hambantota"],
    "Northern Province": [
      "Jaffna",
      "Kilinochchi",
      "Mannar",
      "Mullaitivu",
      "Vavuniya",
    ],
    "Eastern Province": ["Trincomalee", "Batticaloa", "Ampara"],
    "North Western Province": ["Kurunegala", "Puttalam"],
    "North Central Province": ["Anuradhapura", "Polonnaruwa"],
    "Uva Province": ["Badulla", "Moneragala"],
    "Sabaragamuwa Province": ["Ratnapura", "Kegalle"],
  };

  const provinces = Object.keys(sriLankanProvinces);
  const districts = formData.province
    ? sriLankanProvinces[formData.province] || []
    : [];

  // Form steps
  const steps = ["Basic Info", "Address", "Role Specific", "Security"];

  // Check if role requires business info
  const requiresBusinessInfo = [
    "service_center",
    "repair_center",
    "insurance_agent",
  ].includes(formData.role);
  const requiresPoliceInfo = formData.role === "police";
  const requiresNic = formData.role === "vehicle_owner";

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let processedValue = value;

    // Format NIC number (convert to uppercase for old format)
    if (name === "nicNumber") {
      processedValue = value.toUpperCase().trim();
    }

    // If province changes, clear the district
    if (name === "province") {
      setFormData((prev) => ({
        ...prev,
        [name]: processedValue,
        district: "", // Clear district when province changes
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: processedValue,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Password strength calculation
  useEffect(() => {
    const calculatePasswordStrength = (password) => {
      let strength = 0;
      if (password.length >= 8) strength += 25;
      if (/[a-z]/.test(password)) strength += 15;
      if (/[A-Z]/.test(password)) strength += 15;
      if (/[0-9]/.test(password)) strength += 15;
      if (/[^A-Za-z0-9]/.test(password)) strength += 30;
      return Math.min(strength, 100);
    };

    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return "#e74c3c";
    if (passwordStrength < 60) return "#f39c12";
    if (passwordStrength < 80) return "#f1c40f";
    return "#27ae60";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return "Weak";
    if (passwordStrength < 60) return "Fair";
    if (passwordStrength < 80) return "Good";
    return "Strong";
  };

  const validateForm = () => {
    const newErrors = {};

    // Step 0: Basic Info
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const phoneRegex = /^[0-9+\-\s()]+$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }

    if (!formData.role) {
      newErrors.role = "Please select a user role";
    }

    // NIC validation - only for vehicle owners
    if (formData.role === "vehicle_owner") {
      if (!formData.nicNumber.trim()) {
        newErrors.nicNumber = "NIC number is required for vehicle owners";
      } else {
        // Sri Lankan NIC validation
        const oldNicPattern = /^[0-9]{9}[vVxX]$/;
        const newNicPattern = /^[0-9]{12}$/;
        const nicValue = formData.nicNumber.trim().toUpperCase();

        if (!oldNicPattern.test(nicValue) && !newNicPattern.test(nicValue)) {
          newErrors.nicNumber =
            "Please enter a valid NIC number (9 digits + V/X or 12 digits)";
        }
      }
    }

    // Step 1: Address
    if (!formData.street.trim()) {
      newErrors.street = "Street address is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.district.trim()) {
      newErrors.district = "District is required";
    }
    if (!formData.province.trim()) {
      newErrors.province = "Province is required";
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    }

    // Step 2: Role-specific validation
    if (requiresBusinessInfo) {
      if (!formData.businessName.trim()) {
        newErrors.businessName = "Business name is required";
      }
      if (!formData.licenseNumber.trim()) {
        newErrors.licenseNumber = "License number is required";
      }
      if (!formData.businessRegistrationNumber.trim()) {
        newErrors.businessRegistrationNumber =
          "Business registration number is required";
      }
      if (!formData.taxIdentificationNumber.trim()) {
        newErrors.taxIdentificationNumber =
          "Tax identification number is required";
      }
    }

    if (requiresPoliceInfo) {
      if (!formData.badgeNumber.trim()) {
        newErrors.badgeNumber = "Badge number is required";
      }
      if (!formData.department.trim()) {
        newErrors.department = "Department is required";
      }
      if (!formData.rank.trim()) {
        newErrors.rank = "Rank is required";
      }
    }

    // Step 3: Security
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (passwordStrength < 60) {
      newErrors.password =
        "Password is too weak. Please choose a stronger password";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!acceptTerms) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    // Validate current step before proceeding
    const stepValidations = {
      0:
        formData.role === "vehicle_owner"
          ? ["firstName", "lastName", "email", "phone", "role", "nicNumber"]
          : ["firstName", "lastName", "email", "phone", "role"],
      1: ["street", "city", "district", "province", "postalCode"],
      2: requiresBusinessInfo
        ? [
            "businessName",
            "licenseNumber",
            "businessRegistrationNumber",
            "taxIdentificationNumber",
          ]
        : requiresPoliceInfo
        ? ["badgeNumber", "department", "rank"]
        : [],
      3: ["password", "confirmPassword"],
    };

    const fieldsToValidate = stepValidations[currentStep] || [];
    const stepErrors = {};

    fieldsToValidate.forEach((field) => {
      if (!formData[field] || !formData[field].toString().trim()) {
        stepErrors[field] = `This field is required`;
      }
    });

    // Additional validations for current step
    if (currentStep === 0) {
      if (
        formData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        stepErrors.email = "Please enter a valid email address";
      }
      if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
        stepErrors.phone = "Please enter a valid phone number";
      }

      // NIC validation for vehicle owners
      if (formData.role === "vehicle_owner" && formData.nicNumber) {
        const oldNicPattern = /^[0-9]{9}[vVxX]$/;
        const newNicPattern = /^[0-9]{12}$/;
        const nicValue = formData.nicNumber.trim().toUpperCase();

        if (!oldNicPattern.test(nicValue) && !newNicPattern.test(nicValue)) {
          stepErrors.nicNumber =
            "Please enter a valid NIC number (9 digits + V/X or 12 digits)";
        }
      }
    }

    if (currentStep === 3) {
      if (passwordStrength < 60) {
        stepErrors.password = "Password is too weak";
      }
      if (formData.password !== formData.confirmPassword) {
        stepErrors.confirmPassword = "Passwords do not match";
      }
      if (!acceptTerms) {
        stepErrors.terms = "You must accept the terms and conditions";
      }
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      toast.error("Please fix the errors before proceeding");
      return;
    }

    setErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const addService = () => {
    const newService = prompt("Enter service name:");
    if (newService && newService.trim()) {
      setFormData((prev) => ({
        ...prev,
        servicesOffered: [...prev.servicesOffered, newService.trim()],
      }));
    }
  };

  const removeService = (index) => {
    setFormData((prev) => ({
      ...prev,
      servicesOffered: prev.servicesOffered.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare registration data according to your backend model
      const registerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        password: formData.password,
        passwordConfirm: formData.confirmPassword, // Backend expects 'passwordConfirm'
        address: {
          street: formData.street,
          city: formData.city,
          district: formData.district,
          province: formData.province,
          postalCode: formData.postalCode,
        },
      };

      // Add NIC number only for vehicle owners
      if (formData.role === "vehicle_owner" && formData.nicNumber) {
        registerData.nicNumber = formData.nicNumber.toUpperCase();
      }

      // Add business info if required
      if (requiresBusinessInfo) {
        registerData.businessInfo = {
          businessName: formData.businessName,
          licenseNumber: formData.licenseNumber,
          businessRegistrationNumber: formData.businessRegistrationNumber,
          taxIdentificationNumber: formData.taxIdentificationNumber,
        };

        // Add services for service/repair centers (only if they exist)
        if (
          ["service_center", "repair_center"].includes(formData.role) &&
          formData.servicesOffered.length > 0
        ) {
          registerData.businessInfo.servicesOffered = formData.servicesOffered;
        }
      }

      // Add police info if required
      if (requiresPoliceInfo) {
        registerData.businessInfo = {
          badgeNumber: formData.badgeNumber,
          department: formData.department,
          rank: formData.rank,
        };
      }

      // Debug log (remove in production)
      console.log("🚀 Sending registration data:", {
        ...registerData,
        password: "***", // Hide password in logs
        passwordConfirm: "***",
      });

      const response = await axios.post("/auth/register", registerData);

      console.log("✅ Registration response:", response.data);

      if (response.data?.success === true) {
        const message = response.data?.message || "Registration successful!";
        toast.success(message);

        // Handle different response scenarios
        if (
          response.data?.requiresVerification ||
          (response.data?.data?.user && !response.data?.data?.token)
        ) {
          // User needs email verification
          navigate("/auth/verify", {
            state: {
              email: formData.email,
              message: response.data.message,
              userId: response.data.data?.user?.id,
            },
          });
        } else if (
          response.data?.data?.token ||
          response.data?.data?.accessToken
        ) {
          // User was auto-verified and logged in (like system admin)
          const token =
            response.data.data.token || response.data.data.accessToken;
          const user = response.data.data.user;

          localStorage.setItem("token", token);
          if (user) {
            setUserContext(user);
            localStorage.setItem("user", JSON.stringify(user));
          }

          toast.success("Welcome to AutoConnect!");
          navigate("/dashboard", {
            state: {
              message: "Registration successful! Welcome to AutoConnect.",
            },
          });
        } else if (response.data?.data?.user) {
          // User exists but no token - likely needs verification
          navigate("/auth/verify", {
            state: {
              email: formData.email,
              message:
                response.data.message ||
                "Please verify your email to continue.",
              userId: response.data.data.user.id,
            },
          });
        } else {
          // Fallback - redirect to login
          toast.info("Registration successful! Please log in to continue.");
          navigate("/auth/login", {
            state: {
              email: formData.email,
              message: "Registration successful! Please log in.",
            },
          });
        }
      } else {
        // Handle API success: false
        toast.error(response.data?.message || "Registration failed");
      }
    } catch (error) {
      console.error("❌ Registration error:", error);

      let errorMessage = "Registration failed. Please try again.";

      if (error.response?.data) {
        // Handle validation errors from backend
        if (
          error.response.data.errors &&
          Array.isArray(error.response.data.errors)
        ) {
          const errorMessages = error.response.data.errors.map(
            (err) => err.message
          );
          errorMessage = errorMessages.join(", ");

          // Set field-specific errors if available
          const fieldErrors = {};
          error.response.data.errors.forEach((err) => {
            if (err.field) {
              // Map backend field names to frontend field names if needed
              let fieldName = err.field;
              if (fieldName.includes(".")) {
                // Handle nested field names like 'address.street'
                const parts = fieldName.split(".");
                if (parts[0] === "address") {
                  fieldName = parts[1]; // street, city, etc.
                } else if (parts[0] === "businessInfo") {
                  fieldName = parts[1]; // businessName, licenseNumber, etc.
                }
              }
              fieldErrors[fieldName] = err.message;
            }
          });

          if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            toast.error("Please check the highlighted fields");
          } else {
            toast.error(errorMessage);
          }
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
          toast.error(errorMessage);
        }
      } else if (error.request) {
        // Network error
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error(errorMessage);
      }

      // If there are field errors, stay on the form
      // Otherwise, you might want to log additional details
      console.error("Full error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    const googleAuthUrl = `${
      import.meta.env.VITE_REACT_APP_BACKEND_API_URL
    }/auth/oauth/google`;
    window.open(googleAuthUrl, "_blank", "width=500,height=600");

    const handleMessage = (event) => {
      if (event.origin !== import.meta.env.VITE_REACT_APP_BACKEND_API_URL)
        return;

      try {
        const data = JSON.parse(event.data);
        if (data.accessToken) {
          localStorage.setItem("token", data.accessToken);
          setUserContext(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));

          toast.success("Google registration successful!");
          navigate("/dashboard");
        }
      } catch (error) {
        toast.error("Google authentication failed");
      }

      window.removeEventListener("message", handleMessage);
    };

    window.addEventListener("message", handleMessage);
  };

  const PasswordRequirement = ({ met, text }) => (
    <Box className="password-requirement">
      {met ? (
        <CheckIcon className="requirement-icon success" />
      ) : (
        <CloseIcon className="requirement-icon error" />
      )}
      <Typography
        variant="caption"
        className={`requirement-text ${met ? "success" : "error"}`}
      >
        {text}
      </Typography>
    </Box>
  );

  const passwordRequirements = [
    { met: formData.password.length >= 8, text: "At least 8 characters" },
    { met: /[a-z]/.test(formData.password), text: "One lowercase letter" },
    { met: /[A-Z]/.test(formData.password), text: "One uppercase letter" },
    { met: /[0-9]/.test(formData.password), text: "One number" },
    {
      met: /[^A-Za-z0-9]/.test(formData.password),
      text: "One special character",
    },
  ];

  // Step content components
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Box className="step-content">
            <Typography variant="h6" className="step-title">
              Basic Information
            </Typography>

            <Box className="name-fields">
              <TextField
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon className="input-icon" />
                    </InputAdornment>
                  ),
                }}
                className="form-input name-input"
                variant="outlined"
                placeholder="Enter your first name"
              /><br/>

              <TextField
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon className="input-icon" />
                    </InputAdornment>
                  ),
                }}
                className="form-input name-input"
                variant="outlined"
                placeholder="Enter your last name"
              />
            </Box><br/>

            <TextField
              fullWidth
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon className="input-icon" />
                  </InputAdornment>
                ),
              }}
              className="form-input"
              variant="outlined"
              placeholder="Enter your email address"
            /><br/>

            <TextField
              fullWidth
              name="phone"
              label="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              error={!!errors.phone}
              helperText={errors.phone}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon className="input-icon" />
                  </InputAdornment>
                ),
              }}
              className="form-input"
              variant="outlined"
              placeholder="Enter your phone number"
            /><br/>

            <TextField
              fullWidth
              select
              name="role"
              label="User Role"
              value={formData.role}
              onChange={handleInputChange}
              error={!!errors.role}
              helperText={errors.role || "Select your role in the system"}
              className="form-input"
              variant="outlined"
            >
              {userRoles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  <Box>
                    <Typography variant="body1">{role.label}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {role.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField><br/>

            {/* NIC Field - Only for Vehicle Owners */}
            {requiresNic && (
              <Fade in={requiresNic} timeout={300}>
                <TextField
                  fullWidth
                  name="nicNumber"
                  label="NIC Number"
                  value={formData.nicNumber}
                  onChange={handleInputChange}
                  error={!!errors.nicNumber}
                  helperText={
                    errors.nicNumber ||
                    "Enter your National Identity Card number"
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <NicIcon className="input-icon" />
                      </InputAdornment>
                    ),
                  }}
                  className="form-input"
                  variant="outlined"
                  placeholder="e.g., 123456789V or 199901234567"
                />
              </Fade>
            )}
          </Box>
        );

      case 1:
        return (
          <Box className="step-content">
            <Typography variant="h6" className="step-title">
              Address Information
            </Typography>

            <TextField
              fullWidth
              name="street"
              label="Street Address"
              value={formData.street}
              onChange={handleInputChange}
              error={!!errors.street}
              helperText={errors.street}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon className="input-icon" />
                  </InputAdornment>
                ),
              }}
              className="form-input"
              variant="outlined"
              placeholder="Enter your street address"
            />

            <Box className="address-row">
              <TextField
                name="city"
                label="City"
                value={formData.city}
                onChange={handleInputChange}
                error={!!errors.city}
                helperText={errors.city}
                className="form-input address-input"
                variant="outlined"
                placeholder="Enter your city"
              />

              <TextField
                select
                name="province"
                label="Province"
                value={formData.province}
                onChange={handleInputChange}
                error={!!errors.province}
                helperText={errors.province || "Select your province"}
                className="form-input address-input"
                variant="outlined"
              >
                <MenuItem value="">
                  <em>Select Province</em>
                </MenuItem>
                {provinces.map((province) => (
                  <MenuItem key={province} value={province}>
                    {province}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box className="address-row">
              <TextField
                select
                name="district"
                label="District"
                value={formData.district}
                onChange={handleInputChange}
                error={!!errors.district}
                helperText={errors.district || "Select your district"}
                className="form-input address-input"
                variant="outlined"
                disabled={!formData.province}
              >
                <MenuItem value="">
                  <em>Select District</em>
                </MenuItem>
                {districts.map((district) => (
                  <MenuItem key={district} value={district}>
                    {district}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                name="postalCode"
                label="Postal Code"
                value={formData.postalCode}
                onChange={handleInputChange}
                error={!!errors.postalCode}
                helperText={errors.postalCode}
                className="form-input address-input"
                variant="outlined"
                placeholder="Enter postal code"
              />
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box className="step-content">
            <Typography variant="h6" className="step-title">
              {requiresBusinessInfo
                ? "Business Information"
                : requiresPoliceInfo
                ? "Police Information"
                : "Additional Information"}
            </Typography>

            {requiresBusinessInfo && (
              <>
                <TextField
                  fullWidth
                  name="businessName"
                  label="Business Name"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  error={!!errors.businessName}
                  helperText={errors.businessName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon className="input-icon" />
                      </InputAdornment>
                    ),
                  }}
                  className="form-input"
                  variant="outlined"
                  placeholder="Enter your business name"
                />

                <TextField
                  fullWidth
                  name="licenseNumber"
                  label="License Number"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  error={!!errors.licenseNumber}
                  helperText={errors.licenseNumber}
                  className="form-input"
                  variant="outlined"
                  placeholder="Enter your license number"
                />

                <Box className="business-row">
                  <TextField
                    name="businessRegistrationNumber"
                    label="Business Registration Number"
                    value={formData.businessRegistrationNumber}
                    onChange={handleInputChange}
                    error={!!errors.businessRegistrationNumber}
                    helperText={errors.businessRegistrationNumber}
                    className="form-input business-input"
                    variant="outlined"
                    placeholder="Registration number"
                  />

                  <TextField
                    name="taxIdentificationNumber"
                    label="Tax ID Number"
                    value={formData.taxIdentificationNumber}
                    onChange={handleInputChange}
                    error={!!errors.taxIdentificationNumber}
                    helperText={errors.taxIdentificationNumber}
                    className="form-input business-input"
                    variant="outlined"
                    placeholder="Tax ID number"
                  />
                </Box>

                {["service_center", "repair_center"].includes(
                  formData.role
                ) && (
                  <Box className="services-section">
                    <Typography variant="subtitle1" className="services-title">
                      Services Offered
                    </Typography>
                    <Box className="services-list">
                      {formData.servicesOffered.map((service, index) => (
                        <Chip
                          key={index}
                          label={service}
                          onDelete={() => removeService(index)}
                          className="service-chip"
                        />
                      ))}
                    </Box>
                    <Button
                      variant="outlined"
                      onClick={addService}
                      className="add-service-btn"
                    >
                      Add Service
                    </Button>
                  </Box>
                )}
              </>
            )}

            {requiresPoliceInfo && (
              <>
                <TextField
                  fullWidth
                  name="badgeNumber"
                  label="Badge Number"
                  value={formData.badgeNumber}
                  onChange={handleInputChange}
                  error={!!errors.badgeNumber}
                  helperText={errors.badgeNumber}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon className="input-icon" />
                      </InputAdornment>
                    ),
                  }}
                  className="form-input"
                  variant="outlined"
                  placeholder="Enter your badge number"
                />

                <TextField
                  fullWidth
                  name="department"
                  label="Department"
                  value={formData.department}
                  onChange={handleInputChange}
                  error={!!errors.department}
                  helperText={errors.department}
                  className="form-input"
                  variant="outlined"
                  placeholder="Enter your department"
                />

                <TextField
                  fullWidth
                  name="rank"
                  label="Rank"
                  value={formData.rank}
                  onChange={handleInputChange}
                  error={!!errors.rank}
                  helperText={errors.rank}
                  className="form-input"
                  variant="outlined"
                  placeholder="Enter your rank"
                />
              </>
            )}

            {!requiresBusinessInfo && !requiresPoliceInfo && (
              <Box className="no-additional-info">
                <Typography variant="body1" color="textSecondary">
                  No additional information required for this role.
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 3:
        return (
          <Box className="step-content">
            <Typography variant="h6" className="step-title">
              Security & Confirmation
            </Typography>

            <TextField
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon className="input-icon" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      className="visibility-icon"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              className="form-input"
              variant="outlined"
              placeholder="Create a strong password"
            />

            {formData.password && (
              <Box className="password-strength-container">
                <Box className="password-strength-header">
                  <Typography variant="caption" className="strength-label">
                    Password Strength:
                  </Typography>
                  <Chip
                    label={getPasswordStrengthText()}
                    size="small"
                    className="strength-chip"
                    style={{
                      backgroundColor: getPasswordStrengthColor(),
                      color: "white",
                    }}
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength}
                  className="strength-bar"
                  sx={{
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: getPasswordStrengthColor(),
                    },
                  }}
                />
                <Box className="password-requirements">
                  {passwordRequirements.map((req, index) => (
                    <PasswordRequirement
                      key={index}
                      met={req.met}
                      text={req.text}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <TextField
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon className="input-icon" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                      className="visibility-icon"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              className="form-input"
              variant="outlined"
              placeholder="Confirm your password"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="terms-checkbox"
                />
              }
              label={
                <Typography variant="body2" className="terms-text">
                  I accept the{" "}
                  <Link to="/terms" className="terms-link">
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="terms-link">
                    Privacy Policy
                  </Link>
                </Typography>
              }
              className="terms-control"
            />
            {errors.terms && (
              <Typography variant="caption" className="error-text">
                {errors.terms}
              </Typography>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <div className="register-form-container">
      <Fade in={true} timeout={800}>
        <Paper className="register-form-paper" elevation={0}>
          <Box className="register-form-header">
            <Typography variant="h4" className="form-title">
              Create Account
            </Typography>
            <Typography variant="body1" className="form-subtitle">
              Join us today and start your journey
            </Typography>
          </Box>

          {/* Stepper */}
          <Stepper
            activeStep={currentStep}
            className="form-stepper"
            alternativeLabel
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box
            component="form"
            onSubmit={handleSubmit}
            className="register-form"
          >
            {/* Step Content */}
            {renderStepContent()}

            {/* Navigation Buttons */}
            <Box className="step-navigation">
              {currentStep > 0 && (
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  startIcon={<ArrowBack />}
                  className="nav-button back-button"
                >
                  Back
                </Button>
              )}

              <Box className="nav-spacer" />

              {currentStep < steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowForward />}
                  className="nav-button next-button"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  className="register-button"
                  disabled={isLoading}
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <RegisterIcon />
                    )
                  }
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              )}
            </Box>

            {/* Google Auth - only show on first step */}
            {currentStep === 0 && (
              <>
                <Divider className="divider">
                  <Typography variant="body2" className="divider-text">
                    or continue with
                  </Typography>
                </Divider>

                <Button
                  fullWidth
                  variant="outlined"
                  className="google-button"
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                >
                  Continue with Google
                </Button>
              </>
            )}
          </Box>

          <Box className="form-footer">
            <Typography variant="body2" className="footer-text">
              Already have an account?{" "}
              <Link to="/auth/login" className="login-link">
                <ArrowBack className="arrow-icon" />
                Sign in here
              </Link>
            </Typography>
          </Box>

          <Box className="form-bottom-links">
            <Link to="/terms" className="bottom-link">
              Terms & Conditions
            </Link>
            <Link to="/help" className="bottom-link">
              Help Center
            </Link>
          </Box>
        </Paper>
      </Fade>
    </div>
  );
};

export default RegisterForm;
