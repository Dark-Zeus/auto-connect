// src/components/ServiceProvider/ServiceCompletionForm.jsx
import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Alert,
  Stack,
  InputAdornment,
  Fade,
  Collapse,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Build as ServiceIcon,
  AttachMoney as MoneyIcon,
  Schedule as TimeIcon,
  Person as PersonIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  DirectionsCar as CarIcon,
  Assignment as AssignmentIcon,
  Engineering as EngineeringIcon,
  Receipt as ReceiptIcon,
  VerifiedUser as QualityIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { UserContext } from "../../contexts/UserContext";
import bookingAPI from "../../services/bookingApiService";

const ServiceCompletionForm = ({ booking, open, onClose, onComplete }) => {
  const { userContext } = useContext(UserContext);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    completedServices:
      booking?.services?.map((serviceName) => ({
        serviceName,
        description: "",
        partsUsed: [], // This will hold the parts added for each service
        laborDetails: {
          hoursWorked: 0,
          laborRate: 0,
          laborCost: 0,
        },
        serviceCost: 0,
        serviceAmount: 0,
        partsRequired: false,
        serviceStatus: "COMPLETED",
        notes: "",
      })) || [],
    additionalWork: [],
    totalCostBreakdown: {
      taxes: 0,
      discount: 0,
    },
    workStartTime: "",
    workEndTime: "",
    totalTimeSpent: "",
    vehicleCondition: {
      before: {
        mileage: "",
        fuelLevel: "",
        externalCondition: "",
        internalCondition: "",
        photos: [],
      },
      after: {
        mileage: "",
        fuelLevel: "",
        externalCondition: "",
        internalCondition: "",
        photos: [],
      },
    },
    technician: {
      name: userContext?.firstName
        ? `${userContext.firstName} ${userContext.lastName}`
        : "",
      employeeId: "",
      signature: "",
    },
    qualityCheck: {
      performed: false,
      performedBy: "",
      checklist: [],
      overallRating: "",
      notes: "",
    },
    recommendations: [],
    customerNotification: {
      notified: false,
      notificationDate: "",
      notificationMethod: "PHONE",
    },
  });

  const steps = [
    { label: "Service Details", icon: <ServiceIcon /> },
    { label: "Parts & Labor", icon: <EngineeringIcon /> },
    { label: "Vehicle & Time", icon: <CarIcon /> },
    { label: "Quality Assurance", icon: <QualityIcon /> },
    { label: "Final Review", icon: <ReceiptIcon /> },
  ];

  // Professional color scheme
  const colors = {
    primaryLight: "#DFF2EB",
    primaryMedium: "#B9E5E8",
    primaryBlue: "#7AB2D3",
    primaryDark: "#4A628A",
    white: "#ffffff",
    grayLight: "#f8f9fa",
    grayMedium: "#6c757d",
    grayDark: "#495057",
    textDark: "#2c3e50",
    textLight: "#ecf0f1",
  };

  // Calculate totals
  // Format date utility function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateTotals = () => {
    let partsTotal = 0;
    let laborTotal = 0;
    let servicesTotal = 0;
    let additionalWorkTotal = 0;

    formData.completedServices.forEach((service) => {
      if (service.partsUsed) {
        service.partsUsed.forEach((part) => {
          partsTotal += parseFloat(part.totalPrice) || 0;
        });
      }
      laborTotal += parseFloat(service.laborDetails.laborCost) || 0;
      servicesTotal +=
        (parseFloat(service.serviceCost) || 0) +
        (parseFloat(service.serviceAmount) || 0);
    });

    formData.additionalWork.forEach((work) => {
      additionalWorkTotal += parseFloat(work.cost) || 0;
    });

    const finalTotal =
      partsTotal +
      laborTotal +
      servicesTotal +
      additionalWorkTotal +
      (parseFloat(formData.totalCostBreakdown.taxes) || 0) -
      (parseFloat(formData.totalCostBreakdown.discount) || 0);

    return {
      partsTotal,
      laborTotal,
      servicesTotal,
      additionalWorkTotal,
      finalTotal,
    };
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!formData.completedServices.length) {
        toast.error("At least one service must be completed");
        return;
      }

      if (!formData.technician.name) {
        toast.error("Technician name is required");
        return;
      }

      if (!formData.workStartTime || !formData.workEndTime) {
        toast.error("Work start and end times are required");
        return;
      }

      // Validate each service has required information
      for (let i = 0; i < formData.completedServices.length; i++) {
        const service = formData.completedServices[i];
        if (!service.description.trim()) {
          toast.error(
            `Service description is required for ${service.serviceName}`
          );
          setActiveStep(0); // Go back to service details
          return;
        }
        if (service.laborDetails.hoursWorked <= 0) {
          toast.error(
            `Labor hours must be greater than 0 for ${service.serviceName}`
          );
          setActiveStep(1); // Go back to parts & labor
          return;
        }
      }

      // Prepare submission data with proper data types
      const totals = calculateTotals();
      const submissionData = {
        completedServices: formData.completedServices.map((service) => ({
          ...service,
          serviceCost: parseFloat(service.serviceCost) || 0,
          serviceAmount: parseFloat(service.serviceAmount) || 0,
          partsRequired: service.partsRequired || false,
          laborDetails: {
            hoursWorked: parseFloat(service.laborDetails.hoursWorked) || 0,
            laborRate: parseFloat(service.laborDetails.laborRate) || 0,
            laborCost: parseFloat(service.laborDetails.laborCost) || 0,
          },
          partsUsed: service.partsUsed.map((part) => ({
            ...part,
            quantity: parseInt(part.quantity) || 0,
            unitPrice: parseFloat(part.unitPrice) || 0,
            totalPrice: parseFloat(part.totalPrice) || 0,
          })),
        })),
        additionalWork: formData.additionalWork.map((work) => ({
          ...work,
          cost: parseFloat(work.cost) || 0,
        })),
        totalCostBreakdown: {
          partsTotal: totals.partsTotal,
          laborTotal: totals.laborTotal,
          servicesTotal: totals.servicesTotal,
          additionalWorkTotal: totals.additionalWorkTotal,
          taxes: parseFloat(formData.totalCostBreakdown.taxes) || 0,
          discount: parseFloat(formData.totalCostBreakdown.discount) || 0,
          finalTotal: totals.finalTotal,
        },
        workStartTime: formData.workStartTime,
        workEndTime: formData.workEndTime,
        totalTimeSpent: formData.totalTimeSpent,
        vehicleCondition: formData.vehicleCondition,
        technician: formData.technician,
        qualityCheck: formData.qualityCheck,
        recommendations: formData.recommendations,
        customerNotification: formData.customerNotification,
      };

      console.log("Submitting service completion data:", submissionData);

      const response = await bookingAPI.submitServiceCompletionReport(
        booking._id,
        submissionData
      );

      if (response.success) {
        toast.success("Service completion report submitted successfully!");
        onComplete?.(response.data.booking);
        onClose();
      }
    } catch (error) {
      console.error("Error submitting completion report:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit completion report"
      );
    } finally {
      setLoading(false);
    }
  };

  // Add new part to service
  const addPartToService = (serviceIndex) => {
    const newPart = {
      partName: "",
      partNumber: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      condition: "NEW",
    };

    setFormData((prev) => ({
      ...prev,
      completedServices: prev.completedServices.map((service, index) =>
        index === serviceIndex
          ? { ...service, partsUsed: [...service.partsUsed, newPart] }
          : service
      ),
    }));
  };

  // Remove part from service
  const removePartFromService = (serviceIndex, partIndex) => {
    setFormData((prev) => ({
      ...prev,
      completedServices: prev.completedServices.map((service, index) =>
        index === serviceIndex
          ? {
              ...service,
              partsUsed: service.partsUsed.filter(
                (_, pIndex) => pIndex !== partIndex
              ),
            }
          : service
      ),
    }));
  };

  // Update part in service
  const updatePartInService = (serviceIndex, partIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      completedServices: prev.completedServices.map((service, sIndex) =>
        sIndex === serviceIndex
          ? {
              ...service,
              partsUsed: service.partsUsed.map((part, pIndex) => {
                if (pIndex === partIndex) {
                  const updatedPart = { ...part, [field]: value };
                  if (field === "quantity" || field === "unitPrice") {
                    updatedPart.totalPrice =
                      (parseFloat(updatedPart.quantity) || 0) *
                      (parseFloat(updatedPart.unitPrice) || 0);
                  }
                  return updatedPart;
                }
                return part;
              }),
            }
          : service
      ),
    }));
  };

  // Update service field
  const updateService = (serviceIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      completedServices: prev.completedServices.map((service, index) => {
        if (index === serviceIndex) {
          if (field.startsWith("laborDetails.")) {
            const laborField = field.split(".")[1];
            const updatedLaborDetails = {
              ...service.laborDetails,
              [laborField]: value,
            };

            // Auto-calculate labor cost
            if (laborField === "hoursWorked" || laborField === "laborRate") {
              updatedLaborDetails.laborCost =
                (parseFloat(updatedLaborDetails.hoursWorked) || 0) *
                (parseFloat(updatedLaborDetails.laborRate) || 0);
            }

            return { ...service, laborDetails: updatedLaborDetails };
          }
          return { ...service, [field]: value };
        }
        return service;
      }),
    }));
  };

  // Add additional work
  const addAdditionalWork = () => {
    const newWork = {
      workDescription: "",
      reason: "",
      cost: 0,
      customerApproved: false,
      approvalDate: "",
    };

    setFormData((prev) => ({
      ...prev,
      additionalWork: [...prev.additionalWork, newWork],
    }));
  };

  // Update additional work
  const updateAdditionalWork = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      additionalWork: prev.additionalWork.map((work, wIndex) =>
        wIndex === index ? { ...work, [field]: value } : work
      ),
    }));
  };

  // Remove additional work
  const removeAdditionalWork = (index) => {
    setFormData((prev) => ({
      ...prev,
      additionalWork: prev.additionalWork.filter(
        (_, wIndex) => wIndex !== index
      ),
    }));
  };

  // Render service details step
  const renderServiceDetailsStep = () => (
    <Box sx={{ py: 2 }}>
      <Stack spacing={4}>
        {formData.completedServices.map((service, serviceIndex) => (
          <Paper
            key={serviceIndex}
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "16px",
              backgroundColor: colors.white,
              border: `1px solid ${colors.primaryMedium}`,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: `0 8px 32px rgba(74, 98, 138, 0.1)`,
                transform: "translateY(-2px)",
              },
            }}
          >
            {/* Service Header */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  backgroundColor: colors.primaryLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                }}
              >
                <ServiceIcon sx={{ color: colors.primaryDark, fontSize: 24 }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: colors.textDark,
                    mb: 0.5,
                  }}
                >
                  {service.serviceName}
                </Typography>
                <Typography variant="body2" sx={{ color: colors.grayMedium }}>
                  Complete service details and documentation
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Service Description"
                  multiline
                  rows={3}
                  value={service.description}
                  onChange={(e) =>
                    updateService(serviceIndex, "description", e.target.value)
                  }
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: colors.grayLight,
                      borderRadius: "12px",
                      "& fieldset": {
                        borderColor: colors.primaryMedium,
                        borderWidth: "1px",
                      },
                      "&:hover fieldset": {
                        borderColor: colors.primaryBlue,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.primaryDark,
                        borderWidth: "2px",
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Service Cost"
                  type="number"
                  value={service.serviceCost}
                  onChange={(e) =>
                    updateService(serviceIndex, "serviceCost", e.target.value)
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoneyIcon sx={{ color: colors.grayMedium, mr: 0.5 }} />
                        LKR
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: colors.grayLight,
                      borderRadius: "12px",
                      "& fieldset": {
                        borderColor: colors.primaryMedium,
                      },
                      "&:hover fieldset": {
                        borderColor: colors.primaryBlue,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.primaryDark,
                        borderWidth: "2px",
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: colors.grayLight,
                      borderRadius: "12px",
                      "& fieldset": {
                        borderColor: colors.primaryMedium,
                      },
                      "&:hover fieldset": {
                        borderColor: colors.primaryBlue,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.primaryDark,
                        borderWidth: "2px",
                      },
                    },
                  }}
                >
                  <InputLabel>Service Status</InputLabel>
                  <Select
                    value={service.serviceStatus}
                    onChange={(e) =>
                      updateService(
                        serviceIndex,
                        "serviceStatus",
                        e.target.value
                      )
                    }
                    label="Service Status"
                  >
                    <MenuItem value="COMPLETED">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CheckIcon
                          sx={{ color: "#4caf50", mr: 1, fontSize: 20 }}
                        />
                        Completed
                      </Box>
                    </MenuItem>
                    <MenuItem value="PARTIALLY_COMPLETED">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <WarningIcon
                          sx={{ color: "#ff9800", mr: 1, fontSize: 20 }}
                        />
                        Partially Completed
                      </Box>
                    </MenuItem>
                    <MenuItem value="NOT_COMPLETED">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <InfoIcon
                          sx={{ color: "#2196f3", mr: 1, fontSize: 20 }}
                        />
                        Not Completed
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Service Notes & Observations"
                  multiline
                  rows={3}
                  value={service.notes}
                  onChange={(e) =>
                    updateService(serviceIndex, "notes", e.target.value)
                  }
                  placeholder="Add any specific notes, issues encountered, or recommendations..."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: colors.grayLight,
                      borderRadius: "12px",
                      "& fieldset": {
                        borderColor: colors.primaryMedium,
                      },
                      "&:hover fieldset": {
                        borderColor: colors.primaryBlue,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.primaryDark,
                        borderWidth: "2px",
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        ))}

        {/* Additional Work Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: "16px",
            backgroundColor: colors.white,
            border: `1px solid ${colors.primaryMedium}`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  backgroundColor: colors.primaryLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                }}
              >
                <AssignmentIcon
                  sx={{ color: colors.primaryDark, fontSize: 24 }}
                />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: colors.textDark, mb: 0.5 }}
                >
                  Additional Work Performed
                </Typography>
                <Typography variant="body2" sx={{ color: colors.grayMedium }}>
                  Document any extra work done beyond the original request
                </Typography>
              </Box>
            </Box>
            <Button
              startIcon={<AddIcon />}
              onClick={addAdditionalWork}
              variant="contained"
              size="medium"
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                backgroundColor: colors.primaryBlue,
                color: colors.white,
                fontWeight: 500,
                px: 3,
                py: 1.5,
                "&:hover": {
                  backgroundColor: colors.primaryDark,
                  transform: "translateY(-1px)",
                  boxShadow: `0 4px 16px rgba(74, 98, 138, 0.3)`,
                },
              }}
            >
              Add Work Item
            </Button>
          </Box>

          <Stack spacing={2}>
            {formData.additionalWork.map((work, index) => (
              <Card
                key={index}
                elevation={0}
                sx={{
                  borderRadius: "12px",
                  border: `1px solid ${colors.primaryMedium}`,
                  backgroundColor: colors.grayLight,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Work Description"
                        value={work.workDescription}
                        onChange={(e) =>
                          updateAdditionalWork(
                            index,
                            "workDescription",
                            e.target.value
                          )
                        }
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: colors.white,
                            borderRadius: "8px",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Reason for Additional Work"
                        value={work.reason}
                        onChange={(e) =>
                          updateAdditionalWork(index, "reason", e.target.value)
                        }
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: colors.white,
                            borderRadius: "8px",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Additional Cost"
                        type="number"
                        value={work.cost}
                        onChange={(e) =>
                          updateAdditionalWork(index, "cost", e.target.value)
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MoneyIcon
                                sx={{ color: colors.grayMedium, mr: 0.5 }}
                              />
                              LKR
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: colors.white,
                            borderRadius: "8px",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={work.customerApproved}
                              onChange={(e) =>
                                updateAdditionalWork(
                                  index,
                                  "customerApproved",
                                  e.target.checked
                                )
                              }
                              sx={{
                                color: colors.primaryBlue,
                                "&.Mui-checked": {
                                  color: colors.primaryDark,
                                },
                              }}
                            />
                          }
                          label="Customer Approved"
                          sx={{
                            "& .MuiFormControlLabel-label": {
                              color: colors.textDark,
                              fontWeight: 500,
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions sx={{ px: 3, pb: 3 }}>
                  <Button
                    startIcon={<DeleteIcon />}
                    onClick={() => removeAdditionalWork(index)}
                    color="error"
                    size="small"
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                    }}
                  >
                    Remove Item
                  </Button>
                </CardActions>
              </Card>
            ))}

            {formData.additionalWork.length === 0 && (
              <Alert
                severity="info"
                sx={{
                  borderRadius: "12px",
                  backgroundColor: `${colors.primaryLight}40`,
                  border: `1px solid ${colors.primaryMedium}`,
                  "& .MuiAlert-icon": {
                    color: colors.primaryDark,
                  },
                }}
              >
                No additional work items added. Click "Add Work Item" if extra
                work was performed beyond the original service request.
              </Alert>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );

  // COMPLETELY REDESIGNED Parts and Labor Step
  const renderPartsLaborStep = () => (
    <Box sx={{ py: 2 }}>
      <Alert 
        severity="info" 
        sx={{ 
          mb: 4, 
          borderRadius: "16px", 
          backgroundColor: "#e3f2fd", 
          border: "2px solid #1976d2",
          p: 3 
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#1976d2", mb: 1 }}>
          🔧 PARTS & LABOUR SECTION
        </Typography>
        <Typography variant="body1" sx={{ color: "#1976d2" }}>
          For each original service below, enter labour details and add any additional parts that were used during the service.
        </Typography>
      </Alert>

      <Stack spacing={6}>
        {formData.completedServices.map((service, serviceIndex) => (
          <Paper
            key={serviceIndex}
            elevation={4}
            sx={{
              borderRadius: "20px",
              overflow: "hidden",
              border: "3px solid #1976d2",
              border: `1px solid ${colors.primaryMedium}`,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: `0 8px 32px rgba(74, 98, 138, 0.1)`,
                transform: "translateY(-2px)",
              },
            }}
          >
            {/* Service Header */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  backgroundColor: colors.primaryLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                }}
              >
                <EngineeringIcon
                  sx={{ color: colors.primaryDark, fontSize: 24 }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: colors.textDark,
                    mb: 0.5,
                  }}
                >
                  {service.serviceName}
                </Typography>
                <Typography variant="body2" sx={{ color: colors.grayMedium }}>
                  Labor details and parts used for this service
                </Typography>
              </Box>
            </Box>

            {/* Labor Section - Enhanced */}
            <Box
              sx={{
                mb: 4,
                p: 4,
                borderRadius: "16px",
                backgroundColor: colors.grayLight,
                border: `2px solid ${colors.primaryBlue}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    backgroundColor: colors.primaryBlue,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 2,
                  }}
                >
                  <PersonIcon sx={{ color: colors.white, fontSize: 20 }} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: colors.textDark }}
                >
                  Labour Section
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Hours Worked"
                    type="number"
                    value={service.laborDetails.hoursWorked}
                    onChange={(e) =>
                      updateService(
                        serviceIndex,
                        "laborDetails.hoursWorked",
                        e.target.value
                      )
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TimeIcon
                            sx={{ color: colors.grayMedium, mr: 0.5 }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: colors.grayLight,
                        borderRadius: "12px",
                        "& fieldset": {
                          borderColor: colors.primaryMedium,
                        },
                        "&:hover fieldset": {
                          borderColor: colors.primaryBlue,
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: colors.primaryDark,
                          borderWidth: "2px",
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Labor Rate (per hour)"
                    type="number"
                    value={service.laborDetails.laborRate}
                    onChange={(e) =>
                      updateService(
                        serviceIndex,
                        "laborDetails.laborRate",
                        e.target.value
                      )
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MoneyIcon
                            sx={{ color: colors.grayMedium, mr: 0.5 }}
                          />
                          LKR
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: colors.grayLight,
                        borderRadius: "12px",
                        "& fieldset": {
                          borderColor: colors.primaryMedium,
                        },
                        "&:hover fieldset": {
                          borderColor: colors.primaryBlue,
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: colors.primaryDark,
                          borderWidth: "2px",
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Total Labor Cost"
                    type="number"
                    value={service.laborDetails.laborCost}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <MoneyIcon
                            sx={{ color: colors.grayMedium, mr: 0.5 }}
                          />
                          LKR
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: colors.primaryLight,
                        borderRadius: "12px",
                        "& fieldset": {
                          borderColor: colors.primaryMedium,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Service Amount"
                    type="number"
                    value={service.serviceAmount || 0}
                    onChange={(e) =>
                      updateService(
                        serviceIndex,
                        "serviceAmount",
                        e.target.value
                      )
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MoneyIcon
                            sx={{ color: colors.grayMedium, mr: 0.5 }}
                          />
                          LKR
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: colors.grayLight,
                        borderRadius: "12px",
                        "& fieldset": {
                          borderColor: colors.primaryMedium,
                        },
                        "&:hover fieldset": {
                          borderColor: colors.primaryBlue,
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: colors.primaryDark,
                          borderWidth: "2px",
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Parts Section - Enhanced */}
            <Box
              sx={{
                p: 4,
                borderRadius: "16px",
                backgroundColor: colors.grayLight,
                border: `2px solid ${colors.primaryDark}`,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      backgroundColor: colors.primaryDark,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    <ServiceIcon
                      sx={{ color: colors.white, fontSize: 20 }}
                    />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: colors.textDark }}
                  >
                    Parts Section
                  </Typography>
                </Box>
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: colors.white,
                    borderRadius: "12px",
                    border: `1px solid ${colors.primaryMedium}`,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={service.partsRequired}
                        onChange={(e) =>
                          updateService(
                            serviceIndex,
                            "partsRequired",
                            e.target.checked
                          )
                        }
                        sx={{
                          color: colors.primaryBlue,
                          "&.Mui-checked": {
                            color: colors.primaryDark,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography
                        variant="body1"
                        sx={{ color: colors.textDark, fontWeight: 600 }}
                      >
                        Additional Parts Added During Service
                      </Typography>
                    }
                  />
                </Paper>
              </Box>

              {service.partsRequired ? (
                <>
                  <Alert
                    severity="info"
                    sx={{
                      mb: 3,
                      borderRadius: "12px",
                      backgroundColor: `${colors.primaryLight}60`,
                      border: `1px solid ${colors.primaryMedium}`,
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Additional parts were used during this service. Add each part manually with its details and cost.
                    </Typography>
                  </Alert>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ color: colors.textDark, fontWeight: 600 }}
                    >
                      Add parts used during service (one by one)
                    </Typography>
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => addPartToService(serviceIndex)}
                      variant="contained"
                      size="medium"
                      sx={{
                        borderRadius: "12px",
                        textTransform: "none",
                        backgroundColor: colors.primaryDark,
                        color: colors.white,
                        fontWeight: 600,
                        px: 3,
                        py: 1.5,
                        "&:hover": {
                          backgroundColor: colors.primaryBlue,
                          transform: "translateY(-1px)",
                          boxShadow: `0 4px 16px ${colors.primaryDark}40`,
                        },
                      }}
                    >
                      Add New Part
                    </Button>
                  </Box>

                  {service.partsUsed && service.partsUsed.length > 0 ? (
                    <TableContainer
                      component={Paper}
                      elevation={0}
                      sx={{
                        borderRadius: "12px",
                        border: `1px solid ${colors.primaryMedium}`,
                        backgroundColor: colors.grayLight,
                      }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow
                            sx={{
                              backgroundColor: colors.primaryLight,
                              "& .MuiTableCell-head": {
                                fontWeight: 600,
                                color: colors.textDark,
                                borderBottom: `1px solid ${colors.primaryMedium}`,
                              },
                            }}
                          >
                            <TableCell>Part Name</TableCell>
                            <TableCell>Part Number</TableCell>
                            <TableCell align="center">Qty</TableCell>
                            <TableCell align="right">Unit Price</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell align="center">Condition</TableCell>
                            <TableCell align="center">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {service.partsUsed.map((part, partIndex) => (
                            <TableRow
                              key={partIndex}
                              sx={{
                                "&:hover": {
                                  backgroundColor: colors.white,
                                },
                                "& .MuiTableCell-root": {
                                  borderBottom: `1px solid ${colors.primaryMedium}`,
                                  py: 2,
                                },
                              }}
                            >
                              <TableCell>
                                <TextField
                                  size="small"
                                  value={part.partName}
                                  onChange={(e) =>
                                    updatePartInService(
                                      serviceIndex,
                                      partIndex,
                                      "partName",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter part name"
                                  sx={{
                                    minWidth: 120,
                                    "& .MuiOutlinedInput-root": {
                                      backgroundColor: colors.white,
                                      borderRadius: "8px",
                                    },
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  value={part.partNumber}
                                  onChange={(e) =>
                                    updatePartInService(
                                      serviceIndex,
                                      partIndex,
                                      "partNumber",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Part #"
                                  sx={{
                                    minWidth: 100,
                                    "& .MuiOutlinedInput-root": {
                                      backgroundColor: colors.white,
                                      borderRadius: "8px",
                                    },
                                  }}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <TextField
                                  size="small"
                                  type="number"
                                  value={part.quantity}
                                  onChange={(e) =>
                                    updatePartInService(
                                      serviceIndex,
                                      partIndex,
                                      "quantity",
                                      e.target.value
                                    )
                                  }
                                  sx={{
                                    width: 70,
                                    "& .MuiOutlinedInput-root": {
                                      backgroundColor: colors.white,
                                      borderRadius: "8px",
                                    },
                                  }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <TextField
                                  size="small"
                                  type="number"
                                  value={part.unitPrice}
                                  onChange={(e) =>
                                    updatePartInService(
                                      serviceIndex,
                                      partIndex,
                                      "unitPrice",
                                      e.target.value
                                    )
                                  }
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        LKR
                                      </InputAdornment>
                                    ),
                                  }}
                                  sx={{
                                    minWidth: 100,
                                    "& .MuiOutlinedInput-root": {
                                      backgroundColor: colors.white,
                                      borderRadius: "8px",
                                    },
                                  }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Box
                                  sx={{
                                    minWidth: 100,
                                    textAlign: "right",
                                    fontWeight: 600,
                                    color: colors.primaryDark,
                                  }}
                                >
                                  LKR{" "}
                                  {parseFloat(
                                    part.totalPrice || 0
                                  ).toLocaleString()}
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Select
                                  size="small"
                                  value={part.condition}
                                  onChange={(e) =>
                                    updatePartInService(
                                      serviceIndex,
                                      partIndex,
                                      "condition",
                                      e.target.value
                                    )
                                  }
                                  sx={{
                                    minWidth: 80,
                                    "& .MuiOutlinedInput-root": {
                                      backgroundColor: colors.white,
                                      borderRadius: "8px",
                                    },
                                  }}
                                >
                                  <MenuItem value="NEW">New</MenuItem>
                                  <MenuItem value="REFURBISHED">
                                    Refurbished
                                  </MenuItem>
                                  <MenuItem value="USED">Used</MenuItem>
                                </Select>
                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() =>
                                    removePartFromService(
                                      serviceIndex,
                                      partIndex
                                    )
                                  }
                                  sx={{
                                    "&:hover": {
                                      backgroundColor: "#ffebee",
                                    },
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Alert
                      severity="info"
                      sx={{
                        borderRadius: "12px",
                        backgroundColor: `${colors.primaryLight}40`,
                        border: `1px solid ${colors.primaryMedium}`,
                        "& .MuiAlert-icon": {
                          color: colors.primaryDark,
                        },
                      }}
                    >
                      Click "Add Part" to start adding parts for this service.
                    </Alert>
                  )}
                </>
              ) : (
                <Alert
                  severity="warning"
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: `${colors.grayLight}80`,
                    border: `1px solid ${colors.primaryMedium}`,
                    "& .MuiAlert-icon": {
                      color: colors.primaryDark,
                    },
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    If additional parts were used during this service, please check "Additional Parts Added During Service" above and add them manually.
                  </Typography>
                </Alert>
              )}
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  );

  // Render cost summary
  const renderCostSummary = () => {
    const totals = calculateTotals();

    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: "16px",
          backgroundColor: colors.white,
          border: `1px solid ${colors.primaryMedium}`,
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: 600, color: colors.textDark }}
        >
          Cost Summary
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Taxes"
              type="number"
              value={formData.totalCostBreakdown.taxes}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  totalCostBreakdown: {
                    ...prev.totalCostBreakdown,
                    taxes: e.target.value,
                  },
                }))
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MoneyIcon sx={{ color: colors.grayMedium, mr: 0.5 }} />
                    LKR
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: colors.grayLight,
                  borderRadius: "12px",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Discount"
              type="number"
              value={formData.totalCostBreakdown.discount}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  totalCostBreakdown: {
                    ...prev.totalCostBreakdown,
                    discount: e.target.value,
                  },
                }))
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MoneyIcon sx={{ color: colors.grayMedium, mr: 0.5 }} />
                    LKR
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: colors.grayLight,
                  borderRadius: "12px",
                },
              }}
            />
          </Grid>
        </Grid>

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: "12px",
            border: `1px solid ${colors.primaryMedium}`,
          }}
        >
          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 500 }}>Parts Total:</TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 600, color: colors.primaryDark }}
                >
                  LKR {totals.partsTotal.toLocaleString()}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 500 }}>Labor Total:</TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 600, color: colors.primaryDark }}
                >
                  LKR {totals.laborTotal.toLocaleString()}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 500 }}>Services Total:</TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 600, color: colors.primaryDark }}
                >
                  LKR {totals.servicesTotal.toLocaleString()}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 500 }}>
                  Additional Work Total:
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 600, color: colors.primaryDark }}
                >
                  LKR {totals.additionalWorkTotal.toLocaleString()}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 500 }}>Taxes:</TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 600, color: colors.primaryDark }}
                >
                  LKR{" "}
                  {(
                    parseFloat(formData.totalCostBreakdown.taxes) || 0
                  ).toLocaleString()}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 500 }}>Discount:</TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 600, color: "#f44336" }}
                >
                  - LKR{" "}
                  {(
                    parseFloat(formData.totalCostBreakdown.discount) || 0
                  ).toLocaleString()}
                </TableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: colors.primaryLight }}>
                <TableCell sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                  Final Total:
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: colors.primaryDark,
                  }}
                >
                  LKR {totals.finalTotal.toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  };

  // Render comprehensive final review - Enhanced with original booking services
  const renderFinalReview = () => {
    const totals = calculateTotals();

    // Calculate original booking services cost (estimated)
    const originalServicesTotal = booking?.services?.length * 5000 || 0; // Assuming base cost per service

    return (
      <Box sx={{ py: 2 }}>
        <Alert
          severity="info"
          sx={{
            mb: 4,
            borderRadius: "12px",
            backgroundColor: `${colors.primaryLight}40`,
            border: `1px solid ${colors.primaryMedium}`,
            "& .MuiAlert-icon": {
              color: colors.primaryDark,
            },
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Final Review - Service Completion Report
          </Typography>
          Please review all information carefully before submitting. This report
          will be sent to the customer and stored permanently.
        </Alert>

        {/* Original Booking Services Summary */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: "16px",
            backgroundColor: colors.white,
            border: `1px solid ${colors.primaryMedium}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <AssignmentIcon sx={{ color: colors.primaryBlue, mr: 2 }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: colors.textDark }}
            >
              Original Booking Services
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Requested Services:</strong>
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {booking?.services?.map((service, index) => (
                  <Chip
                    key={index}
                    label={service}
                    color="primary"
                    variant="outlined"
                    sx={{
                      backgroundColor: `${colors.primaryLight}60`,
                      fontWeight: 500,
                    }}
                  />
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: "right" }}>
              <Typography
                variant="body1"
                sx={{ color: colors.grayMedium, mb: 1 }}
              >
                Booking Date: {booking?.preferredDate ? formatDate(booking.preferredDate) : 'N/A'}
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: colors.grayMedium }}
              >
                Time Slot: {booking?.preferredTimeSlot || 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Stack spacing={4}>
          {/* Service Details Summary */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "16px",
              backgroundColor: colors.white,
              border: `1px solid ${colors.primaryMedium}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <ServiceIcon sx={{ color: colors.primaryBlue, mr: 2 }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: colors.textDark }}
              >
                Services Completed
              </Typography>
            </Box>

            {formData.completedServices.map((service, index) => (
              <Box
                key={index}
                sx={{
                  mb: 3,
                  pb: 3,
                  borderBottom:
                    index < formData.completedServices.length - 1
                      ? `1px solid ${colors.primaryMedium}`
                      : "none",
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: colors.textDark }}
                    >
                      {service.serviceName}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: colors.grayMedium, mb: 1 }}
                    >
                      Status:{" "}
                      <Chip
                        size="small"
                        label={service.serviceStatus.replace("_", " ")}
                        color={
                          service.serviceStatus === "COMPLETED"
                            ? "success"
                            : "warning"
                        }
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: colors.grayMedium }}
                    >
                      Description:{" "}
                      {service.description || "No description provided"}
                    </Typography>
                    {service.notes && (
                      <Typography
                        variant="body2"
                        sx={{ color: colors.grayMedium, mt: 1 }}
                      >
                        Notes: {service.notes}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="body2"
                      sx={{ color: colors.grayMedium }}
                    >
                      <strong>Labor:</strong> {service.laborDetails.hoursWorked}
                      h × LKR {service.laborDetails.laborRate} = LKR{" "}
                      {service.laborDetails.laborCost}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: colors.grayMedium }}
                    >
                      <strong>Service Cost:</strong> LKR{" "}
                      {parseFloat(service.serviceCost || 0).toLocaleString()}
                      <br />
                      <strong>Service Amount:</strong> LKR{" "}
                      {parseFloat(service.serviceAmount || 0).toLocaleString()}
                      <br />
                      <strong>Total Service Cost:</strong> LKR{" "}
                      {(
                        parseFloat(service.serviceCost || 0) +
                        parseFloat(service.serviceAmount || 0)
                      ).toLocaleString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: colors.grayMedium, mt: 1 }}
                    >
                      <strong>Parts Required:</strong>{" "}
                      {service.partsRequired ? "Yes" : "No"}
                    </Typography>
                    {service.partsRequired &&
                      service.partsUsed &&
                      service.partsUsed.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: colors.textDark,
                              mb: 1,
                            }}
                          >
                            Parts Used ({service.partsUsed.length} items):
                          </Typography>
                          {service.partsUsed.map((part, partIndex) => (
                            <Typography
                              key={partIndex}
                              variant="body2"
                              sx={{ color: colors.grayMedium, ml: 1 }}
                            >
                              • {part.partName} ({part.condition}) - Qty:{" "}
                              {part.quantity} × LKR {part.unitPrice} = LKR{" "}
                              {part.totalPrice}
                              {part.partNumber && ` [${part.partNumber}]`}
                            </Typography>
                          ))}
                        </Box>
                      )}
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Paper>

          {/* Additional Work Summary */}
          {formData.additionalWork.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "16px",
                backgroundColor: colors.white,
                border: `1px solid ${colors.primaryMedium}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <AssignmentIcon sx={{ color: colors.primaryBlue, mr: 2 }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: colors.textDark }}
                >
                  Additional Work Performed
                </Typography>
              </Box>

              {formData.additionalWork.map((work, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 2,
                    p: 2,
                    backgroundColor: colors.grayLight,
                    borderRadius: "8px",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, color: colors.textDark }}
                      >
                        {work.workDescription}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: colors.grayMedium }}
                      >
                        Reason: {work.reason}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ textAlign: "right" }}>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, color: colors.primaryDark }}
                      >
                        LKR {parseFloat(work.cost || 0).toLocaleString()}
                      </Typography>
                      <Chip
                        size="small"
                        label={
                          work.customerApproved
                            ? "Customer Approved"
                            : "Pending Approval"
                        }
                        color={work.customerApproved ? "success" : "warning"}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Paper>
          )}

          {/* Work Timeline & Technician */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "16px",
              backgroundColor: colors.white,
              border: `1px solid ${colors.primaryMedium}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <TimeIcon sx={{ color: colors.primaryBlue, mr: 2 }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: colors.textDark }}
              >
                Work Timeline & Technician
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="body2"
                  sx={{ color: colors.grayMedium, mb: 1 }}
                >
                  <strong>Start Time:</strong>{" "}
                  {formData.workStartTime
                    ? new Date(formData.workStartTime).toLocaleString()
                    : "Not specified"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: colors.grayMedium, mb: 1 }}
                >
                  <strong>End Time:</strong>{" "}
                  {formData.workEndTime
                    ? new Date(formData.workEndTime).toLocaleString()
                    : "Not specified"}
                </Typography>
                <Typography variant="body2" sx={{ color: colors.grayMedium }}>
                  <strong>Total Time:</strong>{" "}
                  {formData.totalTimeSpent || "Not specified"}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="body2"
                  sx={{ color: colors.grayMedium, mb: 1 }}
                >
                  <strong>Technician:</strong> {formData.technician.name}
                </Typography>
                {formData.technician.employeeId && (
                  <Typography
                    variant="body2"
                    sx={{ color: colors.grayMedium, mb: 1 }}
                  >
                    <strong>Employee ID:</strong>{" "}
                    {formData.technician.employeeId}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ color: colors.grayMedium }}>
                  <strong>Quality Check:</strong>{" "}
                  {formData.qualityCheck.performed
                    ? "Performed"
                    : "Not performed"}
                </Typography>
                {formData.qualityCheck.performed &&
                  formData.qualityCheck.notes && (
                    <Typography
                      variant="body2"
                      sx={{ color: colors.grayMedium, mt: 1 }}
                    >
                      <strong>QC Notes:</strong> {formData.qualityCheck.notes}
                    </Typography>
                  )}
              </Grid>
            </Grid>
          </Paper>

          {/* Enhanced Cost Summary with Original Booking Services */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "16px",
              backgroundColor: colors.white,
              border: `1px solid ${colors.primaryMedium}`,
              boxShadow: `0 4px 16px ${colors.primaryBlue}20`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <ReceiptIcon sx={{ color: colors.primaryBlue, mr: 2 }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: colors.textDark }}
              >
                Complete Cost Breakdown
              </Typography>
            </Box>

            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: "12px",
                border: `1px solid ${colors.primaryMedium}`,
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: colors.primaryLight }}>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: colors.textDark,
                        fontSize: "1.1rem",
                      }}
                    >
                      Cost Category
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 700,
                        color: colors.textDark,
                        fontSize: "1.1rem",
                      }}
                    >
                      Amount (LKR)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow sx={{ backgroundColor: `${colors.primaryLight}30` }}>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "1rem",
                        borderBottom: `1px solid ${colors.primaryMedium}`,
                      }}
                    >
                      Original Booking Services ({booking?.services?.length || 0} services)
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 600,
                        color: colors.primaryDark,
                        fontSize: "1rem",
                        borderBottom: `1px solid ${colors.primaryMedium}`,
                      }}
                    >
                      LKR {totals.servicesTotal.toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        borderBottom: `1px solid ${colors.primaryMedium}`,
                        pl: 4,
                      }}
                    >
                      • Labour Total:
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 600,
                        color: colors.primaryDark,
                        borderBottom: `1px solid ${colors.primaryMedium}`,
                      }}
                    >
                      LKR {totals.laborTotal.toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        borderBottom: `1px solid ${colors.primaryMedium}`,
                        pl: 4,
                      }}
                    >
                      • Additional Parts Total:
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 600,
                        color: colors.primaryDark,
                        borderBottom: `1px solid ${colors.primaryMedium}`,
                      }}
                    >
                      LKR {totals.partsTotal.toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        borderBottom: `1px solid ${colors.primaryMedium}`,
                      }}
                    >
                      Additional Work Total:
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 600,
                        color: colors.primaryDark,
                        borderBottom: `1px solid ${colors.primaryMedium}`,
                      }}
                    >
                      LKR {totals.additionalWorkTotal.toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        borderBottom: `1px solid ${colors.primaryMedium}`,
                      }}
                    >
                      Taxes:
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 600,
                        color: colors.primaryDark,
                        borderBottom: `1px solid ${colors.primaryMedium}`,
                      }}
                    >
                      LKR {
                        (
                          parseFloat(formData.totalCostBreakdown.taxes) || 0
                        ).toLocaleString()
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        borderBottom: `1px solid ${colors.primaryMedium}`,
                      }}
                    >
                      Discount:
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 600,
                        color: "#f44336",
                        borderBottom: `1px solid ${colors.primaryMedium}`,
                      }}
                    >
                      - LKR {
                        (
                          parseFloat(formData.totalCostBreakdown.discount) || 0
                        ).toLocaleString()
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ backgroundColor: colors.primaryDark }}>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.3rem",
                        color: colors.white,
                        border: "none",
                      }}
                    >
                      GRAND TOTAL:
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.3rem",
                        color: colors.white,
                        border: "none",
                      }}
                    >
                      LKR {totals.finalTotal.toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Alert
              severity="success"
              sx={{
                mt: 3,
                borderRadius: "12px",
                backgroundColor: "#e8f5e8",
                border: "1px solid #4caf50",
              }}
            >
              <Typography variant="body2">
                This service completion report will be permanently stored and
                sent to the customer upon submission.
              </Typography>
            </Alert>
          </Paper>
        </Stack>
      </Box>
    );
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderServiceDetailsStep();
      case 1:
        return (
          <Box sx={{ py: 2 }}>
            <Stack spacing={4}>
              {renderPartsLaborStep()}
              {renderCostSummary()}
            </Stack>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ py: 2 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "16px",
                backgroundColor: colors.white,
                border: `1px solid ${colors.primaryMedium}`,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 600, color: colors.textDark }}
              >
                Vehicle Condition & Work Timeline
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Work Start Time"
                    type="datetime-local"
                    value={formData.workStartTime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        workStartTime: e.target.value,
                      }))
                    }
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: colors.grayLight,
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Work End Time"
                    type="datetime-local"
                    value={formData.workEndTime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        workEndTime: e.target.value,
                      }))
                    }
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: colors.grayLight,
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Total Time Spent"
                    value={formData.totalTimeSpent}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        totalTimeSpent: e.target.value,
                      }))
                    }
                    placeholder="e.g., 3 hours 45 minutes"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: colors.grayLight,
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ py: 2 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "16px",
                backgroundColor: colors.white,
                border: `1px solid ${colors.primaryMedium}`,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 600, color: colors.textDark }}
              >
                Technician & Quality Assurance
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Technician Name"
                    value={formData.technician.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        technician: {
                          ...prev.technician,
                          name: e.target.value,
                        },
                      }))
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: colors.grayLight,
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Employee ID"
                    value={formData.technician.employeeId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        technician: {
                          ...prev.technician,
                          employeeId: e.target.value,
                        },
                      }))
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: colors.grayLight,
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.qualityCheck.performed}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            qualityCheck: {
                              ...prev.qualityCheck,
                              performed: e.target.checked,
                            },
                          }))
                        }
                        sx={{
                          color: colors.primaryBlue,
                          "&.Mui-checked": {
                            color: colors.primaryDark,
                          },
                        }}
                      />
                    }
                    label="Quality Check Performed"
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        color: colors.textDark,
                        fontWeight: 500,
                      },
                    }}
                  />
                </Grid>
                {formData.qualityCheck.performed && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Quality Check Notes"
                      multiline
                      rows={3}
                      value={formData.qualityCheck.notes}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          qualityCheck: {
                            ...prev.qualityCheck,
                            notes: e.target.value,
                          },
                        }))
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: colors.grayLight,
                          borderRadius: "12px",
                        },
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Box>
        );
      case 4:
        return renderFinalReview();
      default:
        return "Unknown step";
    }
  };

  if (!booking) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          backgroundColor: colors.grayLight,
          boxShadow: "0 24px 64px rgba(74, 98, 138, 0.15)",
          overflow: "hidden",
        },
      }}
    >
      {/* Professional Header */}
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${colors.primaryBlue} 0%, ${colors.primaryDark} 100%)`,
          color: colors.white,
          p: 3,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            width: "200px",
            height: "200px",
            background: `radial-gradient(circle, ${colors.primaryLight}20 0%, transparent 70%)`,
            transform: "translate(50px, -50px)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "16px",
              backgroundColor: `${colors.white}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
              backdropFilter: "blur(10px)",
            }}
          >
            <ServiceIcon sx={{ fontSize: 28, color: colors.white }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 0.5,
                letterSpacing: "-0.5px",
              }}
            >
              Service Completion Report
            </Typography>
            <Typography
              variant="body1"
              sx={{
                opacity: 0.9,
                fontWeight: 400,
              }}
            >
              Booking ID: {booking.bookingId} •{" "}
              {booking.vehicle?.registrationNumber}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          backgroundColor: colors.grayLight,
        }}
      >
        {/* Professional Stepper */}
        <Box sx={{ px: 4, pt: 4, pb: 2 }}>
          <Stepper
            activeStep={activeStep}
            sx={{
              "& .MuiStepLabel-root": {
                cursor: "pointer",
              },
              "& .MuiStepIcon-root": {
                width: 40,
                height: 40,
                borderRadius: "12px",
                color: colors.primaryMedium,
                "&.Mui-active": {
                  color: colors.primaryBlue,
                },
                "&.Mui-completed": {
                  color: colors.primaryDark,
                },
              },
              "& .MuiStepLabel-label": {
                fontSize: "0.875rem",
                fontWeight: 500,
                color: colors.grayMedium,
                "&.Mui-active": {
                  color: colors.textDark,
                  fontWeight: 600,
                },
                "&.Mui-completed": {
                  color: colors.primaryDark,
                  fontWeight: 500,
                },
              },
              "& .MuiStepConnector-line": {
                borderColor: colors.primaryMedium,
                borderWidth: 2,
              },
              "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
                borderColor: colors.primaryBlue,
              },
              "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
                borderColor: colors.primaryDark,
              },
            }}
          >
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  StepIconComponent={() => (
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor:
                          index === activeStep
                            ? colors.primaryBlue
                            : index < activeStep
                            ? colors.primaryDark
                            : colors.primaryMedium,
                        color: colors.white,
                        transition: "all 0.3s ease",
                        boxShadow:
                          index === activeStep
                            ? `0 4px 12px ${colors.primaryBlue}40`
                            : "none",
                      }}
                    >
                      {React.cloneElement(step.icon, { sx: { fontSize: 20 } })}
                    </Box>
                  )}
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Content Area */}
        <Box sx={{ px: 4, pb: 2, minHeight: "500px" }}>
          <Fade in={true} timeout={300}>
            <div>{getStepContent(activeStep)}</div>
          </Fade>
        </Box>
      </DialogContent>

      {/* Professional Footer */}
      <DialogActions
        sx={{
          p: 3,
          backgroundColor: colors.white,
          borderTop: `1px solid ${colors.primaryMedium}`,
          gap: 2,
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 500,
            px: 3,
            py: 1.5,
            color: colors.grayDark,
            border: `1px solid ${colors.primaryMedium}`,
            "&:hover": {
              backgroundColor: colors.grayLight,
              borderColor: colors.primaryBlue,
            },
          }}
        >
          Cancel
        </Button>

        {activeStep > 0 && (
          <Button
            onClick={handleBack}
            disabled={loading}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 500,
              px: 3,
              py: 1.5,
              color: colors.primaryDark,
              border: `1px solid ${colors.primaryDark}`,
              "&:hover": {
                backgroundColor: `${colors.primaryDark}10`,
              },
            }}
          >
            Back
          </Button>
        )}

        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={loading}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              px: 4,
              py: 1.5,
              backgroundColor: colors.primaryBlue,
              color: colors.white,
              boxShadow: `0 4px 16px ${colors.primaryBlue}40`,
              "&:hover": {
                backgroundColor: colors.primaryDark,
                transform: "translateY(-1px)",
                boxShadow: `0 6px 24px ${colors.primaryDark}40`,
              },
            }}
          >
            Continue
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              px: 4,
              py: 1.5,
              backgroundColor: colors.primaryDark,
              color: colors.white,
              boxShadow: `0 4px 16px ${colors.primaryDark}40`,
              "&:hover": {
                backgroundColor: colors.primaryDark,
                transform: "translateY(-1px)",
                boxShadow: `0 6px 24px ${colors.primaryDark}50`,
              },
              "&:disabled": {
                backgroundColor: colors.grayMedium,
                color: colors.white,
                transform: "none",
                boxShadow: "none",
              },
            }}
          >
            {loading ? "Submitting Report..." : "Submit Report"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ServiceCompletionForm;
