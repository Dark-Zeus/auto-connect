import React, { useState } from "react";
import { Notifications } from "@mui/icons-material";

const notificationsData = [
  { id: 1, message: "Your report has been approved.", read: false },
  { id: 2, message: "New user registered.", read: true },
  { id: 3, message: "System update scheduled for tomorrow.", read: false },
  { id: 4, message: "New service center added.", read: false },
];

export default function NotificationPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [notifications, setNotifications] = useState(notificationsData);

  const togglePopup = () => setShowPopup((prev) => !prev);
  const markAllAsRead = () =>
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      {/* Notification Button */}
      <button
        className="relative p-2 rounded-full hover:bg-gray-200"
        aria-label="Notifications"
        onClick={togglePopup}
      >
        <Notifications fontSize="large" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-semibold">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popup Box */}
      {showPopup && (
        <div className="absolute right-0 mt-2 w-[350px] h-[400px] bg-white border border-gray-200 shadow-lg rounded-lg z-50">
          <div className="relative p-4 h-full">
            <div className="flex justify-between items-center mb-7">
              <h4 className="text-xl font-bold text-gray-800">Notifications</h4>
              {notifications.length > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Mark as Read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <p className="text-base text-gray-500">No notifications</p>
            ) : (
              <ul className="overflow-y-auto h-[300px] space-y-3 pr-1 mt-4">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`p-4 rounded-2xl text-base break-words ${
                      n.read
                        ? "bg-gray-100 text-gray-600"
                        : "bg-blue-100 text-blue-800 font-medium"
                    }`}
                  >
                    {n.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
