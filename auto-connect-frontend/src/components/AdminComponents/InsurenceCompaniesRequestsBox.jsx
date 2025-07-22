import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Building,
  Award,
  MapPin,
  User,
  Link as LinkIcon,
  Phone,
  Calendar,
} from "lucide-react";

export default function InsuranceCompanyRequestBox({ requests = [], onAccept, onReject }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <div className="tw:bg-gradient-to-br tw:mt-50 tw:from-white tw:to-blue-50 tw:rounded-3xl tw:shadow-2xl tw:p-8 tw:border-2 tw:border-blue-200/50 tw:w-6xl tw:max-h-[65vh] tw:overflow-y-auto tw:space-y-8">
      <h2 className="tw:text-3xl tw:font-bold tw:text-blue-900 tw:mb-6 tw:text-center tw:tracking-tight">
        Pending Insurance Company Requests
      </h2>

      {requests.map((req, index) => (
        <div
          key={index}
          className="tw:bg-white tw:rounded-2xl tw:p-6 tw:border-2 tw:border-blue-200/50 tw:shadow-lg tw:shadow-blue-100/50 tw:transition-all tw:duration-300 hover:tw:shadow-xl hover:tw:shadow-blue-200/30 hover:tw:-translate-y-1"
        >
          <div className="tw:flex tw:items-center tw:gap-5">
            {/* Icon or Placeholder */}
            <div className="tw:w-20 tw:h-20 tw:flex tw:items-center tw:justify-center tw:bg-blue-100 tw:rounded-2xl tw:text-blue-600 tw:text-xl tw:font-bold">
              {req.name?.charAt(0) || "I"}
            </div>

            <div className="tw:flex-1">
              <h3 className="tw:text-2xl tw:font-bold tw:text-blue-900">{req.name}</h3>
              <div className="tw:flex tw:items-center tw:gap-3 tw:mt-1 tw:flex-wrap">
                <User className="tw:w-4 tw:h-4 tw:text-blue-600" />
                <span className="tw:text-blue-700 tw:text-sm tw:font-semibold">{req.owner}</span>

                <Phone className="tw:w-4 tw:h-4 tw:text-green-600" />
                <span className="tw:text-green-700 tw:text-sm">{req.phone}</span>

                <MapPin className="tw:w-4 tw:h-4 tw:text-purple-600" />
                <span className="tw:text-purple-700 tw:text-sm">{req.address}</span>
              </div>
            </div>

            <div className="tw:flex tw:flex-col tw:gap-2 tw:items-end">
              <button
                onClick={() => onAccept?.(req)}
                className="tw:flex tw:items-center tw:gap-1 tw:bg-green-500 tw:text-white tw:px-4 tw:py-2 tw:rounded-lg tw:text-sm tw:font-semibold hover:tw:bg-green-600 tw:transition"
              >
                <CheckCircle className="tw:w-4 tw:h-4" />
                Accept
              </button>
              <button
                onClick={() => onReject?.(req)}
                className="tw:flex tw:items-center tw:gap-1 tw:bg-red-500 tw:text-white tw:px-4 tw:py-2 tw:rounded-lg tw:text-sm tw:font-semibold hover:tw:bg-red-600 tw:transition"
              >
                <XCircle className="tw:w-4 tw:h-4" />
                Reject
              </button>
              <button
                onClick={() => toggleExpand(index)}
                className="tw:bg-blue-100 tw:p-2 tw:rounded-full hover:tw:bg-blue-200 tw:transition"
                aria-label={expandedIndex === index ? "Collapse details" : "Expand details"}
              >
                {expandedIndex === index ? (
                  <ChevronUp className="tw:w-5 tw:h-5 tw:text-blue-700" />
                ) : (
                  <ChevronDown className="tw:w-5 tw:h-5 tw:text-blue-700" />
                )}
              </button>
            </div>
          </div>

          {expandedIndex === index && (
            <div className="tw:bg-gradient-to-br tw:from-white tw:to-blue-50/50 tw:rounded-2xl tw:p-6 tw:mt-6 tw:border tw:border-blue-200/50 tw:shadow tw:shadow-blue-100/50 tw:space-y-6 tw:transition-all tw:duration-300">
              <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-8">
                {/* Owner Info */}
                <div>
                  <div className="tw:flex tw:items-center tw:gap-3 tw:mb-4">
                    <div className="tw:flex tw:items-center tw:justify-center tw:w-10 tw:h-10 tw:bg-blue-600 tw:rounded-xl tw:shadow-md">
                      <User className="tw:w-5 tw:h-5 tw:text-white" />
                    </div>
                    <h4 className="tw:text-lg tw:font-bold tw:text-blue-900">Owner Information</h4>
                  </div>
                  <div className="tw:space-y-3">
                    <div>
                      <label className="tw:text-blue-700 tw:font-semibold tw:text-xs tw:uppercase tw:tracking-wide">
                        Owner Name
                      </label>
                      <p className="tw:text-base tw:font-semibold tw:text-blue-900 tw:bg-blue-50 tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-blue-200">
                        {req.owner}
                      </p>
                    </div>
                    <div>
                      <label className="tw:flex tw:items-center tw:gap-2 tw:text-blue-700 tw:font-semibold tw:text-xs tw:uppercase tw:tracking-wide">
                        <Phone className="tw:w-4 tw:h-4" />
                        Phone
                      </label>
                      <p className="tw:text-base tw:text-blue-800 tw:bg-blue-50 tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-blue-200">
                        {req.phone}
                      </p>
                    </div>
                    <div>
                      <label className="tw:flex tw:items-center tw:gap-2 tw:text-blue-700 tw:font-semibold tw:text-xs tw:uppercase tw:tracking-wide">
                        <LinkIcon className="tw:w-4 tw:h-4" />
                        Email
                      </label>
                      <p className="tw:text-base tw:text-blue-800 tw:bg-blue-50 tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-blue-200">
                        {req.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location Info */}
                <div>
                  <div className="tw:flex tw:items-center tw:gap-3 tw:mb-4">
                    <div className="tw:flex tw:items-center tw:justify-center tw:w-10 tw:h-10 tw:bg-purple-600 tw:rounded-xl tw:shadow-md">
                      <MapPin className="tw:w-5 tw:h-5 tw:text-white" />
                    </div>
                    <h4 className="tw:text-lg tw:font-bold tw:text-blue-900">Location Details</h4>
                  </div>
                  <div className="tw:space-y-3">
                    <p className="tw:text-base tw:text-blue-900 tw:bg-blue-50 tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-blue-200">
                      {req.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div className="tw:mt-8">
                <div className="tw:flex tw:items-center tw:gap-3 tw:mb-4">
                  <div className="tw:flex tw:items-center tw:justify-center tw:w-10 tw:h-10 tw:bg-purple-600 tw:rounded-xl tw:shadow-md">
                    <Building className="tw:w-5 tw:h-5 tw:text-white" />
                  </div>
                  <h4 className="tw:text-lg tw:font-bold tw:text-blue-900">Business Information</h4>
                </div>
                <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-3 tw:gap-6">
                  <div>
                    <label className="tw:text-blue-700 tw:font-semibold tw:text-xs tw:uppercase tw:tracking-wide">
                      Established
                    </label>
                    <p className="tw:text-base tw:text-blue-900 tw:bg-blue-50 tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-blue-200">
                      {req.establishedDate}
                    </p>
                  </div>
                  <div>
                    <label className="tw:text-blue-700 tw:font-semibold tw:text-xs tw:uppercase tw:tracking-wide">
                      License Number
                    </label>
                    <p className="tw:text-base tw:text-blue-900 tw:bg-blue-50 tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-blue-200">
                      {req.licenseNumber}
                    </p>
                  </div>
                  <div>
                    <label className="tw:text-blue-700 tw:font-semibold tw:text-xs tw:uppercase tw:tracking-wide">
                      Description
                    </label>
                    <p className="tw:text-base tw:text-blue-900 tw:bg-blue-50 tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-blue-200">
                      {req.description}
                    </p>
                  </div>
                </div>

                {/* Certifications */}
                {req.certifications?.length > 0 && (
                  <div className="tw:mt-6">
                    <div className="tw:flex tw:items-center tw:gap-2 tw:mb-2">
                      <Award className="tw:w-4 tw:h-4 tw:text-yellow-600" />
                      <span className="tw:text-blue-700 tw:font-semibold tw:text-xs tw:uppercase">Certifications</span>
                    </div>
                    <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-4">
                      {req.certifications.map((cert, idx) => (
                        <div
                          key={idx}
                          className="tw:bg-gradient-to-br tw:from-white tw:to-yellow-50 tw:border tw:border-yellow-200/50 tw:rounded-xl tw:p-4 tw:shadow-md tw:shadow-yellow-100/50"
                        >
                          <div className="tw:font-bold tw:text-blue-900">{cert.name}</div>
                          <div className="tw:text-xs tw:text-blue-700 tw:mt-1">
                            Issued by: <span className="tw:text-blue-900">{cert.issuedBy}</span>
                          </div>
                          <div className="tw:text-xs tw:text-blue-700">
                            Certificate #: <span className="tw:text-blue-900">{cert.certificateNumber}</span>
                          </div>
                          <div className="tw:flex tw:gap-2 tw:mt-2">
                            <span className="tw:bg-green-100 tw:text-green-800 tw:px-2 tw:py-1 tw:rounded tw:text-xs">
                              Issued: {new Date(cert.issueDate).toLocaleDateString()}
                            </span>
                            <span className="tw:bg-red-100 tw:text-red-800 tw:px-2 tw:py-1 tw:rounded tw:text-xs">
                              Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
