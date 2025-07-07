import React from "react";
import { HelpOutline } from "@mui/icons-material"; // optional icon

function ConfirmationBox({ message, onConfirm, onCancel }) {
  return (
    <div className="tw:fixed tw:inset-0 tw:flex tw:items-center tw:justify-center tw:bg-black/40 tw:z-50">
      <div className="tw:bg-gradient-to-br tw:from-white tw:to-blue-50 tw:rounded-lg tw:p-10 tw:shadow-2xl tw:max-w-xl tw:w-full tw:min-h-[180px] tw:text-center tw:flex tw:flex-col tw:justify-between">
        
        {/* Icon */}
        <div className="tw:flex tw:justify-center tw:mb-6">
          <div className="tw:bg-blue-100 tw:text-blue-700 tw:rounded-full tw:p-4 tw:shadow">
            <HelpOutline fontSize="large" />
          </div>
        </div>

        {/* Message */}
        <p className="tw:!text-2xl tw:font-semibold tw:text-blue-800 tw:!mb-8">
          {message}
        </p>

        {/* Buttons */}
        <div className="tw:flex tw:justify-center tw:gap-10">
          <button
            onClick={onConfirm}
            className="tw:bg-blue-600 tw:text-white tw:font-semibold tw:text-lg tw:px-6 tw:py-3 tw:rounded-lg hover:tw:bg-blue-700 tw:transition"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="tw:bg-gray-200 tw:text-gray-800 tw:font-semibold tw:text-lg tw:px-6 tw:py-3 tw:rounded-lg hover:tw:bg-gray-300 tw:transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationBox;
