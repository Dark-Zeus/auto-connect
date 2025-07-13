import React, { useState } from "react";

function InsuranceCompanyCard({ company }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      {/* Default Card */}
      <div
        onClick={() => setShowPopup(true)}
        className="tw:cursor-pointer tw:w-104 tw:h-30 tw:bg-white tw:border tw:border-blue-200 tw:rounded-2xl tw:shadow-md tw:p-4 tw:flex tw:items-center tw:gap-4 tw:transition-all hover:tw:shadow-lg"
      >
        <img
          src={company.image}
          alt={`${company.name} Logo`}
          className="tw:w-16 tw:h-16 tw:rounded-xl tw:object-cover tw:border tw:border-gray-200"
        />
        <div>
          <h2 className="tw:text-lg tw:font-bold tw:text-blue-800">{company.name}</h2>
          <p className="tw:text-sm tw:text-gray-600">{company.email}</p>
          <p className="tw:text-sm tw:text-gray-600">{company.phone}</p>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="tw:fixed tw:inset-0 tw:bg-black/30 tw:flex tw:items-center tw:justify-center tw:z-50">
          <div className="tw:bg-white tw:rounded-2xl tw:shadow-2xl tw:p-6 tw:max-w-lg tw:w-full tw:relative">
            <button
              onClick={() => setShowPopup(false)}
              className="tw:absolute tw:top-3 tw:right-3 tw:text-gray-500 hover:tw:text-red-500"
            >
              ✖
            </button>
            <div className="tw:flex tw:items-center tw:gap-4 tw:mb-4">
              <img
                src={company.image}
                alt={`${company.name} Logo`}
                className="tw:w-20 tw:h-20 tw:rounded-xl tw:object-cover tw:border tw:border-gray-200"
              />
              <div>
                <h2 className="tw:text-xl tw:font-bold tw:text-blue-800">
                  {company.name}
                </h2>
                <p className="tw:text-gray-500 tw:text-sm">{company.owner}</p>
              </div>
            </div>

            <div className="tw:space-y-2">
              <DetailRow label="Email" value={company.email} />
              <DetailRow label="Phone" value={company.phone} />
              <DetailRow label="Address" value={company.address} />
              <DetailRow label="Website" value={company.website} />
              <DetailRow label="Established" value={company.establishedDate} />
              <DetailRow label="License No." value={company.licenseNumber} />
              <div>
                <p className="tw:text-sm tw:font-semibold tw:text-blue-800">Description</p>
                <p className="tw:text-gray-700">{company.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="tw:flex tw:justify-between tw:items-center">
      <span className="tw:text-sm tw:font-semibold tw:text-blue-800">{label}:</span>
      <span className="tw:text-sm tw:text-gray-700">{value}</span>
    </div>
  );
}

export default InsuranceCompanyCard;
