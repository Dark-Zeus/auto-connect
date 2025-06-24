import React, { useState } from "react";

// Reusable Components using AutoConnect Design System
const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg border";

  const variants = {
    primary:
      "bg-[#7AB2D3] text-white border-[#7AB2D3] hover:bg-[#4A628A] disabled:bg-gray-300",
    secondary:
      "bg-white text-[#4A628A] border-[#7AB2D3] hover:bg-[#DFF2EB] disabled:bg-gray-100",
    outline:
      "bg-transparent text-[#4A628A] border-[#7AB2D3] hover:bg-[#DFF2EB] disabled:text-gray-400",
    success:
      "bg-green-500 text-white border-green-500 hover:bg-green-600 disabled:bg-gray-300",
    danger:
      "bg-red-500 text-white border-red-500 hover:bg-red-600 disabled:bg-gray-300",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      } ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className="mr-2">{icon}</span>
          )}
          {children}
          {icon && iconPosition === "right" && (
            <span className="ml-2">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

const Input = ({
  label,
  error,
  helpText,
  icon,
  iconPosition = "left",
  className = "",
  required = false,
  ...props
}) => {
  const baseClasses =
    "w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7AB2D3] focus:ring-offset-1 text-gray-800 placeholder-gray-500";
  const errorClasses = error
    ? "border-red-500 bg-red-50"
    : "border-gray-300 focus:border-[#7AB2D3]";
  const iconClasses = icon ? (iconPosition === "left" ? "pl-12" : "pr-12") : "";

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div
            className={`absolute inset-y-0 ${
              iconPosition === "left" ? "left-0 pl-3" : "right-0 pr-3"
            } flex items-center pointer-events-none`}
          >
            <span className="text-gray-400 text-lg">{icon}</span>
          </div>
        )}
        <input
          className={`${baseClasses} ${errorClasses} ${iconClasses}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

const Select = ({
  label,
  options = [],
  error,
  className = "",
  required = false,
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7AB2D3] focus:ring-offset-1 text-gray-800 ${
          error
            ? "border-red-500 bg-red-50"
            : "border-gray-300 focus:border-[#7AB2D3]"
        }`}
        {...props}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const Alert = ({
  children,
  variant = "info",
  title,
  onClose,
  className = "",
}) => {
  const variants = {
    info: "bg-[#DFF2EB] border-[#7AB2D3] text-[#4A628A]",
    success: "bg-green-50 border-green-500 text-green-800",
    warning: "bg-yellow-50 border-yellow-500 text-yellow-800",
    error: "bg-red-50 border-red-500 text-red-800",
  };

  return (
    <div
      className={`p-4 border-l-4 rounded-lg ${variants[variant]} ${className}`}
    >
      <div className="flex items-start">
        <div className="flex-1">
          {title && <h4 className="font-medium mb-1">{title}</h4>}
          <div>{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-current hover:opacity-70 transition-opacity"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

const FileUpload = ({
  label,
  accept,
  multiple = false,
  className = "",
  required = false,
  onChange,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const newFiles = Array.from(e.dataTransfer.files);
    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
    setFiles(updatedFiles);
    if (onChange) onChange(updatedFiles);
  };

  const handleChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
    setFiles(updatedFiles);
    if (onChange) onChange(updatedFiles);
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    if (onChange) onChange(updatedFiles);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? "border-[#7AB2D3] bg-[#DFF2EB]"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="text-center">
          <div className="text-4xl mb-2">📄</div>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium text-[#7AB2D3]">Click to upload</span>{" "}
            or drag and drop
          </p>
          <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <span className="text-sm text-gray-600">📄</span>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {file.name}
                </span>
                <span className="ml-2 text-xs text-gray-500">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Sri Lankan Data Constants
const provincialCouncils = [
  { value: "", label: "Select Provincial Council" },
  { value: "Western Provincial Council", label: "Western Provincial Council" },
  { value: "Central Provincial Council", label: "Central Provincial Council" },
  {
    value: "Southern Provincial Council",
    label: "Southern Provincial Council",
  },
  {
    value: "Northern Provincial Council",
    label: "Northern Provincial Council",
  },
  { value: "Eastern Provincial Council", label: "Eastern Provincial Council" },
  {
    value: "North Western Provincial Council",
    label: "North Western Provincial Council",
  },
  {
    value: "North Central Provincial Council",
    label: "North Central Provincial Council",
  },
  { value: "Uva Provincial Council", label: "Uva Provincial Council" },
  {
    value: "Sabaragamuwa Provincial Council",
    label: "Sabaragamuwa Provincial Council",
  },
];

const provinces = [
  { value: "", label: "Select Province" },
  { value: "Western Province", label: "Western Province" },
  { value: "Central Province", label: "Central Province" },
  { value: "Southern Province", label: "Southern Province" },
  { value: "Northern Province", label: "Northern Province" },
  { value: "Eastern Province", label: "Eastern Province" },
  { value: "North Western Province", label: "North Western Province" },
  { value: "North Central Province", label: "North Central Province" },
  { value: "Uva Province", label: "Uva Province" },
  { value: "Sabaragamuwa Province", label: "Sabaragamuwa Province" },
];

const vehicleClasses = [
  { value: "", label: "Select Vehicle Class" },
  { value: "MOTOR CAR", label: "Motor Car" },
  { value: "MOTOR CYCLE", label: "Motor Cycle" },
  { value: "THREE WHEELER", label: "Three Wheeler" },
  { value: "MOTOR LORRY", label: "Motor Lorry" },
  { value: "MOTOR COACH", label: "Motor Coach" },
  { value: "MOTOR AMBULANCE", label: "Motor Ambulance" },
  { value: "MOTOR HEARSE", label: "Motor Hearse" },
  { value: "DUAL PURPOSE VEHICLE", label: "Dual Purpose Vehicle" },
  { value: "LAND VEHICLE", label: "Land Vehicle" },
  { value: "PRIME MOVER", label: "Prime Mover" },
  { value: "TRAILER", label: "Trailer" },
  { value: "MOTOR TRICYCLE VAN", label: "Motor Tricycle Van" },
  { value: "MOTOR TRICYCLE CAB", label: "Motor Tricycle Cab" },
];

const taxationClasses = [
  { value: "", label: "Select Taxation Class" },
  { value: "PRIVATE", label: "Private" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "GOVERNMENT", label: "Government" },
  { value: "DIPLOMATIC", label: "Diplomatic" },
  { value: "DEFENCE", label: "Defence" },
  { value: "SPECIAL", label: "Special" },
];

const vehicleStatuses = [
  { value: "", label: "Select Status When Registered" },
  { value: "BRAND NEW", label: "Brand New" },
  { value: "RECONDITIONED", label: "Reconditioned" },
  { value: "USED LOCAL", label: "Used Local" },
  { value: "ASSEMBLED LOCAL", label: "Assembled Local" },
  { value: "VINTAGE", label: "Vintage" },
  { value: "REBUILT", label: "Rebuilt" },
];

const fuelTypes = [
  { value: "", label: "Select Fuel Type" },
  { value: "PETROL", label: "Petrol" },
  { value: "DIESEL", label: "Diesel" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ELECTRIC", label: "Electric" },
  { value: "LPG", label: "LPG" },
  { value: "CNG", label: "CNG" },
  { value: "DUAL FUEL", label: "Dual Fuel" },
];

const countries = [
  { value: "", label: "Select Country of Manufacture" },
  { value: "JAPAN", label: "Japan" },
  { value: "INDIA", label: "India" },
  { value: "SOUTH KOREA", label: "South Korea" },
  { value: "GERMANY", label: "Germany" },
  { value: "USA", label: "USA" },
  { value: "UK", label: "United Kingdom" },
  { value: "FRANCE", label: "France" },
  { value: "ITALY", label: "Italy" },
  { value: "CHINA", label: "China" },
  { value: "THAILAND", label: "Thailand" },
  { value: "MALAYSIA", label: "Malaysia" },
  { value: "SWEDEN", label: "Sweden" },
  { value: "CZECH REPUBLIC", label: "Czech Republic" },
  { value: "SPAIN", label: "Spain" },
  { value: "BRAZIL", label: "Brazil" },
  { value: "MEXICO", label: "Mexico" },
  { value: "TURKEY", label: "Turkey" },
  { value: "OTHER", label: "Other" },
];

const colors = [
  { value: "", label: "Select Color" },
  { value: "WHITE", label: "White" },
  { value: "BLACK", label: "Black" },
  { value: "SILVER", label: "Silver" },
  { value: "GREY", label: "Grey" },
  { value: "RED", label: "Red" },
  { value: "BLUE", label: "Blue" },
  { value: "GREEN", label: "Green" },
  { value: "YELLOW", label: "Yellow" },
  { value: "BROWN", label: "Brown" },
  { value: "ORANGE", label: "Orange" },
  { value: "PURPLE", label: "Purple" },
  { value: "PINK", label: "Pink" },
  { value: "GOLD", label: "Gold" },
  { value: "MAROON", label: "Maroon" },
  { value: "NAVY", label: "Navy" },
  { value: "CREAM", label: "Cream" },
  { value: "BEIGE", label: "Beige" },
  { value: "MULTICOLOR", label: "Multi Color" },
  { value: "OTHER", label: "Other" },
];

const transmissionTypes = [
  { value: "", label: "Select Transmission Type" },
  { value: "MANUAL", label: "Manual" },
  { value: "AUTOMATIC", label: "Automatic" },
  { value: "CVT", label: "CVT (Continuously Variable)" },
  { value: "SEMI_AUTOMATIC", label: "Semi-Automatic" },
];

// Generate year options
const currentYear = new Date().getFullYear();
const yearOptions = [
  { value: "", label: "Select Year of Manufacture" },
  ...Array.from({ length: currentYear - 1950 + 1 }, (_, i) => {
    const year = currentYear - i;
    return { value: year, label: year.toString() };
  }),
];

// Main Vehicle Registration Component
const VehicleRegistrationForm = () => {
  const [formData, setFormData] = useState({
    // Basic Registration Details
    registrationNumber: "",
    chassisNumber: "",
    engineNumber: "",

    // Current Owner
    currentOwnerName: "",
    currentOwnerIdNumber: "",
    currentOwnerStreet: "",
    currentOwnerCity: "",
    currentOwnerDistrict: "",
    currentOwnerProvince: "",
    currentOwnerPostalCode: "",

    // Absolute Owner
    absoluteOwnerName: "",
    absoluteOwnerIdNumber: "",
    absoluteOwnerStreet: "",
    absoluteOwnerCity: "",
    absoluteOwnerDistrict: "",
    absoluteOwnerProvince: "",
    absoluteOwnerPostalCode: "",
    relationshipToCurrentOwner: "same",

    // Previous Owner
    previousOwnerName: "",
    previousOwnerIdNumber: "",
    previousOwnerStreet: "",
    previousOwnerCity: "",
    previousOwnerDistrict: "",
    previousOwnerProvince: "",
    previousOwnerPostalCode: "",

    // Vehicle Specifications
    cylinderCapacity: "",
    classOfVehicle: "",
    taxationClass: "",
    statusWhenRegistered: "",
    fuelType: "",
    make: "",
    country: "",
    model: "",
    wheelBase: "",
    yearOfManufacture: "",
    color: "",
    seatingCapacity: "",
    unladenWeight: "",
    grossWeight: "",
    frontTyreSize: "",
    rearTyreSize: "",
    height: "",
    transmission: "",

    // Registration Details
    provincialCouncil: "",
    dateOfRegistration: "",

    // Insurance Details
    insuranceProvider: "",
    policyNumber: "",
    insuranceValidFrom: "",
    insuranceValidTo: "",
    coverageType: "",

    // Revenue License
    revenueLicenseNumber: "",
    revenueLicenseValidFrom: "",
    revenueLicenseValidTo: "",
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleDocumentUpload = (documentType, files) => {
    setUploadedDocuments((prev) => ({ ...prev, [documentType]: files }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Basic Registration Details
      if (!formData.registrationNumber.trim())
        newErrors.registrationNumber = "Registration number is required";
      if (!formData.chassisNumber.trim())
        newErrors.chassisNumber = "Chassis number is required";
      if (!formData.engineNumber.trim())
        newErrors.engineNumber = "Engine number is required";

      // Registration number format validation
      if (
        formData.registrationNumber &&
        !/^([A-Z]{2,3}\s)?[A-Z]{2,3}-\d{4}$/.test(
          formData.registrationNumber.toUpperCase()
        )
      ) {
        newErrors.registrationNumber =
          "Invalid format. Use format like ABC-1234 or WP ABC-1234";
      }

      // Chassis number validation (17 characters)
      if (formData.chassisNumber && formData.chassisNumber.length !== 17) {
        newErrors.chassisNumber =
          "Chassis number must be exactly 17 characters";
      }
    }

    if (step === 2) {
      // Current Owner validation
      if (!formData.currentOwnerName.trim())
        newErrors.currentOwnerName = "Current owner name is required";
      if (!formData.currentOwnerIdNumber.trim())
        newErrors.currentOwnerIdNumber = "Current owner ID number is required";
      if (!formData.currentOwnerStreet.trim())
        newErrors.currentOwnerStreet = "Current owner address is required";
      if (!formData.currentOwnerCity.trim())
        newErrors.currentOwnerCity = "Current owner city is required";
      if (!formData.currentOwnerProvince)
        newErrors.currentOwnerProvince = "Current owner province is required";

      // Absolute Owner validation
      if (!formData.absoluteOwnerName.trim())
        newErrors.absoluteOwnerName = "Absolute owner name is required";
      if (!formData.absoluteOwnerIdNumber.trim())
        newErrors.absoluteOwnerIdNumber =
          "Absolute owner ID number is required";
    }

    if (step === 3) {
      // Vehicle specifications validation
      if (!formData.cylinderCapacity)
        newErrors.cylinderCapacity = "Cylinder capacity is required";
      if (!formData.classOfVehicle)
        newErrors.classOfVehicle = "Class of vehicle is required";
      if (!formData.taxationClass)
        newErrors.taxationClass = "Taxation class is required";
      if (!formData.statusWhenRegistered)
        newErrors.statusWhenRegistered = "Status when registered is required";
      if (!formData.fuelType) newErrors.fuelType = "Fuel type is required";
      if (!formData.make.trim()) newErrors.make = "Make is required";
      if (!formData.country) newErrors.country = "Country is required";
      if (!formData.model.trim()) newErrors.model = "Model is required";
      if (!formData.yearOfManufacture)
        newErrors.yearOfManufacture = "Year of manufacture is required";
      if (!formData.color) newErrors.color = "Color is required";

      // Numeric validations
      if (
        formData.cylinderCapacity &&
        (formData.cylinderCapacity < 50 || formData.cylinderCapacity > 10000)
      ) {
        newErrors.cylinderCapacity =
          "Cylinder capacity must be between 50 and 10000 CC";
      }
    }

    if (step === 4) {
      // Additional specifications
      if (!formData.seatingCapacity)
        newErrors.seatingCapacity = "Seating capacity is required";
      if (!formData.unladenWeight)
        newErrors.unladenWeight = "Unladen weight is required";
      if (!formData.grossWeight)
        newErrors.grossWeight = "Gross weight is required";
      if (!formData.frontTyreSize.trim())
        newErrors.frontTyreSize = "Front tyre size is required";
      if (!formData.rearTyreSize.trim())
        newErrors.rearTyreSize = "Rear tyre size is required";
      if (!formData.height) newErrors.height = "Vehicle height is required";
      if (!formData.wheelBase) newErrors.wheelBase = "Wheel base is required";

      // Tyre size format validation
      const tyreFormat = /^\d{3}\/\d{2}R\d{2}$/;
      if (formData.frontTyreSize && !tyreFormat.test(formData.frontTyreSize)) {
        newErrors.frontTyreSize = "Invalid format. Use format like 195/65R15";
      }
      if (formData.rearTyreSize && !tyreFormat.test(formData.rearTyreSize)) {
        newErrors.rearTyreSize = "Invalid format. Use format like 195/65R15";
      }
    }

    if (step === 5) {
      // Registration and legal details
      if (!formData.provincialCouncil)
        newErrors.provincialCouncil = "Provincial council is required";
      if (!formData.dateOfRegistration)
        newErrors.dateOfRegistration = "Date of registration is required";

      // Date validation - cannot be in the future
      if (
        formData.dateOfRegistration &&
        new Date(formData.dateOfRegistration) > new Date()
      ) {
        newErrors.dateOfRegistration =
          "Registration date cannot be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setIsSubmitting(true);

    try {
      // Prepare data for API
      const vehicleData = {
        registrationNumber: formData.registrationNumber.toUpperCase(),
        chassisNumber: formData.chassisNumber.toUpperCase(),
        engineNumber: formData.engineNumber.toUpperCase(),

        currentOwner: {
          name: formData.currentOwnerName,
          idNumber: formData.currentOwnerIdNumber,
          address: {
            street: formData.currentOwnerStreet,
            city: formData.currentOwnerCity,
            district: formData.currentOwnerDistrict,
            province: formData.currentOwnerProvince,
            postalCode: formData.currentOwnerPostalCode,
          },
        },

        absoluteOwner: {
          name: formData.absoluteOwnerName,
          idNumber: formData.absoluteOwnerIdNumber,
          address: {
            street: formData.absoluteOwnerStreet,
            city: formData.absoluteOwnerCity,
            district: formData.absoluteOwnerDistrict,
            province: formData.absoluteOwnerProvince,
            postalCode: formData.absoluteOwnerPostalCode,
          },
          relationshipToCurrentOwner: formData.relationshipToCurrentOwner,
        },

        previousOwners: formData.previousOwnerName
          ? [
              {
                name: formData.previousOwnerName,
                idNumber: formData.previousOwnerIdNumber,
                address: {
                  street: formData.previousOwnerStreet,
                  city: formData.previousOwnerCity,
                  district: formData.previousOwnerDistrict,
                  province: formData.previousOwnerProvince,
                  postalCode: formData.previousOwnerPostalCode,
                },
              },
            ]
          : [],

        cylinderCapacity: Number(formData.cylinderCapacity),
        classOfVehicle: formData.classOfVehicle,
        taxationClass: formData.taxationClass,
        statusWhenRegistered: formData.statusWhenRegistered,
        fuelType: formData.fuelType,
        make: formData.make.toUpperCase(),
        country: formData.country,
        model: formData.model.toUpperCase(),
        wheelBase: Number(formData.wheelBase),
        yearOfManufacture: Number(formData.yearOfManufacture),
        color: formData.color,
        seatingCapacity: Number(formData.seatingCapacity),
        weight: {
          unladenWeight: Number(formData.unladenWeight),
          grossWeight: Number(formData.grossWeight),
        },
        tyreSize: {
          front: formData.frontTyreSize,
          rear: formData.rearTyreSize,
        },
        height: Number(formData.height),
        transmission: formData.transmission,
        provincialCouncil: formData.provincialCouncil,
        dateOfRegistration: formData.dateOfRegistration,

        insuranceDetails: formData.insuranceProvider
          ? {
              provider: formData.insuranceProvider,
              policyNumber: formData.policyNumber,
              validFrom: formData.insuranceValidFrom,
              validTo: formData.insuranceValidTo,
              coverageType: formData.coverageType,
            }
          : undefined,

        revenueLicense: formData.revenueLicenseNumber
          ? {
              licenseNumber: formData.revenueLicenseNumber,
              validFrom: formData.revenueLicenseValidFrom,
              validTo: formData.revenueLicenseValidTo,
              isValid: true,
            }
          : undefined,
      };

      // Simulate API call
      console.log("Submitting vehicle data:", vehicleData);
      console.log("Uploaded documents:", uploadedDocuments);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setShowSuccess(true);
      setCurrentStep(6);
    } catch (error) {
      console.error("Vehicle registration failed:", error);
      setErrors({ submit: "Registration failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitles = [
    "Basic Details",
    "Owner Information",
    "Vehicle Specifications",
    "Technical Details",
    "Registration & Legal",
    "Complete",
  ];

  const renderStep1 = () => (
    <div className="space-y-6">
      <Alert variant="info" title="Vehicle Registration">
        Enter the basic registration details of your vehicle. All fields marked
        with * are required.
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Registration Number"
          placeholder="ABC-1234 or WP ABC-1234"
          required
          value={formData.registrationNumber}
          onChange={(e) =>
            handleInputChange(
              "registrationNumber",
              e.target.value.toUpperCase()
            )
          }
          error={errors.registrationNumber}
          icon="🚗"
          helpText="Format: ABC-1234 or WP ABC-1234"
        />
        <Input
          label="Chassis Number (VIN)"
          placeholder="17-character chassis number"
          required
          value={formData.chassisNumber}
          onChange={(e) =>
            handleInputChange("chassisNumber", e.target.value.toUpperCase())
          }
          error={errors.chassisNumber}
          icon="🔢"
          helpText="Must be exactly 17 characters"
          maxLength={17}
        />
      </div>

      <Input
        label="Engine Number"
        placeholder="Engine identification number"
        required
        value={formData.engineNumber}
        onChange={(e) =>
          handleInputChange("engineNumber", e.target.value.toUpperCase())
        }
        error={errors.engineNumber}
        icon="⚙️"
      />

      <FileUpload
        label="Registration Certificate"
        accept=".pdf,.jpg,.jpeg,.png"
        required
        onChange={(files) =>
          handleDocumentUpload("registrationCertificate", files)
        }
      />

      <FileUpload
        label="Import Permit / Customs Clearance"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(files) => handleDocumentUpload("importPermit", files)}
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <Alert variant="info" title="Owner Information">
        Provide complete details of current owner, absolute owner, and previous
        owner (if applicable).
      </Alert>

      {/* Current Owner */}
      <div>
        <h3 className="text-lg font-semibold text-[#4A628A] mb-4">
          Current Owner Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            placeholder="John Perera"
            required
            value={formData.currentOwnerName}
            onChange={(e) =>
              handleInputChange("currentOwnerName", e.target.value)
            }
            error={errors.currentOwnerName}
            icon="👤"
          />
          <Input
            label="National ID / Passport Number"
            placeholder="123456789V or N1234567"
            required
            value={formData.currentOwnerIdNumber}
            onChange={(e) =>
              handleInputChange("currentOwnerIdNumber", e.target.value)
            }
            error={errors.currentOwnerIdNumber}
            icon="🆔"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <Input
            label="Street Address"
            placeholder="123 Main Street"
            required
            value={formData.currentOwnerStreet}
            onChange={(e) =>
              handleInputChange("currentOwnerStreet", e.target.value)
            }
            error={errors.currentOwnerStreet}
            icon="📍"
            className="md:col-span-2"
          />
          <Input
            label="City"
            placeholder="Colombo"
            required
            value={formData.currentOwnerCity}
            onChange={(e) =>
              handleInputChange("currentOwnerCity", e.target.value)
            }
            error={errors.currentOwnerCity}
            icon="🏙️"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <Input
            label="District"
            placeholder="Colombo"
            value={formData.currentOwnerDistrict}
            onChange={(e) =>
              handleInputChange("currentOwnerDistrict", e.target.value)
            }
            icon="🗺️"
          />
          <Select
            label="Province"
            required
            value={formData.currentOwnerProvince}
            onChange={(e) =>
              handleInputChange("currentOwnerProvince", e.target.value)
            }
            options={provinces}
            error={errors.currentOwnerProvince}
          />
          <Input
            label="Postal Code"
            placeholder="10400"
            value={formData.currentOwnerPostalCode}
            onChange={(e) =>
              handleInputChange("currentOwnerPostalCode", e.target.value)
            }
            icon="📮"
          />
        </div>
      </div>

      {/* Absolute Owner */}
      <div>
        <h3 className="text-lg font-semibold text-[#4A628A] mb-4">
          Absolute Owner Details
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Relationship to Current Owner{" "}
            <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7AB2D3] focus:border-[#7AB2D3] transition-all duration-200"
            value={formData.relationshipToCurrentOwner}
            onChange={(e) =>
              handleInputChange("relationshipToCurrentOwner", e.target.value)
            }
          >
            <option value="same">Same Person</option>
            <option value="parent">Parent</option>
            <option value="spouse">Spouse</option>
            <option value="child">Child</option>
            <option value="company">Company/Organization</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            placeholder="John Perera"
            required
            value={formData.absoluteOwnerName}
            onChange={(e) =>
              handleInputChange("absoluteOwnerName", e.target.value)
            }
            error={errors.absoluteOwnerName}
            icon="👤"
          />
          <Input
            label="National ID / Passport Number"
            placeholder="123456789V or N1234567"
            required
            value={formData.absoluteOwnerIdNumber}
            onChange={(e) =>
              handleInputChange("absoluteOwnerIdNumber", e.target.value)
            }
            error={errors.absoluteOwnerIdNumber}
            icon="🆔"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <Input
            label="Street Address"
            placeholder="123 Main Street"
            value={formData.absoluteOwnerStreet}
            onChange={(e) =>
              handleInputChange("absoluteOwnerStreet", e.target.value)
            }
            icon="📍"
            className="md:col-span-2"
          />
          <Input
            label="City"
            placeholder="Colombo"
            value={formData.absoluteOwnerCity}
            onChange={(e) =>
              handleInputChange("absoluteOwnerCity", e.target.value)
            }
            icon="🏙️"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <Input
            label="District"
            placeholder="Colombo"
            value={formData.absoluteOwnerDistrict}
            onChange={(e) =>
              handleInputChange("absoluteOwnerDistrict", e.target.value)
            }
            icon="🗺️"
          />
          <Select
            label="Province"
            value={formData.absoluteOwnerProvince}
            onChange={(e) =>
              handleInputChange("absoluteOwnerProvince", e.target.value)
            }
            options={provinces}
          />
          <Input
            label="Postal Code"
            placeholder="10400"
            value={formData.absoluteOwnerPostalCode}
            onChange={(e) =>
              handleInputChange("absoluteOwnerPostalCode", e.target.value)
            }
            icon="📮"
          />
        </div>
      </div>

      {/* Previous Owner */}
      <div>
        <h3 className="text-lg font-semibold text-[#4A628A] mb-4">
          Previous Owner Details (Optional)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            placeholder="Previous owner name"
            value={formData.previousOwnerName}
            onChange={(e) =>
              handleInputChange("previousOwnerName", e.target.value)
            }
            icon="👤"
          />
          <Input
            label="National ID / Passport Number"
            placeholder="123456789V or N1234567"
            value={formData.previousOwnerIdNumber}
            onChange={(e) =>
              handleInputChange("previousOwnerIdNumber", e.target.value)
            }
            icon="🆔"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <Input
            label="Street Address"
            placeholder="Previous owner address"
            value={formData.previousOwnerStreet}
            onChange={(e) =>
              handleInputChange("previousOwnerStreet", e.target.value)
            }
            icon="📍"
            className="md:col-span-2"
          />
          <Input
            label="City"
            placeholder="City"
            value={formData.previousOwnerCity}
            onChange={(e) =>
              handleInputChange("previousOwnerCity", e.target.value)
            }
            icon="🏙️"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <Alert variant="info" title="Vehicle Specifications">
        Enter the technical specifications and classification details of your
        vehicle.
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Cylinder Capacity (CC)"
          type="number"
          placeholder="1500"
          required
          value={formData.cylinderCapacity}
          onChange={(e) =>
            handleInputChange("cylinderCapacity", e.target.value)
          }
          error={errors.cylinderCapacity}
          icon="⚙️"
          helpText="Engine displacement in cubic centimeters"
          min="50"
          max="10000"
        />
        <Select
          label="Class of Vehicle"
          required
          value={formData.classOfVehicle}
          onChange={(e) => handleInputChange("classOfVehicle", e.target.value)}
          options={vehicleClasses}
          error={errors.classOfVehicle}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Taxation Class"
          required
          value={formData.taxationClass}
          onChange={(e) => handleInputChange("taxationClass", e.target.value)}
          options={taxationClasses}
          error={errors.taxationClass}
        />
        <Select
          label="Status When Registered"
          required
          value={formData.statusWhenRegistered}
          onChange={(e) =>
            handleInputChange("statusWhenRegistered", e.target.value)
          }
          options={vehicleStatuses}
          error={errors.statusWhenRegistered}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Fuel Type"
          required
          value={formData.fuelType}
          onChange={(e) => handleInputChange("fuelType", e.target.value)}
          options={fuelTypes}
          error={errors.fuelType}
        />
        <Select
          label="Transmission Type"
          value={formData.transmission}
          onChange={(e) => handleInputChange("transmission", e.target.value)}
          options={transmissionTypes}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Make"
          placeholder="TOYOTA"
          required
          value={formData.make}
          onChange={(e) =>
            handleInputChange("make", e.target.value.toUpperCase())
          }
          error={errors.make}
          icon="🏭"
        />
        <Select
          label="Country of Manufacture"
          required
          value={formData.country}
          onChange={(e) => handleInputChange("country", e.target.value)}
          options={countries}
          error={errors.country}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Model"
          placeholder="PRIUS"
          required
          value={formData.model}
          onChange={(e) =>
            handleInputChange("model", e.target.value.toUpperCase())
          }
          error={errors.model}
          icon="🚙"
        />
        <Select
          label="Year of Manufacture"
          required
          value={formData.yearOfManufacture}
          onChange={(e) =>
            handleInputChange("yearOfManufacture", e.target.value)
          }
          options={yearOptions}
          error={errors.yearOfManufacture}
        />
      </div>

      <Select
        label="Color"
        required
        value={formData.color}
        onChange={(e) => handleInputChange("color", e.target.value)}
        options={colors}
        error={errors.color}
      />
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <Alert variant="info" title="Technical Details">
        Enter the physical specifications and technical measurements of your
        vehicle.
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Seating Capacity"
          type="number"
          placeholder="5"
          required
          value={formData.seatingCapacity}
          onChange={(e) => handleInputChange("seatingCapacity", e.target.value)}
          error={errors.seatingCapacity}
          icon="🪑"
          min="1"
          max="100"
        />
        <Input
          label="Wheel Base (mm)"
          type="number"
          placeholder="2600"
          required
          value={formData.wheelBase}
          onChange={(e) => handleInputChange("wheelBase", e.target.value)}
          error={errors.wheelBase}
          icon="📏"
          helpText="Distance between front and rear axles"
          min="500"
          max="10000"
        />
        <Input
          label="Height (mm)"
          type="number"
          placeholder="1500"
          required
          value={formData.height}
          onChange={(e) => handleInputChange("height", e.target.value)}
          error={errors.height}
          icon="📐"
          helpText="Overall vehicle height"
          min="500"
          max="5000"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Unladen Weight (kg)"
          type="number"
          placeholder="1200"
          required
          value={formData.unladenWeight}
          onChange={(e) => handleInputChange("unladenWeight", e.target.value)}
          error={errors.unladenWeight}
          icon="⚖️"
          helpText="Weight without passengers/cargo"
          min="50"
          max="50000"
        />
        <Input
          label="Gross Weight (kg)"
          type="number"
          placeholder="1800"
          required
          value={formData.grossWeight}
          onChange={(e) => handleInputChange("grossWeight", e.target.value)}
          error={errors.grossWeight}
          icon="⚖️"
          helpText="Maximum permissible weight"
          min="50"
          max="50000"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Front Tyre Size"
          placeholder="195/65R15"
          required
          value={formData.frontTyreSize}
          onChange={(e) => handleInputChange("frontTyreSize", e.target.value)}
          error={errors.frontTyreSize}
          icon="🛞"
          helpText="Format: 195/65R15"
        />
        <Input
          label="Rear Tyre Size"
          placeholder="195/65R15"
          required
          value={formData.rearTyreSize}
          onChange={(e) => handleInputChange("rearTyreSize", e.target.value)}
          error={errors.rearTyreSize}
          icon="🛞"
          helpText="Format: 195/65R15"
        />
      </div>

      <FileUpload
        label="Vehicle Photos"
        accept=".jpg,.jpeg,.png"
        multiple={true}
        onChange={(files) => handleDocumentUpload("vehiclePhotos", files)}
      />
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <Alert variant="info" title="Registration & Legal Details">
        Complete the registration details and provide insurance information.
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Provincial Council"
          required
          value={formData.provincialCouncil}
          onChange={(e) =>
            handleInputChange("provincialCouncil", e.target.value)
          }
          options={provincialCouncils}
          error={errors.provincialCouncil}
        />
        <Input
          label="Date of Registration"
          type="date"
          required
          value={formData.dateOfRegistration}
          onChange={(e) =>
            handleInputChange("dateOfRegistration", e.target.value)
          }
          error={errors.dateOfRegistration}
          icon="📅"
        />
      </div>

      {/* Insurance Details */}
      <div>
        <h3 className="text-lg font-semibold text-[#4A628A] mb-4">
          Insurance Details (Optional)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Insurance Provider"
            placeholder="Allianz Insurance Lanka"
            value={formData.insuranceProvider}
            onChange={(e) =>
              handleInputChange("insuranceProvider", e.target.value)
            }
            icon="🛡️"
          />
          <Input
            label="Policy Number"
            placeholder="POL123456789"
            value={formData.policyNumber}
            onChange={(e) => handleInputChange("policyNumber", e.target.value)}
            icon="📄"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <Input
            label="Coverage Valid From"
            type="date"
            value={formData.insuranceValidFrom}
            onChange={(e) =>
              handleInputChange("insuranceValidFrom", e.target.value)
            }
            icon="📅"
          />
          <Input
            label="Coverage Valid To"
            type="date"
            value={formData.insuranceValidTo}
            onChange={(e) =>
              handleInputChange("insuranceValidTo", e.target.value)
            }
            icon="📅"
          />
          <Select
            label="Coverage Type"
            value={formData.coverageType}
            onChange={(e) => handleInputChange("coverageType", e.target.value)}
            options={[
              { value: "", label: "Select Coverage Type" },
              { value: "COMPREHENSIVE", label: "Comprehensive" },
              { value: "THIRD_PARTY", label: "Third Party" },
              {
                value: "THIRD_PARTY_FIRE_THEFT",
                label: "Third Party Fire & Theft",
              },
            ]}
          />
        </div>
      </div>

      {/* Revenue License */}
      <div>
        <h3 className="text-lg font-semibold text-[#4A628A] mb-4">
          Revenue License Details (Optional)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Revenue License Number"
            placeholder="REV123456"
            value={formData.revenueLicenseNumber}
            onChange={(e) =>
              handleInputChange("revenueLicenseNumber", e.target.value)
            }
            icon="📋"
          />
          <Input
            label="Valid From"
            type="date"
            value={formData.revenueLicenseValidFrom}
            onChange={(e) =>
              handleInputChange("revenueLicenseValidFrom", e.target.value)
            }
            icon="📅"
          />
          <Input
            label="Valid To"
            type="date"
            value={formData.revenueLicenseValidTo}
            onChange={(e) =>
              handleInputChange("revenueLicenseValidTo", e.target.value)
            }
            icon="📅"
          />
        </div>
      </div>

      <FileUpload
        label="Insurance Certificate"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(files) =>
          handleDocumentUpload("insuranceCertificate", files)
        }
      />

      <FileUpload
        label="Revenue License"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(files) => handleDocumentUpload("revenueLicense", files)}
      />

      {errors.submit && (
        <Alert variant="error" title="Submission Error">
          {errors.submit}
        </Alert>
      )}
    </div>
  );

  const renderStep6 = () => (
    <div className="text-center py-8">
      {showSuccess ? (
        <div className="space-y-6">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-[#4A628A] mb-2">
            Vehicle Registration Completed Successfully!
          </h3>
          <p className="text-gray-600 mb-6">
            Your vehicle has been registered in the AutoConnect system. You can
            now book services and manage your vehicle's maintenance history.
          </p>

          <Alert variant="success" title="Registration Details">
            <ul className="text-left mt-2 space-y-1">
              <li>
                • Registration Number:{" "}
                <strong>{formData.registrationNumber}</strong>
              </li>
              <li>
                • Vehicle:{" "}
                <strong>
                  {formData.yearOfManufacture} {formData.make} {formData.model}
                </strong>
              </li>
              <li>
                • Owner: <strong>{formData.currentOwnerName}</strong>
              </li>
              <li>
                • Status: <strong>Active and Ready for Service</strong>
              </li>
            </ul>
          </Alert>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/vehicles")}
            >
              View My Vehicles
            </Button>
            <Button onClick={() => (window.location.href = "/services")}>
              Book a Service
            </Button>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      case 6:
        return renderStep6();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DFF2EB] to-[#B9E5E8] py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#4A628A] mb-2">
            Vehicle Registration
          </h1>
          <p className="text-lg text-gray-600">
            Register your vehicle in the AutoConnect system
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center overflow-x-auto">
            {stepTitles.map((title, index) => (
              <div key={index} className="flex items-center min-w-0">
                <div
                  className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm whitespace-nowrap
                  ${
                    currentStep > index + 1
                      ? "bg-[#7AB2D3] text-white"
                      : currentStep === index + 1
                      ? "bg-[#4A628A] text-white"
                      : "bg-gray-200 text-gray-600"
                  }
                `}
                >
                  {currentStep > index + 1 ? "✓" : index + 1}
                </div>

                <div className="ml-3 mr-8 text-sm min-w-0">
                  <div
                    className={`font-medium ${
                      currentStep >= index + 1
                        ? "text-[#4A628A]"
                        : "text-gray-500"
                    }`}
                  >
                    {title}
                  </div>
                </div>

                {index < stepTitles.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-4 ${
                      currentStep > index + 1 ? "bg-[#7AB2D3]" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-[#7AB2D3] to-[#4A628A] px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              Step {currentStep}: {stepTitles[currentStep - 1]}
            </h2>
          </div>

          <div className="p-6">{renderCurrentStep()}</div>

          {currentStep < 6 && (
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              <div className="text-sm text-gray-500">
                Step {currentStep} of {stepTitles.length - 1}
              </div>

              {currentStep < 5 ? (
                <Button onClick={nextStep}>Next Step</Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Register Vehicle
                </Button>
              )}
            </div>
          )}
        </Card>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Need help with vehicle registration?
            <a
              href="#"
              className="text-[#7AB2D3] hover:text-[#4A628A] font-medium ml-1"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VehicleRegistrationForm;
