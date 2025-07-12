import React, { useState, useRef, useEffect } from "react";

export default function ProfilePopupBox({
  userName = "Rashmika Dilmin",
  avatarUrl = "https://i.pravatar.cc/60?img=12",
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

  const handleViewProfile = () => {
    navigate("/profile"); // Navigate to profile page
  };

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
        <div className="tw:absolute tw:right-0 tw:mt-2 tw:w-100 tw:h-180 tw:bg-white tw:border tw:border-gray-200 tw:shadow-lg tw:rounded-lg tw:z-50">
          <div className="tw:p-4 tw:flex tw:flex-col tw:gap-3">
            <div className="tw:flex tw:items-center tw:gap-3">
              <img
                src={avatarUrl}
                alt={`${userName} avatar`}
                className="tw:w-12 tw:h-12 tw:rounded-full tw:border"
                loading="lazy"
              />
              <div>
                <p className="tw:font-semibold tw:text-gray-900">{userName}</p>
                <p className="tw:text-sm tw:text-gray-500">Administrator</p>
              </div>
            </div>
            <hr />
            <button
              onClick={handleViewProfile}
              className="tw:text-left tw:text-gray-700 tw:hover:bg-gray-100 tw:rounded tw:px-3 tw:py-2 tw:transition"
            >
              View Profile
            </button>
            <button
              onClick={() => alert("Logout clicked")}
              className="tw:text-left tw:text-red-600 tw:hover:bg-red-100 tw:rounded tw:px-3 tw:py-2 tw:transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
