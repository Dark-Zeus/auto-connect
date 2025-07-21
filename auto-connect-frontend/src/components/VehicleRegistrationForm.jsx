import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  Alert,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  Fade,
  Collapse,
} from "@mui/material";
import {
  DirectionsCar as CarIcon,
  Person as PersonIcon,
  Description as DocumentIcon,
  PhotoCamera as CameraIcon,
  CheckCircle as CheckIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BackIcon,
  CloudUpload as UploadIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import "./VehicleRegistrationForm.css";

const VehicleRegistrationForm = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [formProgress, setFormProgress] = useState(0);

  const [formData, setFormData] = useState({
    // Basic Registration Details
    registrationNumber: "",
    chassisNumber: "",
    engineNumber: "",

    // Current Owner Information
    currentOwner: {
      name: "",
      address: {
        street: "",
        city: "",
        district: "",
        province: "",
        postalCode: "",
      },
      idNumber: "",
    },

    // Absolute Owner Information
    absoluteOwner: {
      name: "",
      address: {
        street: "",
        city: "",
        district: "",
        province: "",
        postalCode: "",
      },
      idNumber: "",
      relationshipToCurrentOwner: "same",
    },

    // Vehicle Specifications
    cylinderCapacity: "",
    classOfVehicle: "",
    taxationClass: "",
    statusWhenRegistered: "",
    fuelType: "",
    make: "",
    country: "JAPAN",
    model: "",
    wheelBase: "",
    yearOfManufacture: "",
    color: "",
    seatingCapacity: "",
    weight: {
      unladenWeight: "",
      grossWeight: "",
    },
    tyreSize: {
      front: "",
      rear: "",
    },
    height: "",
    transmission: "",
    mileage: 0,

    // Registration Details
    provincialCouncil: "",
    dateOfRegistration: "",

    // Insurance Details
    insuranceDetails: {
      provider: "",
      policyNumber: "",
      validFrom: "",
      validTo: "",
      coverageType: "",
    },

    // Revenue License
    revenueLicense: {
      licenseNumber: "",
      validFrom: "",
      validTo: "",
    },

    // Documents and Images
    documents: [],
    images: [],
    specialNotes: "",
  });

  const steps = [
    {
      label: "Basic Vehicle Information",
      icon: <CarIcon />,
      description: "Registration number, chassis, and engine details",
    },
    {
      label: "Owner Information",
      icon: <PersonIcon />,
      description: "Current and absolute owner details",
    },
    {
      label: "Vehicle Specifications",
      icon: <InfoIcon />,
      description: "Technical specifications and features",
    },
    {
      label: "Legal & Insurance",
      icon: <DocumentIcon />,
      description: "Revenue license and insurance information",
    },
    {
      label: "Documents & Images",
      icon: <CameraIcon />,
      description: "Upload required documents and photos",
    },
  ];

  // Sri Lankan specific data
  const provinces = [
    "Western",
    "Central",
    "Southern",
    "Northern",
    "Eastern",
    "North Western",
    "North Central",
    "Uva",
    "Sabaragamuwa",
  ];

  const districts = {
    Western: ["Colombo", "Gampaha", "Kalutara"],
    Central: ["Kandy", "Matale", "Nuwara Eliya"],
    Southern: ["Galle", "Matara", "Hambantota"],
    Northern: ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
    Eastern: ["Ampara", "Batticaloa", "Trincomalee"],
    "North Western": ["Kurunegala", "Puttalam"],
    "North Central": ["Anuradhapura", "Polonnaruwa"],
    Uva: ["Badulla", "Monaragala"],
    Sabaragamuwa: ["Ratnapura", "Kegalle"],
  };

  const provincialCouncils = [
    "Western Provincial Council",
    "Central Provincial Council",
    "Southern Provincial Council",
    "Northern Provincial Council",
    "Eastern Provincial Council",
    "North Western Provincial Council",
    "North Central Provincial Council",
    "Uva Provincial Council",
    "Sabaragamuwa Provincial Council",
  ];

  const vehicleClasses = [
    "MOTOR CAR",
    "MOTOR CYCLE",
    "THREE WHEELER",
    "MOTOR LORRY",
    "MOTOR COACH",
    "MOTOR AMBULANCE",
    "MOTOR HEARSE",
    "DUAL PURPOSE VEHICLE",
    "LAND VEHICLE",
    "PRIME MOVER",
    "TRAILER",
    "MOTOR TRICYCLE VAN",
    "MOTOR TRICYCLE CAB",
  ];

  const taxationClasses = [
    "PRIVATE",
    "COMMERCIAL",
    "GOVERNMENT",
    "DIPLOMATIC",
    "DEFENCE",
    "SPECIAL",
  ];

  const statusOptions = [
    "BRAND NEW",
    "RECONDITIONED",
    "USED LOCAL",
    "ASSEMBLED LOCAL",
    "VINTAGE",
    "REBUILT",
  ];

  const fuelTypes = [
    "PETROL",
    "DIESEL",
    "HYBRID",
    "ELECTRIC",
    "LPG",
    "CNG",
    "DUAL FUEL",
  ];

  const countries = [
    "JAPAN",
    "INDIA",
    "SOUTH KOREA",
    "GERMANY",
    "USA",
    "UK",
    "FRANCE",
    "ITALY",
    "CHINA",
    "THAILAND",
    "MALAYSIA",
    "SWEDEN",
    "CZECH REPUBLIC",
    "SPAIN",
    "BRAZIL",
    "MEXICO",
    "TURKEY",
    "OTHER",
  ];

  const vehicleColors = [
    "WHITE",
    "BLACK",
    "SILVER",
    "GREY",
    "RED",
    "BLUE",
    "GREEN",
    "YELLOW",
    "BROWN",
    "ORANGE",
    "PURPLE",
    "PINK",
    "GOLD",
    "MAROON",
    "NAVY",
    "CREAM",
    "BEIGE",
    "MULTICOLOR",
    "OTHER",
  ];

  const transmissionTypes = ["MANUAL", "AUTOMATIC", "CVT", "SEMI_AUTOMATIC"];

  const insuranceCoverageTypes = [
    "COMPREHENSIVE",
    "THIRD_PARTY",
    "THIRD_PARTY_FIRE_THEFT",
  ];

  const relationshipOptions = [
    { value: "same", label: "Same Person" },
    { value: "parent", label: "Parent" },
    { value: "spouse", label: "Spouse" },
    { value: "child", label: "Child" },
    { value: "company", label: "Company" },
    { value: "other", label: "Other" },
  ];

  const documentTypes = [
    {
      value: "REGISTRATION_CERTIFICATE",
      label: "Registration Certificate",
      required: true,
    },
    {
      value: "INSURANCE_CERTIFICATE",
      label: "Insurance Certificate",
      required: true,
    },
    { value: "REVENUE_LICENSE", label: "Revenue License", required: false },
    {
      value: "FITNESS_CERTIFICATE",
      label: "Fitness Certificate",
      required: false,
    },
    {
      value: "EMISSION_CERTIFICATE",
      label: "Emission Certificate",
      required: false,
    },
    { value: "IMPORT_PERMIT", label: "Import Permit", required: false },
    { value: "CUSTOMS_CLEARANCE", label: "Customs Clearance", required: false },
    { value: "OTHER", label: "Other Document", required: false },
  ];

  const imageTypes = [
    { value: "FRONT", label: "Front View", required: true },
    { value: "REAR", label: "Rear View", required: false },
    { value: "SIDE", label: "Side View", required: true },
    { value: "INTERIOR", label: "Interior", required: false },
    { value: "ENGINE", label: "Engine Bay", required: false },
    { value: "CHASSIS_NUMBER", label: "Chassis Number", required: true },
    { value: "OTHER", label: "Other", required: false },
  ];

  // Calculate form progress
  useEffect(() => {
    const totalSteps = steps.length;
    const currentProgress = ((activeStep + 1) / totalSteps) * 100;
    setFormProgress(currentProgress);
  }, [activeStep]);

  const handleInputChange = (path, value) => {
    setFormData((prev) => {
      const newData = { ...prev };
      const pathArray = path.split(".");
      let current = newData;

      for (let i = 0; i < pathArray.length - 1; i++) {
        if (!current[pathArray[i]]) {
          current[pathArray[i]] = {};
        }
        current = current[pathArray[i]];
      }

      current[pathArray[pathArray.length - 1]] = value;
      return newData;
    });

    // Clear error for this field
    if (errors[path]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[path];
        return newErrors;
      });
    }
  };

  const validateStep = (stepIndex) => {
    const newErrors = {};

    switch (stepIndex) {
      case 0: // Basic Vehicle Information
        if (!formData.registrationNumber)
          newErrors.registrationNumber = "Registration number is required";
        if (!formData.chassisNumber)
          newErrors.chassisNumber = "Chassis number is required";
        if (!formData.engineNumber)
          newErrors.engineNumber = "Engine number is required";
        if (!formData.dateOfRegistration)
          newErrors.dateOfRegistration = "Registration date is required";

        // Validate registration number format
        if (formData.registrationNumber) {
          const regPattern = /^([A-Z]{2,3}\s)?[A-Z]{2,3}-\d{4}$/;
          if (!regPattern.test(formData.registrationNumber.toUpperCase())) {
            newErrors.registrationNumber =
              "Invalid format (e.g., ABC-1234 or WP ABC-1234)";
          }
        }

        // Validate chassis number length
        if (formData.chassisNumber && formData.chassisNumber.length !== 17) {
          newErrors.chassisNumber =
            "Chassis number must be exactly 17 characters";
        }
        break;

      case 1: // Owner Information
        if (!formData.currentOwner.name)
          newErrors["currentOwner.name"] = "Current owner name is required";
        if (!formData.currentOwner.idNumber)
          newErrors["currentOwner.idNumber"] = "Current owner ID is required";

        // Validate NIC format
        if (formData.currentOwner.idNumber) {
          const nicPattern = /^([0-9]{9}[VXvx]|[0-9]{12})$/;
          if (!nicPattern.test(formData.currentOwner.idNumber)) {
            newErrors["currentOwner.idNumber"] = "Invalid NIC format";
          }
        }

        if (formData.absoluteOwner.relationshipToCurrentOwner !== "same") {
          if (!formData.absoluteOwner.name)
            newErrors["absoluteOwner.name"] = "Absolute owner name is required";
          if (!formData.absoluteOwner.idNumber)
            newErrors["absoluteOwner.idNumber"] =
              "Absolute owner ID is required";

          if (formData.absoluteOwner.idNumber) {
            const nicPattern = /^([0-9]{9}[VXvx]|[0-9]{12})$/;
            if (!nicPattern.test(formData.absoluteOwner.idNumber)) {
              newErrors["absoluteOwner.idNumber"] = "Invalid NIC format";
            }
          }
        }
        break;

      case 2: // Vehicle Specifications
        if (!formData.classOfVehicle)
          newErrors.classOfVehicle = "Vehicle class is required";
        if (!formData.make) newErrors.make = "Vehicle make is required";
        if (!formData.model) newErrors.model = "Vehicle model is required";
        if (!formData.yearOfManufacture)
          newErrors.yearOfManufacture = "Year of manufacture is required";
        if (!formData.fuelType) newErrors.fuelType = "Fuel type is required";
        if (!formData.color) newErrors.color = "Vehicle color is required";

        // Validate year
        if (formData.yearOfManufacture) {
          const year = parseInt(formData.yearOfManufacture);
          const currentYear = new Date().getFullYear();
          if (year < 1900 || year > currentYear + 1) {
            newErrors.yearOfManufacture = `Year must be between 1900 and ${
              currentYear + 1
            }`;
          }
        }
        break;

      case 3: // Legal & Insurance
        if (!formData.provincialCouncil)
          newErrors.provincialCouncil = "Provincial council is required";

        // Validate insurance dates if provided
        if (
          formData.insuranceDetails.validFrom &&
          formData.insuranceDetails.validTo
        ) {
          const fromDate = new Date(formData.insuranceDetails.validFrom);
          const toDate = new Date(formData.insuranceDetails.validTo);
          if (toDate <= fromDate) {
            newErrors["insuranceDetails.validTo"] =
              "End date must be after start date";
          }
        }
        break;

      case 4: // Documents & Images
        // Check for required documents
        const requiredDocs = documentTypes.filter((doc) => doc.required);
        const requiredImages = imageTypes.filter((img) => img.required);

        const missingDocs = requiredDocs.filter(
          (doc) =>
            !uploadedFiles[doc.value] || uploadedFiles[doc.value].length === 0
        );

        const missingImages = requiredImages.filter(
          (img) =>
            !uploadedFiles[img.value] || uploadedFiles[img.value].length === 0
        );

        if (missingDocs.length > 0) {
          newErrors.documents = `Missing required documents: ${missingDocs
            .map((d) => d.label)
            .join(", ")}`;
        }

        if (missingImages.length > 0) {
          newErrors.images = `Missing required images: ${missingImages
            .map((i) => i.label)
            .join(", ")}`;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (validateStep(activeStep)) {
      setLoading(true);
      try {
        // Prepare form data with uploaded files
        const submissionData = {
          ...formData,
          documents: Object.entries(uploadedFiles)
            .filter(([key]) => documentTypes.some((d) => d.value === key))
            .flatMap(([type, files]) =>
              files.map((file) => ({
                type,
                fileName: file.name,
                fileUrl: file.url || "",
                uploadDate: new Date(),
                isVerified: false,
              }))
            ),
          images: Object.entries(uploadedFiles)
            .filter(([key]) => imageTypes.some((i) => i.value === key))
            .flatMap(([type, files]) =>
              files.map((file) => ({
                type,
                imageUrl: file.url || "",
                uploadDate: new Date(),
                description: file.description || "",
              }))
            ),
        };

        await onSubmit(submissionData);
        toast.success("Vehicle registered successfully!");
      } catch (error) {
        console.error("Registration error:", error);
        toast.error("Failed to register vehicle. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFileUpload = (event, type) => {
    const files = Array.from(event.target.files);

    if (files.length === 0) return;

    // Validate files
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = type.startsWith("image")
      ? ["image/jpeg", "image/jpg", "image/png"]
      : ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid file type.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setUploadedFiles((prev) => ({
        ...prev,
        [type]: [
          ...(prev[type] || []),
          ...validFiles.map((file) => ({
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file),
            uploadDate: new Date(),
          })),
        ],
      }));

      toast.success(`${validFiles.length} file(s) uploaded successfully`);
    }

    // Clear input
    event.target.value = "";
  };

  const handleFileRemove = (type, index) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [type]: prev[type]?.filter((_, i) => i !== index) || [],
    }));
    toast.info("File removed");
  };

  const renderFilePreview = (type, files) => {
    if (!files || files.length === 0) return null;

    return (
      <Box className="file-preview-container">
        {files.map((file, index) => (
          <Paper key={index} className="file-preview-item">
            <Box className="file-preview-content">
              {file.type?.startsWith("image/") ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="file-preview-image"
                />
              ) : (
                <DocumentIcon className="file-preview-icon" />
              )}
              <Box className="file-preview-info">
                <Typography variant="caption" className="file-name">
                  {file.name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
              </Box>
              <Box className="file-preview-actions">
                <IconButton
                  size="small"
                  onClick={() => window.open(file.url, "_blank")}
                  title="View file"
                >
                  <ViewIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleFileRemove(type, index)}
                  title="Remove file"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    );
  };

  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <Card className="form-card">
            <CardContent>
              <Typography variant="h6" className="section-title">
                <CarIcon className="section-icon" />
                Basic Vehicle Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Registration Number"
                    placeholder="ABC-1234 or WP ABC-1234"
                    value={formData.registrationNumber}
                    onChange={(e) =>
                      handleInputChange(
                        "registrationNumber",
                        e.target.value.toUpperCase()
                      )
                    }
                    error={!!errors.registrationNumber}
                    helperText={
                      errors.registrationNumber ||
                      "Enter Sri Lankan vehicle registration number"
                    }
                    required
                    className="form-field"
                    inputProps={{ maxLength: 20 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Chassis Number"
                    placeholder="17-character chassis number"
                    value={formData.chassisNumber}
                    onChange={(e) =>
                      handleInputChange(
                        "chassisNumber",
                        e.target.value.toUpperCase()
                      )
                    }
                    error={!!errors.chassisNumber}
                    helperText={
                      errors.chassisNumber ||
                      "Vehicle chassis number (17 characters)"
                    }
                    inputProps={{ maxLength: 17 }}
                    required
                    className="form-field"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Engine Number"
                    value={formData.engineNumber}
                    onChange={(e) =>
                      handleInputChange(
                        "engineNumber",
                        e.target.value.toUpperCase()
                      )
                    }
                    error={!!errors.engineNumber}
                    helperText={errors.engineNumber}
                    required
                    className="form-field"
                    inputProps={{ maxLength: 20 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Date of Registration"
                    type="date"
                    value={formData.dateOfRegistration}
                    onChange={(e) =>
                      handleInputChange("dateOfRegistration", e.target.value)
                    }
                    error={!!errors.dateOfRegistration}
                    helperText={errors.dateOfRegistration}
                    InputLabelProps={{ shrink: true }}
                    required
                    className="form-field"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <Card className="form-card">
            <CardContent>
              <Typography variant="h6" className="section-title">
                <PersonIcon className="section-icon" />
                Owner Information
              </Typography>

              {/* Current Owner */}
              <Box className="owner-section">
                <Typography variant="subtitle1" className="subsection-title">
                  Current Owner Details
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={formData.currentOwner.name}
                      onChange={(e) =>
                        handleInputChange("currentOwner.name", e.target.value)
                      }
                      error={!!errors["currentOwner.name"]}
                      helperText={errors["currentOwner.name"]}
                      required
                      className="form-field"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="ID Number (NIC/Passport)"
                      placeholder="123456789V or 123456789012"
                      value={formData.currentOwner.idNumber}
                      onChange={(e) =>
                        handleInputChange(
                          "currentOwner.idNumber",
                          e.target.value
                        )
                      }
                      error={!!errors["currentOwner.idNumber"]}
                      helperText={
                        errors["currentOwner.idNumber"] ||
                        "Enter NIC or Passport number"
                      }
                      required
                      className="form-field"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Street Address"
                      value={formData.currentOwner.address.street}
                      onChange={(e) =>
                        handleInputChange(
                          "currentOwner.address.street",
                          e.target.value
                        )
                      }
                      className="form-field"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="City"
                      value={formData.currentOwner.address.city}
                      onChange={(e) =>
                        handleInputChange(
                          "currentOwner.address.city",
                          e.target.value
                        )
                      }
                      className="form-field"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth className="form-field">
                      <InputLabel>Province</InputLabel>
                      <Select
                        value={formData.currentOwner.address.province}
                        onChange={(e) => {
                          handleInputChange(
                            "currentOwner.address.province",
                            e.target.value
                          );
                          handleInputChange(
                            "currentOwner.address.district",
                            ""
                          ); // Reset district
                        }}
                        label="Province"
                      >
                        {provinces.map((province) => (
                          <MenuItem key={province} value={province}>
                            {province}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth className="form-field">
                      <InputLabel>District</InputLabel>
                      <Select
                        value={formData.currentOwner.address.district}
                        onChange={(e) =>
                          handleInputChange(
                            "currentOwner.address.district",
                            e.target.value
                          )
                        }
                        label="District"
                        disabled={!formData.currentOwner.address.province}
                      >
                        {formData.currentOwner.address.province &&
                          districts[
                            formData.currentOwner.address.province
                          ]?.map((district) => (
                            <MenuItem key={district} value={district}>
                              {district}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Postal Code"
                      placeholder="00000"
                      value={formData.currentOwner.address.postalCode}
                      onChange={(e) =>
                        handleInputChange(
                          "currentOwner.address.postalCode",
                          e.target.value
                        )
                      }
                      className="form-field"
                      inputProps={{ maxLength: 5, pattern: "[0-9]*" }}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Divider className="section-divider" />

              {/* Absolute Owner */}
              <Box className="owner-section">
                <Typography variant="subtitle1" className="subsection-title">
                  Absolute Owner Details
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControl fullWidth className="form-field">
                      <InputLabel>Relationship to Current Owner</InputLabel>
                      <Select
                        value={
                          formData.absoluteOwner.relationshipToCurrentOwner
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "absoluteOwner.relationshipToCurrentOwner",
                            e.target.value
                          )
                        }
                        label="Relationship to Current Owner"
                      >
                        {relationshipOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Collapse
                    in={
                      formData.absoluteOwner.relationshipToCurrentOwner !==
                      "same"
                    }
                  >
                    <Box sx={{ width: "100%", mt: 2 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Full Name"
                            value={formData.absoluteOwner.name}
                            onChange={(e) =>
                              handleInputChange(
                                "absoluteOwner.name",
                                e.target.value
                              )
                            }
                            error={!!errors["absoluteOwner.name"]}
                            helperText={errors["absoluteOwner.name"]}
                            required={
                              formData.absoluteOwner
                                .relationshipToCurrentOwner !== "same"
                            }
                            className="form-field"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="ID Number (NIC/Passport)"
                            placeholder="123456789V or 123456789012"
                            value={formData.absoluteOwner.idNumber}
                            onChange={(e) =>
                              handleInputChange(
                                "absoluteOwner.idNumber",
                                e.target.value
                              )
                            }
                            error={!!errors["absoluteOwner.idNumber"]}
                            helperText={errors["absoluteOwner.idNumber"]}
                            required={
                              formData.absoluteOwner
                                .relationshipToCurrentOwner !== "same"
                            }
                            className="form-field"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Street Address"
                            value={formData.absoluteOwner.address.street}
                            onChange={(e) =>
                              handleInputChange(
                                "absoluteOwner.address.street",
                                e.target.value
                              )
                            }
                            className="form-field"
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="City"
                            value={formData.absoluteOwner.address.city}
                            onChange={(e) =>
                              handleInputChange(
                                "absoluteOwner.address.city",
                                e.target.value
                              )
                            }
                            className="form-field"
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <FormControl fullWidth className="form-field">
                            <InputLabel>Province</InputLabel>
                            <Select
                              value={formData.absoluteOwner.address.province}
                              onChange={(e) => {
                                handleInputChange(
                                  "absoluteOwner.address.province",
                                  e.target.value
                                );
                                handleInputChange(
                                  "absoluteOwner.address.district",
                                  ""
                                );
                              }}
                              label="Province"
                            >
                              {provinces.map((province) => (
                                <MenuItem key={province} value={province}>
                                  {province}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Postal Code"
                            placeholder="00000"
                            value={formData.absoluteOwner.address.postalCode}
                            onChange={(e) =>
                              handleInputChange(
                                "absoluteOwner.address.postalCode",
                                e.target.value
                              )
                            }
                            className="form-field"
                            inputProps={{ maxLength: 5, pattern: "[0-9]*" }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Collapse>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="form-card">
            <CardContent>
              <Typography variant="h6" className="section-title">
                <InfoIcon className="section-icon" />
                Vehicle Specifications
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required className="form-field">
                    <InputLabel>Class of Vehicle</InputLabel>
                    <Select
                      value={formData.classOfVehicle}
                      onChange={(e) =>
                        handleInputChange("classOfVehicle", e.target.value)
                      }
                      error={!!errors.classOfVehicle}
                      label="Class of Vehicle"
                    >
                      {vehicleClasses.map((vehicleClass) => (
                        <MenuItem key={vehicleClass} value={vehicleClass}>
                          {vehicleClass}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth className="form-field">
                    <InputLabel>Taxation Class</InputLabel>
                    <Select
                      value={formData.taxationClass}
                      onChange={(e) =>
                        handleInputChange("taxationClass", e.target.value)
                      }
                      label="Taxation Class"
                    >
                      {taxationClasses.map((taxClass) => (
                        <MenuItem key={taxClass} value={taxClass}>
                          {taxClass}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth className="form-field">
                    <InputLabel>Status When Registered</InputLabel>
                    <Select
                      value={formData.statusWhenRegistered}
                      onChange={(e) =>
                        handleInputChange(
                          "statusWhenRegistered",
                          e.target.value
                        )
                      }
                      label="Status When Registered"
                    >
                      {statusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required className="form-field">
                    <InputLabel>Fuel Type</InputLabel>
                    <Select
                      value={formData.fuelType}
                      onChange={(e) =>
                        handleInputChange("fuelType", e.target.value)
                      }
                      error={!!errors.fuelType}
                      label="Fuel Type"
                    >
                      {fuelTypes.map((fuel) => (
                        <MenuItem key={fuel} value={fuel}>
                          {fuel}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Vehicle Make"
                    placeholder="e.g., TOYOTA, HONDA"
                    value={formData.make}
                    onChange={(e) =>
                      handleInputChange("make", e.target.value.toUpperCase())
                    }
                    error={!!errors.make}
                    helperText={errors.make}
                    required
                    className="form-field"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Vehicle Model"
                    placeholder="e.g., PRIUS, CIVIC"
                    value={formData.model}
                    onChange={(e) =>
                      handleInputChange("model", e.target.value.toUpperCase())
                    }
                    error={!!errors.model}
                    helperText={errors.model}
                    required
                    className="form-field"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Year of Manufacture"
                    type="number"
                    value={formData.yearOfManufacture}
                    onChange={(e) =>
                      handleInputChange("yearOfManufacture", e.target.value)
                    }
                    error={!!errors.yearOfManufacture}
                    helperText={errors.yearOfManufacture}
                    inputProps={{
                      min: 1900,
                      max: new Date().getFullYear() + 1,
                    }}
                    required
                    className="form-field"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth className="form-field">
                    <InputLabel>Country of Manufacture</InputLabel>
                    <Select
                      value={formData.country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                      label="Country of Manufacture"
                    >
                      {countries.map((country) => (
                        <MenuItem key={country} value={country}>
                          {country}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required className="form-field">
                    <InputLabel>Vehicle Color</InputLabel>
                    <Select
                      value={formData.color}
                      onChange={(e) =>
                        handleInputChange("color", e.target.value)
                      }
                      error={!!errors.color}
                      label="Vehicle Color"
                    >
                      {vehicleColors.map((color) => (
                        <MenuItem key={color} value={color}>
                          {color}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth className="form-field">
                    <InputLabel>Transmission</InputLabel>
                    <Select
                      value={formData.transmission}
                      onChange={(e) =>
                        handleInputChange("transmission", e.target.value)
                      }
                      label="Transmission"
                    >
                      {transmissionTypes.map((transmission) => (
                        <MenuItem key={transmission} value={transmission}>
                          {transmission.replace("_", " ")}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Engine Capacity (CC)"
                    type="number"
                    value={formData.cylinderCapacity}
                    onChange={(e) =>
                      handleInputChange("cylinderCapacity", e.target.value)
                    }
                    inputProps={{ min: 50, max: 10000 }}
                    helperText="Engine displacement in cubic centimeters"
                    className="form-field"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Seating Capacity"
                    type="number"
                    value={formData.seatingCapacity}
                    onChange={(e) =>
                      handleInputChange("seatingCapacity", e.target.value)
                    }
                    inputProps={{ min: 1, max: 100 }}
                    helperText="Number of passengers"
                    className="form-field"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Wheel Base (mm)"
                    type="number"
                    value={formData.wheelBase}
                    onChange={(e) =>
                      handleInputChange("wheelBase", e.target.value)
                    }
                    inputProps={{ min: 500, max: 10000 }}
                    helperText="Distance between front and rear axles"
                    className="form-field"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Vehicle Height (mm)"
                    type="number"
                    value={formData.height}
                    onChange={(e) =>
                      handleInputChange("height", e.target.value)
                    }
                    inputProps={{ min: 500, max: 5000 }}
                    helperText="Overall height of the vehicle"
                    className="form-field"
                  />
                </Grid>

                {/* Weight Section */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" className="subsection-title">
                    Weight Information
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Unladen Weight (kg)"
                    type="number"
                    value={formData.weight.unladenWeight}
                    onChange={(e) =>
                      handleInputChange("weight.unladenWeight", e.target.value)
                    }
                    inputProps={{ min: 50, max: 50000 }}
                    helperText="Weight without passengers or cargo"
                    className="form-field"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Gross Weight (kg)"
                    type="number"
                    value={formData.weight.grossWeight}
                    onChange={(e) =>
                      handleInputChange("weight.grossWeight", e.target.value)
                    }
                    inputProps={{ min: 50, max: 50000 }}
                    error={!!errors["weight.grossWeight"]}
                    helperText={
                      errors["weight.grossWeight"] ||
                      "Maximum permissible weight"
                    }
                    className="form-field"
                  />
                </Grid>

                {/* Tyre Size Section */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" className="subsection-title">
                    Tyre Information
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Front Tyre Size"
                    placeholder="195/65R15"
                    value={formData.tyreSize.front}
                    onChange={(e) =>
                      handleInputChange("tyreSize.front", e.target.value)
                    }
                    helperText="Format: width/aspect ratioR diameter"
                    className="form-field"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Rear Tyre Size"
                    placeholder="195/65R15"
                    value={formData.tyreSize.rear}
                    onChange={(e) =>
                      handleInputChange("tyreSize.rear", e.target.value)
                    }
                    helperText="Format: width/aspect ratioR diameter"
                    className="form-field"
                  />
                </Grid>

                {/* Mileage */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Current Mileage (km)"
                    type="number"
                    value={formData.mileage}
                    onChange={(e) =>
                      handleInputChange("mileage", e.target.value)
                    }
                    inputProps={{ min: 0 }}
                    helperText="Current odometer reading"
                    className="form-field"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="form-card">
            <CardContent>
              <Typography variant="h6" className="section-title">
                <DocumentIcon className="section-icon" />
                Legal & Insurance Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth required className="form-field">
                    <InputLabel>Provincial Council</InputLabel>
                    <Select
                      value={formData.provincialCouncil}
                      onChange={(e) =>
                        handleInputChange("provincialCouncil", e.target.value)
                      }
                      error={!!errors.provincialCouncil}
                      label="Provincial Council"
                    >
                      {provincialCouncils.map((council) => (
                        <MenuItem key={council} value={council}>
                          {council}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" className="subsection-title">
                    Insurance Details
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Insurance Provider"
                    placeholder="e.g., Sri Lanka Insurance"
                    value={formData.insuranceDetails.provider}
                    onChange={(e) =>
                      handleInputChange(
                        "insuranceDetails.provider",
                        e.target.value
                      )
                    }
                    className="form-field"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Policy Number"
                    value={formData.insuranceDetails.policyNumber}
                    onChange={(e) =>
                      handleInputChange(
                        "insuranceDetails.policyNumber",
                        e.target.value
                      )
                    }
                    className="form-field"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth className="form-field">
                    <InputLabel>Coverage Type</InputLabel>
                    <Select
                      value={formData.insuranceDetails.coverageType}
                      onChange={(e) =>
                        handleInputChange(
                          "insuranceDetails.coverageType",
                          e.target.value
                        )
                      }
                      label="Coverage Type"
                    >
                      {insuranceCoverageTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type.replace(/_/g, " ")}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Valid From"
                    type="date"
                    value={formData.insuranceDetails.validFrom}
                    onChange={(e) =>
                      handleInputChange(
                        "insuranceDetails.validFrom",
                        e.target.value
                      )
                    }
                    InputLabelProps={{ shrink: true }}
                    className="form-field"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Valid To"
                    type="date"
                    value={formData.insuranceDetails.validTo}
                    onChange={(e) =>
                      handleInputChange(
                        "insuranceDetails.validTo",
                        e.target.value
                      )
                    }
                    InputLabelProps={{ shrink: true }}
                    error={!!errors["insuranceDetails.validTo"]}
                    helperText={errors["insuranceDetails.validTo"]}
                    className="form-field"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" className="subsection-title">
                    Revenue License
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="License Number"
                    value={formData.revenueLicense.licenseNumber}
                    onChange={(e) =>
                      handleInputChange(
                        "revenueLicense.licenseNumber",
                        e.target.value
                      )
                    }
                    className="form-field"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Valid From"
                    type="date"
                    value={formData.revenueLicense.validFrom}
                    onChange={(e) =>
                      handleInputChange(
                        "revenueLicense.validFrom",
                        e.target.value
                      )
                    }
                    InputLabelProps={{ shrink: true }}
                    className="form-field"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Valid To"
                    type="date"
                    value={formData.revenueLicense.validTo}
                    onChange={(e) =>
                      handleInputChange(
                        "revenueLicense.validTo",
                        e.target.value
                      )
                    }
                    InputLabelProps={{ shrink: true }}
                    error={!!errors["revenueLicense.validTo"]}
                    helperText={errors["revenueLicense.validTo"]}
                    className="form-field"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="form-card">
            <CardContent>
              <Typography variant="h6" className="section-title">
                <CameraIcon className="section-icon" />
                Documents & Images
              </Typography>

              {/* Error Display */}
              {(errors.documents || errors.images) && (
                <Alert severity="error" className="upload-error">
                  {errors.documents && <div>{errors.documents}</div>}
                  {errors.images && <div>{errors.images}</div>}
                </Alert>
              )}

              {/* Required Documents */}
              <Box className="upload-section">
                <Typography variant="subtitle1" className="subsection-title">
                  Required Documents
                </Typography>
                <Grid container spacing={3}>
                  {documentTypes
                    .filter((doc) => doc.required)
                    .map((docType) => (
                      <Grid item xs={12} md={6} key={docType.value}>
                        <Paper className="upload-area">
                          <input
                            accept=".pdf,.jpg,.jpeg,.png"
                            style={{ display: "none" }}
                            id={`document-${docType.value}`}
                            type="file"
                            multiple
                            onChange={(e) => handleFileUpload(e, docType.value)}
                          />
                          <label htmlFor={`document-${docType.value}`}>
                            <Box className="upload-content">
                              <UploadIcon className="upload-icon" />
                              <Typography>{docType.label}</Typography>
                              <Button variant="outlined" component="span">
                                Upload Files
                              </Button>
                              {docType.required && (
                                <Chip
                                  label="Required"
                                  size="small"
                                  className="required-chip"
                                />
                              )}
                            </Box>
                          </label>
                          {renderFilePreview(
                            docType.value,
                            uploadedFiles[docType.value]
                          )}
                        </Paper>
                      </Grid>
                    ))}
                </Grid>
              </Box>

              {/* Optional Documents */}
              <Box className="upload-section">
                <Typography variant="subtitle1" className="subsection-title">
                  Optional Documents
                </Typography>
                <Grid container spacing={3}>
                  {documentTypes
                    .filter((doc) => !doc.required)
                    .map((docType) => (
                      <Grid item xs={12} md={6} key={docType.value}>
                        <Paper className="upload-area optional">
                          <input
                            accept=".pdf,.jpg,.jpeg,.png"
                            style={{ display: "none" }}
                            id={`document-${docType.value}`}
                            type="file"
                            multiple
                            onChange={(e) => handleFileUpload(e, docType.value)}
                          />
                          <label htmlFor={`document-${docType.value}`}>
                            <Box className="upload-content">
                              <UploadIcon className="upload-icon" />
                              <Typography>{docType.label}</Typography>
                              <Button variant="outlined" component="span">
                                Upload Files
                              </Button>
                            </Box>
                          </label>
                          {renderFilePreview(
                            docType.value,
                            uploadedFiles[docType.value]
                          )}
                        </Paper>
                      </Grid>
                    ))}
                </Grid>
              </Box>

              {/* Vehicle Images */}
              <Box className="upload-section">
                <Typography variant="subtitle1" className="subsection-title">
                  Vehicle Images
                </Typography>
                <Grid container spacing={3}>
                  {imageTypes.map((imageType) => (
                    <Grid item xs={12} md={6} key={imageType.value}>
                      <Paper
                        className={`upload-area ${
                          imageType.required ? "required" : "optional"
                        }`}
                      >
                        <input
                          accept=".jpg,.jpeg,.png"
                          style={{ display: "none" }}
                          id={`image-${imageType.value}`}
                          type="file"
                          multiple
                          onChange={(e) => handleFileUpload(e, imageType.value)}
                        />
                        <label htmlFor={`image-${imageType.value}`}>
                          <Box className="upload-content">
                            <CameraIcon className="upload-icon" />
                            <Typography>{imageType.label}</Typography>
                            <Button variant="outlined" component="span">
                              Upload Images
                            </Button>
                            {imageType.required && (
                              <Chip
                                label="Required"
                                size="small"
                                className="required-chip"
                              />
                            )}
                          </Box>
                        </label>
                        {renderFilePreview(
                          imageType.value,
                          uploadedFiles[imageType.value]
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Special Notes */}
              <Box className="notes-section">
                <TextField
                  fullWidth
                  label="Special Notes"
                  multiline
                  rows={4}
                  value={formData.specialNotes}
                  onChange={(e) =>
                    handleInputChange("specialNotes", e.target.value)
                  }
                  placeholder="Any additional information about the vehicle..."
                  className="form-field"
                />
              </Box>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Box className="vehicle-registration-container">
      <Paper className="registration-paper">
        <Box className="registration-header">
          <Typography variant="h4" className="main-title">
            Vehicle Registration
          </Typography>
          <Typography variant="subtitle1" className="subtitle">
            Register your vehicle with Sri Lankan authorities
          </Typography>

          {/* Progress Bar */}
          <Box className="progress-container">
            <LinearProgress
              variant="determinate"
              value={formProgress}
              className="progress-bar"
            />
            <Typography variant="caption" className="progress-text">
              Step {activeStep + 1} of {steps.length} (
              {Math.round(formProgress)}% complete)
            </Typography>
          </Box>
        </Box>

        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          className="registration-stepper"
        >
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={
                  index === steps.length - 1 ? (
                    <Typography variant="caption">Final step</Typography>
                  ) : null
                }
                StepIconComponent={({ active, completed }) => (
                  <Box
                    className={`step-icon ${active ? "active" : ""} ${
                      completed ? "completed" : ""
                    }`}
                  >
                    {completed ? <CheckIcon /> : step.icon}
                  </Box>
                )}
              >
                <Box className="step-label-content">
                  <Typography variant="h6">{step.label}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {step.description}
                  </Typography>
                </Box>
              </StepLabel>
              <StepContent>
                <Fade in timeout={500}>
                  <Box className="step-content">
                    {renderStepContent(index)}

                    <Box className="step-actions">
                      <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        startIcon={<BackIcon />}
                        className="back-button"
                      >
                        Back
                      </Button>

                      {activeStep === steps.length - 1 ? (
                        <Button
                          variant="contained"
                          onClick={handleSubmit}
                          disabled={loading || isSubmitting}
                          startIcon={<CheckIcon />}
                          className="submit-button"
                        >
                          {loading || isSubmitting
                            ? "Registering..."
                            : "Register Vehicle"}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          endIcon={<NextIcon />}
                          className="next-button"
                        >
                          Next
                        </Button>
                      )}

                      <Button
                        onClick={onCancel}
                        className="cancel-button"
                        disabled={loading || isSubmitting}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                </Fade>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {activeStep === steps.length && (
          <Paper square elevation={0} className="completion-paper">
            <Box className="completion-content">
              <CheckIcon className="completion-icon" />
              <Typography variant="h5">Registration Complete!</Typography>
              <Typography>
                Your vehicle has been successfully registered. You will receive
                a confirmation email shortly.
              </Typography>
              <Button onClick={onCancel} className="done-button">
                Done
              </Button>
            </Box>
          </Paper>
        )}
      </Paper>
    </Box>
  );
};

export default VehicleRegistrationForm;
