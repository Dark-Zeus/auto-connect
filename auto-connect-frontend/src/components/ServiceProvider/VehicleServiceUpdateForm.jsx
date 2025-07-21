import React, { useState, useRef } from "react";
import {
  Car,
  Upload,
  Calendar,
  DollarSign,
  Camera,
  Plus,
  Trash2,
  Save,
  FileText,
  Wrench,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  User,
  Phone,
  MapPin,
  Settings,
  Zap,
  Shield,
  AlertCircle,
} from "lucide-react";

// Reusable Input Component
const FormInput = ({
  label,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  icon: Icon,
  options = [],
  ...props
}) => {
  const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

  const inputStyle = {
    width: "100%",
    padding: Icon ? "1rem 1rem 1rem 3rem" : "1rem",
    border: "2px solid #DFF2EB",
    borderRadius: "12px",
    fontSize: "1rem",
    fontFamily: "inherit",
    background: "white",
    transition: "all 0.3s ease",
  };

  const renderInput = () => {
    if (type === "select") {
      return (
        <select
          id={inputId}
          value={value}
          onChange={onChange}
          required={required}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = "#7AB2D3")}
          onBlur={(e) => (e.target.style.borderColor = "#DFF2EB")}
          {...props}
        >
          <option value="">{placeholder || `Select ${label}`}</option>
          {options.map((option) => (
            <option key={option.value || option} value={option.value || option}>
              {option.label || option}
            </option>
          ))}
        </select>
      );
    }

    if (type === "textarea") {
      return (
        <textarea
          id={inputId}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          style={{
            ...inputStyle,
            resize: "vertical",
            minHeight: "100px",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#7AB2D3")}
          onBlur={(e) => (e.target.style.borderColor = "#DFF2EB")}
          {...props}
        />
      );
    }

    return (
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = "#7AB2D3")}
        onBlur={(e) => (e.target.style.borderColor = "#DFF2EB")}
        {...props}
      />
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <label
        htmlFor={inputId}
        style={{
          display: "block",
          fontSize: "1rem",
          fontWeight: "600",
          color: "#2c3e50",
          marginBottom: "0.5rem",
        }}
      >
        {label} {required && <span style={{ color: "#e74c3c" }}>*</span>}
      </label>
      <div style={{ position: "relative" }}>
        {Icon && (
          <Icon
            size={20}
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#7AB2D3",
              zIndex: 2,
            }}
          />
        )}
        {renderInput()}
      </div>
    </div>
  );
};

// Service Category Component
const ServiceCategorySection = ({ serviceDetails, onChange }) => {
  const serviceTypes = [
    { value: "maintenance", label: "🔧 Regular Maintenance" },
    { value: "repair", label: "⚙️ Repair Work" },
    { value: "diagnostic", label: "🔍 Diagnostic Service" },
    { value: "inspection", label: "📋 Safety Inspection" },
    { value: "bodywork", label: "🚗 Body Work" },
    { value: "electrical", label: "⚡ Electrical System" },
    { value: "engine", label: "🏎️ Engine Service" },
    { value: "transmission", label: "⚙️ Transmission" },
    { value: "brakes", label: "🛑 Brake System" },
    { value: "suspension", label: "🔩 Suspension" },
    { value: "air_conditioning", label: "❄️ Air Conditioning" },
    { value: "tire_service", label: "🛞 Tire Service" },
    { value: "oil_change", label: "🛢️ Oil Change" },
    { value: "battery", label: "🔋 Battery Service" },
    { value: "other", label: "📝 Other" },
  ];

  const priorities = [
    { value: "routine", label: "Routine Maintenance" },
    { value: "urgent", label: "Urgent Repair" },
    { value: "emergency", label: "Emergency Service" },
    { value: "recall", label: "Manufacturer Recall" },
  ];

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "20px",
        padding: "2rem",
        marginBottom: "1.5rem",
        boxShadow: "0 10px 30px rgba(74, 98, 138, 0.1)",
        border: "1px solid rgba(122, 178, 211, 0.2)",
      }}
    >
      <h3
        style={{
          fontSize: "1.5rem",
          fontWeight: "600",
          color: "#2c3e50",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <Settings size={24} style={{ color: "#7AB2D3" }} />
        Service Category & Details
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
        }}
      >
        <FormInput
          label="Service Type"
          type="select"
          value={serviceDetails.serviceType}
          onChange={(e) => onChange("serviceType", e.target.value)}
          options={serviceTypes}
          required
          icon={Wrench}
        />

        <FormInput
          label="Priority Level"
          type="select"
          value={serviceDetails.priority}
          onChange={(e) => onChange("priority", e.target.value)}
          options={priorities}
          required
          icon={AlertTriangle}
        />

        <FormInput
          label="Work Order Number"
          value={serviceDetails.workOrderNumber}
          onChange={(e) => onChange("workOrderNumber", e.target.value)}
          placeholder="WO-2025-001234"
          required
          icon={FileText}
        />

        <FormInput
          label="Service Advisor"
          value={serviceDetails.serviceAdvisor}
          onChange={(e) => onChange("serviceAdvisor", e.target.value)}
          placeholder="John Smith"
          required
          icon={User}
        />
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <FormInput
          label="Service Description"
          type="textarea"
          value={serviceDetails.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Detailed description of the work performed, including specific procedures, findings, and recommendations..."
          required
          rows={4}
        />
      </div>
    </div>
  );
};

// Vehicle Information Component
const VehicleInfoSection = ({ vehicleInfo, onChange }) => {
  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "20px",
        padding: "2rem",
        marginBottom: "1.5rem",
        boxShadow: "0 10px 30px rgba(74, 98, 138, 0.1)",
        border: "1px solid rgba(122, 178, 211, 0.2)",
      }}
    >
      <h3
        style={{
          fontSize: "1.5rem",
          fontWeight: "600",
          color: "#2c3e50",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <Car size={24} style={{ color: "#7AB2D3" }} />
        Vehicle Information
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
        }}
      >
        <FormInput
          label="License Plate"
          value={vehicleInfo.plateNumber}
          onChange={(e) => onChange("plateNumber", e.target.value)}
          placeholder="ABC-1234"
          required
        />

        <FormInput
          label="VIN Number"
          value={vehicleInfo.vin}
          onChange={(e) => onChange("vin", e.target.value)}
          placeholder="1HGBH41JXMN109186"
          maxLength={17}
        />

        <FormInput
          label="Current Mileage"
          type="number"
          value={vehicleInfo.currentMileage}
          onChange={(e) => onChange("currentMileage", e.target.value)}
          placeholder="45,000"
          required
        />

        <FormInput
          label="Engine Number"
          value={vehicleInfo.engineNumber}
          onChange={(e) => onChange("engineNumber", e.target.value)}
          placeholder="4G63T123456"
        />

        <FormInput
          label="Last Service Date"
          type="date"
          value={vehicleInfo.lastServiceDate}
          onChange={(e) => onChange("lastServiceDate", e.target.value)}
        />

        <FormInput
          label="Next Service Due"
          type="date"
          value={vehicleInfo.nextServiceDue}
          onChange={(e) => onChange("nextServiceDue", e.target.value)}
        />
      </div>
    </div>
  );
};

// Customer Information Component
const CustomerInfoSection = ({ customerInfo, onChange }) => {
  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "20px",
        padding: "2rem",
        marginBottom: "1.5rem",
        boxShadow: "0 10px 30px rgba(74, 98, 138, 0.1)",
        border: "1px solid rgba(122, 178, 211, 0.2)",
      }}
    >
      <h3
        style={{
          fontSize: "1.5rem",
          fontWeight: "600",
          color: "#2c3e50",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <User size={24} style={{ color: "#7AB2D3" }} />
        Customer Information
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
        }}
      >
        <FormInput
          label="Customer Name"
          value={customerInfo.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="John Doe"
          required
          icon={User}
        />

        <FormInput
          label="Phone Number"
          type="tel"
          value={customerInfo.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          placeholder="+94 77 123 4567"
          required
          icon={Phone}
        />

        <FormInput
          label="Customer Address"
          type="textarea"
          value={customerInfo.address}
          onChange={(e) => onChange("address", e.target.value)}
          placeholder="123 Main Street, Colombo 07"
          icon={MapPin}
          rows={2}
        />
      </div>
    </div>
  );
};

// Main Vehicle Service Update Form Component
const VehicleServiceUpdateForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [vehicleInfo, setVehicleInfo] = useState({
    plateNumber: "",
    vin: "",
    currentMileage: "",
    engineNumber: "",
    lastServiceDate: "",
    nextServiceDue: "",
    ...initialData.vehicleInfo,
  });

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    ...initialData.customerInfo,
  });

  const [serviceDetails, setServiceDetails] = useState({
    serviceType: "",
    priority: "",
    workOrderNumber: "",
    serviceAdvisor: "",
    description: "",
    dateCompleted: new Date().toISOString().split("T")[0],
    laborHours: "",
    ...initialData.serviceDetails,
  });

  const [technicians, setTechnicians] = useState([
    { id: 1, name: "", certificationLevel: "", hoursWorked: "" },
  ]);

  const [partsReplaced, setPartsReplaced] = useState([]);
  const [laborCharges, setLaborCharges] = useState([]);
  const [fluidsChecked, setFluidsChecked] = useState([]);
  const [diagnosticResults, setDiagnosticResults] = useState([]);
  const [qualityChecks, setQualityChecks] = useState([]);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);

  // Handler functions for state updates
  const handleVehicleInfoChange = (field, value) => {
    setVehicleInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleServiceDetailsChange = (field, value) => {
    setServiceDetails((prev) => ({ ...prev, [field]: value }));
  };

  // Add technician
  const addTechnician = () => {
    setTechnicians((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        certificationLevel: "",
        hoursWorked: "",
      },
    ]);
  };

  // Remove technician
  const removeTechnician = (id) => {
    setTechnicians((prev) => prev.filter((tech) => tech.id !== id));
  };

  // Update technician
  const updateTechnician = (id, field, value) => {
    setTechnicians((prev) =>
      prev.map((tech) => (tech.id === id ? { ...tech, [field]: value } : tech))
    );
  };

  // Add part
  const addPart = () => {
    const newPart = {
      id: Date.now(),
      partName: "",
      partNumber: "",
      manufacturer: "",
      quantity: 1,
      unitCost: "",
      totalCost: "",
      warranty: "",
      supplier: "",
    };
    setPartsReplaced((prev) => [...prev, newPart]);
  };

  // Remove part
  const removePart = (id) => {
    setPartsReplaced((prev) => prev.filter((part) => part.id !== id));
  };

  // Update part
  const updatePart = (id, field, value) => {
    setPartsReplaced((prev) =>
      prev.map((part) => {
        if (part.id === id) {
          const updatedPart = { ...part, [field]: value };
          // Auto-calculate total cost
          if (field === "quantity" || field === "unitCost") {
            const quantity =
              field === "quantity"
                ? parseFloat(value) || 0
                : parseFloat(part.quantity) || 0;
            const unitCost =
              field === "unitCost"
                ? parseFloat(value) || 0
                : parseFloat(part.unitCost) || 0;
            updatedPart.totalCost = (quantity * unitCost).toFixed(2);
          }
          return updatedPart;
        }
        return part;
      })
    );
  };

  // Calculate total costs
  const calculateTotalCosts = () => {
    const partsTotal = partsReplaced.reduce(
      (sum, part) => sum + (parseFloat(part.totalCost) || 0),
      0
    );
    const laborTotal = laborCharges.reduce(
      (sum, labor) => sum + (parseFloat(labor.amount) || 0),
      0
    );
    return {
      parts: partsTotal.toFixed(2),
      labor: laborTotal.toFixed(2),
      total: (partsTotal + laborTotal).toFixed(2),
    };
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!vehicleInfo.plateNumber)
      newErrors.plateNumber = "License plate is required";
    if (!vehicleInfo.currentMileage)
      newErrors.currentMileage = "Current mileage is required";
    if (!customerInfo.name)
      newErrors.customerName = "Customer name is required";
    if (!customerInfo.phone)
      newErrors.customerPhone = "Customer phone is required";
    if (!serviceDetails.serviceType)
      newErrors.serviceType = "Service type is required";
    if (!serviceDetails.workOrderNumber)
      newErrors.workOrderNumber = "Work order number is required";
    if (!serviceDetails.serviceAdvisor)
      newErrors.serviceAdvisor = "Service advisor is required";
    if (!serviceDetails.description)
      newErrors.description = "Service description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill in all required fields");
      return;
    }

    const costs = calculateTotalCosts();

    const formData = {
      vehicleInfo,
      customerInfo,
      serviceDetails,
      technicians: technicians.filter((tech) => tech.name.trim()),
      partsReplaced,
      laborCharges,
      fluidsChecked,
      diagnosticResults,
      qualityChecks,
      images,
      costs,
      submittedAt: new Date().toISOString(),
    };

    console.log("Form submitted:", formData);
    onSubmit(formData);
  };

  const costs = calculateTotalCosts();

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #DFF2EB 0%, #B9E5E8 50%, #7AB2D3 100%)",
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        padding: "2rem 0",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 1rem",
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* Service Category Section */}
          <ServiceCategorySection
            serviceDetails={serviceDetails}
            onChange={handleServiceDetailsChange}
          />

          {/* Vehicle Information Section */}
          <VehicleInfoSection
            vehicleInfo={vehicleInfo}
            onChange={handleVehicleInfoChange}
          />

          {/* Customer Information Section */}
          <CustomerInfoSection
            customerInfo={customerInfo}
            onChange={handleCustomerInfoChange}
          />

          {/* Technicians Section */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "20px",
              padding: "2rem",
              marginBottom: "1.5rem",
              boxShadow: "0 10px 30px rgba(74, 98, 138, 0.1)",
              border: "1px solid rgba(122, 178, 211, 0.2)",
            }}
          >
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#2c3e50",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <Wrench size={24} style={{ color: "#7AB2D3" }} />
              Technicians Assigned
            </h3>

            {technicians.map((technician, index) => (
              <div
                key={technician.id}
                style={{
                  background: "#f8f9fa",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  marginBottom: "1rem",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1rem",
                    alignItems: "end",
                  }}
                >
                  <FormInput
                    label="Technician Name"
                    value={technician.name}
                    onChange={(e) =>
                      updateTechnician(technician.id, "name", e.target.value)
                    }
                    placeholder="John Smith"
                    required={index === 0}
                  />

                  <FormInput
                    label="Certification Level"
                    type="select"
                    value={technician.certificationLevel}
                    onChange={(e) =>
                      updateTechnician(
                        technician.id,
                        "certificationLevel",
                        e.target.value
                      )
                    }
                    options={[
                      "Apprentice",
                      "Journeyman",
                      "Master Technician",
                      "ASE Certified",
                      "Manufacturer Certified",
                    ]}
                  />

                  <FormInput
                    label="Hours Worked"
                    type="number"
                    step="0.5"
                    value={technician.hoursWorked}
                    onChange={(e) =>
                      updateTechnician(
                        technician.id,
                        "hoursWorked",
                        e.target.value
                      )
                    }
                    placeholder="8.0"
                  />

                  {technicians.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTechnician(technician.id)}
                      style={{
                        background: "#fee2e2",
                        color: "#dc2626",
                        border: "none",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "fit-content",
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addTechnician}
              style={{
                background: "linear-gradient(135deg, #7AB2D3, #4A628A)",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Plus size={16} />
              Add Technician
            </button>
          </div>

          {/* Parts Section */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "20px",
              padding: "2rem",
              marginBottom: "1.5rem",
              boxShadow: "0 10px 30px rgba(74, 98, 138, 0.1)",
              border: "1px solid rgba(122, 178, 211, 0.2)",
            }}
          >
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#2c3e50",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <Settings size={24} style={{ color: "#7AB2D3" }} />
              Parts & Materials Used
            </h3>

            {partsReplaced.map((part) => (
              <div
                key={part.id}
                style={{
                  background: "#f8f9fa",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  marginBottom: "1rem",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <FormInput
                    label="Part Name"
                    value={part.partName}
                    onChange={(e) =>
                      updatePart(part.id, "partName", e.target.value)
                    }
                    placeholder="Brake Pads"
                    required
                  />

                  <FormInput
                    label="Part Number"
                    value={part.partNumber}
                    onChange={(e) =>
                      updatePart(part.id, "partNumber", e.target.value)
                    }
                    placeholder="BP-123456"
                  />

                  <FormInput
                    label="Manufacturer"
                    value={part.manufacturer}
                    onChange={(e) =>
                      updatePart(part.id, "manufacturer", e.target.value)
                    }
                    placeholder="OEM / Bosch / etc."
                  />

                  <FormInput
                    label="Quantity"
                    type="number"
                    min="1"
                    value={part.quantity}
                    onChange={(e) =>
                      updatePart(part.id, "quantity", e.target.value)
                    }
                    placeholder="1"
                    required
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1rem",
                    alignItems: "end",
                  }}
                >
                  <FormInput
                    label="Unit Cost (LKR)"
                    type="number"
                    step="0.01"
                    value={part.unitCost}
                    onChange={(e) =>
                      updatePart(part.id, "unitCost", e.target.value)
                    }
                    placeholder="5000.00"
                    required
                  />

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "#2c3e50",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Total Cost (LKR)
                    </label>
                    <div
                      style={{
                        padding: "1rem",
                        border: "2px solid #DFF2EB",
                        borderRadius: "12px",
                        background: "#f8f9fa",
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "#4A628A",
                      }}
                    >
                      {part.totalCost || "0.00"}
                    </div>
                  </div>

                  <FormInput
                    label="Warranty Period"
                    value={part.warranty}
                    onChange={(e) =>
                      updatePart(part.id, "warranty", e.target.value)
                    }
                    placeholder="12 months / 20,000 km"
                  />

                  <button
                    type="button"
                    onClick={() => removePart(part.id)}
                    style={{
                      background: "#fee2e2",
                      color: "#dc2626",
                      border: "none",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "fit-content",
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addPart}
              style={{
                background: "linear-gradient(135deg, #7AB2D3, #4A628A)",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Plus size={16} />
              Add Part
            </button>
          </div>

          {/* Cost Summary */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "20px",
              padding: "2rem",
              marginBottom: "1.5rem",
              boxShadow: "0 10px 30px rgba(74, 98, 138, 0.1)",
              border: "1px solid rgba(122, 178, 211, 0.2)",
            }}
          >
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#2c3e50",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <DollarSign size={24} style={{ color: "#7AB2D3" }} />
              Cost Summary
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  border: "1px solid #bbf7d0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Settings size={20} style={{ color: "#16a34a" }} />
                  <h4
                    style={{
                      margin: 0,
                      color: "#16a34a",
                      fontSize: "1rem",
                      fontWeight: "600",
                    }}
                  >
                    Parts Total
                  </h4>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#166534",
                  }}
                >
                  LKR {costs.parts}
                </p>
              </div>

              <div
                style={{
                  background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  border: "1px solid #bfdbfe",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Clock size={20} style={{ color: "#2563eb" }} />
                  <h4
                    style={{
                      margin: 0,
                      color: "#2563eb",
                      fontSize: "1rem",
                      fontWeight: "600",
                    }}
                  >
                    Labor Total
                  </h4>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#1e40af",
                  }}
                >
                  LKR {costs.labor}
                </p>
              </div>

              <div
                style={{
                  background: "linear-gradient(135deg, #7AB2D3, #4A628A)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  color: "white",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <DollarSign size={20} />
                  <h4
                    style={{ margin: 0, fontSize: "1rem", fontWeight: "600" }}
                  >
                    Grand Total
                  </h4>
                </div>
                <p
                  style={{ margin: 0, fontSize: "1.75rem", fontWeight: "700" }}
                >
                  LKR {costs.total}
                </p>
              </div>
            </div>

            {/* Labor Charges Section */}
            <div style={{ marginTop: "2rem" }}>
              <h4
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#2c3e50",
                  marginBottom: "1rem",
                }}
              >
                Labor Charges
              </h4>

              {laborCharges.map((labor, index) => (
                <div
                  key={index}
                  style={{
                    background: "#f8f9fa",
                    padding: "1rem",
                    borderRadius: "8px",
                    marginBottom: "0.5rem",
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr auto",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Labor description"
                    value={labor.description || ""}
                    onChange={(e) => {
                      const newLabor = [...laborCharges];
                      newLabor[index] = {
                        ...newLabor[index],
                        description: e.target.value,
                      };
                      setLaborCharges(newLabor);
                    }}
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                      fontSize: "0.875rem",
                    }}
                  />
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Hours"
                    value={labor.hours || ""}
                    onChange={(e) => {
                      const newLabor = [...laborCharges];
                      newLabor[index] = {
                        ...newLabor[index],
                        hours: e.target.value,
                      };
                      setLaborCharges(newLabor);
                    }}
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                      fontSize: "0.875rem",
                    }}
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Rate (LKR)"
                    value={labor.rate || ""}
                    onChange={(e) => {
                      const newLabor = [...laborCharges];
                      const hours = parseFloat(newLabor[index]?.hours) || 0;
                      const rate = parseFloat(e.target.value) || 0;
                      newLabor[index] = {
                        ...newLabor[index],
                        rate: e.target.value,
                        amount: (hours * rate).toFixed(2),
                      };
                      setLaborCharges(newLabor);
                    }}
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                      fontSize: "0.875rem",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setLaborCharges(
                        laborCharges.filter((_, i) => i !== index)
                      )
                    }
                    style={{
                      background: "#fee2e2",
                      color: "#dc2626",
                      border: "none",
                      padding: "0.5rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  setLaborCharges([
                    ...laborCharges,
                    { description: "", hours: "", rate: "", amount: "0.00" },
                  ])
                }
                style={{
                  background: "none",
                  border: "2px dashed #7AB2D3",
                  color: "#7AB2D3",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Plus size={16} />
                Add Labor Charge
              </button>
            </div>
          </div>

          {/* Quality Assurance Section */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "20px",
              padding: "2rem",
              marginBottom: "1.5rem",
              boxShadow: "0 10px 30px rgba(74, 98, 138, 0.1)",
              border: "1px solid rgba(122, 178, 211, 0.2)",
            }}
          >
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#2c3e50",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <Shield size={24} style={{ color: "#7AB2D3" }} />
              Quality Assurance & Testing
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1.5rem",
              }}
            >
              <FormInput
                label="Quality Check Performed By"
                value={serviceDetails.qualityChecker || ""}
                onChange={(e) =>
                  handleServiceDetailsChange("qualityChecker", e.target.value)
                }
                placeholder="Senior Technician Name"
                icon={User}
              />

              <FormInput
                label="Test Drive Completed"
                type="select"
                value={serviceDetails.testDriveCompleted || ""}
                onChange={(e) =>
                  handleServiceDetailsChange(
                    "testDriveCompleted",
                    e.target.value
                  )
                }
                options={[
                  { value: "yes", label: "Yes - Test drive completed" },
                  { value: "no", label: "No - Test drive not required" },
                  { value: "na", label: "N/A - Vehicle not operational" },
                ]}
                icon={Car}
              />

              <FormInput
                label="Final Inspection Status"
                type="select"
                value={serviceDetails.inspectionStatus || ""}
                onChange={(e) =>
                  handleServiceDetailsChange("inspectionStatus", e.target.value)
                }
                options={[
                  { value: "passed", label: "Passed - All systems OK" },
                  { value: "passed_notes", label: "Passed with notes" },
                  { value: "failed", label: "Failed - Requires attention" },
                ]}
                icon={CheckCircle}
              />
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <FormInput
                label="Quality Assurance Notes"
                type="textarea"
                value={serviceDetails.qualityNotes || ""}
                onChange={(e) =>
                  handleServiceDetailsChange("qualityNotes", e.target.value)
                }
                placeholder="Document any quality checks, test results, or additional notes..."
                rows={3}
              />
            </div>
          </div>

          {/* Images and Documentation */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "20px",
              padding: "2rem",
              marginBottom: "1.5rem",
              boxShadow: "0 10px 30px rgba(74, 98, 138, 0.1)",
              border: "1px solid rgba(122, 178, 211, 0.2)",
            }}
          >
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#2c3e50",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <Camera size={24} style={{ color: "#7AB2D3" }} />
              Documentation & Images
            </h3>

            {/* Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: "2px dashed #7AB2D3",
                borderRadius: "12px",
                padding: "3rem 2rem",
                textAlign: "center",
                cursor: "pointer",
                background: "linear-gradient(135deg, #DFF2EB, #B9E5E8)",
                transition: "all 0.3s ease",
                marginBottom: "1.5rem",
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = "#4A628A";
                e.target.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = "#7AB2D3";
                e.target.style.transform = "scale(1)";
              }}
            >
              <Upload
                size={48}
                style={{ color: "#4A628A", marginBottom: "1rem" }}
              />
              <p
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  color: "#2c3e50",
                  margin: "0 0 0.5rem 0",
                }}
              >
                Upload service documentation and images
              </p>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#6c757d",
                  margin: 0,
                }}
              >
                Before/after photos, diagnostic reports, part receipts, etc.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={(e) => {
                const files = Array.from(e.target.files);
                files.forEach((file) => {
                  if (file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      setImages((prev) => [
                        ...prev,
                        {
                          id: Date.now() + Math.random(),
                          url: e.target.result,
                          name: file.name,
                          type: "image",
                        },
                      ]);
                    };
                    reader.readAsDataURL(file);
                  } else {
                    setImages((prev) => [
                      ...prev,
                      {
                        id: Date.now() + Math.random(),
                        name: file.name,
                        type: "document",
                        file: file,
                      },
                    ]);
                  }
                });
              }}
              style={{ display: "none" }}
            />

            {/* Image/Document Preview Grid */}
            {images.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "1rem",
                }}
              >
                {images.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      position: "relative",
                      background: "white",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0 4px 12px rgba(74, 98, 138, 0.1)",
                    }}
                  >
                    {item.type === "image" ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: "150px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#f8f9fa",
                        }}
                      >
                        <FileText size={48} style={{ color: "#6c757d" }} />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setImages(images.filter((img) => img.id !== item.id))
                      }
                      style={{
                        position: "absolute",
                        top: "0.5rem",
                        right: "0.5rem",
                        background: "rgba(220, 38, 38, 0.9)",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "2rem",
                        height: "2rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                    <div
                      style={{
                        padding: "0.75rem",
                        fontSize: "0.875rem",
                        color: "#6c757d",
                        textAlign: "center",
                        wordBreak: "break-word",
                      }}
                    >
                      {item.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Section */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 10px 30px rgba(74, 98, 138, 0.1)",
              border: "1px solid rgba(122, 178, 211, 0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "2rem",
                flexWrap: "wrap",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#2c3e50",
                    margin: "0 0 0.5rem 0",
                  }}
                >
                  Ready to Submit Service Record?
                </h3>
                <p
                  style={{
                    color: "#6c757d",
                    margin: 0,
                    fontSize: "0.875rem",
                  }}
                >
                  Please review all information before submitting to the vehicle
                  passport system
                </p>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="button"
                  onClick={onCancel}
                  style={{
                    background: "none",
                    color: "#6c757d",
                    border: "2px solid #e5e7eb",
                    padding: "1rem 2rem",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = "#dc2626";
                    e.target.style.color = "#dc2626";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.color = "#6c757d";
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    background: "linear-gradient(135deg, #7AB2D3, #4A628A)",
                    color: "white",
                    border: "none",
                    padding: "1rem 2rem",
                    borderRadius: "12px",
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 16px rgba(74, 98, 138, 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 8px 24px rgba(74, 98, 138, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 4px 16px rgba(74, 98, 138, 0.3)";
                  }}
                >
                  <Save size={20} />
                  Submit Service Record
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleServiceUpdateForm;
