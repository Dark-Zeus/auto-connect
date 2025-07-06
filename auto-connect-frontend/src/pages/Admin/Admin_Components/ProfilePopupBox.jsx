import React, { useState, useRef, useEffect } from "react";

export default function ProfilePopupBox({ userName = "Rashmika Dilmin", avatarUrl = "https://i.pravatar.cc/60?img=12" }) {
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
    <div className="relative" ref={popupRef}>
      {/* Profile Button */}
      <button
        onClick={() => setShowPopup((prev) => !prev)}
        className="flex items-center gap-2 rounded-full hover:bg-gray-200 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="User Profile"
      >
        <img
          src={avatarUrl}
          alt={`${userName} avatar`}
          className="w-12 h-12 rounded-full border"
          loading="lazy"
        />
        <span className="hidden md:block font-medium text-gray-700 select-none">{userName}</span>
      </button>

      {/* Popup Box */}
      {showPopup && (
        <div className="absolute right-0 mt-2 w-100 h-180 bg-white border border-gray-200 shadow-lg rounded-lg z-50">
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <img
                src={avatarUrl}
                alt={`${userName} avatar`}
                className="w-12 h-12 rounded-full border"
                loading="lazy"
              />
              <div>
                <p className="font-semibold text-gray-900">{userName}</p>
                <p className="text-sm text-gray-500">Administrator</p>
              </div>
            </div>
            <hr />
            <button
              onClick={() => alert("View Profile clicked")}
              className="text-left text-gray-700 hover:bg-gray-100 rounded px-3 py-2 transition"
            >
              View Profile
            </button>
            <button
              onClick={() => alert("Logout clicked")}
              className="text-left text-red-600 hover:bg-red-100 rounded px-3 py-2 transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
