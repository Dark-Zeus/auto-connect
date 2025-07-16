import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";

const approvedRequests = [
  {
    id: 1,
    client: "John Doe",
    vehicle: "Toyota Camry 2018",
    date: "2025-07-05",
    status: "Approved",
  },
  {
    id: 2,
    client: "Emily Smith",
    vehicle: "Honda Civic 2020",
    date: "2025-07-06",
    status: "Approved",
  },
];

const pendingRequests = [
  {
    id: 1,
    client: "Robert Lee",
    vehicle: "Ford Focus 2019",
    date: "2025-07-07",
    status: "Pending",
  },
  {
    id: 2,
    client: "Jane Miller",
    vehicle: "Nissan Altima 2017",
    date: "2025-07-08",
    status: "Pending",
  },
];

const RepairRequests = () => {
  return (
    <div className="tw:p-6">
      <h1 className="tw:text-3xl tw:font-bold tw:text-[#4A628A] tw:mb-6 tw:pb-10">
        Repair Requests
      </h1>

      {/* Approved Requests */}
      <div className="tw:mb-10">
        <h2 className="tw:text-xl tw:font-semibold tw:text-[#77AB2D] tw:flex tw:items-center tw:gap-2 tw:mb-4 tw:pb-4">
          <CheckCircleIcon className="tw:text-[#77AB2D]" /> Approved Requests
        </h2>
        <div className="tw:grid tw:gap-4 tw:md:grid-cols-2">
          {approvedRequests.map((req) => (
            <div
              key={req.id}
              className="tw:bg-[#B9E5E8] tw:p-8 tw:rounded-lg tw:shadow-md"
            >
              <div className="tw:flex tw:items-center tw:justify-between tw:mb-2">
                <p className="tw:font-semibold tw:text-[#4A628A]">
                  {req.client}
                </p>
                <CheckCircleIcon className="tw:text-[#77AB2D]" />
              </div>
              <p className="tw:text-sm tw:text-gray-700">
                Vehicle: {req.vehicle}
              </p>
              <p className="tw:text-sm tw:text-gray-700">Date: {req.date}</p>
              <p className="tw:mt-2 tw:text-sm tw:font-semibold tw:text-green-700">
                {req.status}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Requests */}
      <div>
        <h2 className="tw:flex tw:items-center tw:gap-2 tw:mb-4 tw:text-xl tw:font-semibold tw:text-yellow-600 tw:pb-4">
          <HourglassBottomIcon className="tw:text-yellow-600" /> Pending
          Requests
        </h2>
        <div className="tw:grid tw:gap-4 tw:md:grid-cols-2">
          {pendingRequests.map((req) => (
            <div
              key={req.id}
              className="tw:p-8 tw:bg-white tw:border tw:border-yellow-200 tw:rounded-lg tw:shadow-md"
            >
              <div className="tw:flex tw:items-center tw:justify-between tw:mb-2">
                <p className="tw:font-semibold tw:text-[#4A628A]">
                  {req.client}
                </p>
                <HourglassBottomIcon className="tw:text-yellow-500" />
              </div>
              <p className="tw:text-sm tw:text-gray-700">
                Vehicle: {req.vehicle}
              </p>
              <p className="tw:text-sm tw:text-gray-700">Date: {req.date}</p>
              <p className="tw:mt-2 tw:text-sm tw:font-semibold tw:text-yellow-700">
                {req.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RepairRequests;
