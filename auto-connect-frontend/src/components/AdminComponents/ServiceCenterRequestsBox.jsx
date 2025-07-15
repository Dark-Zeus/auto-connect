import React, { useState } from "react";
import { CheckCircle, Cancel, ExpandMore, ExpandLess } from "@mui/icons-material";
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
    <div className="tw:bg-white tw:rounded-2xl tw:shadow-2xl tw:p-6 tw:border tw:border-blue-200 tw:max-w-8xl tw:w-3xl tw:h-150 tw:max-h-[85vh] tw:overflow-y-auto tw:space-y-6">
      <h2 className="tw:text-2xl tw:font-bold tw:text-blue-800 tw:mb-4 text-center">
        Pending Service Center Requests
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
              <button className="tw:flex tw:items-center tw:gap-1 tw:bg-green-500 tw:text-white tw:px-3 tw:py-1.5 tw:rounded-lg tw:text-sm hover:tw:bg-green-600 tw:transition">
                <CheckCircle className="tw:text-white tw:text-sm" />
                Accept
              </button>
              <button className="tw:flex tw:items-center tw:gap-1 tw:bg-red-500 tw:text-white tw:px-3 tw:py-1.5 tw:rounded-lg tw:text-sm hover:tw:bg-red-600 tw:transition">
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
              <p className="tw:text-blue-900">
                <span className="tw:font-semibold">Name:</span> {req.details.firstName} {req.details.lastName}
              </p>
              <p className="tw:text-blue-900">
                <span className="tw:font-semibold">Phone:</span> {req.details.phone}
              </p>
              <p className="tw:text-blue-900">
                <span className="tw:font-semibold">Address:</span> {req.details.address.street}, {req.details.address.city}, {req.details.address.district}, {req.details.address.province} - {req.details.address.postalCode}
              </p>
              <p className="tw:font-semibold tw:mt-2 tw:text-blue-700">Business Info</p>
              <ul className="tw:list-disc tw:ml-5 tw:text-blue-800">
                <li>License: {req.details.businessInfo.licenseNumber}</li>
                <li>Business Reg: {req.details.businessInfo.businessRegistrationNumber}</li>
                <li>TIN: {req.details.businessInfo.taxIdentificationNumber}</li>
                <li>Services: {req.details.businessInfo.servicesOffered.join(", ")}</li>
              </ul>
              {req.details.businessInfo.certifications?.length > 0 && (
                <div className="tw:mt-2">
                  <p className="tw:font-semibold tw:text-blue-700">Certifications:</p>
                  <ul className="tw:list-disc tw:ml-5 tw:text-blue-800">
                    {req.details.businessInfo.certifications.map((cert, idx) => (
                      <li key={idx}>
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
