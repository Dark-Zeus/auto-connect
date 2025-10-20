import React, { useState, useRef, useEffect } from 'react';
import './AddNewPolicyPage.css';
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';

import * as insurancePolicyApiService from "@services/insurancePolicyApiService"; // Ensure the service is imported

// Move this OUTSIDE of AddNewPolicyPage
const FormField = ({
  type = "text", name, label, placeholder, required = false, options = null, rows = null, readOnly = false, hint = null, fullWidth = false,
  value, onChange, onBlur, error, touched
}) => {
  const hasError = touched && error;
  const fieldClass = `form-input ${readOnly ? 'readonly' : ''} ${hasError ? 'error' : ''}`;
  return (
    <div className={`form-group ${hasError ? 'error' : ''} ${fullWidth ? 'full-width' : ''}`}>
      <label className="form-label">
        {label} {required && '*'}
      </label>
      {type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`form-select ${hasError ? 'error' : ''}`}
          required={required}
        >
          <option value="">{placeholder}</option>
          {options && options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`form-textarea ${hasError ? 'error' : ''}`}
          placeholder={placeholder}
          rows={rows || 3}
          required={required}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={fieldClass}
          placeholder={placeholder}
          required={required}
          readOnly={readOnly}
        />
      )}
      {hint && <small className="form-hint">{hint}</small>}
      {hasError && <div className="error-message">{error}</div>}
    </div>
  );
};

const AddNewPolicyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [policyTypes, setPolicyTypes] = useState([]);

  // Check if this is a renewal
  const isRenewal = location.state?.isRenewal || false;
  const existingPolicy = location.state?.existingPolicy || null;

  // Form data state
  const [formData, setFormData] = useState({
    // Customer Personal Details
    vehicleOwnerName: '',
    nic: '',
    address: '',
    email: '',
    contactNo: '',
    
    // Vehicle Information
    vehicleType: '',
    vehicleNumber: '',
    vehicleRegistrationNumber: '',
    engineCapacity: '',
    chassisNumber: '',
    vehicleModel: '',
    vehicleMake: '',
    manufactureYear: '',
    fuelType: '',
    estimatedValue: '',
    
    // Policy Information
    policyNumber: '',
    policyType: '',
    premiumAmount: '',
    policyStartDate: '',
    policyEndDate: ''
  });

  // Pre-fill form data if this is a renewal
  useEffect(() => {
    if (isRenewal && existingPolicy) {
      setFormData({
        // Customer Personal Details (pre-filled from existing policy)
        vehicleOwnerName: existingPolicy.customerName || '',
        nic: existingPolicy.nic || '',
        address: existingPolicy.address || '',
        email: existingPolicy.email || '',
        contactNo: existingPolicy.contactNo || '',
        
        // Vehicle Information (pre-filled from existing policy)
        vehicleType: existingPolicy.vehicleType || '',
        vehicleNumber: existingPolicy.vehicleNumber || '',
        vehicleRegistrationNumber: existingPolicy.registrationNumber || '',
        engineCapacity: existingPolicy.engineCapacity || '',
        chassisNumber: existingPolicy.chassisNumber || '',
        vehicleModel: existingPolicy.vehicleModel || '',
        vehicleMake: existingPolicy.vehicleMake || '',
        manufactureYear: existingPolicy.manufactureYear || '',
        fuelType: existingPolicy.fuelType || '',
        estimatedValue: existingPolicy.estimatedValue?.toString() || '',
        
        // Policy Information (will be updated with new values)
        policyNumber: '', // Will be auto-generated
        policyType: existingPolicy.policyType || '',
        premiumAmount: '',
        policyStartDate: '',
        policyEndDate: ''
      });
    }
  }, [isRenewal, existingPolicy]);

  // Generate policy number on component mount
  useEffect(() => {
    const generatePolicyNumber = () => {
      const currentYear = new Date().getFullYear();
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `POL-${currentYear}-${randomNum}`;
    };

    const fetchPolicyTypes = async () => {
      try {
        const typesData = await insurancePolicyApiService.getAllInsurancePolicyTypes();
        setPolicyTypes(typesData.data);
      } catch (error) {
        toast.error("Failed to fetch policy types.");
        console.error("Error fetching policy types:", error);
      }
    };

    fetchPolicyTypes();
    
    setFormData(prev => ({
      ...prev,
      policyNumber: generatePolicyNumber()
    }));
  }, []);

  // Auto-calculate premium when estimated value changes
  useEffect(() => {
    if (formData.estimatedValue && formData.policyType) {
      let premium = 0;
      const estimatedValue = parseFloat(formData.estimatedValue);
      
      // calculate premium based on policy type, get rates from policyTypes state
      const selectedPolicyType = policyTypes.find(type => type.policyTypeName === formData.policyType);
      if (selectedPolicyType) {
        const rate = selectedPolicyType.premiumPerLakh; // assuming 'rate' field exists
        premium = (estimatedValue / 100) * rate;
      }
      
      setFormData(prev => ({
        ...prev,
        premiumAmount: Math.round(premium).toString()
      }));
    }
  }, [formData.estimatedValue, formData.policyType]);

  // Auto-calculate end date when start date changes
  useEffect(() => {
    if (formData.policyStartDate) {
      const startDate = new Date(formData.policyStartDate);
      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
      
      setFormData(prev => ({
        ...prev,
        policyEndDate: endDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.policyStartDate]);

  // Validation functions
  const validateNIC = (nic) => {
    if (!nic) return "This field is mandatory";
    const nicPattern1 = /^\d{9}[vV]$/; // 9 digits + V/v
    const nicPattern2 = /^\d{12}$/; // 12 digits
    if (!nicPattern1.test(nic) && !nicPattern2.test(nic)) {
      return "NIC must be 9 numbers followed by V or 12 numbers";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return "This field is mandatory";
    if (!email.includes('@')) {
      return "Email must contain @ sign";
    }
    return "";
  };

  const validateContactNo = (contactNo) => {
    if (!contactNo) return "This field is mandatory";
    const cleanNumber = contactNo.replace(/[^\d]/g, ''); // Remove non-digits
    if (cleanNumber.length !== 10) {
      return "Contact number must be 10 digits";
    }
    return "";
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'vehicleOwnerName':
        return !value ? "This field is mandatory" : "";
      case 'nic':
        return validateNIC(value);
      case 'address':
        return !value ? "This field is mandatory" : "";
      case 'email':
        return validateEmail(value);
      case 'contactNo':
        return validateContactNo(value);
      case 'vehicleType':
      case 'vehicleNumber':
      case 'vehicleRegistrationNumber':
      case 'engineCapacity':
      case 'chassisNumber':
      case 'vehicleModel':
      case 'vehicleMake':
      case 'manufactureYear':
      case 'fuelType':
      case 'estimatedValue':
      case 'policyType':
      case 'policyStartDate':
        return !value ? "This field is mandatory" : "";
      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field and update errors
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateStep = (step) => {
    let stepFields = [];
    let newErrors = {};
    let isValid = true;

    switch (step) {
      case 1:
        stepFields = ['vehicleOwnerName', 'nic', 'address', 'email', 'contactNo'];
        break;
      case 2:
        stepFields = ['vehicleType', 'vehicleNumber', 'vehicleRegistrationNumber',
                     'engineCapacity', 'chassisNumber', 'vehicleModel',
                     'vehicleMake', 'manufactureYear', 'fuelType', 'estimatedValue'];
        break;
      case 3:
        stepFields = ['policyType', 'policyStartDate'];
        break;
      case 4:
        return agreedToTerms;
      default:
        return false;
    }

    // Validate all fields in current step
    stepFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    // Mark all fields in step as touched
    const newTouched = {};
    stepFields.forEach(field => {
      newTouched[field] = true;
    });

    setTouched(prev => ({ ...prev, ...newTouched }));
    setErrors(prev => ({ ...prev, ...newErrors }));

    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep(4)) {
      // Here you would typically send the data to your backend
      console.log('Policy Data:', formData);
      const message = isRenewal ? 'Policy renewed successfully!' : 'Policy created successfully!';
      if(isRenewal){

      } else {
        insurancePolicyApiService.createInsurancePolicy(formData)
          .then((data) => {
            console.log('Created Policy:', data);
          })
          .catch((error) => {
            console.error('Error creating policy:', error);
            toast.error('Failed to create policy. Please try again.');
            return;
          });
      }
      toast.success(message);
      navigate('/policymanagement');
    } else {
      toast.error('Please agree to the terms and conditions before submitting.');
    }
  };

  // Digital signature functionality
  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const openPolicyRules = () => {
    // This would typically open a PDF or modal with policy rules
    window.open('/policy-rules.pdf', '_blank');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3 className="step-title">Customer Personal Details</h3>
            {isRenewal && (
              <div className="renewal-notice">
                <span className="renewal-icon">🔄</span>
                <span>Renewing policy for existing customer. You can update the details if needed.</span>
              </div>
            )}
            <div className="form-grid">
              <FormField
                name="vehicleOwnerName"
                label="Vehicle Owner's Name"
                placeholder="Enter full name"
                value={formData.vehicleOwnerName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.vehicleOwnerName}
                touched={touched.vehicleOwnerName}
                required={true}
              />
              <FormField
                name="nic"
                label="NIC Number"
                placeholder="e.g., 912345678V or 199123456789"
                value={formData.nic}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.nic}
                touched={touched.nic}
                required={true}
              />
              <FormField
                type="textarea"
                name="address"
                label="Address"
                placeholder="Enter complete address"
                value={formData.address}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.address}
                touched={touched.address}
                required={true}
                fullWidth={true}
              />
              <FormField
                type="email"
                name="email"
                label="Email Address"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.email}
                touched={touched.email}
                required={true}
              />
              <FormField
                type="tel"
                name="contactNo"
                label="Contact Number"
                placeholder="0771234567"
                value={formData.contactNo}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.contactNo}
                touched={touched.contactNo}
                required={true}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h3 className="step-title">Vehicle Information</h3>
            {isRenewal && (
              <div className="renewal-notice">
                <span className="renewal-icon">🚗</span>
                <span>Vehicle information from previous policy. Update if any changes occurred.</span>
              </div>
            )}
            <div className="form-grid">
              <FormField
                type="select"
                name="vehicleType"
                label="Vehicle Type"
                placeholder="Select Vehicle Type"
                value={formData.vehicleType}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.vehicleType}
                touched={touched.vehicleType}
                required={true}
                options={[
                  { value: "Car", label: "Car" },
                  { value: "Van", label: "Van" },
                  { value: "SUV", label: "SUV" },
                  { value: "Pickup", label: "Pickup" },
                  { value: "Bus", label: "Bus" },
                  { value: "Truck", label: "Truck" },
                  { value: "Motorcycle", label: "Motorcycle" },
                  { value: "Three Wheeler", label: "Three Wheeler" }
                ]}
              />
              <FormField
                name="vehicleNumber"
                label="Vehicle Number"
                placeholder="e.g., CAB-1234"
                value={formData.vehicleNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.vehicleNumber}
                touched={touched.vehicleNumber}
                required={true}
              />
              <FormField
                name="vehicleRegistrationNumber"
                label="Vehicle Registration Number"
                placeholder="Registration number"
                value={formData.vehicleRegistrationNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.vehicleRegistrationNumber}
                touched={touched.vehicleRegistrationNumber}
                required={true}
              />
              <FormField
                type="number"
                name="engineCapacity"
                label="Engine Capacity (CC)"
                placeholder="e.g., 1500"
                value={formData.engineCapacity}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.engineCapacity}
                touched={touched.engineCapacity}
                required={true}
              />
              <FormField
                name="chassisNumber"
                label="Chassis Number"
                placeholder="Chassis number"
                value={formData.chassisNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.chassisNumber}
                touched={touched.chassisNumber}
                required={true}
              />
              <FormField
                name="vehicleModel"
                label="Vehicle Model"
                placeholder="e.g., Corolla"
                value={formData.vehicleModel}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.vehicleModel}
                touched={touched.vehicleModel}
                required={true}
              />
              <FormField
                name="vehicleMake"
                label="Vehicle Make"
                placeholder="e.g., Toyota"
                value={formData.vehicleMake}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.vehicleMake}
                touched={touched.vehicleMake}
                required={true}
              />
              <FormField
                type="select"
                name="manufactureYear"
                label="Manufacture Year"
                placeholder="Select Year"
                value={formData.manufactureYear}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.manufactureYear}
                touched={touched.manufactureYear}
                required={true}
                options={Array.from({ length: 30 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return { value: year.toString(), label: year.toString() };
                })}
              />
              <FormField
                type="select"
                name="fuelType"
                label="Fuel Type"
                placeholder="Select Fuel Type"
                value={formData.fuelType}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.fuelType}
                touched={touched.fuelType}
                required={true}
                options={[
                  { value: "Petrol", label: "Petrol" },
                  { value: "Diesel", label: "Diesel" },
                  { value: "Hybrid", label: "Hybrid" },
                  { value: "Electric", label: "Electric" },
                  { value: "CNG", label: "CNG" },
                  { value: "LPG", label: "LPG" }
                ]}
              />
              <FormField
                type="number"
                name="estimatedValue"
                label="Estimated Value of Vehicle (LKR)"
                placeholder="e.g., 2500000"
                value={formData.estimatedValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.estimatedValue}
                touched={touched.estimatedValue}
                required={true}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h3 className="step-title">Policy Information</h3>
            {isRenewal && (
              <div className="renewal-notice">
                <span className="renewal-icon">🛡️</span>
                <span>Setting up new policy details for renewal. Premium will be recalculated based on current vehicle value.</span>
              </div>
            )}
            <div className="form-grid">
              <FormField
                name="policyNumber"
                label="Policy Number"
                value={formData.policyNumber}
                readOnly={true}
                hint="Auto-generated by system"
              />
              <FormField
                type="select"
                name="policyType"
                label="Policy Type"
                placeholder="Select Policy Type"
                value={formData.policyType}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.policyType}
                touched={touched.policyType}
                required={true}
                options={
                  policyTypes.map(type => ({ value: type.policyTypeName, label: type.policyTypeName }) )
                }
              />
              <FormField
                name="premiumAmount"
                label="Premium Amount (LKR)"
                value={formData.premiumAmount}
                readOnly={true}
                hint="Auto-calculated based on vehicle value and policy type"
              />
              <FormField
                type="date"
                name="policyStartDate"
                label="Policy Start Date"
                value={formData.policyStartDate}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.policyStartDate}
                touched={touched.policyStartDate}
                required={true}
              />
              <FormField
                type="date"
                name="policyEndDate"
                label="Policy End Date"
                value={formData.policyEndDate}
                readOnly={true}
                hint="Auto-calculated (1 year from start date)"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h3 className="step-title">Confirmation</h3>
            
            {/* Renewal Notice */}
            {isRenewal && (
              <div className="renewal-confirmation-notice">
                <div className="renewal-header">
                  <span className="renewal-icon">🔄</span>
                  <h4>Policy Renewal Confirmation</h4>
                </div>
                <p>You are renewing policy for vehicle <strong>{formData.vehicleNumber}</strong></p>
                {existingPolicy && (
                  <p>Previous policy <strong>{existingPolicy.policyNumber}</strong> expired on <strong>{existingPolicy.endDate}</strong></p>
                )}
              </div>
            )}
            
            {/* Summary Section */}
            <div className="confirmation-summary">
              <h4>Policy Summary</h4>
              <div className="summary-grid">
                <div className="summary-section">
                  <h5>Customer Details</h5>
                  <p><strong>Name:</strong> {formData.vehicleOwnerName}</p>
                  <p><strong>NIC:</strong> {formData.nic}</p>
                  <p><strong>Contact:</strong> {formData.contactNo}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                </div>
                <div className="summary-section">
                  <h5>Vehicle Details</h5>
                  <p><strong>Type:</strong> {formData.vehicleType}</p>
                  <p><strong>Number:</strong> {formData.vehicleNumber}</p>
                  <p><strong>Make/Model:</strong> {formData.vehicleMake} {formData.vehicleModel}</p>
                  <p><strong>Year:</strong> {formData.manufactureYear}</p>
                  <p><strong>Value:</strong> LKR {parseInt(formData.estimatedValue || 0).toLocaleString()}</p>
                </div>
                <div className="summary-section">
                  <h5>Policy Details</h5>
                  <p><strong>Policy Number:</strong> {formData.policyNumber}</p>
                  <p><strong>Type:</strong> {formData.policyType}</p>
                  <p><strong>Premium:</strong> LKR {parseInt(formData.premiumAmount || 0).toLocaleString()}</p>
                  <p><strong>Period:</strong> {formData.policyStartDate} to {formData.policyEndDate}</p>
                </div>
              </div>
            </div>

            {/* Agreement Section */}
            <div className="agreement-section">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-text">
                  I have read and agree to the terms and conditions of this insurance policy
                </span>
              </label>

              <button type="button" className="rules-btn" onClick={openPolicyRules}>
                📄 View Policy Terms & Conditions
              </button>
            </div>
            {!agreedToTerms && touched.agreement && (
              <div className="error-message">You must agree to the terms and conditions</div>
            )}

            {/* Digital Signature Section */}
            <div className="signature-section">
              <h5>Digital Signature</h5>
              <div className="signature-container">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={150}
                  className="signature-canvas"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <div className="signature-label">Please sign above</div>
              </div>
              <button type="button" className="clear-signature-btn" onClick={clearSignature}>
                Clear Signature
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="add-policy-page">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          {isRenewal ? 'Renew Policy' : 'Add New Insurance Policy'}
        </h1>
        <p className="page-subtitle">
          {isRenewal 
            ? 'Renew an existing insurance policy for customer' 
            : 'Create a new insurance policy for customer'
          }
        </p>
      </div>

      {/* Progress Steps */}
      <div className="progress-steps">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className={`step ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}>
            <div className="step-number">{step}</div>
            <div className="step-label">
              {step === 1 && 'Customer Details'}
              {step === 2 && 'Vehicle Information'}
              {step === 3 && 'Policy Information'}
              {step === 4 && 'Confirmation'}
            </div>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="form-container">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="form-navigation">
        {currentStep > 1 && (
          <button type="button" className="nav-btn prev-btn" onClick={handlePrevious}>
            ← Previous
          </button>
        )}
        <div className="nav-spacer"></div>
        {currentStep < 4 ? (
          <button type="button" className="nav-btn next-btn" onClick={handleNext}>
            Next →
          </button>
        ) : (
          <button type="button" className="nav-btn submit-btn" onClick={handleSubmit}>
            {isRenewal ? 'Renew Policy' : 'Create Policy'}
          </button>
        )}
      </div>

      {/* Back to Policies */}
      <div className="bottom-actions">
        <button className="back-to-policies-btn" onClick={() => navigate('/policymanagement')}>
          ← Back to Policy Management
        </button>
      </div>
    </div>
  );
};

export default AddNewPolicyPage;