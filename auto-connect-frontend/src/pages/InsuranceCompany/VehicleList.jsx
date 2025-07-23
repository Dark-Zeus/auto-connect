import React, { useState } from "react";

const vehicles = [
  {
    id: "1",
    plateNumber: "ABC-1234",
    model: "Toyota Prius",
    owner: "John Doe",
    insuranceType: "Comprehensive",
    registeredDate: "2025-01-15",
  },
  {
    id: "2",
    plateNumber: "XYZ-5678",
    model: "Honda Civic",
    owner: "Jane Smith",
    insuranceType: "Third Party",
    registeredDate: "2025-03-08",
  },
  {
    id: "3",
    plateNumber: "DEF-9012",
    model: "Suzuki Alto",
    owner: "Michael Brown",
    insuranceType: "Comprehensive",
    registeredDate: "2025-02-20",
  },
  {
    id: "4",
    plateNumber: "GHI-3456",
    model: "Nissan Leaf",
    owner: "Emily Clark",
    insuranceType: "Third Party",
    registeredDate: "2025-04-02",
  },
  {
    id: "5",
    plateNumber: "JKL-7890",
    model: "BMW X5",
    owner: "Robert Wilson",
    insuranceType: "Comprehensive",
    registeredDate: "2025-01-28",
  },
  {
    id: "6",
    plateNumber: "MNO-2345",
    model: "Tesla Model 3",
    owner: "Sarah Johnson",
    insuranceType: "Third Party",
    registeredDate: "2025-03-16",
  },
  {
    id: "7",
    plateNumber: "PQR-6789",
    model: "Hyundai Elantra",
    owner: "Daniel Evans",
    insuranceType: "Comprehensive",
    registeredDate: "2025-05-10",
  },
  {
    id: "8",
    plateNumber: "STU-1122",
    model: "Kia Sportage",
    owner: "Nancy Green",
    insuranceType: "Third Party",
    registeredDate: "2025-04-25",
  },
  {
    id: "9",
    plateNumber: "VWX-3344",
    model: "Audi A4",
    owner: "Kevin Martin",
    insuranceType: "Comprehensive",
    registeredDate: "2025-02-11",
  },
  {
    id: "10",
    plateNumber: "YZA-5566",
    model: "Ford Ranger",
    owner: "Laura Scott",
    insuranceType: "Third Party",
    registeredDate: "2025-06-01",
  },
];

const VehicleCard = ({ vehicle }) => (
  <div className="tw:bg-[#DFF2EB] tw:rounded-2xl tw:p-5 tw:shadow-md tw:hover:shadow-lg tw:w-[400px]">
    <div className="tw:flex tw:items-center tw:justify-between">
      <h2 className="tw:text-xl tw:font-bold tw:text-[#4A628A]">
        {vehicle.plateNumber}
      </h2>
      <span
        className={`tw:text-sm tw:px-3 tw:py-1 tw:rounded-full ${
          vehicle.insuranceType === "Comprehensive"
            ? "tw:bg-[#7AB2D3] tw:text-white"
            : "tw:bg-[#B9E5E8] tw:text-[#4A628A]"
        }`}
      >
        {vehicle.insuranceType}
      </span>
    </div>
    <p className="tw:text-[#4A628A] tw:mt-2">
      <strong>Model:</strong> {vehicle.model}
    </p>
    <p className="tw:text-[#4A628A]">
      <strong>Owner:</strong> {vehicle.owner}
    </p>
    <p className="tw:text-[#4A628A]">
      <strong>Registered On:</strong> {vehicle.registeredDate}
    </p>
  </div>
);

const VehicleList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVehicles = vehicles.filter((v) =>
    v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.id.includes(searchTerm)
  );

  return (
    <div className="tw:min-h-screen tw:bg-[#B9E5E8] tw:flex tw:flex-col tw:items-center tw:p-4 tw:space-y-6 tw:w-full">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Plate Number or Policy ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="tw:w-full tw:p-3 tw:border tw:border-blue-200 tw:rounded-xl tw:bg-blue-50 tw:text-blue-800 tw:font-medium"
      />

      {/* Vehicle Cards Grid */}
      <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:xl:grid-cols-3 tw:gap-8 tw:pt-4">
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map((v) => <VehicleCard key={v.id} vehicle={v} />)
        ) : (
          <p className="tw:text-[#4A628A] tw:text-lg">No vehicles found.</p>
        )}
      </div>
    </div>
  );
};

export default VehicleList;
