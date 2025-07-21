// src/utils/formValidation.utils.js

/**
 * Validation utilities for vehicle registration form
 */

// Sri Lankan vehicle registration number validation
export const validateRegistrationNumber = (regNumber) => {
  if (!regNumber) return "Registration number is required";

  // Sri Lankan format: ABC-1234 or WP ABC-1234
  const pattern = /^([A-Z]{2,3}\s)?[A-Z]{2,3}-\d{4}$/;
  if (!pattern.test(regNumber.toUpperCase())) {
    return "Invalid registration number format (e.g., ABC-1234 or WP ABC-1234)";
  }

  return null;
};

// Chassis number validation (17 characters)
export const validateChassisNumber = (chassisNumber) => {
  if (!chassisNumber) return "Chassis number is required";

  if (chassisNumber.length !== 17) {
    return "Chassis number must be exactly 17 characters";
  }

  // Check for valid characters (no I, O, Q)
  const pattern = /^[A-HJ-NPR-Z0-9]{17}$/;
  if (!pattern.test(chassisNumber.toUpperCase())) {
    return "Invalid chassis number format";
  }

  return null;
};

// Engine number validation
export const validateEngineNumber = (engineNumber) => {
  if (!engineNumber) return "Engine number is required";

  if (engineNumber.length < 3 || engineNumber.length > 20) {
    return "Engine number must be between 3 and 20 characters";
  }

  return null;
};

// NIC validation for Sri Lankan format
export const validateNIC = (nic) => {
  if (!nic) return "NIC is required";

  // Old format: 9 digits + V/X
  const oldPattern = /^[0-9]{9}[VXvx]$/;
  // New format: 12 digits
  const newPattern = /^[0-9]{12}$/;

  if (!oldPattern.test(nic) && !newPattern.test(nic)) {
    return "Invalid NIC format (e.g., 123456789V or 123456789012)";
  }

  return null;
};

// Email validation
export const validateEmail = (email) => {
  if (!email) return null; // Email is optional

  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(email)) {
    return "Invalid email format";
  }

  return null;
};

// Phone number validation (Sri Lankan format)
export const validatePhoneNumber = (phone) => {
  if (!phone) return null; // Phone is optional

  // Sri Lankan mobile: +94xxxxxxxxx or 0xxxxxxxxx
  const pattern = /^(\+94|0)[0-9]{9}$/;
  if (!pattern.test(phone.replace(/\s+/g, ""))) {
    return "Invalid phone number format (e.g., +94771234567 or 0771234567)";
  }

  return null;
};

// Year validation
export const validateYear = (year) => {
  if (!year) return "Year is required";

  const currentYear = new Date().getFullYear();
  const yearNum = parseInt(year);

  if (yearNum < 1900 || yearNum > currentYear + 1) {
    return `Year must be between 1900 and ${currentYear + 1}`;
  }

  return null;
};

// Tyre size validation (e.g., 195/65R15)
export const validateTyreSize = (tyreSize) => {
  if (!tyreSize) return null; // Optional field

  const pattern = /^\d{3}\/\d{2}R\d{2}$/;
  if (!pattern.test(tyreSize)) {
    return "Invalid tyre size format (e.g., 195/65R15)";
  }

  return null;
};

// Postal code validation (Sri Lankan format)
export const validatePostalCode = (postalCode) => {
  if (!postalCode) return null; // Optional field

  const pattern = /^[0-9]{5}$/;
  if (!pattern.test(postalCode)) {
    return "Postal code must be 5 digits";
  }

  return null;
};

// Engine capacity validation
export const validateEngineCapacity = (capacity) => {
  if (!capacity) return null; // Optional field

  const capacityNum = parseInt(capacity);
  if (capacityNum < 50 || capacityNum > 10000) {
    return "Engine capacity must be between 50cc and 10,000cc";
  }

  return null;
};

// Weight validation
export const validateWeight = (weight) => {
  if (!weight) return null; // Optional field

  const weightNum = parseInt(weight);
  if (weightNum < 50 || weightNum > 50000) {
    return "Weight must be between 50kg and 50,000kg";
  }

  return null;
};

// Date validation
export const validateDate = (date, fieldName = "Date", required = false) => {
  if (!date) {
    return required ? `${fieldName} is required` : null;
  }

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return `Invalid ${fieldName.toLowerCase()} format`;
  }

  return null;
};

// Future date validation
export const validateFutureDate = (date, fieldName = "Date") => {
  const baseValidation = validateDate(date, fieldName);
  if (baseValidation) return baseValidation;

  if (!date) return null;

  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (dateObj < today) {
    return `${fieldName} cannot be in the past`;
  }

  return null;
};

// Past date validation
export const validatePastDate = (date, fieldName = "Date") => {
  const baseValidation = validateDate(date, fieldName);
  if (baseValidation) return baseValidation;

  if (!date) return null;

  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  if (dateObj > today) {
    return `${fieldName} cannot be in the future`;
  }

  return null;
};

// Required field validation
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return `${fieldName} is required`;
  }
  return null;
};

// Length validation
export const validateLength = (value, min, max, fieldName) => {
  if (!value) return null;

  const length = value.toString().length;
  if (length < min || length > max) {
    return `${fieldName} must be between ${min} and ${max} characters`;
  }

  return null;
};

// Number range validation
export const validateRange = (value, min, max, fieldName) => {
  if (!value) return null;

  const num = parseFloat(value);
  if (isNaN(num)) {
    return `${fieldName} must be a valid number`;
  }

  if (num < min || num > max) {
    return `${fieldName} must be between ${min} and ${max}`;
  }

  return null;
};

// Comprehensive form validation
export const validateVehicleForm = (formData, step) => {
  const errors = {};

  switch (step) {
    case 0: // Basic Vehicle Information
      errors.registrationNumber = validateRegistrationNumber(
        formData.registrationNumber
      );
      errors.chassisNumber = validateChassisNumber(formData.chassisNumber);
      errors.engineNumber = validateEngineNumber(formData.engineNumber);
      errors.dateOfRegistration = validateDate(
        formData.dateOfRegistration,
        "Registration date",
        true
      );

      // Ensure registration date is not in the future
      if (formData.dateOfRegistration) {
        const regDate = new Date(formData.dateOfRegistration);
        const today = new Date();
        if (regDate > today) {
          errors.dateOfRegistration =
            "Registration date cannot be in the future";
        }
      }
      break;

    case 1: // Owner Information
      errors["currentOwner.name"] = validateRequired(
        formData.currentOwner?.name,
        "Current owner name"
      );
      errors["currentOwner.idNumber"] = validateNIC(
        formData.currentOwner?.idNumber
      );
      errors["currentOwner.address.postalCode"] = validatePostalCode(
        formData.currentOwner?.address?.postalCode
      );

      // Validate absolute owner if different from current owner
      if (formData.absoluteOwner?.relationshipToCurrentOwner !== "same") {
        errors["absoluteOwner.name"] = validateRequired(
          formData.absoluteOwner?.name,
          "Absolute owner name"
        );
        errors["absoluteOwner.idNumber"] = validateNIC(
          formData.absoluteOwner?.idNumber
        );
        errors["absoluteOwner.address.postalCode"] = validatePostalCode(
          formData.absoluteOwner?.address?.postalCode
        );
      }
      break;

    case 2: // Vehicle Specifications
      errors.classOfVehicle = validateRequired(
        formData.classOfVehicle,
        "Vehicle class"
      );
      errors.make = validateRequired(formData.make, "Vehicle make");
      errors.model = validateRequired(formData.model, "Vehicle model");
      errors.yearOfManufacture = validateYear(formData.yearOfManufacture);
      errors.cylinderCapacity = validateEngineCapacity(
        formData.cylinderCapacity
      );
      errors.seatingCapacity = validateRange(
        formData.seatingCapacity,
        1,
        100,
        "Seating capacity"
      );
      errors["weight.unladenWeight"] = validateWeight(
        formData.weight?.unladenWeight
      );
      errors["weight.grossWeight"] = validateWeight(
        formData.weight?.grossWeight
      );
      errors["tyreSize.front"] = validateTyreSize(formData.tyreSize?.front);
      errors["tyreSize.rear"] = validateTyreSize(formData.tyreSize?.rear);
      errors.height = validateRange(
        formData.height,
        500,
        5000,
        "Vehicle height"
      );
      errors.wheelBase = validateRange(
        formData.wheelBase,
        500,
        10000,
        "Wheel base"
      );

      // Validate that gross weight is greater than unladen weight
      if (formData.weight?.unladenWeight && formData.weight?.grossWeight) {
        const unladenWeight = parseFloat(formData.weight.unladenWeight);
        const grossWeight = parseFloat(formData.weight.grossWeight);
        if (grossWeight <= unladenWeight) {
          errors["weight.grossWeight"] =
            "Gross weight must be greater than unladen weight";
        }
      }
      break;

    case 3: // Legal & Insurance
      errors.provincialCouncil = validateRequired(
        formData.provincialCouncil,
        "Provincial council"
      );

      // Insurance validation (if provided)
      if (
        formData.insuranceDetails?.validFrom &&
        formData.insuranceDetails?.validTo
      ) {
        const validFrom = new Date(formData.insuranceDetails.validFrom);
        const validTo = new Date(formData.insuranceDetails.validTo);
        if (validTo <= validFrom) {
          errors["insuranceDetails.validTo"] =
            "Insurance end date must be after start date";
        }
      }

      // Revenue license validation (if provided)
      if (
        formData.revenueLicense?.validFrom &&
        formData.revenueLicense?.validTo
      ) {
        const validFrom = new Date(formData.revenueLicense.validFrom);
        const validTo = new Date(formData.revenueLicense.validTo);
        if (validTo <= validFrom) {
          errors["revenueLicense.validTo"] =
            "Revenue license end date must be after start date";
        }
      }
      break;

    case 4: // Documents & Images
      // File validation would be handled separately
      // This step mainly involves file uploads which are validated on upload
      break;

    default:
      break;
  }

  // Remove null/undefined errors
  Object.keys(errors).forEach((key) => {
    if (!errors[key]) {
      delete errors[key];
    }
  });

  return errors;
};

// File validation utilities
export const validateFileType = (file, allowedTypes) => {
  if (!file) return "File is required";

  const fileExtension = file.name.split(".").pop().toLowerCase();
  if (!allowedTypes.includes(fileExtension)) {
    return `File must be one of: ${allowedTypes.join(", ")}`;
  }

  return null;
};

export const validateFileSize = (file, maxSizeMB = 5) => {
  if (!file) return "File is required";

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `File size must be less than ${maxSizeMB}MB`;
  }

  return null;
};

export const validateImageFile = (file) => {
  const typeError = validateFileType(file, ["jpg", "jpeg", "png"]);
  if (typeError) return typeError;

  const sizeError = validateFileSize(file, 10); // 10MB for images
  if (sizeError) return sizeError;

  return null;
};

export const validateDocumentFile = (file) => {
  const typeError = validateFileType(file, ["pdf", "jpg", "jpeg", "png"]);
  if (typeError) return typeError;

  const sizeError = validateFileSize(file, 5); // 5MB for documents
  if (sizeError) return sizeError;

  return null;
};

// Utility function to get nested value from object
export const getNestedValue = (obj, path) => {
  return path.split(".").reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

// Utility function to set nested value in object
export const setNestedValue = (obj, path, value) => {
  const keys = path.split(".");
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (!current[key] || typeof current[key] !== "object") {
      current[key] = {};
    }
    return current[key];
  }, obj);

  target[lastKey] = value;
  return obj;
};

// Form completeness checker
export const calculateFormCompleteness = (formData) => {
  const requiredFields = [
    "registrationNumber",
    "chassisNumber",
    "engineNumber",
    "currentOwner.name",
    "currentOwner.idNumber",
    "classOfVehicle",
    "make",
    "model",
    "yearOfManufacture",
    "provincialCouncil",
    "dateOfRegistration",
  ];

  let completedFields = 0;

  requiredFields.forEach((field) => {
    const value = getNestedValue(formData, field);
    if (value && value.toString().trim() !== "") {
      completedFields++;
    }
  });

  return Math.round((completedFields / requiredFields.length) * 100);
};

// Export all validation functions
export default {
  validateRegistrationNumber,
  validateChassisNumber,
  validateEngineNumber,
  validateNIC,
  validateEmail,
  validatePhoneNumber,
  validateYear,
  validateTyreSize,
  validatePostalCode,
  validateEngineCapacity,
  validateWeight,
  validateDate,
  validateFutureDate,
  validatePastDate,
  validateRequired,
  validateLength,
  validateRange,
  validateVehicleForm,
  validateFileType,
  validateFileSize,
  validateImageFile,
  validateDocumentFile,
  getNestedValue,
  setNestedValue,
  calculateFormCompleteness,
};
