import React, { useState, useEffect } from "react";

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

const Badge = ({
  children,
  variant = "default",
  size = "md",
  className = "",
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-[#B9E5E8] text-[#4A628A]",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-600",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};

const Input = ({ label, className = "", ...props }) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7AB2D3] focus:border-[#7AB2D3] transition-all duration-200"
        {...props}
      />
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children, footer, size = "lg" }) => {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          className={`bg-white rounded-xl shadow-xl w-full ${sizes[size]} max-h-screen overflow-auto`}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="p-6">{children}</div>
          {footer && (
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Mock Vehicle Data
const mockVehicles = [
  {
    id: "VEH001",
    registrationNumber: "WP ABC-1234",
    make: "TOYOTA",
    model: "PRIUS",
    yearOfManufacture: 2018,
    chassisNumber: "JTDKN3DU5A0123456",
    engineNumber: "ABC123456",
    color: "WHITE",
    fuelType: "HYBRID",
    classOfVehicle: "MOTOR CAR",
    taxationClass: "PRIVATE",
    cylinderCapacity: 1498,
    status: "ACTIVE",
    currentOwner: {
      name: "John Perera",
      idNumber: "123456789V",
    },
    dateOfRegistration: "2018-03-15",
    provincialCouncil: "Western Provincial Council",
    isVerified: true,
    insuranceDetails: {
      provider: "Allianz Insurance",
      policyNumber: "POL123456789",
      validTo: "2024-12-31",
      isValid: true,
    },
    revenueLicense: {
      licenseNumber: "REV123456",
      validTo: "2024-12-31",
      isValid: true,
    },
    emissionTest: {
      lastTestDate: "2024-01-15",
      nextTestDue: "2025-01-15",
      testResult: "PASS",
    },
    mileage: 75000,
    lastServiceDate: "2024-05-20",
    nextServiceDue: "2024-08-20",
  },
  {
    id: "VEH002",
    registrationNumber: "CP XYZ-5678",
    make: "HONDA",
    model: "CIVIC",
    yearOfManufacture: 2020,
    chassisNumber: "JHFCK1234567890AB",
    engineNumber: "DEF789012",
    color: "SILVER",
    fuelType: "PETROL",
    classOfVehicle: "MOTOR CAR",
    taxationClass: "PRIVATE",
    cylinderCapacity: 1499,
    status: "ACTIVE",
    currentOwner: {
      name: "Sarah Silva",
      idNumber: "987654321V",
    },
    dateOfRegistration: "2020-07-20",
    provincialCouncil: "Central Provincial Council",
    isVerified: true,
    insuranceDetails: {
      provider: "AIA Insurance",
      policyNumber: "POL987654321",
      validTo: "2024-07-20",
      isValid: true,
    },
    revenueLicense: {
      licenseNumber: "REV789012",
      validTo: "2024-07-20",
      isValid: true,
    },
    emissionTest: {
      lastTestDate: "2024-02-10",
      nextTestDue: "2025-02-10",
      testResult: "PASS",
    },
    mileage: 45000,
    lastServiceDate: "2024-04-15",
    nextServiceDue: "2024-10-15",
  },
  {
    id: "VEH003",
    registrationNumber: "SP DEF-9012",
    make: "NISSAN",
    model: "MARCH",
    yearOfManufacture: 2016,
    chassisNumber: "JN1BCBZ12345678CD",
    engineNumber: "GHI345678",
    color: "RED",
    fuelType: "PETROL",
    classOfVehicle: "MOTOR CAR",
    taxationClass: "PRIVATE",
    cylinderCapacity: 1198,
    status: "ACTIVE",
    currentOwner: {
      name: "Ravi Fernando",
      idNumber: "456789123V",
    },
    dateOfRegistration: "2016-11-08",
    provincialCouncil: "Southern Provincial Council",
    isVerified: false,
    insuranceDetails: {
      provider: "LOLC Insurance",
      policyNumber: "POL456789123",
      validTo: "2024-11-08",
      isValid: false,
    },
    revenueLicense: {
      licenseNumber: "REV345678",
      validTo: "2024-05-15",
      isValid: false,
    },
    emissionTest: {
      lastTestDate: "2023-11-08",
      nextTestDue: "2024-11-08",
      testResult: "FAIL",
    },
    mileage: 120000,
    lastServiceDate: "2024-03-10",
    nextServiceDue: "2024-09-10",
  },
];

// Vehicle Dashboard Component
const VehicleDashboard = () => {
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && vehicle.status === "ACTIVE") ||
      (filter === "issues" &&
        (!vehicle.insuranceDetails.isValid ||
          !vehicle.revenueLicense.isValid ||
          vehicle.emissionTest.testResult === "FAIL"));

    const matchesSearch =
      vehicle.registrationNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleViewDetails = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const getStatusBadge = (vehicle) => {
    const hasIssues =
      !vehicle.insuranceDetails.isValid ||
      !vehicle.revenueLicense.isValid ||
      vehicle.emissionTest.testResult === "FAIL";

    if (vehicle.status !== "ACTIVE") {
      return <Badge variant="inactive">Inactive</Badge>;
    } else if (hasIssues) {
      return <Badge variant="warning">⚠️ Issues</Badge>;
    } else {
      return <Badge variant="success">✅ Active</Badge>;
    }
  };

  const getVehicleAge = (year) => {
    return new Date().getFullYear() - year;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const stats = {
    total: vehicles.length,
    active: vehicles.filter((v) => v.status === "ACTIVE").length,
    issues: vehicles.filter(
      (v) =>
        !v.insuranceDetails.isValid ||
        !v.revenueLicense.isValid ||
        v.emissionTest.testResult === "FAIL"
    ).length,
    serviceDue: vehicles.filter((v) => new Date(v.nextServiceDue) <= new Date())
      .length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DFF2EB] to-[#B9E5E8] py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#4A628A] mb-2">
              My Vehicles
            </h1>
            <p className="text-lg text-gray-600">
              Manage your registered vehicles and track their status
            </p>
          </div>
          <Button
            onClick={() => (window.location.href = "/register-vehicle")}
            icon="➕"
          >
            Register New Vehicle
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-[#4A628A] mb-2">
              {stats.total}
            </div>
            <div className="text-gray-600">Total Vehicles</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.active}
            </div>
            <div className="text-gray-600">Active Vehicles</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {stats.issues}
            </div>
            <div className="text-gray-600">Vehicles with Issues</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {stats.serviceDue}
            </div>
            <div className="text-gray-600">Service Due</div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All Vehicles ({stats.total})
              </Button>
              <Button
                variant={filter === "active" ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter("active")}
              >
                Active ({stats.active})
              </Button>
              <Button
                variant={filter === "issues" ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter("issues")}
              >
                With Issues ({stats.issues})
              </Button>
            </div>

            <Input
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80"
            />
          </div>
        </Card>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <Card
              key={vehicle.id}
              className="p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => handleViewDetails(vehicle)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#4A628A] mb-1">
                    {vehicle.registrationNumber}
                  </h3>
                  <p className="text-gray-600">
                    {vehicle.yearOfManufacture} {vehicle.make} {vehicle.model}
                  </p>
                </div>
                {getStatusBadge(vehicle)}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Owner:</span>
                  <span className="font-medium">
                    {vehicle.currentOwner.name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Fuel Type:</span>
                  <span className="font-medium">{vehicle.fuelType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Engine:</span>
                  <span className="font-medium">
                    {vehicle.cylinderCapacity} CC
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Vehicle Age:</span>
                  <span className="font-medium">
                    {getVehicleAge(vehicle.yearOfManufacture)} years
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Mileage:</span>
                  <span className="font-medium">
                    {vehicle.mileage.toLocaleString()} km
                  </span>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Insurance:</span>
                  <Badge
                    variant={
                      vehicle.insuranceDetails.isValid ? "success" : "danger"
                    }
                    size="sm"
                  >
                    {vehicle.insuranceDetails.isValid ? "Valid" : "Expired"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Revenue License:</span>
                  <Badge
                    variant={
                      vehicle.revenueLicense.isValid ? "success" : "danger"
                    }
                    size="sm"
                  >
                    {vehicle.revenueLicense.isValid ? "Valid" : "Expired"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Emission Test:</span>
                  <Badge
                    variant={
                      vehicle.emissionTest.testResult === "PASS"
                        ? "success"
                        : "danger"
                    }
                    size="sm"
                  >
                    {vehicle.emissionTest.testResult}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Book Service
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No vehicles found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? "Try adjusting your search terms"
                : "You haven't registered any vehicles yet"}
            </p>
            <Button
              onClick={() => (window.location.href = "/register-vehicle")}
            >
              Register Your First Vehicle
            </Button>
          </Card>
        )}

        {/* Vehicle Details Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={
            selectedVehicle
              ? `${selectedVehicle.registrationNumber} - Vehicle Details`
              : ""
          }
          size="xl"
          footer={
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
              <Button
                onClick={() =>
                  (window.location.href = `/vehicles/${selectedVehicle?.id}/edit`)
                }
              >
                Edit Vehicle
              </Button>
              <Button
                variant="success"
                onClick={() =>
                  (window.location.href = `/services?vehicle=${selectedVehicle?.id}`)
                }
              >
                Book Service
              </Button>
            </div>
          }
        >
          {selectedVehicle && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-lg font-semibold text-[#4A628A] mb-3">
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">
                      Registration Number
                    </span>
                    <p className="text-gray-800 font-semibold">
                      {selectedVehicle.registrationNumber}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">
                      Vehicle
                    </span>
                    <p className="text-gray-800">
                      {selectedVehicle.yearOfManufacture} {selectedVehicle.make}{" "}
                      {selectedVehicle.model}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">
                      Chassis Number
                    </span>
                    <p className="text-gray-800 font-mono text-sm">
                      {selectedVehicle.chassisNumber}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">
                      Engine Number
                    </span>
                    <p className="text-gray-800 font-mono text-sm">
                      {selectedVehicle.engineNumber}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">
                      Color
                    </span>
                    <p className="text-gray-800">{selectedVehicle.color}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">
                      Fuel Type
                    </span>
                    <p className="text-gray-800">{selectedVehicle.fuelType}</p>
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              <div>
                <h4 className="text-lg font-semibold text-[#4A628A] mb-3">
                  Owner Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">
                      Current Owner
                    </span>
                    <p className="text-gray-800">
                      {selectedVehicle.currentOwner.name}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">
                      ID Number
                    </span>
                    <p className="text-gray-800">
                      {selectedVehicle.currentOwner.idNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vehicle Specifications */}
              <div>
                <h4 className="text-lg font-semibold text-[#4A628A] mb-3">
                  Specifications
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">
                      Class of Vehicle
                    </span>
                    <p className="text-gray-800">
                      {selectedVehicle.classOfVehicle}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">
                      Taxation Class
                    </span>
                    <p className="text-gray-800">
                      {selectedVehicle.taxationClass}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">
                      Engine Capacity
                    </span>
                    <p className="text-gray-800">
                      {selectedVehicle.cylinderCapacity} CC
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">
                      Current Mileage
                    </span>
                    <p className="text-gray-800">
                      {selectedVehicle.mileage.toLocaleString()} km
                    </p>
                  </div>
                </div>
              </div>

              {/* Legal Information */}
              <div>
                <h4 className="text-lg font-semibold text-[#4A628A] mb-3">
                  Legal & Registration
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">
                      Registration Date
                    </span>
                    <p className="text-gray-800">
                      {formatDate(selectedVehicle.dateOfRegistration)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">
                      Provincial Council
                    </span>
                    <p className="text-gray-800">
                      {selectedVehicle.provincialCouncil}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">
                      Verification Status
                    </span>
                    <Badge
                      variant={
                        selectedVehicle.isVerified ? "success" : "warning"
                      }
                    >
                      {selectedVehicle.isVerified
                        ? "✅ Verified"
                        : "⏳ Pending Verification"}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">
                      Vehicle Status
                    </span>
                    <Badge
                      variant={
                        selectedVehicle.status === "ACTIVE"
                          ? "success"
                          : "inactive"
                      }
                    >
                      {selectedVehicle.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Insurance & Licenses */}
              <div>
                <h4 className="text-lg font-semibold text-[#4A628A] mb-3">
                  Insurance & Licenses
                </h4>

                {/* Insurance */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">
                      Insurance Details
                    </h5>
                    <Badge
                      variant={
                        selectedVehicle.insuranceDetails.isValid
                          ? "success"
                          : "danger"
                      }
                    >
                      {selectedVehicle.insuranceDetails.isValid
                        ? "Valid"
                        : "Expired"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Provider:</span>
                      <span className="ml-2 text-gray-800">
                        {selectedVehicle.insuranceDetails.provider}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Policy Number:</span>
                      <span className="ml-2 text-gray-800 font-mono">
                        {selectedVehicle.insuranceDetails.policyNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Valid Until:</span>
                      <span className="ml-2 text-gray-800">
                        {formatDate(selectedVehicle.insuranceDetails.validTo)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Revenue License */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">
                      Revenue License
                    </h5>
                    <Badge
                      variant={
                        selectedVehicle.revenueLicense.isValid
                          ? "success"
                          : "danger"
                      }
                    >
                      {selectedVehicle.revenueLicense.isValid
                        ? "Valid"
                        : "Expired"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">License Number:</span>
                      <span className="ml-2 text-gray-800 font-mono">
                        {selectedVehicle.revenueLicense.licenseNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Valid Until:</span>
                      <span className="ml-2 text-gray-800">
                        {formatDate(selectedVehicle.revenueLicense.validTo)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Emission Test */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">Emission Test</h5>
                    <Badge
                      variant={
                        selectedVehicle.emissionTest.testResult === "PASS"
                          ? "success"
                          : "danger"
                      }
                    >
                      {selectedVehicle.emissionTest.testResult}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Last Test Date:</span>
                      <span className="ml-2 text-gray-800">
                        {formatDate(selectedVehicle.emissionTest.lastTestDate)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Next Test Due:</span>
                      <span className="ml-2 text-gray-800">
                        {formatDate(selectedVehicle.emissionTest.nextTestDue)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Information */}
              <div>
                <h4 className="text-lg font-semibold text-[#4A628A] mb-3">
                  Service Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">
                      Last Service Date
                    </span>
                    <p className="text-gray-800">
                      {formatDate(selectedVehicle.lastServiceDate)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">
                      Next Service Due
                    </span>
                    <p className="text-gray-800">
                      {formatDate(selectedVehicle.nextServiceDue)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default VehicleDashboard;
