// src/components/ServiceProvider/ServiceCompletionForm.jsx
import React, { useState, useContext, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormControlLabel,
  Alert,
  Divider,
  InputAdornment,
  IconButton,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Build as ServiceIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { UserContext } from "../../contexts/UserContext";
import bookingAPI from "../../services/bookingApiService";

const ServiceCompletionForm = ({ open, onClose, booking, onSuccess }) => {
  const { userContext } = useContext(UserContext);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Define color scheme - Using project's color palette
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

  const [formData, setFormData] = useState({
    completedServices: [],
    additionalWork: [],
    additionalWorkRequired: false,
    totalCostBreakdown: {
      partsTotal: 0,
      laborTotal: 0,
      servicesTotal: 0,
      additionalWorkTotal: 0,
      tax: 0,
      taxRate: 15,
      discount: 0,
      finalTotal: 0,
    },
    workStartTime: new Date().toISOString().slice(0, 16),
    workEndTime: new Date().toISOString().slice(0, 16),
    vehicleCondition: {
      before: {
        mileage: "",
        fuelLevel: "FULL",
        externalCondition: "",
        internalCondition: "",
      },
      after: {
        mileage: "",
        fuelLevel: "FULL",
        externalCondition: "",
        internalCondition: "",
      },
    },
    technician: {
      name: userContext?.user?.firstName + " " + userContext?.user?.lastName || "",
      employeeId: userContext?.user?._id || "",
    },
    qualityCheck: {
      performed: false,
      performedBy: "",
      overallRating: "GOOD",
      notes: "",
    },
    recommendations: [],
    customerNotification: {
      notified: false,
      notificationMethod: "PHONE",
    },
  });

  // Initialize completed services when booking changes
  useEffect(() => {
    if (booking && booking.services) {
      const initialServices = booking.services.map((service) => ({
        serviceName: service,
        description: "",
        partsUsed: [],
        partsRequired: false,
        laborDetails: {
          hoursWorked: 0,
          laborRate: 2000, // Default rate per hour
          laborCost: 0,
        },
        serviceCost: 0,
        serviceAmount: 5000, // Default service amount
        serviceStatus: "COMPLETED",
        notes: "",
      }));

      setFormData((prev) => ({
        ...prev,
        completedServices: initialServices,
      }));
    }
  }, [booking]);

  // Calculate totals
  const calculateTotals = () => {
    let laborTotal = 0;
    let partsTotal = 0;
    let servicesTotal = 0;

    formData.completedServices.forEach((service) => {
      laborTotal += service.laborDetails.laborCost || 0;
      partsTotal += 
        service.partsUsed?.reduce((sum, part) => sum + (part.totalPrice || 0), 0) || 0;
      servicesTotal += (service.serviceCost || 0) + (service.serviceAmount || 0);
    });

    const additionalWorkTotal = formData.additionalWork.reduce(
      (sum, work) => sum + (parseFloat(work.cost) || 0), 0
    );

    const subtotal = laborTotal + partsTotal + servicesTotal + additionalWorkTotal;
    const taxAmount = (subtotal * formData.totalCostBreakdown.taxRate) / 100;
    const discountAmount = parseFloat(formData.totalCostBreakdown.discount) || 0;
    const finalTotal = subtotal + taxAmount - discountAmount;

    return {
      laborTotal,
      partsTotal,
      servicesTotal,
      additionalWorkTotal,
      subtotal,
      taxAmount,
      finalTotal,
    };
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const totals = calculateTotals();

      const submissionData = {
        bookingId: booking._id,
        vehicle: {
          registrationNumber: booking.vehicle.registrationNumber,
          make: booking.vehicle.make,
          model: booking.vehicle.model,
          year: booking.vehicle.year,
        },
        completedServices: formData.completedServices,
        additionalWork: formData.additionalWork,
        totalCostBreakdown: {
          ...formData.totalCostBreakdown,
          ...totals,
        },
        workStartTime: new Date(formData.workStartTime),
        workEndTime: new Date(formData.workEndTime),
        vehicleCondition: formData.vehicleCondition,
        technician: formData.technician,
        qualityCheck: formData.qualityCheck,
        recommendations: formData.recommendations,
        customerNotification: formData.customerNotification,
      };

      const response = await bookingAPI.completeService(submissionData);

      if (response.success) {
        toast.success("Service completion report submitted successfully!");
        onSuccess();
        onClose();
      } else {
        toast.error(response.message || "Failed to submit service report");
      }
    } catch (error) {
      console.error("Error submitting service completion:", error);
      toast.error("An error occurred while submitting the report");
    } finally {
      setLoading(false);
    }
  };

  // Update service field
  const updateService = (serviceIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      completedServices: prev.completedServices.map((service, index) => {
        if (index === serviceIndex) {
          if (field.includes("laborDetails.")) {
            const laborField = field.split(".")[1];
            const updatedLaborDetails = {
              ...service.laborDetails,
              [laborField]: value,
            };

            // Auto-calculate labor cost
            if (laborField === "hoursWorked" || laborField === "laborRate") {
              updatedLaborDetails.laborCost =
                (updatedLaborDetails.hoursWorked || 0) *
                (updatedLaborDetails.laborRate || 0);
            }

            return { ...service, laborDetails: updatedLaborDetails };
          }
          return { ...service, [field]: value };
        }
        return service;
      }),
    }));
  };

  // Add part to service
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
          ? {
              ...service,
              partsUsed: [...(service.partsUsed || []), newPart],
            }
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
              partsUsed: service.partsUsed.filter((_, pIndex) => pIndex !== partIndex),
            }
          : service
      ),
    }));
  };

  // Update part in service
  const updatePartInService = (serviceIndex, partIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      completedServices: prev.completedServices.map((service, index) => {
        if (index === serviceIndex) {
          const updatedPartsUsed = service.partsUsed.map((part, pIndex) => {
            if (pIndex === partIndex) {
              const updatedPart = { ...part, [field]: value };
              
              // Auto-calculate total price
              if (field === "quantity" || field === "unitPrice") {
                updatedPart.totalPrice = (updatedPart.quantity || 0) * (updatedPart.unitPrice || 0);
              }
              
              return updatedPart;
            }
            return part;
          });
          
          return { ...service, partsUsed: updatedPartsUsed };
        }
        return service;
      }),
    }));
  };

  // Add additional work
  const addAdditionalWork = () => {
    const newWork = {
      description: "",
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
      additionalWork: prev.additionalWork.map((work, i) =>
        i === index ? { ...work, [field]: value } : work
      ),
    }));
  };

  // Remove additional work
  const removeAdditionalWork = (index) => {
    setFormData((prev) => ({
      ...prev,
      additionalWork: prev.additionalWork.filter((_, i) => i !== index),
    }));
  };

  // Render service details step
  const renderServiceDetails = () => (
    <Box sx={{ py: 4 }}>
      {/* Page Title */}
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 6, 
          fontWeight: 600, 
          color: colors.textDark,
          textAlign: 'center',
          letterSpacing: '0.5px'
        }}
      >
        Vehicle & Service Information
      </Typography>
      
      {/* Vehicle & Service Overview */}
      <Paper 
        elevation={1} 
        sx={{ 
          p: 6, 
          mb: 6, 
          borderRadius: 3,
          border: `1px solid ${colors.primaryMedium}`,
          backgroundColor: colors.white,
        }}
      >
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 4, 
                fontWeight: 600, 
                color: colors.primaryDark,
                fontSize: '1.25rem'
              }}
            >
              Vehicle Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography sx={{ fontWeight: 500, color: colors.grayMedium }}>Registration:</Typography>
                <Typography sx={{ fontWeight: 600, color: colors.textDark }}>
                  {booking?.vehicle?.registrationNumber}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography sx={{ fontWeight: 500, color: colors.grayMedium }}>Make:</Typography>
                <Typography sx={{ fontWeight: 600, color: colors.textDark }}>
                  {booking?.vehicle?.make}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography sx={{ fontWeight: 500, color: colors.grayMedium }}>Model:</Typography>
                <Typography sx={{ fontWeight: 600, color: colors.textDark }}>
                  {booking?.vehicle?.model}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography sx={{ fontWeight: 500, color: colors.grayMedium }}>Year:</Typography>
                <Typography sx={{ fontWeight: 600, color: colors.textDark }}>
                  {booking?.vehicle?.year}
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 4, 
                fontWeight: 600, 
                color: colors.primaryDark,
                fontSize: '1.25rem'
              }}
            >
              Original Services Requested
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {booking?.services?.map((service, index) => (
                <Chip 
                  key={index} 
                  label={service} 
                  sx={{ 
                    backgroundColor: colors.primaryLight,
                    color: colors.primaryDark,
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    height: 36,
                    border: `1px solid ${colors.primaryMedium}`
                  }}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Work Start Time"
              type="datetime-local"
              value={formData.workStartTime}
              onChange={(e) => setFormData(prev => ({ ...prev, workStartTime: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: colors.grayLight,
                  '& fieldset': {
                    borderColor: colors.primaryMedium,
                  },
                  '&:hover fieldset': {
                    borderColor: colors.primaryBlue,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.primaryDark,
                  },
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
              onChange={(e) => setFormData(prev => ({ ...prev, workEndTime: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: colors.grayLight,
                  '& fieldset': {
                    borderColor: colors.primaryMedium,
                  },
                  '&:hover fieldset': {
                    borderColor: colors.primaryBlue,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.primaryDark,
                  },
                },
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Vehicle Condition Documentation */}
      <Paper 
        elevation={1} 
        sx={{ 
          p: 6, 
          borderRadius: 3,
          border: `1px solid ${colors.primaryMedium}`,
          backgroundColor: colors.white,
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 6, 
            fontWeight: 600, 
            color: colors.primaryDark,
            fontSize: '1.25rem',
            textAlign: 'center'
          }}
        >
          Vehicle Condition Documentation
        </Typography>
        
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 4, 
                fontWeight: 600, 
                color: colors.textDark,
                fontSize: '1.1rem',
                textAlign: 'center'
              }}
            >
              Before Service
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Mileage (km)"
                type="number"
                value={formData.vehicleCondition.before.mileage}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  vehicleCondition: {
                    ...prev.vehicleCondition,
                    before: { ...prev.vehicleCondition.before, mileage: e.target.value }
                  }
                }))}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: colors.grayLight,
                  },
                }}
              />
              <FormControl fullWidth>
                <InputLabel>Fuel Level</InputLabel>
                <Select
                  value={formData.vehicleCondition.before.fuelLevel}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    vehicleCondition: {
                      ...prev.vehicleCondition,
                      before: { ...prev.vehicleCondition.before, fuelLevel: e.target.value }
                    }
                  }))}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: colors.grayLight,
                  }}
                >
                  <MenuItem value="EMPTY">Empty</MenuItem>
                  <MenuItem value="1/4">1/4 Tank</MenuItem>
                  <MenuItem value="1/2">1/2 Tank</MenuItem>
                  <MenuItem value="3/4">3/4 Tank</MenuItem>
                  <MenuItem value="FULL">Full Tank</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="External Condition Notes"
                multiline
                rows={4}
                value={formData.vehicleCondition.before.externalCondition}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  vehicleCondition: {
                    ...prev.vehicleCondition,
                    before: { ...prev.vehicleCondition.before, externalCondition: e.target.value }
                  }
                }))}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: colors.grayLight,
                  },
                }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 4, 
                fontWeight: 600, 
                color: colors.textDark,
                fontSize: '1.1rem',
                textAlign: 'center'
              }}
            >
              After Service
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Mileage (km)"
                type="number"
                value={formData.vehicleCondition.after.mileage}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  vehicleCondition: {
                    ...prev.vehicleCondition,
                    after: { ...prev.vehicleCondition.after, mileage: e.target.value }
                  }
                }))}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: colors.grayLight,
                  },
                }}
              />
              <FormControl fullWidth>
                <InputLabel>Fuel Level</InputLabel>
                <Select
                  value={formData.vehicleCondition.after.fuelLevel}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    vehicleCondition: {
                      ...prev.vehicleCondition,
                      after: { ...prev.vehicleCondition.after, fuelLevel: e.target.value }
                    }
                  }))}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: colors.grayLight,
                  }}
                >
                  <MenuItem value="EMPTY">Empty</MenuItem>
                  <MenuItem value="1/4">1/4 Tank</MenuItem>
                  <MenuItem value="1/2">1/2 Tank</MenuItem>
                  <MenuItem value="3/4">3/4 Tank</MenuItem>
                  <MenuItem value="FULL">Full Tank</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="External Condition Notes"
                multiline
                rows={4}
                value={formData.vehicleCondition.after.externalCondition}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  vehicleCondition: {
                    ...prev.vehicleCondition,
                    after: { ...prev.vehicleCondition.after, externalCondition: e.target.value }
                  }
                }))}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: colors.grayLight,
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );

  // Render Parts and Labour step with enhanced sections
  const renderPartsLaborStep = () => {
    const totals = calculateTotals();

    return (
      <Box sx={{ py: 4 }}>
        {/* Page Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: colors.textDark,
            textAlign: "center",
            mb: 8,
            letterSpacing: '0.5px'
          }}
        >
          Parts & Labour Details
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {formData.completedServices.map((service, serviceIndex) => (
            <Box key={serviceIndex}>
              {/* Service Header */}
              <Paper
                elevation={1}
                sx={{
                  p: 6,
                  mb: 6,
                  borderRadius: 3,
                  backgroundColor: colors.primaryLight,
                  border: `1px solid ${colors.primaryMedium}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      backgroundColor: colors.primaryDark,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 3,
                    }}
                  >
                    <ServiceIcon sx={{ color: colors.white, fontSize: 24 }} />
                  </Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 600, 
                      color: colors.primaryDark,
                      fontSize: '1.5rem'
                    }}
                  >
                    {service.serviceName}
                  </Typography>
                </Box>
                
                <TextField
                  fullWidth
                  label="Service Description & Notes"
                  multiline
                  rows={3}
                  value={service.description}
                  onChange={(e) => updateService(serviceIndex, "description", e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: colors.white,
                    },
                  }}
                />
              </Paper>

              {/* Labour Section */}
              <Paper
                elevation={1}
                sx={{
                  p: 6,
                  mb: 6,
                  borderRadius: 3,
                  backgroundColor: colors.white,
                  border: `1px solid ${colors.primaryMedium}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 6 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      backgroundColor: colors.primaryDark,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 3,
                    }}
                  >
                    <WorkIcon sx={{ color: colors.white, fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{ 
                        fontWeight: 600, 
                        color: colors.primaryDark,
                        fontSize: '1.5rem',
                        mb: 0.5,
                      }}
                    >
                      Labour Details
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: colors.grayMedium, fontWeight: 400 }}
                    >
                      Enter hours worked and hourly rate
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={4}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Hours Worked"
                      type="number"
                      value={service.laborDetails.hoursWorked}
                      onChange={(e) =>
                        updateService(serviceIndex, "laborDetails.hoursWorked", e.target.value)
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <TimeIcon sx={{ color: colors.primaryBlue }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: colors.grayLight,
                          borderRadius: 2,
                          "&:hover fieldset": {
                            borderColor: colors.primaryBlue,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: colors.primaryDark,
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Hourly Rate (LKR)"
                      type="number"
                      value={service.laborDetails.laborRate}
                      onChange={(e) =>
                        updateService(serviceIndex, "laborDetails.laborRate", e.target.value)
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MoneyIcon sx={{ color: colors.primaryBlue }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: colors.grayLight,
                          borderRadius: 2,
                          "&:hover fieldset": {
                            borderColor: colors.primaryBlue,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: colors.primaryDark,
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 4,
                        backgroundColor: colors.primaryLight,
                        borderRadius: 2,
                        textAlign: "center",
                        border: `1px solid ${colors.primaryMedium}`,
                      }}
                    >
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          color: colors.grayMedium, 
                          fontWeight: 500,
                          mb: 1,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        Total Labour Cost
                      </Typography>
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          color: colors.primaryDark, 
                          fontWeight: 600,
                        }}
                      >
                        LKR {(service.laborDetails.laborCost || 0).toLocaleString()}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>

              {/* Parts Section */}
              <Paper
                elevation={1}
                sx={{
                  p: 6,
                  mb: 6,
                  borderRadius: 3,
                  backgroundColor: colors.white,
                  border: `1px solid ${colors.primaryMedium}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 6 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      backgroundColor: colors.primaryDark,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 3,
                    }}
                  >
                    <ServiceIcon sx={{ color: colors.white, fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{ 
                        fontWeight: 600, 
                        color: colors.primaryDark,
                        fontSize: '1.5rem',
                        mb: 0.5,
                      }}
                    >
                      Parts & Components
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: colors.grayMedium, fontWeight: 400 }}
                    >
                      Add additional parts used during service
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    p: 4,
                    mb: 4,
                    backgroundColor: colors.primaryLight,
                    borderRadius: 2,
                    border: `1px solid ${colors.primaryMedium}`,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={service.partsRequired}
                        onChange={(e) =>
                          updateService(serviceIndex, "partsRequired", e.target.checked)
                        }
                        sx={{
                          color: colors.primaryBlue,
                          "&.Mui-checked": { 
                            color: colors.primaryDark,
                          },
                          mr: 2,
                        }}
                      />
                    }
                    label={
                      <Typography
                        variant="body1"
                        sx={{ 
                          color: colors.textDark, 
                          fontWeight: 500,
                        }}
                      >
                        Additional parts were used during this service
                      </Typography>
                    }
                  />
                </Box>

                {service.partsRequired ? (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        mb: 6,
                      }}
                    >
                      <Button
                        startIcon={<AddIcon />}
                        onClick={() => addPartToService(serviceIndex)}
                        variant="contained"
                        size="large"
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          backgroundColor: colors.primaryDark,
                          color: colors.white,
                          fontWeight: 600,
                          px: 6,
                          py: 2,
                          "&:hover": {
                            backgroundColor: colors.primaryBlue,
                          },
                        }}
                      >
                        Add New Part
                      </Button>
                    </Box>

                    {service.partsUsed && service.partsUsed.length > 0 ? (
                      <TableContainer
                        component={Paper}
                        elevation={1}
                        sx={{
                          borderRadius: 2,
                          border: `1px solid ${colors.primaryMedium}`,
                          backgroundColor: colors.white,
                          mb: 4,
                        }}
                      >
                        <Table>
                          <TableHead>
                            <TableRow
                              sx={{
                                backgroundColor: colors.primaryLight,
                                "& .MuiTableCell-head": {
                                  fontWeight: 600,
                                  color: colors.primaryDark,
                                  py: 2,
                                },
                              }}
                            >
                              <TableCell>Part Name</TableCell>
                              <TableCell>Part Number</TableCell>
                              <TableCell align="center">Quantity</TableCell>
                              <TableCell align="right">Unit Price (LKR)</TableCell>
                              <TableCell align="right">Total Price</TableCell>
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
                                    backgroundColor: colors.grayLight,
                                  },
                                  "& .MuiTableCell-root": { 
                                    py: 3,
                                    borderBottom: `1px solid ${colors.primaryMedium}`,
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
                                    sx={{ minWidth: 150 }}
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
                                    sx={{ minWidth: 100 }}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <TextField
                                    size="small"
                                    type="number"
                                    value={part.quantity}
                                    onChange={(e) => {
                                      const quantity = parseInt(e.target.value) || 1;
                                      updatePartInService(
                                        serviceIndex,
                                        partIndex,
                                        "quantity",
                                        quantity
                                      );
                                    }}
                                    inputProps={{ min: 1 }}
                                    sx={{ width: 80 }}
                                  />
                                </TableCell>
                                <TableCell align="right">
                                  <TextField
                                    size="small"
                                    type="number"
                                    value={part.unitPrice}
                                    onChange={(e) => {
                                      const unitPrice = parseFloat(e.target.value) || 0;
                                      updatePartInService(
                                        serviceIndex,
                                        partIndex,
                                        "unitPrice",
                                        unitPrice
                                      );
                                    }}
                                    placeholder="0.00"
                                    sx={{ minWidth: 120 }}
                                  />
                                </TableCell>
                                <TableCell align="right">
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      fontWeight: 600,
                                      color: colors.primaryDark,
                                      backgroundColor: colors.primaryLight,
                                      px: 2,
                                      py: 1,
                                      borderRadius: "8px",
                                      textAlign: "center",
                                    }}
                                  >
                                    LKR {(part.totalPrice || 0).toLocaleString()}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <FormControl size="small" sx={{ minWidth: 100 }}>
                                    <Select
                                      value={part.condition || "NEW"}
                                      onChange={(e) =>
                                        updatePartInService(
                                          serviceIndex,
                                          partIndex,
                                          "condition",
                                          e.target.value
                                        )
                                      }
                                    >
                                      <MenuItem value="NEW">New</MenuItem>
                                      <MenuItem value="USED">Used</MenuItem>
                                      <MenuItem value="REFURBISHED">Refurbished</MenuItem>
                                    </Select>
                                  </FormControl>
                                </TableCell>
                                <TableCell align="center">
                                  <IconButton
                                    onClick={() =>
                                      removePartFromService(serviceIndex, partIndex)
                                    }
                                    color="error"
                                    size="small"
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
                          backgroundColor: "#fff8e1",
                          border: "1px solid #ff9800",
                        }}
                      >
                        <Typography variant="h6">
                          No parts added yet. Click "ADD NEW PART MANUALLY" to start adding parts.
                        </Typography>
                      </Alert>
                    )}

                    {/* Parts Total Display */}
                    <Paper
                      elevation={1}
                      sx={{
                        p: 4,
                        backgroundColor: colors.primaryLight,
                        borderRadius: 2,
                        textAlign: "center",
                        border: `1px solid ${colors.primaryMedium}`,
                      }}
                    >
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          color: colors.grayMedium, 
                          fontWeight: 500,
                          mb: 1,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        Total Parts Cost
                      </Typography>
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          color: colors.primaryDark, 
                          fontWeight: 600,
                        }}
                      >
                        LKR{" "}
                        {(
                          service.partsUsed?.reduce(
                            (sum, part) => sum + (part.totalPrice || 0),
                            0
                          ) || 0
                        ).toLocaleString()}
                      </Typography>
                    </Paper>
                  </>
                ) : (
                  <Box
                    sx={{
                      p: 4,
                      backgroundColor: colors.grayLight,
                      borderRadius: 2,
                      border: `1px solid ${colors.primaryMedium}`,
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="body1" sx={{ color: colors.grayMedium, fontWeight: 400 }}>
                      No additional parts were needed for this service.
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  // Render comprehensive final review with original booking services
  const renderFinalReview = () => {
    const totals = calculateTotals();

    // Calculate original booking services cost
    const originalServicesTotal = booking?.services?.length * 5000 || 0;

    return (
      <Box sx={{ py: 4 }}>
        {/* Page Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: colors.textDark,
            textAlign: "center",
            mb: 6,
            letterSpacing: '0.5px'
          }}
        >
          Service Completion Review
        </Typography>

        <Box
          sx={{
            p: 4,
            mb: 6,
            backgroundColor: colors.primaryLight,
            borderRadius: 2,
            border: `1px solid ${colors.primaryMedium}`,
            textAlign: 'center'
          }}
        >
          <Typography variant="body1" sx={{ color: colors.textDark, fontWeight: 500 }}>
            Please review all details carefully before submitting the service completion report.
            This will update the booking status and notify the customer.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Original Booking Services Section */}
          <Grid item xs={12}>
            <Paper
              elevation={1}
              sx={{
                p: 6,
                borderRadius: 3,
                backgroundColor: colors.white,
                border: `1px solid ${colors.primaryMedium}`,
                mb: 4,
              }}
            >
              <Typography
                variant="h5"
                sx={{ 
                  fontWeight: 600, 
                  color: colors.primaryDark, 
                  mb: 4,
                  fontSize: '1.5rem'
                }}
              >
                Original Booking Services
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                {booking?.services?.map((service, index) => (
                  <Chip
                    key={index}
                    label={`${service} - LKR 5,000`}
                    sx={{
                      backgroundColor: colors.primaryLight,
                      color: colors.primaryDark,
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      height: 36,
                      border: `1px solid ${colors.primaryMedium}`
                    }}
                  />
                ))}
              </Box>
              <Box sx={{ p: 3, backgroundColor: colors.primaryLight, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: colors.primaryDark, fontWeight: 600, textAlign: 'center' }}>
                  Original Services Total: LKR {originalServicesTotal.toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Completed Services Details */}
          <Grid item xs={12}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 6, 
                borderRadius: 3,
                backgroundColor: colors.white,
                border: `1px solid ${colors.primaryMedium}`,
                mb: 4,
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4, 
                  color: colors.primaryDark,
                  fontWeight: 600,
                  fontSize: '1.5rem'
                }}
              >
                Completed Services Summary
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {formData.completedServices.map((service, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      p: 4, 
                      backgroundColor: colors.grayLight, 
                      borderRadius: 2,
                      border: `1px solid ${colors.primaryMedium}`,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: colors.textDark }}>
                      {service.serviceName}
                    </Typography>
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1" sx={{ color: colors.grayMedium }}>
                          <strong>Hours:</strong> {service.laborDetails.hoursWorked} hrs
                        </Typography>
                        <Typography variant="body1" sx={{ color: colors.grayMedium }}>
                          <strong>Rate:</strong> LKR {service.laborDetails.laborRate}/hr
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1" sx={{ color: colors.grayMedium }}>
                          <strong>Parts Used:</strong> {service.partsUsed?.length || 0} parts
                        </Typography>
                        <Typography variant="body1" sx={{ color: colors.grayMedium }}>
                          <strong>Additional Parts:</strong> {service.partsRequired ? "Yes" : "No"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Complete Cost Breakdown */}
          <Grid item xs={12}>
            <Paper
              elevation={1}
              sx={{
                p: 6,
                borderRadius: 3,
                backgroundColor: colors.white,
                border: `1px solid ${colors.primaryMedium}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 6 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    backgroundColor: colors.primaryDark,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 3,
                  }}
                >
                  <MoneyIcon sx={{ color: colors.white, fontSize: 24 }} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{ 
                    fontWeight: 600, 
                    color: colors.primaryDark,
                    fontSize: '1.5rem'
                  }}
                >
                  Complete Cost Breakdown
                </Typography>
              </Box>

              <TableContainer
                component={Paper}
                elevation={0}
                sx={{ borderRadius: "12px", backgroundColor: "white" }}
              >
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Original Booking Services:</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        LKR {originalServicesTotal.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Labour Cost:</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        LKR {totals.laborTotal.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Additional Parts:</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        LKR {totals.partsTotal.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Additional Services:</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        LKR {totals.servicesTotal.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Additional Work:</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        LKR {totals.additionalWorkTotal.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: colors.primaryLight }}>
                      <TableCell sx={{ fontWeight: 700, color: colors.primaryDark }}>Subtotal:</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: colors.primaryDark }}>
                        LKR {(originalServicesTotal + totals.subtotal).toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>
                        Tax ({formData.totalCostBreakdown.taxRate}%):
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        LKR {totals.taxAmount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Discount:</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: "#f44336" }}>
                        - LKR {(parseFloat(formData.totalCostBreakdown.discount) || 0).toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow 
                      sx={{ 
                        backgroundColor: colors.primaryDark,
                      }}
                    >
                      <TableCell sx={{ fontWeight: 700, fontSize: "1.2rem", color: colors.white }}>
                        FINAL TOTAL:
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontWeight: 700, fontSize: "1.2rem", color: colors.white }}
                      >
                        LKR {(originalServicesTotal + totals.finalTotal).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Tax and Discount Inputs */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Discount Amount"
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
                startAdornment: <InputAdornment position="start">LKR</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tax Rate"
              type="number"
              value={formData.totalCostBreakdown.taxRate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  totalCostBreakdown: {
                    ...prev.totalCostBreakdown,
                    taxRate: e.target.value,
                  },
                }))
              }
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
          </Grid>
        </Grid>
      </Box>
    );
  };

  const steps = [
    "Service Details",
    "Parts & Labour",
    "Final Review"
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderServiceDetails();
      case 1:
        return renderPartsLaborStep();
      case 2:
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
        sx: { minHeight: "80vh" },
      }}
    >
      <DialogTitle 
        sx={{ 
          py: 4,
          backgroundColor: colors.primaryLight,
          borderBottom: `1px solid ${colors.primaryMedium}`,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 600, 
              color: colors.primaryDark, 
              mb: 1,
              fontSize: '1.75rem'
            }}
          >
            Service Completion Form
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: colors.grayMedium, 
              fontWeight: 400 
            }}
          >
            Booking ID: {booking.bookingId} | Vehicle: {booking.vehicle?.registrationNumber}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: "space-between" }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          size="large"
          sx={{ minWidth: 120 }}
        >
          Back
        </Button>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button onClick={onClose} size="large" sx={{ minWidth: 120 }}>
            Cancel
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              size="large"
              sx={{ minWidth: 120 }}
              startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
            >
              {loading ? "Submitting..." : "Complete Service"}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              size="large"
              sx={{ minWidth: 120 }}
            >
              Next
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceCompletionForm;