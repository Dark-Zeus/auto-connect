import React from "react";

const VehicleHeader = ({ make, model, year, name, date, district, city }) => {
  return (
    <div className="tw:text-center tw:my-4">
      <h1 className="tw:text-3xl tw:font-bold tw:text-black">
        {make} {model} {year}
      </h1>
      <p className="tw:text-gray-600">
        For Sale By {name} on {date}, {district}, {city}
      </p>
    </div>
  );
};

export default VehicleHeader;
