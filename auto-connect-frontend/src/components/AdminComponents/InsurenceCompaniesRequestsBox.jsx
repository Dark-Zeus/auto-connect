import React, { useState } from "react";
import { CheckCircle, Cancel, ExpandMore, ExpandLess } from "@mui/icons-material";

export default function InsuranceCompanyRequestBox({ requests = [], onAccept, onReject }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <div className="tw:bg-white tw:rounded-2xl tw:shadow-2xl tw:p-6 tw:border tw:border-blue-200 tw:max-w-8xl tw:w-3xl tw:h-150 tw:max-h-[85vh] tw:overflow-y-auto tw:space-y-6">
      <h2 className="tw:text-2xl tw:font-bold tw:text-blue-800 tw:mb-4 tw:text-center">
        Pending Insurance Company Requests
      </h2>

      {requests.map((req, index) => (
        <div
          key={index}
          className="tw:bg-blue-50 tw:mt-6 tw:rounded-xl tw:p-4 tw:border-l-4 tw:border-blue-500 tw:shadow hover:tw:shadow-md tw:transition tw:space-y-3"
        >
          <div className="tw:flex tw:justify-between tw:items-center">
            <div>
              <p className="tw:font-semibold tw:text-blue-900">{req.name}</p>
              <p className="tw:text-sm tw:text-blue-700">{req.email}</p>
            </div>
            <div className="tw:flex tw:gap-2">
              <button
                onClick={() => onAccept?.(req)}
                className="tw:flex tw:items-center tw:gap-1 tw:bg-green-500 tw:text-white tw:px-3 tw:py-1.5 tw:rounded-lg tw:text-sm hover:tw:bg-green-600 tw:transition"
              >
                <CheckCircle className="tw:text-white tw:text-sm" />
                Accept
              </button>
              <button
                onClick={() => onReject?.(req)}
                className="tw:flex tw:items-center tw:gap-1 tw:bg-red-500 tw:text-white tw:px-3 tw:py-1.5 tw:rounded-lg tw:text-sm hover:tw:bg-red-600 tw:transition"
              >
                <Cancel className="tw:text-white tw:text-sm" />
                Reject
              </button>
              <button
                onClick={() => toggleExpand(index)}
                className="tw:bg-blue-200 tw:px-2 tw:rounded-full hover:tw:bg-blue-300 tw:transition"
              >
                {expandedIndex === index ? <ExpandLess /> : <ExpandMore />}
              </button>
            </div>
          </div>

          {expandedIndex === index && (
            <div className="tw:bg-white tw:rounded tw:p-4 tw:mt-2 tw:border tw:border-blue-200">
              <p className="tw:text-blue-900"><span className="tw:font-semibold">Owner:</span> {req.owner}</p>
              <p className="tw:text-blue-900"><span className="tw:font-semibold">Phone:</span> {req.phone}</p>
              <p className="tw:text-blue-900"><span className="tw:font-semibold">Address:</span> {req.address}</p>
              <p className="tw:text-blue-900">
                <span className="tw:font-semibold">Website:</span>{" "}
                <a href={`https://${req.website}`} className="tw:text-blue-600" target="_blank" rel="noreferrer">
                  {req.website}
                </a>
              </p>
              <p className="tw:text-blue-900"><span className="tw:font-semibold">Established:</span> {req.establishedDate}</p>
              <p className="tw:text-blue-900"><span className="tw:font-semibold">License No:</span> {req.licenseNumber}</p>
              <p className="tw:text-blue-900"><span className="tw:font-semibold">Description:</span> {req.description}</p>

              {req.certifications?.length > 0 && (
                <div className="tw:mt-2">
                  <p className="tw:font-semibold tw:text-blue-700">Certifications:</p>
                  <ul className="tw:list-disc tw:ml-5 tw:text-blue-800">
                    {req.certifications.map((cert, i) => (
                      <li key={i}>
                        {cert.name} (#{cert.certificateNumber}, issued by {cert.issuedBy}, valid till {cert.expiryDate})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
