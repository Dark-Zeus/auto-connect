import React from "react";

const StatCard = ({ icon, label, value, growth, color }) => {
  const isPositive = growth.includes("+");

  return (
    <div className={`tw:p-4 tw:rounded-lg tw:shadow-md ${color}`}>
      <div className="tw:flex tw:items-center tw:justify-between">
        <div className="tw:text-2xl">{icon}</div>
        <div
          className={`tw:text-sm tw:font-semibold ${
            isPositive ? "tw:text-green-600" : "tw:text-red-600"
          }`}
        >
          {growth}
        </div>
      </div>
      <h4 className="tw:mt-2 tw:text-sm tw:font-medium tw:text-gray-600">
        {label}
      </h4>
      <p className="tw:text-xl tw:font-bold tw:text-gray-800">{value}</p>
    </div>
  );
};

export default StatCard;
