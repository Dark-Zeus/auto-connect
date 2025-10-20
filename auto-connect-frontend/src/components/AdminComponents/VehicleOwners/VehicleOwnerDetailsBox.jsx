import React, { useState } from "react";
import { Phone, Badge, Mail, MapPin, Home } from "lucide-react";

function VehicleOwnerCard({ owner }) {
  const [showPopup, setShowPopup] = useState(false);

  if (!owner) return null;

  const fullName = `${owner.firstName} ${owner.lastName}`;
  const profileImage = owner.profileImage || `https://ui-avatars.com/api/?name=${owner.firstName}+${owner.lastName}&background=DBEAFE&color=fff`;

  return (
    <>
      {/* Card */}
      <div
        onClick={() => setShowPopup(true)}
        className="tw:w-[300px] tw:rounded-2xl tw:p-5 tw:shadow-lg tw:cursor-pointer tw:transition-transform hover:tw:scale-105 tw:bg-white"
      >
        <div className="tw:flex tw:gap-4">
          <img
            src={profileImage}
            alt={fullName}
            className="tw:w-35 tw:h-35 tw:rounded-xl tw:object-cover tw:border tw:border-blue-100"
          />
          <div>
            <h2 className="tw:font-bold tw:text-lg">{fullName}</h2>
            <p className="tw:text-sm tw:text-gray-600">
              <Mail size={12} className="tw:inline tw:mr-1" />
              {owner.email}
            </p>
            <p className="tw:text-sm tw:text-gray-600">
              <Phone size={12} className="tw:inline tw:mr-1" />
              {owner.phone}
            </p>
          </div>
        </div>
        <div className="tw:mt-3 tw:text-xs tw:text-gray-500">
          <span>
            <MapPin size={12} className="tw:inline tw:mr-1" />
            {owner.address?.city}
          </span>
          <span className="tw:ml-4">
            <Badge size={12} className="tw:inline tw:mr-1" />
            {owner.nicNumber}
          </span>
        </div>
      </div>

      {/* Modal */}
      {showPopup && (
        <div className="tw:fixed tw:inset-0 tw:bg-black/50 tw:flex tw:items-center tw:justify-center tw:z-999">
          <div className="tw:bg-white tw:p-6 tw:rounded-xl tw:shadow-xl tw:max-w-xl tw:w-full tw:relative">
            <button
              onClick={() => setShowPopup(false)}
              className="tw:absolute tw:top-3 tw:right-3 tw:text-red-500 hover:tw:text-red-700"
            >
              &#10005;
            </button>
            <div className="tw:flex tw:gap-4">
              <img
                src={profileImage}
                alt={fullName}
                className="tw:w-40 tw:h-40 tw:rounded-xl tw:object-cover"
              />
              <div>
                <h2 className="tw:text-2xl tw:font-bold">{fullName}</h2>
                <p className="tw:text-sm tw:text-gray-600">{owner.email}</p>
                <p className="tw:text-sm tw:text-gray-600">{owner.phone}</p>
              </div>
            </div>

            <div className="tw:grid tw:grid-cols-2 tw:gap-4 tw:mt-4">
              <Detail label="NIC" value={owner.nicNumber} />
              <Detail label="City" value={owner.address?.city} />
              <Detail label="District" value={owner.address?.district} />
              <Detail label="Province" value={owner.address?.province} />
              <Detail label="Street" value={owner.address?.street} />
              <Detail label="Postal Code" value={owner.address?.postalCode} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Detail({ label, value }) {
  return (
    <div className="tw:bg-gray-50 tw:p-3 tw:rounded-lg tw:shadow-sm">
      <div className="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:text-gray-700">
        <strong>{label}:</strong>
      </div>
      <p className="tw:mt-1 tw:text-sm tw:text-gray-900">{value}</p>
    </div>
  );
}

export default VehicleOwnerCard;
