// src/components/atoms/ServiceTypeSelector.jsx
import React, { useState, useEffect } from "react";
import { ChevronDown, Search, Tag, Wrench } from "lucide-react";

const ServiceTypeSelector = ({
  value,
  onChange,
  category,
  className = "",
  placeholder = "Select Service Type",
  error = "",
  disabled = false,
  required = false,
  showSearch = false,
  allowCustom = false,
  onCustomAdd,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const serviceTypes = {
    "Engine Services": [
      "Oil Change",
      "Engine Tune-up",
      "Engine Diagnostic",
      "Engine Overhaul",
      "Spark Plug Replacement",
      "Air Filter Change",
      "Fuel Injection Service",
      "Timing Belt Replacement",
      "Engine Mount Replacement",
      "Coolant Flush",
    ],
    "Brake Services": [
      "Brake Inspection",
      "Brake Pad Replacement",
      "Brake Fluid Change",
      "Brake Repair",
      "Brake Rotor Replacement",
      "ABS Diagnostic",
      "Brake Line Repair",
      "Parking Brake Adjustment",
      "Brake Caliper Service",
      "Master Cylinder Replacement",
    ],
    "Transmission Services": [
      "Transmission Flush",
      "Gear Box Repair",
      "Clutch Replacement",
      "Transmission Diagnostic",
      "CVT Service",
      "Differential Service",
      "Transmission Mount Replacement",
      "Torque Converter Service",
      "Manual Transmission Service",
      "Automatic Transmission Service",
    ],
    "Electrical Services": [
      "Battery Check",
      "Alternator Repair",
      "Wiring Issues",
      "Light Replacement",
      "Starter Motor Repair",
      "ECU Diagnostic",
      "Fuse Box Repair",
      "Ignition System Service",
      "Audio System Installation",
      "Dashboard Repair",
    ],
    "Body Work": [
      "Dent Repair",
      "Paint Touch-up",
      "Rust Treatment",
      "Accident Repair",
      "Bumper Replacement",
      "Windshield Replacement",
      "Door Panel Repair",
      "Scratch Removal",
      "Frame Straightening",
      "Upholstery Repair",
    ],
    "Tire Services": [
      "Tire Rotation",
      "Wheel Alignment",
      "Tire Replacement",
      "Wheel Balancing",
      "Tire Pressure Check",
      "Puncture Repair",
      "Tire Installation",
      "Rim Repair",
      "Tire Mounting",
      "TPMS Service",
    ],
    "AC Services": [
      "AC Gas Refill",
      "AC Repair",
      "AC Filter Change",
      "AC Diagnostic",
      "Compressor Repair",
      "AC Belt Replacement",
      "Condenser Cleaning",
      "Evaporator Service",
      "AC Hose Replacement",
      "Climate Control Repair",
    ],
    "Inspection Services": [
      "Vehicle Inspection",
      "Emission Test",
      "Safety Check",
      "Pre-purchase Inspection",
      "Insurance Inspection",
      "Annual Inspection",
      "Road Worthiness Test",
      "Compliance Check",
      "Technical Inspection",
      "Government Inspection",
    ],
    "Cleaning Services": [
      "Car Wash",
      "Interior Cleaning",
      "Waxing",
      "Detailing",
      "Engine Bay Cleaning",
      "Upholstery Cleaning",
      "Ceramic Coating",
      "Paint Protection",
      "Steam Cleaning",
      "Odor Removal",
    ],
    "Emergency Services": [
      "Towing",
      "Jump Start",
      "Flat Tire Change",
      "Emergency Repair",
      "Lockout Service",
      "Fuel Delivery",
      "Battery Replacement",
      "Roadside Assistance",
      "Accident Recovery",
      "24/7 Support",
    ],
  };

  const availableTypes =
    category && serviceTypes[category] ? serviceTypes[category] : [];

  // Filter service types based on search term
  const filteredTypes = availableTypes.filter((type) =>
    type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (selectedValue) => {
    onChange({ target: { value: selectedValue } });
    setIsOpen(false);
    setSearchTerm("");
    setShowCustomInput(false);
  };

  const handleCustomSubmit = () => {
    if (customValue.trim() && onCustomAdd) {
      onCustomAdd(customValue.trim());
      handleSelect(customValue.trim());
      setCustomValue("");
      setShowCustomInput(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".service-type-selector")) {
        setIsOpen(false);
        setShowCustomInput(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`tw:relative service-type-selector ${className}`}>
      {/* Main Input */}
      <div
        className={`tw:relative tw:w-full tw:px-3 tw:py-2 tw:border tw:rounded-md tw:cursor-pointer tw:transition-all tw:duration-200 tw:bg-white ${
          disabled
            ? "tw:bg-gray-100 tw:cursor-not-allowed tw:text-gray-500"
            : isOpen
            ? "tw:ring-2 tw:ring-blue-500 tw:border-blue-500"
            : error
            ? "tw:border-red-500 tw:ring-1 tw:ring-red-500"
            : "tw:border-gray-300 hover:tw:border-gray-400"
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="tw:flex tw:items-center tw:justify-between">
          <div className="tw:flex tw:items-center tw:space-x-2">
            <Wrench className="tw:h-4 tw:w-4 tw:text-gray-500" />
            <span
              className={`tw:text-sm ${
                value ? "tw:text-gray-900" : "tw:text-gray-500"
              }`}
            >
              {value || placeholder}
              {required && !value && (
                <span className="tw:text-red-500 tw:ml-1">*</span>
              )}
            </span>
          </div>
          <ChevronDown
            className={`tw:h-4 tw:w-4 tw:text-gray-500 tw:transition-transform tw:duration-200 ${
              isOpen ? "tw:rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="tw:text-red-500 tw:text-sm tw:mt-1">{error}</p>}

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="tw:absolute tw:z-50 tw:w-full tw:mt-1 tw:bg-white tw:border tw:border-gray-200 tw:rounded-md tw:shadow-lg tw:max-h-64 tw:overflow-hidden">
          {/* Search Input */}
          {showSearch && availableTypes.length > 5 && (
            <div className="tw:p-3 tw:border-b tw:border-gray-100">
              <div className="tw:relative">
                <Search className="tw:absolute tw:left-3 tw:top-1/2 tw:transform tw:-translate-y-1/2 tw:h-4 tw:w-4 tw:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search service types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="tw:w-full tw:pl-9 tw:pr-3 tw:py-2 tw:text-sm tw:border tw:border-gray-300 tw:rounded-md tw:focus:outline-none tw:focus:ring-1 tw:focus:ring-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* Service Types List */}
          <div className="tw:max-h-48 tw:overflow-y-auto">
            {availableTypes.length === 0 && !category ? (
              <div className="tw:p-4 tw:text-center tw:text-gray-500">
                <Tag className="tw:h-8 tw:w-8 tw:mx-auto tw:mb-2 tw:text-gray-400" />
                <p className="tw:text-sm">Please select a category first</p>
              </div>
            ) : filteredTypes.length === 0 ? (
              <div className="tw:p-4 tw:text-center tw:text-gray-500">
                <Search className="tw:h-8 tw:w-8 tw:mx-auto tw:mb-2 tw:text-gray-400" />
                <p className="tw:text-sm">No service types found</p>
                {allowCustom && (
                  <button
                    onClick={() => setShowCustomInput(true)}
                    className="tw:mt-2 tw:text-blue-600 hover:tw:text-blue-800 tw:text-sm tw:font-medium"
                  >
                    Add custom service type
                  </button>
                )}
              </div>
            ) : (
              <>
                {filteredTypes.map((type, index) => (
                  <div
                    key={index}
                    className={`tw:px-3 tw:py-2 tw:cursor-pointer tw:text-sm tw:transition-colors tw:flex tw:items-center tw:space-x-2 ${
                      value === type
                        ? "tw:bg-blue-50 tw:text-blue-700 tw:font-medium"
                        : "tw:text-gray-700 hover:tw:bg-gray-50"
                    }`}
                    onClick={() => handleSelect(type)}
                  >
                    <Wrench className="tw:h-3 tw:w-3 tw:text-gray-400" />
                    <span>{type}</span>
                    {value === type && (
                      <div className="tw:ml-auto tw:w-2 tw:h-2 tw:bg-blue-600 tw:rounded-full"></div>
                    )}
                  </div>
                ))}

                {/* Add Custom Option */}
                {allowCustom && !showCustomInput && (
                  <div
                    className="tw:px-3 tw:py-2 tw:cursor-pointer tw:text-sm tw:text-blue-600 hover:tw:bg-blue-50 tw:border-t tw:border-gray-100 tw:flex tw:items-center tw:space-x-2"
                    onClick={() => setShowCustomInput(true)}
                  >
                    <Tag className="tw:h-3 tw:w-3" />
                    <span>Add custom service type</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Custom Input */}
          {showCustomInput && allowCustom && (
            <div className="tw:p-3 tw:border-t tw:border-gray-100 tw:bg-gray-50">
              <div className="tw:flex tw:space-x-2">
                <input
                  type="text"
                  placeholder="Enter custom service type"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleCustomSubmit()}
                  className="tw:flex-1 tw:px-3 tw:py-2 tw:text-sm tw:border tw:border-gray-300 tw:rounded-md tw:focus:outline-none tw:focus:ring-1 tw:focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={handleCustomSubmit}
                  disabled={!customValue.trim()}
                  className="tw:px-3 tw:py-2 tw:bg-blue-600 tw:text-white tw:text-sm tw:rounded-md hover:tw:bg-blue-700 tw:transition-colors disabled:tw:opacity-50 disabled:tw:cursor-not-allowed"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowCustomInput(false)}
                  className="tw:px-3 tw:py-2 tw:bg-gray-300 tw:text-gray-700 tw:text-sm tw:rounded-md hover:tw:bg-gray-400 tw:transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceTypeSelector;
