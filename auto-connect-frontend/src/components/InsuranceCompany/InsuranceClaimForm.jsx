import React, { useState } from "react";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

const InsuranceClaimForm = () => {
  const [damageSeverity, setDamageSeverity] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);

  return (
    <div className="tw:mx-auto tw:p-6 tw:bg-white tw:shadow-md tw:rounded-lg tw:space-y-6 tw:ml-10">
      {/* Vehicle Information */}
      <div className="tw:border-l-4 tw:border-purple-500 tw:pl-4">
        <h2 className="tw:text-lg tw:font-semibold tw:text-purple-700 tw:flex tw:items-center tw:gap-2">
          <DirectionsCarIcon className="tw:text-purple-700" />
          Vehicle Information
        </h2>
        <div className="tw:bg-green-100 tw:text-green-800 tw:px-4 tw:py-2 tw:mt-2 tw:rounded">
          <p className="tw:font-semibold">Toyota Corolla 2020</p>
          <p className="tw:text-sm">
            License: ABC-1234 • Policy: POL-789456 • Coverage: Comprehensive
          </p>
        </div>
      </div>

      {/* Incident Details */}
      <div>
        <h2 className="tw:text-lg tw:font-semibold tw:text-blue-600 tw:flex tw:items-center tw:gap-2">
          <ReportProblemIcon className="tw:text-blue-600" />
          Incident Details
        </h2>
        <div className="tw:grid tw:grid-cols-2 tw:gap-4 tw:mt-4">
          <div>
            <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700">
              Date of Incident *
            </label>
            <input
              type="date"
              className="tw:mt-1 tw:block tw:w-full tw:border tw:border-gray-300 tw:rounded tw:px-3 tw:py-2 tw:text-black tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700">
              Time of Incident *
            </label>
            <input
              type="time"
              className="tw:mt-1 tw:block tw:w-full tw:border tw:border-gray-300 tw:rounded tw:px-3 tw:py-2 tw:text-black tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="tw:mt-4">
          <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700">
            Location of Incident *
          </label>
          <input
            type="text"
            placeholder="Street address, city, landmarks..."
            className="tw:mt-1 tw:block tw:w-full tw:border tw:border-gray-300 tw:rounded tw:px-3 tw:py-2 tw:text-black tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-400"
          />
        </div>

        <div className="tw:mt-4">
          <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700">
            Incident Type *
          </label>
          <select className="tw:mt-1 tw:block tw:w-full tw:border tw:border-gray-300 tw:rounded tw:px-3 tw:py-2 tw:text-black tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-400">
            <option>Select incident type</option>
            <option>Collision</option>
            <option>Theft</option>
            <option>Natural Disaster</option>
          </select>
        </div>

        <div className="tw:mt-4 tw:bg-blue-50 tw:p-4 tw:rounded">
          <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-1">
            Incident Description *
          </label>
          <textarea
            rows="4"
            placeholder="Describe what happened in detail..."
            className="tw:w-full tw:border tw:border-gray-300 tw:rounded tw:px-3 tw:py-2 tw:text-black tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-400"
          ></textarea>
        </div>

        {/* Damage Severity */}
        <div className="tw:mt-4">
          <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">
            Damage Severity
          </label>
          <div className="tw:flex tw:space-x-4">
            {["Minor", "Major", "Total Loss"].map((type) => {
              const colors = {
                Minor: "tw:bg-green-100 tw:text-green-800",
                Major: "tw:bg-yellow-100 tw:text-yellow-800",
                "Total Loss": "tw:bg-red-100 tw:text-red-800",
              };
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setDamageSeverity(type)}
                  className={`tw:px-4 tw:py-2 tw:rounded tw:border ${
                    colors[type]
                  } ${
                    damageSeverity === type
                      ? "tw:ring-2 tw:ring-offset-2 tw:ring-blue-400"
                      : ""
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Damage Assessment */}
      <div>
        <h2 className="tw:text-lg tw:font-semibold tw:text-gray-700 tw:flex tw:items-center tw:gap-2 tw:mt-12">
          <CameraAltIcon className="tw:text-gray-700" />
          Damage Assessment
        </h2>
        <div className="tw:mt-5">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files).slice(0, 5); // Limit to 5 files
              setUploadedImages(files);
            }}
            className="tw:mt-1 tw:block tw:w-full tw:border tw:border-gray-300 tw:rounded tw:px-3 tw:py-2 tw:text-black tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-400"
          />
          <p className="tw:text-sm tw:text-gray-500 tw:mt-1">
            You can upload up to 5 images.
          </p>
        </div>

        {/* Preview Uploaded Images */}
        {uploadedImages.length > 0 && (
          <div className="tw:mt-4 tw:grid tw:grid-cols-2 tw:md:grid-cols-3 tw:gap-4">
            {uploadedImages.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`upload-${index}`}
                  className="tw:w-full tw:h-60 tw:object-cover tw:rounded tw:shadow"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="tw:text-center">
        <button className="tw:bg-blue-600 tw:text-white tw:px-6 tw:py-2 tw:rounded tw:hover:bg-blue-700">
          Submit
        </button>
      </div>
    </div>
  );
};

export default InsuranceClaimForm;
