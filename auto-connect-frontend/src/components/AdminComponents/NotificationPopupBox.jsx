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
    <div className="tw:relative">
      {/* Notification Button */}
      <button
        className="tw:relative tw:p-2 tw:rounded-full tw:hover:bg-gray-200"
        aria-label="Notifications"
        onClick={togglePopup}
      >
        <Notifications fontSize="large" />
        {unreadCount > 0 && (
          <span className="tw:absolute tw:top-1 tw:right-1 tw:h-4 tw:w-4 tw:flex tw:items-center tw:justify-center tw:rounded-full tw:bg-red-600 tw:text-white tw:text-xs tw:font-semibold">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popup Box */}
      {showPopup && (
        <div className="tw:absolute tw:right-0 tw:mt-2 tw:w-[350px] tw:h-[400px] tw:bg-white tw:border tw:border-gray-200 tw:shadow-lg tw:rounded-lg tw:z-50">
          <div className="tw:relative tw:p-4 tw:h-full">
            <div className="tw:flex tw:justify-between tw:items-center tw:mb-7">
              <h4 className="tw:text-xl tw:font-bold tw:text-gray-800">Notifications</h4>
              {notifications.length > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="tw:text-sm tw:text-blue-600 tw:hover:underline"
                >
                  Mark as Read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <p className="tw:text-base tw:text-gray-500">No notifications</p>
            ) : (
              <ul className="tw:overflow-y-auto tw:h-[300px] tw:space-y-3 tw:pr-1 tw:mt-4">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`tw:p-4 tw:rounded-2xl tw:text-base tw:break-words ${
                      n.read
                        ? "tw:bg-gray-100 tw:text-gray-600"
                        : "tw:bg-blue-100 tw:text-blue-800 tw:font-medium"
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
