import React from "react";

const VehicleHeader = ({ make, model, year, name, date, district, city }) => {
  const formattedDate = date
    ? new Date(date).toISOString().slice(0, 10)
    : "";
  return (
    <div className="tw:text-center tw:my-4">
      <h1 className="tw:text-3xl tw:font-bold tw:text-black">
        {make} {model} {year}
      </h1>
      <p className="tw:text-gray-600">
        For Sale By {name} on {formattedDate}, {district}, {city}
      </p>
    </div>
  );
};

export default VehicleHeader;
