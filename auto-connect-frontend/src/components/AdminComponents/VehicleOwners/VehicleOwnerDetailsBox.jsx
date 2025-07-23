import React, { useState } from "react";
import {
  Phone,
  Badge,
  Mail,
  MapPin,
  Calendar,
  Users,
  Home,
} from "lucide-react";

function VehicleOwnerCard({ owner }) {
  const [showPopup, setShowPopup] = useState(false);

  if (!owner) return null; // Safeguard in case `owner` is undefined

  return (
    <>
      {/* Card */}
      <div
        onClick={() => setShowPopup(true)}
        className="tw:w-[300px] tw:rounded-2xl tw:p-5 tw:shadow-lg tw:cursor-pointer tw:transition-transform hover:tw:scale-105 tw:bg-white"
      >
        <div className="tw:flex tw:gap-4">
          <img
            src={owner.image}
            alt={owner.name}
            className="tw:w-35 tw:h-35 tw:rounded-xl tw:object-cover tw:border tw:border-blue-100"
          />
          <div>
            <h2 className="tw:font-bold tw:text-lg">{owner.name}</h2>
            <p className="tw:text-sm tw:text-gray-600">
              <Mail size={12} className="tw:inline tw:mr-1" />
              {owner.email}
            </p>
            <p className="tw:text-sm tw:text-gray-600">
              <Phone size={12} className="tw:inline tw:mr-1" />
              {owner.mobile}
            </p>
          </div>
        </div>
        <div className="tw:mt-3 tw:text-xs tw:text-gray-500">
          <span>
            <MapPin size={12} className="tw:inline tw:mr-1" />
            {owner.city}
          </span>
          <span className="tw:ml-4">
            <Badge size={12} className="tw:inline tw:mr-1" />
            {owner.nic}
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
                src={owner.image}
                alt={owner.name}
                className="tw:w-40 tw:h-40 tw:rounded-xl tw:object-cover"
              />
              <div>
                <h2 className="tw:text-2xl tw:font-bold">{owner.name}</h2>
                <p className="tw:text-sm tw:text-gray-600">{owner.email}</p>
                <p className="tw:text-sm tw:text-gray-600">{owner.mobile}</p>
              </div>
            </div>

            <div className="tw:grid tw:grid-cols-2 tw:gap-4 tw:mt-4">
              <Detail label="NIC" value={owner.nic} icon={<Badge size={16} />} />
              <Detail label="Gender" value={owner.gender} icon={<Users size={16} />} />
              <Detail label="DOB" value={owner.dob} icon={<Calendar size={16} />} />
              <Detail label="Address" value={owner.address} icon={<MapPin size={16} />} />
              <Detail label="City" value={owner.city} icon={<Home size={16} />} />
              <Detail label="District" value={owner.district} icon={<MapPin size={16} />} />
              <Detail label="Province" value={owner.province} icon={<MapPin size={16} />} />
              <Detail label="Postal Code" value={owner.postalCode} icon={<Home size={16} />} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Detail({ icon, label, value }) {
  return (
    <div className="tw:bg-gray-50 tw:p-3 tw:rounded-lg tw:shadow-sm">
      <div className="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:text-gray-700">
        {icon}
        <strong>{label}:</strong>
      </div>
      <p className="tw:mt-1 tw:text-sm tw:text-gray-900">{value}</p>
    </div>
  );
}

export default VehicleOwnerCard;