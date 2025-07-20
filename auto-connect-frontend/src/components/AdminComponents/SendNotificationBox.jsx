import React, { useState } from "react";
import { Send, Trash2, Users, Bell, AlertTriangle, Gift, Megaphone } from "lucide-react";
import ConfirmationBox from "./ConfirmationBox";

const receiverOptions = [
  { value: "All Users", label: "All Users", icon: <Users className="tw:w-4 tw:h-4 tw:text-blue-500" /> },
  { value: "Vehicle Owners", label: "Vehicle Owners", icon: <Users className="tw:w-4 tw:h-4 tw:text-green-500" /> },
  { value: "Registered Users", label: "Registered Users", icon: <Users className="tw:w-4 tw:h-4 tw:text-indigo-500" /> },
  { value: "Insurance Company", label: "Insurance Companies", icon: <Bell className="tw:w-4 tw:h-4 tw:text-yellow-500" /> },
  { value: "Service Center", label: "Service Centers", icon: <Bell className="tw:w-4 tw:h-4 tw:text-orange-500" /> },
];

const typeOptions = [
  { value: "Announcement", label: "Announcement", icon: <Megaphone className="tw:w-4 tw:h-4 tw:text-blue-500" /> },
  { value: "Reminder", label: "Reminder", icon: <Bell className="tw:w-4 tw:h-4 tw:text-green-500" /> },
  { value: "Alert", label: "Alert", icon: <AlertTriangle className="tw:w-4 tw:h-4 tw:text-red-500" /> },
  { value: "Offer", label: "Offer", icon: <Gift className="tw:w-4 tw:h-4 tw:text-pink-500" /> },
];

function SendNotificationBox({ onSend }) {
  const [message, setMessage] = useState("");
  const [receiver, setReceiver] = useState(receiverOptions[0].value);
  const [type, setType] = useState(typeOptions[0].value);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSendClick = () => {
    if (message.trim()) {
      setShowConfirm(true);
    }
  };

  const confirmSend = () => {
    onSend({ message, receiver, type });
    setShowConfirm(false);
    setMessage("");
    setReceiver(receiverOptions[0].value);
    setType(typeOptions[0].value);
  };

  const handleClear = () => {
    setMessage("");
    setReceiver(receiverOptions[0].value);
    setType(typeOptions[0].value);
  };

  return (
    <div className="tw:bg-white tw:p-6 tw:rounded-2xl tw:shadow-md tw:border tw:border-gray-200 tw:w-full">
      <h2 className="tw:text-2xl tw:font-bold tw:mb-4 tw:text-blue-800 flex items-center gap-2">
        <Send className="tw:w-6 tw:h-6 tw:text-blue-600" />
        Send Notification
      </h2>

      {/* Receiver Dropdown */}
      <div className="tw:mb-4">
        <label className="tw:block tw:font-semibold tw:text-blue-800 tw:mb-2 flex items-center gap-2">
          <Users className="tw:w-4 tw:h-4 tw:text-blue-500" />
          Select Receiver
        </label>
        <div className="tw:relative">
          <select
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            className="tw:w-full tw:p-3 tw:border tw:border-blue-300 tw:rounded-lg tw:bg-blue-50 tw:text-blue-800 tw:font-medium tw:pr-10"
          >
            {receiverOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2">
            {receiverOptions.find((opt) => opt.value === receiver)?.icon}
          </span>
        </div>

        <label className="tw:block tw:font-semibold tw:text-blue-800 tw:mb-2 tw:mt-4 flex items-center gap-2">
          <Bell className="tw:w-4 tw:h-4 tw:text-blue-500" />
          Select Type
        </label>
        <div className="tw:relative">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="tw:w-full tw:p-3 tw:border tw:border-blue-300 tw:rounded-lg tw:bg-blue-50 tw:text-blue-800 tw:font-medium tw:pr-10"
          >
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2">
            {typeOptions.find((opt) => opt.value === type)?.icon}
          </span>
        </div>
      </div>

      {/* Message Input */}
      <label className="tw:block tw:font-semibold tw:text-blue-800 tw:mb-2">
        Message
      </label>
      <textarea
        rows={5}
        className="tw:w-full tw:p-3 tw:border tw:border-blue-300 tw:rounded-lg tw:bg-blue-50 tw:text-blue-800 tw:mb-2 focus:tw:ring-2 focus:tw:ring-blue-300 tw:transition"
        placeholder="Enter your notification message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {/* Buttons */}
      <div className="tw:flex tw:justify-end tw:gap-4 tw:mt-4">
        <button
          onClick={handleClear}
          className="tw:bg-gray-200 tw:text-gray-700 tw:px-4 tw:py-2 tw:rounded-lg hover:tw:bg-gray-300 tw:flex tw:items-center gap-2"
        >
          <Trash2 className="tw:w-4 tw:h-4" />
          Clear
        </button>
        <button
          onClick={handleSendClick}
          className="tw:bg-gradient-to-r tw:from-blue-600 tw:to-blue-700 tw:text-white tw:px-6 tw:py-2 tw:rounded-lg hover:tw:from-blue-700 hover:tw:to-blue-800 tw:font-semibold tw:shadow-md tw:flex tw:items-center gap-2"
        >
          <Send className="tw:w-4 tw:h-4" />
          Send
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <ConfirmationBox
          message="Are you sure you want to send this notification?"
          onConfirm={confirmSend}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

export default SendNotificationBox;