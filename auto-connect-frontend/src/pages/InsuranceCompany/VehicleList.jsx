import React, { useState } from "react";

const vehicles = [
  {
    id: "1",
    plateNumber: "ABC-1234",
    model: "Toyota Prius",
    owner: "John Doe",
    insuranceType: "Comprehensive",
    registeredDate: "2025-01-15",
    engineCapacity: "1800cc",
    valuation: "$22,000",
    image: "../../../public/insurance-claims/toyota-rius.jpg",
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

const VehicleCard = ({ vehicle, isFirst, onClick }) => (
  <div
    className="tw:bg-[#DFF2EB] tw:rounded-2xl tw:p-5 tw:shadow-md tw:hover:shadow-lg tw:w-[400px] tw:cursor-pointer"
    onClick={isFirst ? onClick : null}
  >
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

const VehicleModal = ({ vehicle, onClose }) => (
  <div className="tw:fixed tw:inset-0 tw:bg-black/50 tw:flex tw:items-center tw:justif:-center tw:z-50 tw:pl-24">
    <div className="tw:bg-white tw:rounded-2xl tw:p-6 tw:w-[500px] tw:shadow-lg tw:relative">
      <button
        onClick={onClose}
        className="tw:absolute tw:top-2 tw:right-3 tw:text-red-500 tw:hover:text-black tw:text-3xl tw:font-bold "
      >
        &times;
      </button>
      <img
        src={vehicle.image}
        alt="Vehicle"
        className="tw:rounded-xl tw:mb-4 tw:w-full tw:h-64 tw:object-cover tw:mt-4"
      />
      <h2 className="tw:text-2xl tw:font-bold tw:text-[#4A628A] tw:mb-2">
        {vehicle.model} - {vehicle.plateNumber}
      </h2>
      <p className="tw:text-[#4A628A]">
        <strong>Owner:</strong> {vehicle.owner}
      </p>
      <p className="tw:text-[#4A628A]">
        <strong>Engine Capacity:</strong> {vehicle.engineCapacity}
      </p>
      <p className="tw:text-[#4A628A]">
        <strong>Valuation:</strong> {vehicle.valuation}
      </p>
      <p className="tw:text-[#4A628A] tw:mb-4">
        <strong>Insurance Type:</strong> {vehicle.insuranceType}
      </p>
      <p className="tw:text-[#4A628A] tw:mb-4">
        <strong>Registered Date:</strong> {vehicle.registeredDate}
      </p>

      <div className="tw:flex tw:justify-between tw:mt-7">
        <button className="tw:bg-red-500 tw:text-white tw:px-4 tw:py-2 tw:rounded-lg tw:hover:bg-red-600">
          Stolen Mark
        </button>
        <button className="tw:bg-yellow-500 tw:text-white tw:px-4 tw:py-2 tw:rounded-lg tw:hover:bg-yellow-600">
          Scrap Mark
        </button>
        <button className="tw:bg-blue-500 tw:text-white tw:px-4 tw:py-2 tw:rounded-lg tw:hover:bg-blue-600">
          Insurance Write-off
        </button>
      </div>
    </div>
  </div>
);

const VehicleList = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="tw:min-h-screen tw:bg-[#B9E5E8] tw:flex tw:flex-col tw:items-center tw:p-4 tw:space-y-6 tw:w-full">
      <h1 className="tw:text-3xl tw:font-bold tw:text-[#4A628A] tw:pb-8 tw:pt-3">
        Registered Vehicles
      </h1>

      <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:xl:grid-cols-3 tw:gap-8">
        {vehicles.map((v, idx) => (
          <VehicleCard
            key={v.id}
            vehicle={v}
            isFirst={idx === 0}
            onClick={handleOpenModal}
          />
        ))}
      </div>

      {showModal && (
        <VehicleModal vehicle={vehicles[0]} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default VehicleList;
