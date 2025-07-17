import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import lc150_1 from '../../assets/images/lc150_1.jpg';

const ReportAvailable = ({ isOpen = true, onClose = () => {} }) => {
  if (!isOpen) return null;

const navigate = useNavigate();

  return (
    <div className="tw:fixed tw:inset-0 tw:bg-black/50 tw:flex tw:items-center tw:justify-center tw:p-4 tw:z-50">
      <div className="tw:bg-white tw:rounded-lg tw:max-w-2xl tw:w-full tw:max-h-[90vh] tw:overflow-y-auto tw:shadow-2xl">
        {/* Header */}
        <div className="tw:px-6 tw:py-4 tw:border-b tw:border-gray-200 tw:relative">
          <h2 className="tw:text-2xl tw:font-semibold tw:text-gray-800 tw:text-center">
            We've found this vehicle
          </h2>
          <button
            onClick={onClose}
            className="tw:absolute tw:top-4 tw:right-4 tw:text-gray-400 tw:hover:text-red-800 tw:hover:cursor-pointer tw:transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="tw:p-6">
          <div className="tw:flex tw:flex-col lg:tw:flex-row tw:gap-6">
            {/* Vehicle Image */}
            <div className="tw:flex-shrink-0 lg:tw:w-1/2">
              <img
                src={lc150_1}
                alt="2006 Volkswagen Golf"
                className="tw:w-full tw:h-64 tw:object-cover tw:rounded-lg tw:shadow-md"
              />
            </div>

            {/* Vehicle Details */}
            <div className="tw:flex-1 tw:space-y-4">
              <div className="tw:text-center lg:tw:text-right">
                <h3 className="tw:text-xl tw:font-semibold tw:text-gray-800 tw:mb-1">
                  Toyota Land Cruiser 150 TX
                </h3>
                <p className="tw:text-lg tw:text-gray-600">2015</p>
              </div>

              <div className="tw:space-y-3">
                <div className="tw:flex tw:justify-between tw:items-center">
                  <span className="tw:text-gray-600 tw:font-medium">Vehicle type</span>
                  <span className="tw:text-gray-800 tw:font-semibold">SUV</span>
                </div>
                
                <div className="tw:flex tw:justify-between tw:items-center">
                  <span className="tw:text-gray-600 tw:font-medium">Colour</span>
                  <span className="tw:text-gray-800 tw:font-semibold">Black</span>
                </div>
                
                <div className="tw:flex tw:justify-between tw:items-center">
                  <span className="tw:text-gray-600 tw:font-medium">First registered</span>
                  <span className="tw:text-gray-800 tw:font-semibold">May 2015</span>
                </div>
              </div>

              <div className="tw:mt-6 tw:space-y-3">
                <button 
                    className="tw:w-full tw:bg-[linear-gradient(135deg,var(--sky-blue),var(--navy-blue))] tw:text-white tw:py-3 tw:px-6 tw:rounded-lg tw:font-semibold tw:text-lg tw:hover:bg-[linear-gradient(135deg,var(--navy-blue),var(--sky-blue))] tw:hover:cursor-pointer tw:transition-all tw:shadow-md"
                    onClick={() => navigate('/vehiclehistory')}
                >
                    Get report
                </button>
                
                <div className="tw:text-center">
                    <span className="tw:text-gray-600 tw:text-sm">Not the right vehicle? </span>
                    <button 
                        className="tw:text-sm tw:font-medium tw:underline hover:tw:no-underline tw:transition-all tw:hover:text-blue-800 tw:hover:cursor-pointer tw:text-[#288aff]"
                        onClick={() => { window.location.href = '/checkreports'; }}
                    >
                        Search again
                    </button>
                </div>
             </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportAvailable;