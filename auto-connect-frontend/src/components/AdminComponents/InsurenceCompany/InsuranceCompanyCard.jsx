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

      {showPopup && (
      <div className="tw:fixed tw:inset-0 tw:bg-black/40 tw:backdrop-blur-sm tw:flex tw:items-center tw:justify-center tw:z-50 tw:px-4">
        <div className="tw:bg-white tw:rounded-3xl tw:shadow-2xl tw:p-8 tw:max-w-xl tw:w-full tw:relative tw:animate-fadeIn tw:transition-all tw:duration-300">
          {/* Close Button */}
          <button
            onClick={() => setShowPopup(false)}
            className="tw:absolute tw:top-4 tw:right-4 tw:text-gray-500 hover:tw:text-red-500 tw:text-xl tw:font-bold"
            aria-label="Close"
          >
            ✖
          </button>

          {/* Header with image and name */}
          <div className="tw:flex tw:items-center tw:gap-5 tw:mb-6">
            <img
              src={company.image}
              alt={`${company.name} Logo`}
              className="tw:w-20 tw:h-20 tw:rounded-2xl tw:object-cover tw:border tw:border-gray-300 tw:shadow"
            />
            <div>
              <h2 className="tw:text-2xl tw:font-extrabold tw:text-blue-800">
                {company.name}
              </h2>
              <p className="tw:text-sm tw:text-gray-500">{company.owner}</p>
            </div>
          </div>

          {/* Detail Rows */}
          <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:text-lg">
            <DetailRow label="Email" value={company.email} />
            <DetailRow label="Phone" value={company.phone} />
            <DetailRow label="Address" value={company.address} />
            <DetailRow label="Website" value={company.website} />
            <DetailRow label="Established" value={company.establishedDate} />
            <DetailRow label="License No." value={company.licenseNumber} />
          </div>

          {/* Description */}
          <div className="tw:mt-5 tw:bg-blue-50 tw:rounded-xl tw:p-4 tw:shadow-inner">
            <p className="tw:text-sm tw:font-semibold tw:text-blue-700 tw:mb-1">Description</p>
            <p className="tw:text-gray-700 tw:text-sm">{company.description}</p>
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
