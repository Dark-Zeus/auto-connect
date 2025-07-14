import React, { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

function InsuranceCompanyCard({ company }) {
  const [showPopup, setShowPopup] = useState(false);

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(company.rating || 0);
    for (let i = 0; i < 5; i++) {
      stars.push(
        i < fullStars ? (
          <StarIcon key={i} fontSize="small" className="tw:text-yellow-500" />
        ) : (
          <StarBorderIcon key={i} fontSize="small" className="tw:text-yellow-400" />
        )
      );
    }
    return stars;
  };

  return (
    <>
      {/* Main Card */}
      <div
        onClick={() => setShowPopup(true)}
        className="tw:cursor-pointer tw:w-[308px] tw:h-[220px] tw:bg-white tw:border tw:border-gray-300 tw:rounded-2xl tw:shadow-md tw:transition-all tw:duration-300 hover:tw:shadow-lg tw:p-4 tw:flex tw:flex-col tw:justify-between"
      >
        <div className="tw:flex tw:justify-between tw:items-start tw:gap-4">
          <img
            src={company.image}
            alt={`${company.name} Logo`}
            className="tw:w-24 tw:h-24 tw:object-cover tw:rounded-xl tw:border tw:border-gray-200"
          />
          <h3 className="tw:text-lg tw:font-semibold tw:text-blue-800 tw:mt-1 tw:pr-1">
            {company.name}
          </h3>
        </div>

        <div className="tw:mt-4 tw:px-1 tw:text-sm">
          <p className="tw:text-gray-700 tw:font-medium">
            Email: <span className="tw:text-gray-900">{company.email}</span>
          </p>
          <p className="tw:text-gray-700 tw:font-medium">
            Phone: <span className="tw:text-gray-900">{company.phone}</span>
          </p>
          <div className="tw:mt-2 tw:flex tw:items-center tw:gap-1">
            {renderStars()}
          </div>
          <button
            className="tw:text-blue-600 tw:hover:underline tw:mt-2"
            onClick={() => setShowPopup(true)}
          >
            View Details
          </button>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="tw:fixed tw:inset-0 tw:bg-black/40 tw:backdrop-blur-sm tw:flex tw:items-center tw:justify-center tw:z-50 tw:px-4">
          <div className="tw:bg-white tw:rounded-3xl tw:shadow-2xl tw:p-8 tw:max-w-3xl tw:w-full tw:relative tw:overflow-y-auto tw:max-h-[90vh] tw:border tw:border-blue-100">
            <button
              onClick={() => setShowPopup(false)}
              className="tw:absolute tw:top-4 tw:right-4 tw:text-gray-500 hover:tw:text-red-500 tw:text-xl tw:font-bold"
              aria-label="Close"
            >
              ✖
            </button>

            {/* Header */}
            <div className="tw:flex tw:items-start tw:gap-6 tw:mb-8">
              <img
                src={company.image}
                alt={`${company.name} Logo`}
                className="tw:w-24 tw:h-24 tw:rounded-2xl tw:object-cover tw:border tw:border-gray-300 tw:shadow"
              />
              <div>
                <h2 className="tw:text-2xl tw:font-extrabold tw:text-blue-800">
                  {company.name}
                </h2>
                <p className="tw:text-sm tw:text-gray-500">{company.owner}</p>
                <div className="tw:mt-2 tw:flex tw:items-center tw:gap-1">
                  {renderStars()}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="tw:grid tw:grid-cols-2 sm:tw:grid-cols-2 tw:gap-4 tw:mb-6">
              <DetailRow label="Email" value={company.email} />
              <DetailRow label="Phone" value={company.phone} />
              <DetailRow label="Address" value={company.address} />
              <DetailRow label="Website" value={company.website} />
              <DetailRow label="Established" value={company.establishedDate} />
              <DetailRow label="License No." value={company.licenseNumber} />
            </div>

            {/* Description */}
            {company.description && (
              <div className="tw:mb-6 tw:bg-blue-50 tw:rounded-xl tw:p-4 tw:shadow-inner">
                <p className="tw:text-sm tw:font-semibold tw:text-blue-700 tw:mb-1">Description</p>
                <p className="tw:text-gray-700 tw:text-sm">{company.description}</p>
              </div>
            )}

            {/* Certifications */}
            {company.certifications?.length > 0 && (
              <div className="tw:mt-6">
                <h3 className="tw:text-xl tw:font-bold tw:text-blue-800 tw:mb-2 tw:border-b tw:border-blue-200 tw:pb-1">
                  📜 Certifications
                </h3>
                <div className="tw:mt-2 tw:grid tw:grid-cols-2 md:tw:grid-cols-2 tw:gap-4">
                  {company.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="tw:bg-gradient-to-br tw:from-white tw:to-blue-50 tw:border tw:border-blue-200 tw:rounded-2xl tw:p-4 tw:shadow-sm"
                    >
                      <h4 className="tw:font-semibold tw:text-blue-700 tw:mb-2">
                        📘 {cert.name}
                      </h4>
                      <ul className="tw:text-sm tw:text-blue-900 tw:space-y-3">
                        <li><strong>Issued By:</strong> {cert.issuedBy}</li>
                        <li><strong>Certificate #:</strong> {cert.certificateNumber}</li>
                        <li>
                          <span className="tw:bg-blue-100 tw:text-blue-700 tw:px-2 tw:py-1 tw:rounded-full tw:text-xs">
                            📅 Issued: {new Date(cert.issueDate).toLocaleDateString()}
                          </span>
                        </li>
                        <li>
                          <span className="tw:bg-red-100 tw:text-red-700 tw:px-2 tw:py-1 tw:rounded-full tw:text-xs">
                            ⏳ Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                          </span>
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="tw:flex tw:flex-col">
      <span className="tw:text-sm tw:font-semibold tw:text-blue-800">{label}</span>
      <span className="tw:text-sm tw:text-gray-700">{value}</span>
    </div>
  );
}

export default InsuranceCompanyCard;
