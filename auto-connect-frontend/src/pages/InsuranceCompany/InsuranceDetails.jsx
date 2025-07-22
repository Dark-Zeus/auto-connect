import React from "react";
import { useNavigate } from "react-router-dom";

const claimant = {
  name: "John Doe",
  age: 34,
  gender: "Male",
  address: "123 Main Street, Cityville",
  contact: "+1 234 567 890",
  policyNumber: "IC-2025-12345",
  model: "Toyota Camry",
  plateNumber: "XYZ 1234",
  insuranceType: "Comprehensive",
  registeredDate: "2020-01-15",
};

const company = {
  name: "Allianz Insurance",
  address: "456 Insurance Ave, Capital City",
  email: "support@allianz.com",
  phone: "+1 987 654 3210",
  officer: "Jane Smith (Claims Officer)",
};

const InsuranceDetails = () => {
  const navigate = useNavigate();

  const handleGoToClaimForm = () => {
    navigate("/insurance-claim");
  };

  return (
    <div className="tw:min-h-screen tw:bg-[#DFF2EB] tw:p-6 tw:flex tw:items-center tw:justify-center tw:w-full">
      <div className="tw:max-w-6xl tw:w-full tw:flex tw:flex-col tw:space-y-6">
        <div className="tw:flex tw:flex-col md:tw:flex-row tw:gap-6">
          <div className="tw:flex-1 tw:bg-[#B9E5E8] tw:rounded-2xl tw:p-6 tw:shadow-lg">
            <h2 className="tw:text-xl tw:font-semibold tw:text-[#4A628A] tw:mb-6 tw:pb-6">
              Your Information
            </h2>
            <div className="tw:space-y-2 tw:text-[#4A628A]">
              <p>
                <strong>Name:</strong> {claimant.name}
              </p>
              <p>
                <strong>Age:</strong> {claimant.age}
              </p>
              <p>
                <strong>Gender:</strong> {claimant.gender}
              </p>
              <p>
                <strong>Address:</strong> {claimant.address}
              </p>
              <p>
                <strong>Contact:</strong> {claimant.contact}
              </p>
              <p>
                <strong>Policy No:</strong> {claimant.policyNumber}
              </p>
              <p>
                <strong>Vehicle Model:</strong> {claimant.model}
              </p>
              <p>
                <strong>Plate Number:</strong> {claimant.plateNumber}
              </p>
              <p>
                <strong>Insurance Type:</strong> {claimant.insuranceType}
              </p>
              <p>
                <strong>Registered On:</strong> {claimant.registeredDate}
              </p>
            </div>
          </div>

          <div className="tw:flex-1 tw:bg-[#7AB2D3] tw:rounded-2xl tw:p-6 tw:text-white tw:shadow-lg">
            <h2 className="tw:text-xl tw:font-semibold tw:mb-10 tw:pb-6">
              Insurance Company Information
            </h2>
            <div className="tw:space-y-2">
              <p>
                <strong>Company:</strong> {company.name}
              </p>
              <p>
                <strong>Address:</strong> {company.address}
              </p>
              <p>
                <strong>Email:</strong> {company.email}
              </p>
              <p>
                <strong>Phone:</strong> {company.phone}
              </p>
              <p>
                <strong>Claims Officer:</strong> {company.officer}
              </p>
            </div>
          </div>
        </div>

        <div className="tw:flex tw:justify-end">
          <button
            onClick={handleGoToClaimForm}
            className="tw:bg-[#4A628A] tw:text-white tw:px-6 tw:py-2 tw-rounded-xl tw-font-semibold tw-shadow-md hover:tw-bg-[#3a4f6f] tw-transition"
          >
            Insurance Claim
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsuranceDetails;
