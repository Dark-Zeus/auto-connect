import React from "react";

function ServiceCenterStatBox({ totalUpdates = 0, rateChange = "+0%" }) {
  const monthName = new Date().toLocaleString("default", { month: "long" });
  const isPositive = rateChange.startsWith("+");

  return (
    <div className="tw:bg-white tw:rounded-2xl tw:h-36 tw:shadow-md tw:px-6 tw:py-4 tw:w-full tw:relative tw:border-l-4 tw:border-blue-600">
      <div className="tw:flex tw:justify-between tw:items-center tw:h-full">
        <div>
          <h4 className="tw:text-gray-600 tw:text-lg">
            Total Updates - {monthName}
          </h4>
          <p className="tw:!text-3xl tw:font-bold tw:text-blue-800 tw:!mt-3">
            11
          </p>
        </div>

        <div
          className={`tw:text-sm tw:font-semibold ${
            isPositive ? "tw:text-green-600" : "tw:text-red-500"
          }`}
        >
          {rateChange}
        </div>
      </div>
    </div>
  );
}

export default ServiceCenterStatBox;
