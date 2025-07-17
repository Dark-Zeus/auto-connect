import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const InsuranceClaims = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state;

  const sampleClaims = [
    {
      vehicleName: "Toyota Prius",
      modelYear: "2019",
      date: "2025-07-15",
      time: "14:30",
      location: "123 Main Street, Colombo",
      incidentType: "Collision",
      description:
        "Rear-ended by another vehicle while waiting at a red light.",
      damageSeverity: "Minor",
      uploadedImages: [
        "/insurance-claims/toyota-prius-1.jpg",
        "/insurance-claims/toyota-prius-2.jpg",
        "/insurance-claims/toyota-prius-3.jpg",
      ],
    },
    {
      vehicleName: "Honda Civic",
      modelYear: "2021",
      date: "2025-07-10",
      time: "08:15",
      location: "Galle Road, Moratuwa",
      incidentType: "Theft",
      description: "Car was broken into, stereo and personal items stolen.",
      damageSeverity: "Major",
      uploadedImages: [
        "/insurance-claims/honda-civic-1.jpg",
        "/insurance-claims/honda-civic-2.jpeg",
        ],
    },
    {
      vehicleName: "Nissan Leaf",
      modelYear: "2020",
      date: "2025-06-30",
      time: "17:45",
      location: "Kandy Road, Kurunegala",
      incidentType: "Natural Disaster",
      description: "Tree fell on the vehicle during a storm.",
      damageSeverity: "Total Loss",
      uploadedImages: ["/insurance-claims/nissan-leaf.jpeg"],
    },
  ];

  const claims = formData ? [formData] : sampleClaims;

  return (
    <div className=" tw:mx-auto tw:p-6 tw:bg-[#DFF2EB] tw:shadow-xl tw:rounded-2xl tw:space-y-10">
      <div className="tw:flex tw:items-center tw:space-x-3">
        <button
          className="tw:text-[#4A628A] tw:hover:text-[#7AB2D3] tw:transition"
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon fontSize="tw:medium" />
        </button>
        <h1 className="tw:text-3xl tw:font-bold tw:text-[#4A628A]">
          Insurance Claims
        </h1>
      </div>

      {claims.map((claim, index) => (
        <div
          key={index}
          className="tw:bg-white tw:p-6 tw:rounded-xl tw:shadow-md tw:border tw:border-[#B9E5E8] tw:space-y-4"
        >
          <h2 className="tw:text-xl tw:font-semibold tw:text-[#7AB2D3]">
            Claim #{index + 1} - {claim.vehicleName} ({claim.modelYear})
          </h2>

          <div className="tw:text-[#4A628A] tw:space-y-2">
            <p>
              <strong>Date:</strong> {claim.date}
            </p>
            <p>
              <strong>Time:</strong> {claim.time}
            </p>
            <p>
              <strong>Location:</strong> {claim.location}
            </p>
            <p>
              <strong>Incident Type:</strong> {claim.incidentType}
            </p>
            <p>
              <strong>Description:</strong> {claim.description}
            </p>
            <p>
              <strong>Damage Severity:</strong>{" "}
              <span className="tw:text-white tw:px-2 tw:py-0.5 tw:rounded tw:bg-[#4A628A]">
                {claim.damageSeverity}
              </span>
            </p>
          </div>

          {claim.uploadedImages && claim.uploadedImages.length > 0 && (
            <div className="tw:mt-4 tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:md:grid-cols-3 tw:gap-4">
              {claim.uploadedImages.map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl} // direct path from public folder
                  alt={`uploaded-${idx}`}
                  className="tw:w-full tw:h-60 tw:object-cover tw:rounded-lg tw:border tw:border-[#B9E5E8]"
                />
              ))}
            </div>
          )}
          <div className="tw:flex tw:space-x-4 tw:mt-4">
            <button className="tw:bg-[#4A628A] tw:text-white tw:px-4 tw:py-2 tw:rounded tw:hover:bg-[#7AB2D3]">
              View
            </button>
            <button className="tw:bg-[#4A628A] tw:text-white tw:px-4 tw:py-2 tw-rounded tw:hover:bg-[#7AB2D3]">
              Accept
            </button>
            <button className="tw:bg-[#4A628A] tw:text-white tw:px-4 tw:py-2 tw:rounded tw:hover:bg-[#7AB2D3]">
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InsuranceClaims;
