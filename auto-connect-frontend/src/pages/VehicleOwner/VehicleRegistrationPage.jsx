import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Alert,
  Breadcrumbs,
  Link,
  Chip,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Home as HomeIcon,
  DirectionsCar as CarIcon,
  NavigateNext as NavigateNextIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Description as DocumentIcon,
  Schedule as ScheduleIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { UserContext } from "@contexts/UserContext";
import VehicleRegistrationForm from "@components/VehicleRegistrationForm";
import axios from "@utils/axios";
import "./VehicleRegistrationPage.css";

const VehicleRegistrationPage = () => {
  const navigate = useNavigate();
  const { userContext } = useContext(UserContext);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartRegistration = () => {
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      // Add current user ID to the form data
      const vehicleData = {
        ...formData,
        currentOwner: {
          ...formData.currentOwner,
          userId: userContext._id,
        },
      };

      const response = await axios.post(
        "/api/v1/vehicles/register",
        vehicleData
      );

      if (response.data.success) {
        toast.success("Vehicle registered successfully!");
        navigate("/dashboard/vehicles");
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Vehicle registration error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to register vehicle. Please try again."
      );
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const requirements = [
    {
      icon: <DocumentIcon />,
      title: "Registration Certificate",
      description:
        "Original vehicle registration certificate from previous owner or import documentation",
      required: true,
    },
    {
      icon: <SecurityIcon />,
      title: "Insurance Policy",
      description:
        "Valid comprehensive or third-party insurance policy document",
      required: true,
    },
    {
      icon: <CheckIcon />,
      title: "Identity Verification",
      description:
        "National Identity Card (NIC) or valid passport for identification",
      required: true,
    },
    {
      icon: <CarIcon />,
      title: "Vehicle Inspection",
      description: "Recent vehicle inspection certificate (if applicable)",
      required: false,
    },
    {
      icon: <ScheduleIcon />,
      title: "Revenue License",
      description: "Current revenue license or payment receipts",
      required: false,
    },
  ];

  const steps = [
    "Complete registration form with accurate vehicle details",
    "Upload required documents and vehicle photographs",
    "Submit application for verification",
    "Await approval from relevant authorities",
    "Receive digital vehicle passport and certificates",
  ];

  if (showForm) {
    return (
      <VehicleRegistrationForm
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <Box className="vehicle-registration-page">
      <Container maxWidth="lg" className="page-container">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          className="breadcrumb"
          aria-label="breadcrumb"
        >
          <Link color="inherit" href="/dashboard" className="breadcrumb-link">
            <HomeIcon className="breadcrumb-icon" />
            Dashboard
          </Link>
          <Link
            color="inherit"
            href="/dashboard/vehicles"
            className="breadcrumb-link"
          >
            <CarIcon className="breadcrumb-icon" />
            Vehicles
          </Link>
          <Typography color="text.primary" className="breadcrumb-current">
            Register New Vehicle
          </Typography>
        </Breadcrumbs>

        {/* Page Header */}
        <Paper className="page-header">
          <Box className="header-content">
            <Box className="header-text">
              <Typography variant="h3" className="page-title">
                Vehicle Registration
              </Typography>
              <Typography variant="h6" className="page-subtitle">
                Register your vehicle with Sri Lankan authorities through our
                streamlined digital process
              </Typography>
              <Box className="header-chips">
                <Chip
                  icon={<SecurityIcon />}
                  label="Secure Process"
                  className="feature-chip secure"
                />
                <Chip
                  icon={<CheckIcon />}
                  label="Government Approved"
                  className="feature-chip approved"
                />
                <Chip
                  icon={<ScheduleIcon />}
                  label="Quick Processing"
                  className="feature-chip quick"
                />
              </Box>
            </Box>
            <Box className="header-illustration">
              <CarIcon className="main-icon" />
            </Box>
          </Box>
        </Paper>

        {/* Important Notice */}
        <Alert severity="info" className="info-alert" icon={<InfoIcon />}>
          <Typography variant="subtitle1" className="alert-title">
            Before You Begin
          </Typography>
          <Typography variant="body2">
            Ensure you have all required documents ready. The registration
            process typically takes 3-5 business days for verification and
            approval.
          </Typography>
        </Alert>

        {/* Main Content Grid */}
        <Grid container spacing={4} className="content-grid">
          {/* Requirements Section */}
          <Grid item xs={12} md={6}>
            <Card className="requirements-card">
              <CardContent>
                <Typography variant="h5" className="card-title">
                  <DocumentIcon className="card-icon" />
                  Required Documents
                </Typography>
                <Typography variant="body2" className="card-subtitle">
                  Prepare these documents before starting your registration
                </Typography>

                <List className="requirements-list">
                  {requirements.map((requirement, index) => (
                    <React.Fragment key={index}>
                      <ListItem className="requirement-item">
                        <ListItemIcon className="requirement-icon-container">
                          <Box
                            className={`requirement-icon ${
                              requirement.required ? "required" : "optional"
                            }`}
                          >
                            {requirement.icon}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box className="requirement-title">
                              {requirement.title}
                              {requirement.required && (
                                <Chip
                                  label="Required"
                                  size="small"
                                  className="required-chip"
                                />
                              )}
                            </Box>
                          }
                          secondary={requirement.description}
                          className="requirement-text"
                        />
                      </ListItem>
                      {index < requirements.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Process Steps Section */}
          <Grid item xs={12} md={6}>
            <Card className="process-card">
              <CardContent>
                <Typography variant="h5" className="card-title">
                  <CheckIcon className="card-icon" />
                  Registration Process
                </Typography>
                <Typography variant="body2" className="card-subtitle">
                  Follow these simple steps to complete your registration
                </Typography>

                <List className="process-list">
                  {steps.map((step, index) => (
                    <ListItem key={index} className="process-item">
                      <ListItemIcon className="process-number-container">
                        <Box className="process-number">{index + 1}</Box>
                      </ListItemIcon>
                      <ListItemText primary={step} className="process-text" />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Section */}
        <Paper className="action-section">
          <Box className="action-content">
            <Box className="action-text">
              <Typography variant="h5" className="action-title">
                Ready to Register Your Vehicle?
              </Typography>
              <Typography variant="body1" className="action-description">
                Start the registration process now. Our step-by-step form will
                guide you through each requirement.
              </Typography>
            </Box>
            <Box className="action-buttons">
              <Button
                variant="contained"
                size="large"
                onClick={handleStartRegistration}
                className="start-button"
                startIcon={<CarIcon />}
              >
                Start Registration
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/dashboard/vehicles")}
                className="back-button"
              >
                Back to Vehicles
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Additional Information */}
        <Grid container spacing={3} className="info-grid">
          <Grid item xs={12} md={4}>
            <Card className="info-card">
              <CardContent className="info-card-content">
                <SecurityIcon className="info-icon secure-icon" />
                <Typography variant="h6" className="info-title">
                  Secure & Encrypted
                </Typography>
                <Typography variant="body2" className="info-description">
                  Your personal and vehicle information is protected with
                  bank-level encryption and security measures.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card className="info-card">
              <CardContent className="info-card-content">
                <ScheduleIcon className="info-icon time-icon" />
                <Typography variant="h6" className="info-title">
                  Quick Processing
                </Typography>
                <Typography variant="body2" className="info-description">
                  Most registrations are processed within 3-5 business days.
                  You'll receive updates via email and SMS.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card className="info-card">
              <CardContent className="info-card-content">
                <CheckIcon className="info-icon approved-icon" />
                <Typography variant="h6" className="info-title">
                  Government Approved
                </Typography>
                <Typography variant="body2" className="info-description">
                  Our platform is officially recognized and integrated with Sri
                  Lankan vehicle registration authorities.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Help Section */}
        <Paper className="help-section">
          <Box className="help-content">
            <Typography variant="h6" className="help-title">
              Need Help?
            </Typography>
            <Typography variant="body2" className="help-description">
              If you have questions about the registration process or need
              assistance with your documents, our support team is here to help.
            </Typography>
            <Box className="help-actions">
              <Button variant="outlined" className="help-button">
                Contact Support
              </Button>
              <Button variant="text" className="help-button">
                View FAQ
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default VehicleRegistrationPage;
