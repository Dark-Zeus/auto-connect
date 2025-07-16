import React from "react";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";

const repairData = [
  {
    id: "C001",
    owner: "John Doe",
    vehicle: "Toyota Corolla",
    status: "In Progress",
    stages: ["Received", "Diagnosed"],
  },
  {
    id: "C002",
    owner: "Jane Smith",
    vehicle: "Honda Civic",
    status: "Completed",
    stages: ["Received", "Diagnosed", "Repairing", "Ready"],
  },
  {
    id: "C003",
    owner: "Alex Johnson",
    vehicle: "Ford Ranger",
    status: "Pending",
    stages: ["Received"],
  },
];

const allStages = ["Received", "Diagnosed", "Repairing", "Ready"];

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "tw:bg-[#B9E5E8] tw:text-[#4A628A]";
    case "In Progress":
      return "tw:bg-[#DFF2EB] tw:text-[#77AB2D]";
    case "Completed":
      return "tw:bg-[#4A628A] tw:text-white";
    default:
      return "tw:bg-gray-200 tw:text-gray-700";
  }
};

const RepairStatus = () => {
  return (
    <div className="tw:p-6 tw:bg-[#DFF2EB] tw:min-h-screen">
      <h2 className="tw:text-3xl tw:font-bold tw:text-[#4A628A] tw:mb-6">
        Vehicle Repair Tracking
      </h2>

      <div className="tw:grid tw:gap-6 tw:p-8">
        {repairData.map((item) => (
          <div
            key={item.id}
            className="tw:bg-white tw:rounded-2xl tw:shadow-md tw:p-6 tw:border-l-8 tw:border-[#77AB2D]"
          >
            <div className="tw:flex tw:items-center tw:justify-between tw:mb-4">
              <div>
                <h3 className="tw:text-xl tw:font-semibold tw:text-[#4A628A]">
                  <DirectionsCarIcon className="tw:mr-2" />
                  {item.vehicle}
                </h3>
                <p className="tw:text-sm tw:text-gray-500">
                  Owner: {item.owner}
                </p>
              </div>
              <div
                className={`tw:px-4 tw:py-1 tw:rounded-full tw:text-sm tw:font-medium ${getStatusColor(
                  item.status
                )}`}
              >
                {item.status}
              </div>
            </div>

            <div className="tw:flex tw:items-center tw:justify-between tw:mt-4 tw:space-x-4">
              {allStages.map((stage, idx) => {
                const completed = item.stages.includes(stage);
                return (
                  <div
                    key={stage}
                    className="tw:flex tw:flex-col tw:items-center"
                  >
                    <div
                      className={`tw:w-10 tw:h-10 tw:flex tw:items-center tw:justify-center tw:rounded-full ${
                        completed
                          ? "tw:bg-[#77AB2D] tw:text-white"
                          : "tw:bg-gray-300 tw:text-gray-600"
                      }`}
                    >
                      {completed ? (
                        <CheckCircleIcon fontSize="small" />
                      ) : (
                        <HourglassBottomIcon fontSize="small" />
                      )}
                    </div>
                    <span className="tw:mt-1 tw:text-xs tw:text-gray-700">
                      {stage}
                    </span>
                    {idx < allStages.length - 1 && (
                      <div className="tw:w-12 tw:h-1 tw:my-2 tw:bg-gray-300"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepairStatus;
