import React, { useState } from "react";
import {
  DirectionsCar,
  Person,
  Phone,
  Home,
  Badge,
} from "@mui/icons-material";

function VehicleOwnerCard({ owner }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      {/* Default Card */}
      <div
        onClick={() => setShowPopup(true)}
        className="tw:rounded-3xl tw:shadow-xl tw:bg-gradient-to-br tw:from-white tw:to-blue-50 tw:p-6 tw:border-l-8 tw:border-blue-500 hover:tw:shadow-xl hover:tw:scale-[1.03] tw-transition tw-duration-300 tw-ease-in-out tw-space-y-5 tw:cursor-pointer"
      >
        <div className="tw:flex tw:items-center tw:space-x-4">
          <div className="tw:p-4 tw:bg-blue-200 tw:rounded-full tw:text-blue-700 tw:flex tw:items-center tw:justify-center tw:shadow-md">
            <Person style={{ fontSize: 32 }} />
          </div>
          <div>
            <h2 className="tw:text-xl tw:font-bold tw:text-blue-900">{owner.name}</h2>
            <p className="tw:text-sm tw:text-blue-700">{owner.email}</p>
            <p className="tw:text-sm tw:text-blue-700">{owner.mobile}</p>
          </div>
        </div>
        <div className="tw:flex tw:items-center tw:space-x-3">
          <DirectionsCar className="tw:text-blue-400" />
          <span className="tw:text-blue-900 tw:font-semibold">
            {owner.vehicleName} – {owner.vehicleModel}
          </span>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="tw:fixed tw:inset-0 tw:bg-black/30 tw:flex tw:items-center tw:justify-center tw:z-50">
          <div className="tw:bg-white tw:rounded-2xl tw:shadow-2xl tw:p-6 tw:max-w-2xl tw:w-full tw:relative">
            <button
              onClick={() => setShowPopup(false)}
              className="tw:absolute tw:top-3 tw:right-3 tw:text-gray-500 hover:tw:text-red-500"
            >
              ✖
            </button>
            <div className="tw:mb-6">
              <h2 className="tw:text-2xl tw:font-extrabold tw:text-blue-900">{owner.name}</h2>
              <p className="tw:text-blue-700">{owner.email}</p>
              <p className="tw:text-blue-700">{owner.mobile}</p>
            </div>

            <div className="tw:grid tw:grid-cols-2 tw:gap-4">
              <Detail label="NIC" value={owner.nic} />
              <Detail label="Address" value={owner.address} />
              <Detail label="Vehicle" value={`${owner.vehicleName} – ${owner.vehicleModel}`} />
              <Detail label="Manufacturer" value={owner.manufacturer} />
              <Detail label="Model Year" value={owner.modelYear} />
              <Detail label="Registered Year" value={owner.registeredYear} />
              <Detail label="Leasing" value={owner.leasing} />
              <Detail label="Condition" value={owner.condition} />
              <Detail label="Transmission" value={owner.transmission} />
              <Detail label="Fuel Type" value={owner.fuelType} />
              <Detail label="Engine Capacity" value={`${owner.engineCapacity} cc`} />
              <Detail label="Mileage" value={`${owner.mileage} km`} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Detail({ label, value }) {
  return (
    <div className="tw:bg-blue-50 tw:p-4 tw:rounded-lg tw:shadow-sm">
      <p className="tw:text-xs tw:font-semibold tw:text-blue-600">{label}</p>
      <p className="tw:text-blue-900 tw:font-bold">{value}</p>
    </div>
  );
}

export default VehicleOwnerCard;
