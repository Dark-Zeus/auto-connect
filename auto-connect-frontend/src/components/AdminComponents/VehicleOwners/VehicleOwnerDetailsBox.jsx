import React, { useState } from "react";
import { Person, Home, Phone, Badge } from "@mui/icons-material";

function VehicleOwnerCard({ owner }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      {/* Main Card */}
      <div
        onClick={() => setShowPopup(true)}
        className="tw:rounded-3xl tw:w-[300px] tw:shadow-xl tw:bg-gradient-to-br tw:from-white tw:to-blue-50 tw:p-6 tw:border-l-8 tw:border-blue-500 hover:tw:shadow-xl hover:tw:scale-[1.03] tw:transition tw:duration-300 tw:ease-in-out tw:space-y-5 tw:cursor-pointer"
      >
        <div className="tw:flex tw:items-center tw:space-x-4">
          <img
            src={owner.image}
            alt={owner.name}
            className="tw:w-16 tw:h-16 tw:rounded-full tw:object-cover tw:border tw:border-gray-300"
          />
          <div>
            <h2 className="tw:text-xl tw:font-bold tw:text-blue-900">{owner.name}</h2>
            <p className="tw:text-sm tw:text-blue-700">{owner.email}</p>
            <p className="tw:text-sm tw:text-blue-700">{owner.mobile}</p>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="tw:fixed tw:inset-0 tw:bg-black/30 tw:flex tw:items-center tw:justify-center tw:z-50 tw:px-4">
          <div className="tw:bg-white tw:rounded-2xl tw:shadow-2xl tw:p-6 tw:max-w-xl tw:w-full tw:relative tw:overflow-y-auto tw:max-h-[90vh]">
            <button
              onClick={() => setShowPopup(false)}
              className="tw:absolute tw:top-3 tw:right-3 tw:text-gray-500 hover:tw:text-red-500"
            >
              ✖
            </button>

            <div className="tw:flex tw:items-center tw:space-x-4 tw:mb-6">
              <img
                src={owner.image}
                alt={owner.name}
                className="tw:w-20 tw:h-20 tw:rounded-full tw:object-cover tw:border tw:border-gray-300"
              />
              <div>
                <h2 className="tw:text-xl tw:font-extrabold tw:text-blue-900">{owner.name}</h2>
                <p className="tw:text-blue-700">{owner.email}</p>
                <p className="tw:text-blue-700">{owner.mobile}</p>
              </div>
            </div>

            <div className="tw:grid tw:grid-cols-2 sm:tw:grid-cols-2 tw:gap-4">
              <Detail label="NIC" value={owner.nic} />
              <Detail label="Gender" value={owner.gender} />
              <Detail label="Address" value={owner.address} />
              <Detail label="Date of Birth" value={owner.dob} />
              <Detail label="City" value={owner.city} />
              <Detail label="District" value={owner.district} />
              <Detail label="Province" value={owner.province} />
              <Detail label="Postal Code" value={owner.postalCode} />
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
