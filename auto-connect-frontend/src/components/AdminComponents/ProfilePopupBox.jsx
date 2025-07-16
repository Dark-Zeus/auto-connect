import React, { useState, useRef, useEffect } from "react";

export default function ProfilePopupBox({
  userName = "Rashmika Dilmin",
  avatarUrl = "https://i.pravatar.cc/60?img=12",
  email = "rashmika@example.com",
  gender = "Male",
  address = "123 Main Street, Colombo",
  phone = "0771234567",
  nic = "987654321V",
  role = "Administrator",
}) {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  // Close popup if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="tw:relative" ref={popupRef}>
      {/* Profile Button */}
      <button
        onClick={() => setShowPopup((prev) => !prev)}
        className="tw:flex tw:items-center tw:gap-2 tw:rounded-full tw:hover:bg-gray-200 tw:p-1 tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-500"
        aria-label="User Profile"
      >
        <img
          src={avatarUrl}
          alt={`${userName} avatar`}
          className="tw:w-12 tw:h-12 tw:rounded-full tw:border"
          loading="lazy"
        />
        <span className="tw:hidden md:tw:block tw:font-medium tw:text-gray-700 tw:select-none">
          {userName}
        </span>
      </button>

      {/* Popup Box */}
      {showPopup && (
        <div className="tw:absolute tw:right-0 tw:mt-2 tw:w-[320px] tw:bg-white tw:border tw:border-gray-200 tw:shadow-lg tw:rounded-2xl tw:z-50 tw:p-5">
          {/* Profile header */}
          <div className="tw:flex tw:items-center tw:gap-4 tw:mb-4">
            <img
              src={avatarUrl}
              alt={`${userName} avatar`}
              className="tw:w-14 tw:h-14 tw:rounded-full tw:border tw:border-blue-300"
              loading="lazy"
            />
            <div>
              <p className="tw:font-bold tw:text-blue-900">{userName}</p>
              <p className="tw:text-sm tw:text-gray-500">{email}</p>
              <span className="tw:text-xs tw:mt-1 tw:inline-block tw:bg-blue-100 tw:text-blue-700 tw:px-2 tw:py-1 tw:rounded-full">
                {role}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="tw:grid tw:grid-cols-1 tw:gap-3 tw:bg-blue-50 tw:p-4 tw:rounded-xl tw:text-sm tw:text-blue-900 tw:font-medium">
            <ProfileDetail label="Gender" value={gender} />
            <ProfileDetail label="NIC" value={nic} />
            <ProfileDetail label="Phone" value={phone} />
            <ProfileDetail label="Address" value={address} />
          </div>

          {/* Logout */}
          <div className="tw-mt-4 tw-flex tw-justify-end">
            <button
              onClick={() => alert("Logged out")}
              className="tw:bg-red-100 tw:text-red-600 tw:px-4 tw:py-2 tw:rounded-lg tw:font-semibold hover:tw:bg-red-200 tw:transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileDetail({ label, value }) {
  return (
    <div className="tw-flex tw-justify-between tw-items-center">
      <span className="tw-font-semibold">{label}:</span>
      <span>{value}</span>
    </div>
  );
}
