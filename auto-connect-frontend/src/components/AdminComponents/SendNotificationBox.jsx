import React, { useState } from "react";
import ConfirmationBox from "./ConfirmationBox";

function SendNotificationBox({ onClose, onSend }) {
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
    onClose();
  };

  return (
    <>
      <div className="tw:fixed tw:inset-0 tw:flex tw:items-center tw:justify-center tw:bg-black/40 tw:z-40">
        <div className="tw:bg-white tw:p-6 tw:rounded-2xl tw:shadow-lg tw:w-full tw:max-w-lg">
          <h2 className="tw:text-xl tw:font-bold tw:mb-4">Send Notification</h2>

          {/* Receiver Selection */}
          <div className="tw:mb-4">
            <label className="tw:block tw:font-semibold tw:text-blue-800 tw:mb-2">
              Select Receiver
            </label>
            <select
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              className="tw:w-full tw:p-3 tw:border tw:border-blue-300 tw:rounded-lg tw:bg-blue-50 tw:text-blue-800"
            >
              <option value="System">System</option>
              <option value="Insurance Company">Insurance Companies</option>
              <option value="Service Center">Service Centers</option>
            </select>
          </div>

          {/* Message Box */}
          <textarea
            rows={5}
            className="tw:w-full tw:p-3 tw:border tw:border-blue-300 tw:rounded-lg tw:bg-blue-50 tw:text-blue-800"
            placeholder="Enter your notification message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {/* Action Buttons */}
          <div className="tw:flex tw:justify-end tw:gap-4 tw:mt-4">
            <button
              onClick={onClose}
              className="tw:bg-gray-300 tw:text-black tw:px-4 tw:py-2 tw:rounded-lg hover:tw:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSendClick}
              className="tw:bg-blue-600 tw:text-white tw:px-4 tw:py-2 tw:rounded-lg hover:tw:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmationBox
          message="Are you sure you want to send this notification?"
          onConfirm={confirmSend}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}

export default SendNotificationBox;
