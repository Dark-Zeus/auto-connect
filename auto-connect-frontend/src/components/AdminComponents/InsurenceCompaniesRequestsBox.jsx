import React from "react";

export default function InsuranceCompanyRequestPopup({ requests = [], onClose, onAccept, onReject }) {
  return (
    <div className="tw:fixed tw:inset-0 tw:bg-black/40 tw:z-50 tw:flex tw:justify-center tw:items-center tw:p-4">
      <div className="tw:bg-white tw:rounded-2xl tw:p-6 tw:max-w-3xl tw:w-full tw:overflow-y-auto tw:max-h-[80vh]">
        <div className="tw:flex tw:justify-between tw:items-center tw:mb-4">
          <h2 className="tw:text-2xl tw:font-bold tw:text-blue-800">Insurance Company Requests</h2>
          <button onClick={onClose} className="tw-text-gray-600 hover:tw:text-red-600 tw-text-xl">✖</button>
        </div>

        {requests.length === 0 ? (
          <p className="tw-text-gray-500">No insurance company requests found.</p>
        ) : (
          requests.map((req, index) => (
            <div key={index} className="tw:bg-blue-50 tw:p-4 tw:rounded-xl tw:mb-4 tw:shadow-sm">
              <p><strong>Name:</strong> {req.name}</p>
              <p><strong>Email:</strong> {req.email}</p>
              <p><strong>Phone:</strong> {req.phone}</p>
              <div className="tw-mt-2 tw-flex tw-gap-2">
                <button onClick={() => onAccept(req)} className="tw-bg-green-500 tw-text-white tw-px-4 tw-py-1 tw-rounded hover:tw-bg-green-600">Accept</button>
                <button onClick={() => onReject(req)} className="tw-bg-red-500 tw-text-white tw-px-4 tw-py-1 tw-rounded hover:tw-bg-red-600">Reject</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
