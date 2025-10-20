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
  CloudUpload as CloudUploadIcon,
  AttachFile as AttachFileIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { UserContext } from "../../contexts/UserContext";
import bookingAPI from "../../services/bookingApiService";

const ServiceCompletionForm = ({ open, onClose, booking, onSuccess, onComplete }) => {
  const { userContext } = useContext(UserContext);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Define custom color palette using CSS variables
  const colors = {
    primary: {
      light: "var(--primary-light, #DFF2EB)",
      medium: "var(--primary-medium, #B9E5E8)",
      blue: "var(--primary-blue, #7AB2D3)",
      dark: "var(--primary-dark, #4A628A)"
    },
    neutral: {
      white: "var(--white, #ffffff)",
      grayLight: "var(--gray-light, #f8f9fa)",
      grayMedium: "var(--gray-medium, #6c757d)",
      grayDark: "var(--gray-dark, #495057)",
      textDark: "var(--text-dark, #2c3e50)",
      textLight: "var(--text-light, #ecf0f1)"
    },
    state: {
      success: "var(--success-color, #27ae60)",
      error: "var(--error-color, #e74c3c)",
      warning: "var(--warning-color, #f39c12)",
      info: "var(--info-color, #3498db)"
    }
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
      name: `${userContext?.user?.firstName || ""} ${userContext?.user?.lastName || ""}`.trim() || "Unknown Technician",
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
    supportingDocuments: [],
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
        serviceCost: 5000, // Default service cost
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
      servicesTotal += (service.serviceCost || 0);
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

  // Comprehensive validation functions
  const validateForm = () => {
    const errors = [];
    const warnings = [];

    // 1. Validate Work Time Duration
    const startTime = new Date(formData.workStartTime);
    const endTime = new Date(formData.workEndTime);
    const timeDiffHours = (endTime - startTime) / (1000 * 60 * 60);

    if (startTime >= endTime) {
      errors.push("Work end time must be after work start time");
    }

    if (timeDiffHours > 168) { // 7 days
      errors.push("Work duration cannot exceed 7 days");
    }

    // 2. Validate Hours Worked against actual time duration
    const totalHoursWorked = formData.completedServices.reduce((total, service) => {
      return total + (parseFloat(service.laborDetails.hoursWorked) || 0);
    }, 0);

    if (totalHoursWorked > timeDiffHours + 2) { // Allow 2 hours buffer
      errors.push(`Total hours worked (${totalHoursWorked.toFixed(1)}h) cannot exceed the actual work duration (${timeDiffHours.toFixed(1)}h)`);
    }

    if (totalHoursWorked > 24) {
      warnings.push("Total hours worked exceeds 24 hours - please verify this is correct");
    }

    // 3. Validate Mileage
    const beforeMileage = parseFloat(formData.vehicleCondition.before.mileage) || 0;
    const afterMileage = parseFloat(formData.vehicleCondition.after.mileage) || 0;

    if (beforeMileage < 0 || afterMileage < 0) {
      errors.push("Mileage cannot be negative");
    }

    if (beforeMileage === 0 && afterMileage === 0) {
      warnings.push("Both before and after mileage are 0 - please verify this is correct");
    }

    if (afterMileage < beforeMileage) {
      errors.push("After mileage cannot be less than before mileage");
    }

    const mileageDiff = afterMileage - beforeMileage;
    if (mileageDiff > 1000) { // Reasonable limit for service duration
      warnings.push(`Mileage increase (${mileageDiff} km) seems high for a service - please verify`);
    }

    // 4. Validate Service Costs
    formData.completedServices.forEach((service, index) => {
      const serviceCost = parseFloat(service.serviceCost) || 0;
      const hoursWorked = parseFloat(service.laborDetails.hoursWorked) || 0;
      const laborRate = parseFloat(service.laborDetails.laborRate) || 0;
      const laborCost = parseFloat(service.laborDetails.laborCost) || 0;

      if (serviceCost < 0) {
        errors.push(`Service ${index + 1}: Service cost cannot be negative`);
      }

      if (serviceCost > 1000000) { // 1 million reasonable max
        errors.push(`Service ${index + 1}: Service cost seems unreasonably high`);
      }

      if (hoursWorked < 0) {
        errors.push(`Service ${index + 1}: Hours worked cannot be negative`);
      }

      if (laborRate < 0) {
        errors.push(`Service ${index + 1}: Labor rate cannot be negative`);
      }

      if (laborRate > 50000) { // 50k per hour seems excessive
        warnings.push(`Service ${index + 1}: Labor rate (LKR ${laborRate}/hour) seems very high`);
      }

      // Validate labor cost calculation
      const expectedLaborCost = hoursWorked * laborRate;
      const laborCostDiff = Math.abs(laborCost - expectedLaborCost);
      if (laborCostDiff > 0.01) { // Allow for rounding
        errors.push(`Service ${index + 1}: Labor cost (LKR ${laborCost}) doesn't match hours × rate (${hoursWorked} × ${laborRate} = LKR ${expectedLaborCost})`);
      }

      // Validate parts costs
      service.partsUsed?.forEach((part, partIndex) => {
        const quantity = parseFloat(part.quantity) || 0;
        const unitPrice = parseFloat(part.unitPrice) || 0;
        const totalPrice = parseFloat(part.totalPrice) || 0;

        if (quantity <= 0) {
          errors.push(`Service ${index + 1}, Part ${partIndex + 1}: Quantity must be greater than 0`);
        }

        if (unitPrice < 0) {
          errors.push(`Service ${index + 1}, Part ${partIndex + 1}: Unit price cannot be negative`);
        }

        if (unitPrice > 1000000) {
          warnings.push(`Service ${index + 1}, Part ${partIndex + 1}: Unit price seems very high`);
        }

        const expectedTotal = quantity * unitPrice;
        if (Math.abs(totalPrice - expectedTotal) > 0.01) {
          errors.push(`Service ${index + 1}, Part ${partIndex + 1}: Total price doesn't match quantity × unit price`);
        }
      });
    });

    // 5. Validate Discount and Total Cost
    const totals = calculateTotals();
    const discount = parseFloat(formData.totalCostBreakdown.discount) || 0;
    const subtotal = totals.partsTotal + totals.laborTotal + totals.servicesTotal + totals.additionalWorkTotal;

    if (discount < 0) {
      errors.push("Discount cannot be negative");
    }

    if (discount > subtotal) {
      errors.push("Discount cannot exceed the subtotal amount");
    }

    if (discount > subtotal * 0.8) { // 80% discount seems excessive
      warnings.push("Discount exceeds 80% of subtotal - please verify this is correct");
    }

    // 6. Validate Tax
    const taxRate = parseFloat(formData.totalCostBreakdown.taxRate) || 0;
    if (taxRate < 0) {
      errors.push("Tax rate cannot be negative");
    }

    if (taxRate > 50) { // 50% tax seems excessive
      warnings.push("Tax rate exceeds 50% - please verify this is correct");
    }

    // 7. Validate Technician Information
    if (!formData.technician.name || formData.technician.name.trim() === "" || formData.technician.name === "Unknown Technician") {
      errors.push("Technician name is required");
    }

    // 8. Validate at least one completed service
    if (!formData.completedServices || formData.completedServices.length === 0) {
      errors.push("At least one completed service is required");
    }

    // 9. Validate fuel level progression (optional warning)
    const beforeFuel = formData.vehicleCondition.before.fuelLevel;
    const afterFuel = formData.vehicleCondition.after.fuelLevel;
    const fuelLevels = ["EMPTY", "1/4", "1/2", "3/4", "FULL"];
    
    if (beforeFuel && afterFuel) {
      const beforeIndex = fuelLevels.indexOf(beforeFuel);
      const afterIndex = fuelLevels.indexOf(afterFuel);
      
      if (afterIndex < beforeIndex - 1) { // Allow for some fuel consumption
        warnings.push("Fuel level decreased significantly during service - please verify");
      }
    }

    return { errors, warnings };
  };

  // Calculate time duration in human-readable format
  const calculateTimeDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return '';

    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;

    if (diffMs < 0) return '';

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0 && diffMinutes > 0) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    } else {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
    }
  };

  // Handle form submission with validation
  const handleSubmit = async () => {
    try {
      // Validate form before submission
      const validation = validateForm();
      
      if (validation.errors.length > 0) {
        toast.error(`Please fix the following errors:\n${validation.errors.join('\n')}`);
        return;
      }

      if (validation.warnings.length > 0) {
        const confirmed = window.confirm(
          `Please review the following warnings:\n${validation.warnings.join('\n')}\n\nDo you want to continue?`
        );
        if (!confirmed) {
          return;
        }
      }

      setLoading(true);

      const totals = calculateTotals();

      const submissionData = {
        completedServices: formData.completedServices.map(service => ({
          serviceName: service.serviceName,
          description: service.description || '',
          partsUsed: service.partsUsed || [],
          partsRequired: service.partsRequired || false,
          laborDetails: {
            hoursWorked: parseFloat(service.laborDetails.hoursWorked) || 0,
            laborRate: parseFloat(service.laborDetails.laborRate) || 0,
            laborCost: parseFloat(service.laborDetails.laborCost) || 0,
          },
          serviceCost: parseFloat(service.serviceCost) || 0,
          serviceStatus: service.serviceStatus || 'COMPLETED',
          notes: service.notes || '',
        })),
        additionalWork: formData.additionalWork || [],
        totalCostBreakdown: {
          taxes: parseFloat(formData.totalCostBreakdown.tax) || 0,
          discount: parseFloat(formData.totalCostBreakdown.discount) || 0,
        },
        workStartTime: formData.workStartTime,
        workEndTime: formData.workEndTime,
        totalTimeSpent: calculateTimeDuration(formData.workStartTime, formData.workEndTime),
        vehicleCondition: {
          before: Object.fromEntries(
            Object.entries({
              mileage: formData.vehicleCondition.before.mileage ? parseFloat(formData.vehicleCondition.before.mileage) : undefined,
              fuelLevel: formData.vehicleCondition.before.fuelLevel || undefined,
              externalCondition: formData.vehicleCondition.before.externalCondition || '',
              internalCondition: formData.vehicleCondition.before.internalCondition || '',
            }).filter(([_, value]) => value !== undefined)
          ),
          after: Object.fromEntries(
            Object.entries({
              mileage: formData.vehicleCondition.after.mileage ? parseFloat(formData.vehicleCondition.after.mileage) : undefined,
              fuelLevel: formData.vehicleCondition.after.fuelLevel || undefined,
              externalCondition: formData.vehicleCondition.after.externalCondition || '',
              internalCondition: formData.vehicleCondition.after.internalCondition || '',
            }).filter(([_, value]) => value !== undefined)
          ),
        },
        technician: {
          name: formData.technician.name || '',
          employeeId: formData.technician.employeeId || '',
          signature: formData.technician.signature || '',
        },
        qualityCheck: Object.fromEntries(
          Object.entries({
            performed: Boolean(formData.qualityCheck.performed),
            performedBy: formData.qualityCheck.performedBy || '',
            overallRating: formData.qualityCheck.overallRating || undefined,
            notes: formData.qualityCheck.notes || '',
          }).filter(([_, value]) => value !== undefined)
        ),
        recommendations: formData.recommendations || [],
        customerNotification: Object.fromEntries(
          Object.entries({
            notified: Boolean(formData.customerNotification.notified),
            notificationMethod: formData.customerNotification.notificationMethod || undefined,
          }).filter(([_, value]) => value !== undefined)
        ),
        supportingDocuments: formData.supportingDocuments.map(doc => ({
          fileName: doc.fileName,
          fileType: doc.fileType,
          fileSize: doc.fileSize,
          description: doc.description || '',
          file: doc.file
        })),
      };

      console.log("📤 Submitting service completion report:", submissionData);
      console.log("📋 Completed Services:", submissionData.completedServices);
      console.log("👨‍🔧 Technician:", submissionData.technician);

      const response = await bookingAPI.submitServiceCompletionReport(booking._id, submissionData);

      if (response.success) {
        toast.success("Service completion report submitted successfully!");
        if (onSuccess) onSuccess();
        if (onComplete) {
          // Pass the updated booking data from the response
          const updatedBooking = response.data?.booking || response.data;
          onComplete(updatedBooking);
        }
        onClose();
      } else {
        toast.error(response.message || "Failed to submit service report");
      }
    } catch (error) {
      console.error("Error submitting service completion:", error);
      console.error("Error response data:", error.response?.data);

      // Display detailed error message from backend
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.error ||
                          error.message ||
                          "An error occurred while submitting the report";

      toast.error(`Validation Error: ${errorMessage}`, {
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Real-time field validation helpers
  const validateFieldValue = (field, value, serviceIndex = null) => {
    const numValue = parseFloat(value) || 0;
    
    switch (field) {
      case 'laborDetails.hoursWorked':
        if (numValue < 0) return { error: 'Hours worked cannot be negative' };
        if (numValue > 24) return { warning: 'Hours worked exceeds 24 hours' };
        
        // Check against work duration if available
        const startTime = new Date(formData.workStartTime);
        const endTime = new Date(formData.workEndTime);
        const maxHours = (endTime - startTime) / (1000 * 60 * 60);
        if (maxHours > 0 && numValue > maxHours) {
          return { warning: `Hours exceed work duration (${maxHours.toFixed(1)}h)` };
        }
        break;
        
      case 'laborDetails.laborRate':
        if (numValue < 0) return { error: 'Labor rate cannot be negative' };
        if (numValue > 50000) return { warning: 'Labor rate seems very high' };
        break;
        
      case 'serviceCost':
        if (numValue < 0) return { error: 'Service cost cannot be negative' };
        if (numValue > 1000000) return { warning: 'Service cost seems very high' };
        break;
        
      default:
        return null;
    }
    
    return null;
  };

  // Update service field with validation
  const updateService = (serviceIndex, field, value) => {
    // Validate the field value
    const validation = validateFieldValue(field, value, serviceIndex);
    if (validation?.error) {
      toast.error(validation.error);
      return; // Don't update if there's an error
    }
    
    if (validation?.warning) {
      toast.warning(validation.warning);
    }

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

            // Auto-calculate labor cost with validation
            if (laborField === "hoursWorked" || laborField === "laborRate") {
              const hoursWorked = parseFloat(updatedLaborDetails.hoursWorked) || 0;
              const laborRate = parseFloat(updatedLaborDetails.laborRate) || 0;
              updatedLaborDetails.laborCost = hoursWorked * laborRate;
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

  // Update part in service with validation
  const updatePartInService = (serviceIndex, partIndex, field, value) => {
    const numValue = parseFloat(value) || 0;
    
    // Validate part fields
    if (field === 'quantity') {
      if (numValue <= 0) {
        toast.error('Part quantity must be greater than 0');
        return;
      }
      if (numValue > 1000) {
        toast.warning('Part quantity seems very high');
      }
    }
    
    if (field === 'unitPrice') {
      if (numValue < 0) {
        toast.error('Part unit price cannot be negative');
        return;
      }
      if (numValue > 1000000) {
        toast.warning('Part unit price seems very high');
      }
    }

    setFormData((prev) => ({
      ...prev,
      completedServices: prev.completedServices.map((service, index) => {
        if (index === serviceIndex) {
          const updatedPartsUsed = service.partsUsed.map((part, pIndex) => {
            if (pIndex === partIndex) {
              const updatedPart = { ...part, [field]: value };
              
              // Auto-calculate total price with validation
              if (field === "quantity" || field === "unitPrice") {
                const quantity = parseFloat(updatedPart.quantity) || 0;
                const unitPrice = parseFloat(updatedPart.unitPrice) || 0;
                updatedPart.totalPrice = quantity * unitPrice;
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

  // Validate mileage input
  const validateMileage = (value, type) => {
    const numValue = parseFloat(value) || 0;
    
    if (numValue < 0) {
      toast.error(`${type} mileage cannot be negative`);
      return false;
    }
    
    if (numValue === 0) {
      toast.warning(`${type} mileage is 0 - please verify this is correct`);
    }
    
    if (numValue > 999999) {
      toast.warning(`${type} mileage seems very high`);
    }
    
    return true;
  };

  // Validate discount
  const validateDiscount = (discountValue) => {
    const discount = parseFloat(discountValue) || 0;
    const totals = calculateTotals();
    const subtotal = totals.partsTotal + totals.laborTotal + totals.servicesTotal + totals.additionalWorkTotal;
    
    if (discount < 0) {
      toast.error('Discount cannot be negative');
      return false;
    }
    
    if (discount > subtotal) {
      toast.error('Discount cannot exceed the subtotal amount');
      return false;
    }
    
    if (discount > subtotal * 0.8) {
      toast.warning('Discount exceeds 80% of subtotal - please verify this is correct');
    }
    
    return true;
  };

  // Validate work time
  const validateWorkTime = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffHours = (end - start) / (1000 * 60 * 60);
    
    if (start >= end) {
      toast.error('Work end time must be after work start time');
      return false;
    }
    
    if (diffHours > 168) { // 7 days
      toast.error('Work duration cannot exceed 7 days');
      return false;
    }
    
    if (diffHours < 0.5) { // 30 minutes minimum
      toast.warning('Work duration is less than 30 minutes - please verify');
    }
    
    return true;
  };

  // Enhanced form data update with validation
  const updateFormData = (path, value, skipValidation = false) => {
    // Pre-validation based on field type
    if (!skipValidation) {
      if (path.includes('mileage')) {
        const mileageType = path.includes('before') ? 'Before' : 'After';
        if (!validateMileage(value, mileageType)) return;
      }
      
      if (path.includes('discount')) {
        if (!validateDiscount(value)) return;
      }
      
      if (path === 'workStartTime' || path === 'workEndTime') {
        const currentStart = path === 'workStartTime' ? value : formData.workStartTime;
        const currentEnd = path === 'workEndTime' ? value : formData.workEndTime;
        if (currentStart && currentEnd) {
          if (!validateWorkTime(currentStart, currentEnd)) return;
        }
      }
    }

    // Update the form data
    setFormData((prev) => {
      const keys = path.split('.');
      const result = { ...prev };
      let current = result;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return result;
    });
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

  // Handle file upload
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);

    files.forEach((file) => {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File type not supported: ${file.name}`);
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error(`File too large: ${file.name}. Maximum size is 5MB.`);
        return;
      }

      // Create file object
      const fileObj = {
        id: Date.now() + Math.random(),
        file: file,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        description: '',
        uploadStatus: 'pending'
      };

      setFormData((prev) => ({
        ...prev,
        supportingDocuments: [...prev.supportingDocuments, fileObj],
      }));
    });

    // Clear the input
    event.target.value = '';
  };

  // Remove supporting document
  const removeSupportingDocument = (index) => {
    setFormData((prev) => ({
      ...prev,
      supportingDocuments: prev.supportingDocuments.filter((_, i) => i !== index),
    }));
  };

  // Update document description
  const updateDocumentDescription = (index, description) => {
    setFormData((prev) => ({
      ...prev,
      supportingDocuments: prev.supportingDocuments.map((doc, i) =>
        i === index ? { ...doc, description } : doc
      ),
    }));
  };

  // Render service details step
  const renderServiceDetails = () => (
    <Box sx={{ py: 2 }}>
      {/* Page Title */}
      <Typography
        variant="h4"
        sx={{
          mb: 5,
          fontWeight: 700,
          color: colors.neutral.textDark,
          textAlign: 'center',
          letterSpacing: '-0.025em',
          fontSize: { xs: '1.75rem', md: '2.125rem' }
        }}
      >
        Vehicle & Service Information
      </Typography>

      {/* Vehicle & Service Overview */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 6 },
          mb: 4,
          borderRadius: 4,
          border: `2px solid ${colors.primary.medium}`,
          backgroundColor: colors.primary.light,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: colors.primary.blue,
            boxShadow: `0 4px 12px rgba(74, 98, 138, 0.15)`
          }
        }}
      >
        <Grid container spacing={5}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 600,
                color: colors.neutral.textDark,
                fontSize: '1.125rem'
              }}
            >
              Vehicle Details
            </Typography>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
              p: 3,
              backgroundColor: colors.neutral.white,
              borderRadius: 3,
              border: `1px solid ${colors.primary.medium}`,
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                <Typography sx={{ fontWeight: 500, color: colors.neutral.grayMedium, fontSize: '0.925rem' }}>Registration:</Typography>
                <Typography sx={{ fontWeight: 700, color: colors.neutral.textDark, fontSize: '0.925rem' }}>
                  {booking?.vehicle?.registrationNumber}
                </Typography>
              </Box>
              <Divider sx={{ my: 0.5, borderColor: colors.primary.medium }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                <Typography sx={{ fontWeight: 500, color: colors.neutral.grayMedium, fontSize: '0.925rem' }}>Make:</Typography>
                <Typography sx={{ fontWeight: 700, color: colors.neutral.textDark, fontSize: '0.925rem' }}>
                  {booking?.vehicle?.make}
                </Typography>
              </Box>
              <Divider sx={{ my: 0.5, borderColor: colors.primary.medium }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                <Typography sx={{ fontWeight: 500, color: colors.neutral.grayMedium, fontSize: '0.925rem' }}>Model:</Typography>
                <Typography sx={{ fontWeight: 700, color: colors.neutral.textDark, fontSize: '0.925rem' }}>
                  {booking?.vehicle?.model}
                </Typography>
              </Box>
              <Divider sx={{ my: 0.5, borderColor: colors.primary.medium }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                <Typography sx={{ fontWeight: 500, color: colors.neutral.grayMedium, fontSize: '0.925rem' }}>Year:</Typography>
                <Typography sx={{ fontWeight: 700, color: colors.neutral.textDark, fontSize: '0.925rem' }}>
                  {booking?.vehicle?.year}
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 600,
                color: colors.neutral.textDark,
                fontSize: '1.125rem'
              }}
            >
              Original Services Requested
            </Typography>
            <Box sx={{
              p: 3,
              backgroundColor: colors.neutral.white,
              borderRadius: 3,
              border: `1px solid ${colors.primary.medium}`,
            }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {booking?.services?.map((service, index) => (
                  <Chip
                    key={index}
                    label={service}
                    sx={{
                      backgroundColor: colors.primary.light,
                      color: colors.primary.dark,
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      height: 36,
                      border: `1px solid ${colors.primary.medium}`,
                      '&:hover': {
                        backgroundColor: colors.primary.medium
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Work Time Section with Enhanced Visuals */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                mb: 2,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${colors.primary.light} 0%, ${colors.neutral.white} 100%)`,
                border: `2px solid ${colors.primary.medium}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TimeIcon sx={{ fontSize: 28, color: colors.primary.dark, mr: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.primary.dark, fontSize: '1.25rem' }}>
                  Work Duration & Timing
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Work Start Time"
                    type="datetime-local"
                    value={formData.workStartTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, workStartTime: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      max: new Date().toISOString().slice(0, 16),
                    }}
                    sx={{
                      '& .MuiInputLabel-root': {
                        fontWeight: 600,
                        color: colors.neutral.grayDark,
                        fontSize: '1rem'
                      },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: colors.neutral.white,
                        fontSize: '1rem',
                        height: 56,
                        '& fieldset': {
                          borderColor: colors.primary.medium,
                          borderWidth: '2px',
                        },
                        '&:hover fieldset': {
                          borderColor: colors.primary.blue,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colors.primary.dark,
                          borderWidth: '3px',
                          boxShadow: `0 0 8px ${colors.primary.blue}40`,
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Work End Time"
                    type="datetime-local"
                    value={formData.workEndTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, workEndTime: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: formData.workStartTime,
                      max: new Date().toISOString().slice(0, 16),
                    }}
                    error={formData.workStartTime && formData.workEndTime && new Date(formData.workEndTime) <= new Date(formData.workStartTime)}
                    helperText={
                      formData.workStartTime && formData.workEndTime && new Date(formData.workEndTime) <= new Date(formData.workStartTime)
                        ? "End time must be after start time"
                        : ""
                    }
                    sx={{
                      '& .MuiInputLabel-root': {
                        fontWeight: 600,
                        color: colors.neutral.grayDark,
                        fontSize: '1rem'
                      },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: colors.neutral.white,
                        fontSize: '1rem',
                        height: 56,
                        '& fieldset': {
                          borderColor: colors.primary.medium,
                          borderWidth: '2px',
                        },
                        '&:hover fieldset': {
                          borderColor: colors.primary.blue,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colors.primary.dark,
                          borderWidth: '3px',
                          boxShadow: `0 0 8px ${colors.primary.blue}40`,
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Time Duration Display */}
                {formData.workStartTime && formData.workEndTime && new Date(formData.workEndTime) > new Date(formData.workStartTime) && (
                  <Grid item xs={12}>
                    <Alert
                      icon={<TimeIcon />}
                      severity="info"
                      sx={{
                        backgroundColor: colors.info + '15',
                        borderLeft: `4px solid ${colors.info}`,
                        '& .MuiAlert-icon': {
                          color: colors.info
                        }
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600, color: colors.primary.dark }}>
                        Total Work Duration: {calculateTimeDuration(formData.workStartTime, formData.workEndTime)}
                      </Typography>
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Technician Information Section with Enhanced Visuals */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${colors.primary.light} 0%, ${colors.neutral.white} 100%)`,
                border: `2px solid ${colors.primary.medium}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PersonIcon sx={{ fontSize: 28, color: colors.primary.dark, mr: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.primary.dark, fontSize: '1.25rem' }}>
                  Technician Information
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Technician Name"
                    value={formData.technician.name}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      technician: { ...prev.technician, name: e.target.value }
                    }))}
                    placeholder="Enter technician's full name"
                    error={!formData.technician.name || formData.technician.name.trim() === "" || formData.technician.name === "Unknown Technician"}
                    helperText={
                      (!formData.technician.name || formData.technician.name.trim() === "" || formData.technician.name === "Unknown Technician")
                        ? "Technician name is required"
                        : "Full name of the technician who performed the service"
                    }
                    sx={{
                      '& .MuiInputLabel-root': {
                        fontWeight: 600,
                        color: colors.neutral.grayDark,
                        fontSize: '1rem'
                      },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: colors.neutral.white,
                        fontSize: '1rem',
                        height: 56,
                        '& fieldset': {
                          borderColor: colors.primary.medium,
                          borderWidth: '2px',
                        },
                        '&:hover fieldset': {
                          borderColor: colors.primary.blue,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colors.primary.dark,
                          borderWidth: '3px',
                          boxShadow: `0 0 8px ${colors.primary.blue}40`,
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        fontSize: '0.875rem',
                        mt: 1
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Employee/Technician ID (Optional)"
                    value={formData.technician.employeeId}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      technician: { ...prev.technician, employeeId: e.target.value }
                    }))}
                    placeholder="Enter employee ID or badge number"
                    helperText="Employee identification number or badge ID"
                    sx={{
                      '& .MuiInputLabel-root': {
                        fontWeight: 600,
                        color: colors.neutral.grayDark,
                        fontSize: '1rem'
                      },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: colors.neutral.white,
                        fontSize: '1rem',
                        height: 56,
                        '& fieldset': {
                          borderColor: colors.primary.medium,
                          borderWidth: '2px',
                        },
                        '&:hover fieldset': {
                          borderColor: colors.primary.blue,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colors.primary.dark,
                          borderWidth: '3px',
                          boxShadow: `0 0 8px ${colors.primary.blue}40`,
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        fontSize: '0.875rem',
                        mt: 1
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Vehicle Condition Documentation */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 6 },
          borderRadius: 4,
          border: `2px solid ${colors.primary.medium}`,
          backgroundColor: colors.primary.light,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: colors.primary.blue,
            boxShadow: `0 4px 12px rgba(74, 98, 138, 0.15)`
          }
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 4,
            fontWeight: 700,
            color: colors.neutral.textDark,
            fontSize: '1.5rem',
            textAlign: 'center',
            letterSpacing: '-0.025em'
          }}
        >
          Vehicle Condition Documentation
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{
              p: 4,
              backgroundColor: colors.neutral.white,
              borderRadius: 3,
              border: `1px solid ${colors.primary.medium}`,
              height: 'fit-content'
            }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  color: colors.neutral.textDark,
                  fontSize: '1.125rem',
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
                    '& .MuiInputLabel-root': {
                      fontWeight: 500,
                      color: colors.neutral.grayDark
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: colors.neutral.grayLight,
                      fontSize: '0.925rem',
                      '& fieldset': {
                        borderColor: colors.primary.medium,
                      },
                      '&:hover fieldset': {
                        borderColor: colors.primary.blue,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: colors.primary.dark,
                      },
                    },
                  }}
                />
                <FormControl fullWidth>
                  <InputLabel sx={{ fontWeight: 500, color: colors.neutral.grayDark }}>Fuel Level</InputLabel>
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
                      borderRadius: 3,
                      backgroundColor: colors.neutral.grayLight,
                      fontSize: '0.925rem',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.primary.medium,
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.primary.blue,
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.primary.dark,
                      },
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
                    '& .MuiInputLabel-root': {
                      fontWeight: 500,
                      color: colors.neutral.grayDark
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: colors.neutral.grayLight,
                      fontSize: '0.925rem',
                      '& fieldset': {
                        borderColor: colors.primary.medium,
                      },
                      '&:hover fieldset': {
                        borderColor: colors.primary.blue,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: colors.primary.dark,
                      },
                    },
                  }}
                />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{
              p: 4,
              backgroundColor: colors.neutral.white,
              borderRadius: 3,
              border: `1px solid ${colors.primary.medium}`,
              height: 'fit-content'
            }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  color: colors.neutral.textDark,
                  fontSize: '1.125rem',
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
                    '& .MuiInputLabel-root': {
                      fontWeight: 500,
                      color: colors.neutral.grayDark
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: colors.neutral.grayLight,
                      fontSize: '0.925rem',
                      '& fieldset': {
                        borderColor: colors.primary.medium,
                      },
                      '&:hover fieldset': {
                        borderColor: colors.primary.blue,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: colors.primary.dark,
                      },
                    },
                  }}
                />
                <FormControl fullWidth>
                  <InputLabel sx={{ fontWeight: 500, color: colors.neutral.grayDark }}>Fuel Level</InputLabel>
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
                      borderRadius: 3,
                      backgroundColor: colors.neutral.grayLight,
                      fontSize: '0.925rem',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.primary.medium,
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.primary.blue,
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.primary.dark,
                      },
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
                    '& .MuiInputLabel-root': {
                      fontWeight: 500,
                      color: colors.neutral.grayDark
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: colors.neutral.grayLight,
                      fontSize: '0.925rem',
                      '& fieldset': {
                        borderColor: colors.primary.medium,
                      },
                      '&:hover fieldset': {
                        borderColor: colors.primary.blue,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: colors.primary.dark,
                      },
                    },
                  }}
                />
              </Box>
            </Paper>
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
            color: colors.neutral.textDark,
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
                  backgroundColor: colors.primary.light,
                  border: `1px solid ${colors.primary.medium}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      backgroundColor: colors.primary.dark,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 3,
                    }}
                  >
                    <ServiceIcon sx={{ color: colors.neutral.white, fontSize: 24 }} />
                  </Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 600, 
                      color: colors.primary.dark,
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
                      backgroundColor: colors.neutral.white,
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
                  backgroundColor: colors.neutral.white,
                  border: `1px solid ${colors.primary.medium}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 6 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      backgroundColor: colors.primary.dark,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 3,
                    }}
                  >
                    <WorkIcon sx={{ color: colors.neutral.white, fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{ 
                        fontWeight: 600, 
                        color: colors.primary.dark,
                        fontSize: '1.5rem',
                        mb: 0.5,
                      }}
                    >
                      Labour Details
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: colors.neutral.grayMedium, fontWeight: 400 }}
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
                            <TimeIcon sx={{ color: colors.primary.blue }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: colors.neutral.grayLight,
                          borderRadius: 2,
                          "&:hover fieldset": {
                            borderColor: colors.primary.blue,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: colors.primary.dark,
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
                            <MoneyIcon sx={{ color: colors.primary.blue }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: colors.neutral.grayLight,
                          borderRadius: 2,
                          "&:hover fieldset": {
                            borderColor: colors.primary.blue,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: colors.primary.dark,
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
                        backgroundColor: colors.primary.light,
                        borderRadius: 2,
                        textAlign: "center",
                        border: `1px solid ${colors.primary.medium}`,
                      }}
                    >
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          color: colors.neutral.grayMedium, 
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
                          color: colors.primary.dark, 
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
                  backgroundColor: colors.neutral.white,
                  border: `1px solid ${colors.primary.medium}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 6 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      backgroundColor: colors.primary.dark,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 3,
                    }}
                  >
                    <ServiceIcon sx={{ color: colors.neutral.white, fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{ 
                        fontWeight: 600, 
                        color: colors.primary.dark,
                        fontSize: '1.5rem',
                        mb: 0.5,
                      }}
                    >
                      Parts & Components
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: colors.neutral.grayMedium, fontWeight: 400 }}
                    >
                      Add additional parts used during service
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    p: 4,
                    mb: 4,
                    backgroundColor: colors.primary.light,
                    borderRadius: 2,
                    border: `1px solid ${colors.primary.medium}`,
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
                          color: colors.primary.blue,
                          "&.Mui-checked": { 
                            color: colors.primary.dark,
                          },
                          mr: 2,
                        }}
                      />
                    }
                    label={
                      <Typography
                        variant="body1"
                        sx={{ 
                          color: colors.neutral.textDark, 
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
                          backgroundColor: colors.primary.dark,
                          color: colors.neutral.white,
                          fontWeight: 600,
                          px: 6,
                          py: 2,
                          "&:hover": {
                            backgroundColor: colors.primary.blue,
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
                          border: `1px solid ${colors.primary.medium}`,
                          backgroundColor: colors.neutral.white,
                          mb: 4,
                        }}
                      >
                        <Table>
                          <TableHead>
                            <TableRow
                              sx={{
                                backgroundColor: colors.primary.light,
                                "& .MuiTableCell-head": {
                                  fontWeight: 600,
                                  color: colors.primary.dark,
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
                                    backgroundColor: colors.neutral.grayLight,
                                  },
                                  "& .MuiTableCell-root": { 
                                    py: 3,
                                    borderBottom: `1px solid ${colors.primary.medium}`,
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
                                      color: colors.primary.dark,
                                      backgroundColor: colors.primary.light,
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
                        backgroundColor: colors.primary.light,
                        borderRadius: 2,
                        textAlign: "center",
                        border: `1px solid ${colors.primary.medium}`,
                      }}
                    >
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          color: colors.neutral.grayMedium, 
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
                          color: colors.primary.dark, 
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
                      backgroundColor: colors.neutral.grayLight,
                      borderRadius: 2,
                      border: `1px solid ${colors.primary.medium}`,
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="body1" sx={{ color: colors.neutral.grayMedium, fontWeight: 400 }}>
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
            color: colors.neutral.textDark,
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
            backgroundColor: colors.primary.light,
            borderRadius: 2,
            border: `1px solid ${colors.primary.medium}`,
            textAlign: 'center'
          }}
        >
          <Typography variant="body1" sx={{ color: colors.neutral.textDark, fontWeight: 500 }}>
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
                backgroundColor: colors.neutral.white,
                border: `1px solid ${colors.primary.medium}`,
                mb: 4,
              }}
            >
              <Typography
                variant="h5"
                sx={{ 
                  fontWeight: 600, 
                  color: colors.primary.dark, 
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
                      backgroundColor: colors.primary.light,
                      color: colors.primary.dark,
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      height: 36,
                      border: `1px solid ${colors.primary.medium}`
                    }}
                  />
                ))}
              </Box>
              <Box sx={{ p: 3, backgroundColor: colors.primary.light, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: colors.primary.dark, fontWeight: 600, textAlign: 'center' }}>
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
                backgroundColor: colors.neutral.white,
                border: `1px solid ${colors.primary.medium}`,
                mb: 4,
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4, 
                  color: colors.primary.dark,
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
                      backgroundColor: colors.neutral.grayLight, 
                      borderRadius: 2,
                      border: `1px solid ${colors.primary.medium}`,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: colors.neutral.textDark }}>
                      {service.serviceName}
                    </Typography>
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1" sx={{ color: colors.neutral.grayMedium }}>
                          <strong>Hours:</strong> {service.laborDetails.hoursWorked} hrs
                        </Typography>
                        <Typography variant="body1" sx={{ color: colors.neutral.grayMedium }}>
                          <strong>Rate:</strong> LKR {service.laborDetails.laborRate}/hr
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1" sx={{ color: colors.neutral.grayMedium }}>
                          <strong>Parts Used:</strong> {service.partsUsed?.length || 0} parts
                        </Typography>
                        <Typography variant="body1" sx={{ color: colors.neutral.grayMedium }}>
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
                backgroundColor: colors.neutral.white,
                border: `1px solid ${colors.primary.medium}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 6 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    backgroundColor: colors.primary.dark,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 3,
                  }}
                >
                  <MoneyIcon sx={{ color: colors.neutral.white, fontSize: 24 }} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{ 
                    fontWeight: 600, 
                    color: colors.primary.dark,
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
                    <TableRow sx={{ backgroundColor: colors.primary.light }}>
                      <TableCell sx={{ fontWeight: 700, color: colors.primary.dark }}>Subtotal:</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: colors.primary.dark }}>
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
                        backgroundColor: colors.primary.dark,
                      }}
                    >
                      <TableCell sx={{ fontWeight: 700, fontSize: "1.2rem", color: colors.neutral.white }}>
                        FINAL TOTAL:
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontWeight: 700, fontSize: "1.2rem", color: colors.neutral.white }}
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

          {/* Supporting Documents Upload Section */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 6 },
                borderRadius: 4,
                backgroundColor: colors.primary.light,
                border: `2px solid ${colors.primary.medium}`,
                mt: 3,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: colors.primary.blue,
                  boxShadow: `0 4px 12px rgba(74, 98, 138, 0.15)`
                }
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 5 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${colors.primary.blue} 0%, ${colors.primary.dark} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 3,
                    boxShadow: `0 4px 12px rgba(74, 98, 138, 0.3)`,
                  }}
                >
                  <DescriptionIcon sx={{ color: colors.neutral.white, fontSize: 28 }} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: colors.neutral.textDark,
                    fontSize: '1.5rem',
                    letterSpacing: '-0.025em'
                  }}
                >
                  Supporting Documents
                </Typography>
              </Box>

              <Paper
                sx={{
                  p: 4,
                  mb: 4,
                  backgroundColor: colors.neutral.white,
                  borderRadius: 3,
                  border: `1px solid ${colors.primary.medium}`,
                  textAlign: 'center'
                }}
              >
                <Typography variant="body1" sx={{ color: colors.neutral.grayDark, fontWeight: 500, mb: 2, fontSize: '1rem' }}>
                  Upload any additional documents related to the service completion (photos, receipts, warranty documents, etc.)
                </Typography>
                <Typography variant="body2" sx={{ color: colors.neutral.grayMedium, fontSize: '0.875rem' }}>
                  Supported formats: JPG, PNG, PDF, DOC, DOCX (Max size: 5MB per file)
                </Typography>
              </Paper>

              {/* File Upload Button */}
              <Box sx={{ display: "flex", justifyContent: "center", mb: 5 }}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  size="large"
                  sx={{
                    borderRadius: 4,
                    textTransform: "none",
                    background: `linear-gradient(135deg, ${colors.primary.blue} 0%, ${colors.primary.dark} 100%)`,
                    color: colors.neutral.white,
                    fontWeight: 600,
                    fontSize: '1rem',
                    px: 8,
                    py: 3,
                    boxShadow: `0 4px 12px rgba(74, 98, 138, 0.3)`,
                    transition: 'all 0.2s ease-in-out',
                    "&:hover": {
                      background: `linear-gradient(135deg, ${colors.primary.dark} 0%, ${colors.primary.dark} 100%)`,
                      boxShadow: `0 6px 20px rgba(74, 98, 138, 0.4)`,
                      transform: 'translateY(-2px)'
                    },
                  }}
                >
                  Upload Documents
                  <input
                    type="file"
                    multiple
                    hidden
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                  />
                </Button>
              </Box>

              {/* Uploaded Documents List */}
              {formData.supportingDocuments.length > 0 && (
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: `2px solid ${colors.primary.medium}`,
                    backgroundColor: colors.neutral.white,
                    overflow: 'hidden'
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: colors.primary.light,
                          "& .MuiTableCell-head": {
                            fontWeight: 700,
                            color: colors.neutral.textDark,
                            py: 3,
                            fontSize: '0.925rem',
                            borderBottom: `2px solid ${colors.primary.medium}`
                          },
                        }}
                      >
                        <TableCell>Document Name</TableCell>
                        <TableCell align="center">Type</TableCell>
                        <TableCell align="center">Size</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.supportingDocuments.map((document, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:hover": {
                              backgroundColor: colors.neutral.grayLight,
                            },
                            "& .MuiTableCell-root": {
                              py: 3.5,
                              borderBottom: `1px solid ${colors.primary.medium}`,
                              fontSize: '0.925rem'
                            },
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <AttachFileIcon sx={{ color: colors.primary.blue, fontSize: 22 }} />
                              <Typography variant="body2" sx={{ fontWeight: 600, color: colors.neutral.textDark }}>
                                {document.fileName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={document.fileType.split('/')[1].toUpperCase()}
                              size="small"
                              sx={{
                                backgroundColor: colors.primary.light,
                                color: colors.primary.dark,
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                height: 28
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">
                              {(document.fileSize / 1024).toFixed(1)} KB
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              placeholder="Optional description..."
                              value={document.description}
                              onChange={(e) =>
                                updateDocumentDescription(index, e.target.value)
                              }
                              sx={{
                                minWidth: 200,
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  backgroundColor: colors.neutral.grayLight,
                                  fontSize: '0.875rem',
                                  '& fieldset': {
                                    borderColor: colors.primary.medium,
                                  },
                                  '&:hover fieldset': {
                                    borderColor: colors.primary.blue,
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: colors.primary.dark,
                                  },
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              onClick={() => removeSupportingDocument(index)}
                              size="small"
                              sx={{
                                color: colors.state.error,
                                '&:hover': {
                                  backgroundColor: colors.neutral.grayLight,
                                  color: colors.state.error
                                }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {formData.supportingDocuments.length === 0 && (
                <Paper
                  sx={{
                    p: 6,
                    backgroundColor: colors.primary.light,
                    borderRadius: 3,
                    border: `2px dashed ${colors.primary.medium}`,
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="body1" sx={{ color: colors.neutral.grayMedium, fontWeight: 500, fontSize: '1rem' }}>
                    No documents uploaded yet. Click "Upload Documents" to add supporting files.
                  </Typography>
                </Paper>
              )}
            </Paper>
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
        sx: {
          minHeight: "85vh",
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
          border: `1px solid ${colors.primary.medium}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          py: 6,
          background: `linear-gradient(135deg, ${colors.primary.blue} 0%, ${colors.primary.dark} 100%)`,
          boxShadow: '0 4px 20px rgba(74, 98, 138, 0.25)',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, mb: 2 }}>
            <CheckCircleIcon sx={{ fontSize: '3rem', color: colors.neutral.white, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: colors.neutral.white,
                fontSize: '2.25rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                letterSpacing: '-0.025em'
              }}
            >
              Service Completion Form
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: colors.neutral.white,
              fontWeight: 500,
              opacity: 0.95,
              fontSize: '1.125rem',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            {booking.vehicle?.make} {booking.vehicle?.model} • {booking.vehicle?.registrationNumber} • Booking #{booking.bookingId}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          background: `linear-gradient(180deg, ${colors.neutral.white} 0%, #ffffff 15%, #ffffff 100%)`,
          px: { xs: 3, md: 5 },
          py: 6,
        }}
      >
        <Stepper
          activeStep={activeStep}
          sx={{
            mb: 8,
            '& .MuiStepLabel-root .Mui-completed': {
              color: colors.primary.blue,
            },
            '& .MuiStepLabel-root .Mui-active': {
              color: colors.primary.dark,
            },
            '& .MuiStepIcon-root': {
              fontSize: '2rem',
              '&.Mui-completed': {
                color: colors.state.success,
              },
              '&.Mui-active': {
                color: colors.primary.blue,
              }
            },
            '& .MuiStepConnector-alternativeLabel': {
              top: 16,
              left: 'calc(-50% + 16px)',
              right: 'calc(50% + 16px)',
            },
            '& .MuiStepConnector-alternativeLabel.Mui-active .MuiStepConnector-line, & .MuiStepConnector-alternativeLabel.Mui-completed .MuiStepConnector-line': {
              borderColor: colors.primary.dark,
              borderWidth: 3,
            },
          }}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    '&.Mui-completed': {
                      color: colors.state.success,
                    },
                    '&.Mui-active': {
                      color: colors.primary.blue,
                    },
                  }
                }}
                sx={{
                  '& .MuiStepLabel-label': {
                    fontSize: '1.125rem',
                    fontWeight: activeStep === index ? 700 : 500,
                    color: activeStep === index ? colors.primary.dark : colors.neutral.grayMedium,
                    mt: 1
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}
      </DialogContent>

      <DialogActions
        sx={{
          p: 5,
          justifyContent: "space-between",
          background: `linear-gradient(180deg, #ffffff 0%, ${colors.neutral.grayLight} 100%)`,
          borderTop: `2px solid ${colors.primary.medium}`,
        }}
      >
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          size="large"
          variant="outlined"
          sx={{
            minWidth: 140,
            borderRadius: 3,
            borderWidth: 2,
            borderColor: colors.primary.medium,
            color: colors.neutral.grayDark,
            fontWeight: 600,
            fontSize: '1rem',
            py: 1.5,
            '&:hover': {
              borderColor: colors.primary.blue,
              backgroundColor: colors.neutral.white,
              borderWidth: 2,
            },
            '&:disabled': {
              borderColor: colors.primary.medium,
              color: colors.neutral.grayMedium,
            }
          }}
        >
          Back
        </Button>

        <Box sx={{ display: "flex", gap: 3 }}>
          <Button
            onClick={onClose}
            size="large"
            variant="outlined"
            sx={{
              minWidth: 140,
              borderRadius: 3,
              borderWidth: 2,
              borderColor: colors.primary.medium,
              color: colors.neutral.grayDark,
              fontWeight: 600,
              fontSize: '1rem',
              py: 1.5,
              '&:hover': {
                borderColor: colors.state.error,
                backgroundColor: colors.neutral.grayLight,
                color: colors.state.error,
                borderWidth: 2,
              }
            }}
          >
            Cancel
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              size="large"
              sx={{
                minWidth: 200,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${colors.state.success} 0%, ${colors.state.success} 100%)`,
                boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)',
                py: 2,
                fontSize: '1.125rem',
                fontWeight: 700,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  background: `linear-gradient(135deg, ${colors.state.success} 0%, ${colors.state.success} 100%)`,
                  boxShadow: '0 8px 24px rgba(34, 197, 94, 0.4)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  background: colors.neutral.grayMedium,
                  boxShadow: 'none',
                  transform: 'none',
                }
              }}
              startIcon={loading ? <CircularProgress size={22} color="inherit" /> : <CheckCircleIcon />}
            >
              {loading ? "Submitting..." : "Complete Service"}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              size="large"
              sx={{
                minWidth: 140,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${colors.primary.blue} 0%, ${colors.primary.dark} 100%)`,
                boxShadow: '0 4px 16px rgba(74, 98, 138, 0.3)',
                py: 2,
                fontSize: '1.125rem',
                fontWeight: 700,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  background: `linear-gradient(135deg, ${colors.primary.dark} 0%, ${colors.primary.dark} 100%)`,
                  boxShadow: '0 8px 24px rgba(74, 98, 138, 0.4)',
                  transform: 'translateY(-2px)',
                }
              }}
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