import React, { useState } from 'react';
import { ChevronRight, ArrowLeft, Check, Info, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OwnershipHistoryCheck = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const historyChecks = [
    { label: 'Not recorded as stolen', passed: true },
    { label: 'Not recorded as scrapped', passed: true },
    { label: 'Not an insurance write-off', passed: true }
  ];

  const additionalChecks = [
    { label: 'Mileage', value: '78,450 miles', status: 'Verified' },
    { label: 'Previous Keepers', value: '6', status: 'Confirmed' },
    { label: 'Colour Changes', value: 'None', status: 'Checked' },
    { label: 'Plate Changes', value: '1', status: 'Recorded' }
  ];

  return (
    <div className="tw:w-full tw:max-w-4xl tw:mx-auto tw:p-4">
      {/* Main Component */}
      <div 
        className="tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:p-6 tw:cursor-pointer tw:shadow-sm hover:tw:shadow-md tw:transition-shadow tw:duration-300"
        onClick={togglePopup}
      >
        <div className="tw:flex tw:items-center tw:justify-between">
          <div>
            <h3 className="tw:text-blue-600 tw:font-semibold tw:text-xl tw:mb-2">
              Ownership & History
            </h3>
            <p className="tw:text-gray-600 tw:text-base">
              Basic history check: <span className="tw:text-green-600 tw:font-medium">3 checks passed</span>
            </p>
          </div>
          <ChevronRight className="tw:text-blue-600 tw:w-6 tw:h-6" />
        </div>
      </div>

      {/* Popup Overlay */}
      {isPopupOpen && (
        <div className="tw:fixed tw:inset-0 tw:bg-black/50  tw:z-50 tw:flex tw:items-center tw:justify-end  tw:duration-300">
          <div className="tw:bg-white tw:w-full tw:max-w-1/2 tw:h-full tw:overflow-y-auto tw:shadow-2xl tw:rounded-l-xl tw:transform tw:transition-transform tw:duration-300 tw:animate-slide-in-right">
            {/* Header */}
            <div className="tw:flex tw:items-center tw:p-6 tw:border-b tw:border-gray-200 tw:bg-gray-50">
              <button 
                onClick={togglePopup}
                className="tw:mr-4 tw:p-2 tw:rounded-full hover:tw:bg-gray-200 tw:transition-colors"
              >
                <ArrowLeft className="tw:w-6 tw:h-6 tw:text-blue-600 tw:hover:text-blue-800 tw:hover:cursor-pointer" />
              </button>
              <h2 className="tw:text-2xl tw:font-semibold tw:text-gray-800">
                Ownership and History
              </h2>
            </div>

            {/* Content */}
            <div className="tw:p-6 tw:space-y-8">
              {/* Info Section */}
              <div className="tw:bg-blue-50 tw:border tw:border-blue-200 tw:rounded-xl tw:p-6">
                <div className="tw:flex tw:items-start tw:space-x-4">
                  <Info className="tw:w-6 tw:h-6 tw:text-blue-600 tw:mt-1 tw:flex-shrink-0" />
                  <div>
                    <h4 className="tw:font-semibold tw:text-gray-800 tw:text-lg tw:mb-2">
                      Info Given by the Seller
                    </h4>
                    <p className="tw:text-base tw:text-gray-600 tw:leading-relaxed">
                      The below information (except History Check) has been provided by the seller. It's always best to check details with them before you buy.
                    </p>
                  </div>
                </div>
              </div>

              {/* Owners Section */}
              <div>
                <div className="tw:flex tw:items-center tw:justify-between tw:mb-3">
                  <h4 className="tw:font-semibold tw:text-gray-800 tw:text-lg">Owners</h4>
                  <span className="tw:text-xl tw:font-semibold tw:text-gray-800">3</span>
                </div>
                <p className="tw:text-base tw:text-gray-600 tw:leading-relaxed">
                  <span className="tw:font-medium">Good to know:</span> Vehicles can be driven by more people than just their owners, especially true for ex-rental or fleet vehicles. It's always best to double-check the vehicle's previous use with the seller.
                </p>
              </div>

              {/* Insurance Section */}
              <div>
                <div className="tw:flex tw:items-center tw:justify-between tw:mb-3">
                  <h4 className="tw:font-semibold tw:text-gray-800 tw:text-lg">Insurance</h4>
                  <span className="tw:text-green-600 tw:font-medium tw:text-base">Valid</span>
                </div>
                <p className="tw:text-base tw:text-gray-600 tw:leading-relaxed">2025-10-14</p>
              </div>

              {/* Basic History Check */}
              <div className="tw:bg-gray-50 tw:rounded-xl tw:p-6">
                <h4 className="tw:font-semibold tw:text-gray-800 tw:text-lg tw:mb-4">Basic History Check</h4>
                <div className="tw:mb-4">
                  <span className="tw:text-base tw:text-gray-600">Status: </span>
                  <span className="tw:text-green-600 tw:font-medium tw:text-base">3 checks passed</span>
                </div>
                
                <div className="tw:space-y-4">
                  {historyChecks.map((check, index) => (
                    <div key={index} className="tw:flex tw:items-center tw:justify-between tw:py-2">
                      <span className="tw:text-blue-600 tw:text-base">{check.label}</span>
                      <Check className="tw:w-5 tw:h-5 tw:text-green-600" />
                    </div>
                  ))}
                </div>

                {/* Additional Checks 
                <div className="tw:mt-6">
                  <h4 className="tw:font-semibold tw:text-gray-800 tw:text-lg tw:mb-4">Additional Vehicle Details</h4>
                  <div className="tw:space-y-4">
                    {additionalChecks.map((check, index) => (
                      <div key={index} className="tw:flex tw:items-center tw:justify-between tw:py-2">
                        <span className="tw:text-gray-700 tw:text-base">{check.label}</span>
                        <div className="tw:flex tw:items-center tw:space-x-2">
                          <span className="tw:text-gray-800 tw:font-medium tw:text-base">{check.value}</span>
                          <span className="tw:text-green-600 tw:text-sm">{check.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>*/}

                {/* Buying Guide */}
                <div className="tw:mt-6 tw:p-4 tw:bg-white tw:rounded-lg tw:shadow-sm">
                  <div className="tw:flex tw:items-start tw:space-x-4">
                    <FileText className="tw:w-6 tw:h-6 tw:text-blue-600 tw:mt-1 tw:flex-shrink-0" />
                    <div>
                      <h4 className="tw:font-semibold tw:text-gray-800 tw:text-lg tw:mb-2">Buying Guide</h4>
                      <p className="tw:text-base tw:text-gray-600 tw:leading-relaxed tw:mb-4">
                        To ensure a secure purchase, verify all details with the seller, including mileage, ownership history, and MOT status. Consider a full vehicle check for added peace of mind.
                      </p>
                      <ul className="tw:list-disc tw:pl-6 tw:text-base tw:text-gray-600 tw:leading-relaxed">
                        <li>Confirm the vehicle's service history.</li>
                        <li>Check for outstanding finance.</li>
                        <li>Inspect the vehicle in person or hire a professional.</li>
                        <li>Ensure Insurance is valid or plan for renewal.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="tw:mt-6 tw:p-4 tw:bg-white tw:rounded-lg tw:shadow-sm">
                  <p className="tw:text-base tw:text-gray-600 tw:mb-4 tw:leading-relaxed">
                    For peace of mind, you can purchase a Vehicle Check with
                    additional checks including accidents recorded, service/repair history, emission tests, previous keepers, mileage, color. Terms and conditions apply.
                  </p>
                  <button className="tw:w-full tw:bg-blue-600 tw:text-white tw:py-3 tw:px-4 tw:rounded-lg tw:text-base tw:font-semibold tw:hover:bg-blue-800 tw:hover:cursor-pointer tw:transition-colors tw:mt-2" onClick={() => navigate('/vehiclehistory')}>
                    Buy a Full Vehicle Check
                  </button>
                </div>

                <div className="tw:mt-6">
                  <p className="tw:text-base tw:text-gray-600 tw:font-medium">
                    About this vehicle check: The 5 basic checks were performed when the advert was placed and therefore some information may be out of date. The seller may have conducted their own full check. AutoConnect Sri Lanka will not be liable for any inaccuracies or for any loss you suffer if you rely on it
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnershipHistoryCheck;