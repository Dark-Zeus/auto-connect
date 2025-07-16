import React from "react";
import InsuranceClaimForm from "@components/InsuranceCompany/InsuranceClaimForm";

export default function InsuranceClaimPage() {
  return (
    <div className="tw:min-h-screen tw:bg-blue-50 tw:flex tw:flex-col tw:items-center tw:py-10 tw:w-full tw:px-5 tw:overflow-auto">
      <div className="tw:bg-white tw:shadow-md tw:rounded-md tw:w-full tw:p-6 tw:text-center tw:mb-6">
        <h1 className="tw:text-2xl tw:font-bold tw:text-blue-700 tw:flex tw:items-center tw:justify-center tw:gap-2">
          <svg
            className="tw:w-6 tw:h-6 tw:text-blue-700"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 1l9 4v6c0 5.25-3.438 10.74-9 12-5.562-1.26-9-6.75-9-12V5l9-4z" />
          </svg>
          File Insurance Claim
        </h1>
        <p className="tw:text-sm tw:text-gray-600">
          Report your accident and get fast claim processing
        </p>
      </div>

      <div className="tw:flex tw:flex-col tw:md:flex-row tw:gap-6 tw:w-full">
        <div className="tw:flex-1 tw:bg-white tw:rounded-md tw:shadow-md tw:p-6 tw:min-h-[500px] tw:border tw:border-gray-300">
          <InsuranceClaimForm />
        </div>

        <div className="tw:w-full tw:md:w-[300px] tw:space-y-6">
          <div className="tw:bg-white tw:p-4 tw:rounded-md tw:shadow">
            <h3 className="tw:text-sm tw:font-semibold tw:text-gray-700 tw:mb-2">
              Your Insurance Provider
            </h3>
            <div className="tw:bg-blue-100 tw:p-3 tw:rounded-md">
              <p className="tw:text-sm tw:font-semibold tw:text-blue-800">
                Allianz Insurance
              </p>
              <p className="tw:text-xs tw:text-gray-700">Policy: POL-789456</p>
              <p className="tw:text-xs tw:text-gray-700">
                Coverage: Comprehensive
              </p>
              <p className="tw:text-xs tw:text-gray-500 tw:mt-2">
                Your claim will be processed directly with Allianz through our
                integrated system.
              </p>
            </div>
          </div>

          {/* Claim Process */}
          <div className="tw:bg-white tw:p-4 tw:rounded-md tw:shadow">
            <h3 className="tw:text-sm tw:font-semibold tw:text-gray-700 tw:mb-2">
              Claim Process
            </h3>
            <ol className="tw:list-decimal tw:ml-5 tw:text-sm tw:text-gray-700 tw:space-y-1">
              <li className="tw:text-green-600 tw:font-semibold">
                Submit claim form
              </li>
              <li>Insurance review</li>
              <li>Damage assessment</li>
              <li>Repair authorization</li>
              <li>Settlement</li>
            </ol>
          </div>

          {/* Quick Actions */}
          <div className="tw:bg-white tw:p-4 tw:rounded-md tw:shadow tw:space-y-2">
            <h3 className="tw:text-sm tw:font-semibold tw:text-gray-700 tw:mb-2">
              Quick Actions
            </h3>
            <button className="tw:w-full tw:bg-blue-500 tw:text-white tw:py-2 tw:px-4 tw:rounded-md tw:text-sm tw:hover:bg-blue-600">
              Request Agent Visit
            </button>
            <button className="tw:w-full tw:border tw:border-gray-300 tw:text-gray-700 tw:py-2 tw:px-4 tw:rounded-md tw:text-sm tw:hover:bg-gray-100">
              Find Repair Shops
            </button>
            <button className="tw:w-full tw:border tw:border-gray-300 tw:text-gray-700 tw:py-2 tw:px-4 tw:rounded-md tw:text-sm tw:hover:bg-gray-100">
              Track Claim Status
            </button>
          </div>

          {/* Emergency */}
          <div className="tw:bg-red-100 tw:p-4 tw:rounded-md tw:text-red-700 tw:shadow">
            <h3 className="tw:font-semibold tw:text-sm tw:mb-1">
              Emergency Assistance
            </h3>
            <p className="tw:text-lg tw:font-bold">1-800-HELP-NOW</p>
            <p className="tw:text-xs">24/7 Emergency Support</p>
          </div>
        </div>
      </div>
    </div>
  );
}
