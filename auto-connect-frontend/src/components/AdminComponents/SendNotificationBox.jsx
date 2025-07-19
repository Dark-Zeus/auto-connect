import React, { useState } from "react";
import ConfirmationBox from "./ConfirmationBox";

function SendNotificationBox({ onSend }) {
  const [message, setMessage] = useState("");
  const [receiver, setReceiver] = useState("System");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSendClick = () => {
    if (message.trim()) {
      setShowConfirm(true);
    }
  };

  const confirmSend = () => {
    onSend({ message, receiver });
    setShowConfirm(false);
    setMessage("");
    setReceiver("System");
  };

  return (
    <div className="tw:bg-white tw:p-6 tw:rounded-2xl tw:shadow-md tw:border tw:border-gray-200 tw:w-full">
      <h2 className="tw:text-2xl tw:font-bold tw:mb-4 tw:text-blue-800">Send Notification</h2>

      {/* Receiver Dropdown */}
      <div className="tw:mb-4">
        <label className="tw:block tw:font-semibold tw:text-blue-800 tw:mb-2">
          Select Receiver
        </label>
        <select
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          className="tw:w-full tw:p-3 tw:border tw:border-blue-300 tw:rounded-lg tw:bg-blue-50 tw:text-blue-800"
        >
          <option value="All Users">All Users</option>
          <option value="Vehicle Owners">Vehicle Owners</option>
          <option value="Registered Users">Registered Users</option>
          <option value="Insurance Company">Insurance Companies</option>
          <option value="Service Center">Service Centers</option>
        </select>

        <label className="tw:block tw:font-semibold tw:text-blue-800 tw:mb-2 tw:mt-2">
          Select Type
        </label>
        <select
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          className="tw:w-full tw:p-3 tw:border tw:border-blue-300 tw:rounded-lg tw:bg-blue-50 tw:text-blue-800"
        >
          <option value="Announcement">Announcement</option>
          <option value="Reminder">Reminder</option>
          <option value="Alert">Alert</option>
          <option value="Offer">Offer</option>
        </select>
      </div>

      {/* Message Input */}
      <textarea
        rows={5}
        className="tw:w-full tw:h-80 tw:p-3 tw:border tw:border-blue-300 tw:rounded-lg tw:bg-blue-50 tw:text-blue-800"
        placeholder="Enter your notification message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {/* Buttons */}
      <div className="tw:flex tw:justify-end tw:gap-4 tw:mt-4">
        <button
          onClick={() => {
            setMessage("");
            setReceiver("System");
          }}
          className="tw:bg-gray-300 tw:text-black tw:px-4 tw:py-2 tw:rounded-lg hover:tw:bg-gray-400"
        >
          Clear
        </button>
        <button
          onClick={handleSendClick}
          className="tw:bg-blue-600 tw:text-white tw:px-4 tw:py-2 tw:rounded-lg hover:tw:bg-blue-700"
        >
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