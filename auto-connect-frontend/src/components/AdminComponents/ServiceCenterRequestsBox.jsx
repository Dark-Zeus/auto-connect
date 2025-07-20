import React, { useState } from "react";
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Mail, Phone, Building, Award, MapPin, User } from "lucide-react";
import center1 from "../../assets/images/service_center1.jpg";

const requests = [
  {
    name: "CityFix Motors",
    email: "rashmika@cityfix.lk",
    icon: center1,
    district: "Colombo",
    rating: 4.7,
    details: {
      firstName: "Rashmika",
      lastName: "Dilmin",
      phone: "0711111111",
      address: {
        street: "123 Main Rd",
        city: "Colombo",
        district: "Colombo",
        province: "Western",
        postalCode: "10100",
      },
      businessInfo: {
        businessName: "CityFix Motors",
        licenseNumber: "LIC-0001",
        businessRegistrationNumber: "BR-123456",
        taxIdentificationNumber: "TIN-998877",
        servicesOffered: ["Engine Tuning", "Wheel Alignment"],
        certifications: [
          {
            name: "ISO 9001",
            issuedBy: "ISO Authority",
            certificateNumber: "CERT12345",
            issueDate: "2023-01-15",
            expiryDate: "2026-01-14",
          },
          {
            name: "Environmental Compliance",
            issuedBy: "GreenCert Org",
            certificateNumber: "GC-987654",
            issueDate: "2022-05-01",
            expiryDate: "2025-05-01",
          },
        ],
      },
    },
  },
    {
    name: "CityFix Motors",
    email: "rashmika@cityfix.lk",
    icon: center1,
    district: "Colombo",
    rating: 4.7,
    details: {
      firstName: "Rashmika",
      lastName: "Dilmin",
      phone: "0711111111",
      address: {
        street: "123 Main Rd",
        city: "Colombo",
        district: "Colombo",
        province: "Western",
        postalCode: "10100",
      },
      businessInfo: {
        businessName: "CityFix Motors",
        licenseNumber: "LIC-0001",
        businessRegistrationNumber: "BR-123456",
        taxIdentificationNumber: "TIN-998877",
        servicesOffered: ["Engine Tuning", "Wheel Alignment"],
        certifications: [
          {
            name: "ISO 9001",
            issuedBy: "ISO Authority",
            certificateNumber: "CERT12345",
            issueDate: "2023-01-15",
            expiryDate: "2026-01-14",
          },
          {
            name: "Environmental Compliance",
            issuedBy: "GreenCert Org",
            certificateNumber: "GC-987654",
            issueDate: "2022-05-01",
            expiryDate: "2025-05-01",
          },
        ],
      },
    },
  },
  // Add more dummy entries
];

export default function ServiceCenterRequestBox() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="tw:bg-gradient-to-br tw:from-white tw:to-blue-50 tw:rounded-3xl tw:shadow-2xl tw:p-8 tw:border-2 tw:border-blue-200/50 tw:max-w-6xl tw:w-full tw:max-h-[85vh] tw:overflow-y-auto tw:space-y-8">
      <h2 className="tw:text-3xl tw:font-bold tw:text-blue-900 tw:mb-6 text-center tw:tracking-tight">
        Pending Service Center Requests
      </h2>

      {requests.map((req, index) => (
        <div
          key={index}
          className="tw:bg-white tw:rounded-2xl tw:p-6 tw:border-2 tw:border-blue-200/50 tw:shadow-lg tw:shadow-blue-100/50 tw:transition-all tw:duration-300 hover:tw:shadow-xl hover:tw:shadow-blue-200/30 hover:tw:-translate-y-1"
        >
          <div className="tw:flex tw:items-center tw:gap-5">
            <img
              src={req.icon}
              alt={req.name}
              className="tw:w-20 tw:h-20 tw:object-cover tw:rounded-2xl tw:border-4 tw:border-white tw:shadow-xl"
            />
            <div className="tw:flex-1">
              <h3 className="tw:text-2xl tw:font-bold tw:text-blue-900">{req.name}</h3>
              <div className="tw:flex tw:items-center tw:gap-3 tw:mt-1">
                <Mail className="tw:w-4 tw:h-4 tw:text-blue-600" />
                <span className="tw:text-blue-700 tw:text-sm">{req.email}</span>
                <MapPin className="tw:w-4 tw:h-4 tw:text-green-600" />
                <span className="tw:text-green-700 tw:text-sm">{req.district}</span>
              </div>
            </div>
            <div className="tw:flex tw:flex-col tw:gap-2 tw:items-end">
              <button className="tw:flex tw:items-center tw:gap-1 tw:bg-green-500 tw:text-white tw:px-4 tw:py-2 tw:rounded-lg tw:text-sm tw:font-semibold hover:tw:bg-green-600 tw:transition">
                <CheckCircle className="tw:w-4 tw:h-4" />
                Accept
              </button>
              <button className="tw:flex tw:items-center tw:gap-1 tw:bg-red-500 tw:text-white tw:px-4 tw:py-2 tw:rounded-lg tw:text-sm tw:font-semibold hover:tw:bg-red-600 tw:transition">
                <XCircle className="tw:w-4 tw:h-4" />
                Reject
              </button>
              <button
                onClick={() => toggleExpand(index)}
                className="tw:bg-blue-100 tw:p-2 tw:rounded-full hover:tw:bg-blue-200 tw:transition tw:mt-2"
                aria-label={expandedIndex === index ? "Collapse details" : "Expand details"}
              >
                {expandedIndex === index ? <ChevronUp className="tw:w-5 tw:h-5" /> : <ChevronDown className="tw:w-5 tw:h-5" />}
              </button>
            </div>
          </div>

          {expandedIndex === index && (
            <div className="tw:bg-gradient-to-br tw:from-white tw:to-blue-50/50 tw:rounded-2xl tw:p-6 tw:mt-6 tw:border tw:border-blue-200/50 tw:shadow tw:shadow-blue-100/50 tw:space-y-6 tw:transition-all tw:duration-300">
              <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-8">
                {/* Personal Info */}
                <div>
                  <div className="tw:flex tw:items-center tw:gap-3 tw:mb-4">
                    <div className="tw:flex tw:items-center tw:justify-center tw:w-10 tw:h-10 tw:bg-blue-600 tw:rounded-xl tw:shadow-md">
                      <User className="tw:w-5 tw:h-5 tw:text-white" />
                    </div>
                    <h4 className="tw:text-lg tw:font-bold tw:text-blue-900">Personal Information</h4>
                  </div>
                  <div className="tw:space-y-3">
                    <div>
                      <label className="tw:flex tw:items-center tw:gap-2 tw:text-blue-700 tw:font-semibold tw:text-xs tw:uppercase tw:tracking-wide">
                        Full Name
                      </label>
                      <p className="tw:text-base tw:font-semibold tw:text-blue-900 tw:bg-blue-50 tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-blue-200">
                        {req.details.firstName} {req.details.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="tw:flex tw:items-center tw:gap-2 tw:text-blue-700 tw:font-semibold tw:text-xs tw:uppercase tw:tracking-wide">
                        <Mail className="tw:w-4 tw:h-4" />
                        Email
                      </label>
                      <p className="tw:text-base tw:text-blue-800 tw:bg-blue-50 tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-blue-200">
                        {req.email}
                      </p>
                    </div>
                    <div>
                      <label className="tw:flex tw:items-center tw:gap-2 tw:text-blue-700 tw:font-semibold tw:text-xs tw:uppercase tw:tracking-wide">
                        <Phone className="tw:w-4 tw:h-4" />
                        Phone
                      </label>
                      <p className="tw:text-base tw:font-semibold tw:text-blue-900 tw:bg-blue-50 tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-blue-200">
                        {req.details.phone}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Location Info */}
                <div>
                  <div className="tw:flex tw:items-center tw:gap-3 tw:mb-4">
                    <div className="tw:flex tw:items-center tw:justify-center tw:w-10 tw:h-10 tw:bg-green-600 tw:rounded-xl tw:shadow-md">
                      <MapPin className="tw:w-5 tw:h-5 tw:text-white" />
                    </div>
                    <h4 className="tw:text-lg tw:font-bold tw:text-blue-900">Location Details</h4>
                  </div>
                  <div className="tw:space-y-3">
                    <div>
                      <label className="tw:text-blue-700 tw:font-semibold tw:text-xs tw:uppercase tw:tracking-wide">Street Address</label>
                      <p className="tw:text-base tw:text-blue-900 tw:bg-blue-50 tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-blue-200">{req.details.address.street}</p>
                    </div>
                    <div className="tw:grid tw:grid-cols-2 tw:gap-2">
                      <div>
                        <label className="tw:text-blue-700 tw:font-semibold tw:text-xs tw:uppercase tw:tracking-wide">City</label>
                        <p className="tw:text-base tw:text-blue-900 tw:bg-blue-50 tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-blue-200">{req.details.address.city}</p>
                      </div>
                      <div>
                        <label className="tw:text-blue-700 tw:font-semibold tw:text-xs tw:uppercase tw:tracking-wide">District</label>
                        <p className="tw:text-base tw:text-blue-900 tw:bg-blue-50 tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-blue-200">{req.details.address.district}</p>
                      </div>
                      <div>
                        <label className="tw:text-blue-700 tw:font-semibold tw:text-xs tw:uppercase tw:tracking-wide">Province</label>
                        <p className="tw:text-base tw:text-blue-900 tw:bg-blue-50 tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-blue-200">{req.details.address.province}</p>
                      </div>
                      <div>
                        <label className="tw:text-blue-700 tw:font-semibold tw:text-xs tw:uppercase tw:tracking-wide">Postal Code</label>
                        <p className="tw:text-base tw:text-blue-900 tw:bg-blue-50 tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-blue-200">{req.details.address.postalCode}</p>
                      </div>
                    </div>
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
                    <label className="tw:text-blue-700 tw:font-semibold tw:text-xs tw:uppercase tw:tracking-wide">License Number</label>
                    <p className="tw:text-base tw:text-blue-900 tw:bg-blue-50 tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-blue-200">{req.details.businessInfo.licenseNumber}</p>
                  </div>
                  <div>
                    <label className="tw:text-blue-700 tw:font-semibold tw:text-xs tw:uppercase tw:tracking-wide">Business Reg</label>
                    <p className="tw:text-base tw:text-blue-900 tw:bg-blue-50 tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-blue-200">{req.details.businessInfo.businessRegistrationNumber}</p>
                  </div>
                  <div>
                    <label className="tw:text-blue-700 tw:font-semibold tw:text-xs tw:uppercase tw:tracking-wide">TIN</label>
                    <p className="tw:text-base tw:text-blue-900 tw:bg-blue-50 tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-blue-200">{req.details.businessInfo.taxIdentificationNumber}</p>
                  </div>
                </div>
                <div className="tw:mt-4">
                  <label className="tw:text-blue-700 tw:font-semibold tw:text-xs tw:uppercase tw:tracking-wide">Services Offered</label>
                  <div className="tw:flex tw:flex-wrap tw:gap-2 tw:mt-2">
                    {req.details.businessInfo.servicesOffered.map((service, idx) => (
                      <span
                        key={idx}
                        className="tw:flex tw:items-center tw:gap-1 tw:bg-gradient-to-r tw:from-blue-100 tw:to-blue-50 tw:px-3 tw:py-1 tw:rounded-xl tw:border tw:border-blue-200 tw:text-blue-800 tw:text-xs tw:font-medium"
                      >
                        <span className="tw:w-2 tw:h-2 tw:bg-blue-600 tw:rounded-full"></span>
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
                {req.details.businessInfo.certifications?.length > 0 && (
                  <div className="tw:mt-6">
                    <div className="tw:flex tw:items-center tw:gap-2 tw:mb-2">
                      <Award className="tw:w-4 tw:h-4 tw:text-yellow-600" />
                      <span className="tw:text-blue-700 tw:font-semibold tw:text-xs tw:uppercase">Certifications</span>
                    </div>
                    <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-4">
                      {req.details.businessInfo.certifications.map((cert, idx) => (
                        <div
                          key={idx}
                          className="tw:bg-gradient-to-br tw:from-white tw:to-yellow-50 tw:border tw:border-yellow-200/50 tw:rounded-xl tw:p-4 tw:shadow-md tw:shadow-yellow-100/50"
                        >
                          <div className="tw:font-bold tw:text-blue-900">{cert.name}</div>
                          <div className="tw:text-xs tw:text-blue-700 tw:mt-1">Issued by: <span className="tw:text-blue-900">{cert.issuedBy}</span></div>
                          <div className="tw:text-xs tw:text-blue-700">Certificate #: <span className="tw:text-blue-900">{cert.certificateNumber}</span></div>
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
