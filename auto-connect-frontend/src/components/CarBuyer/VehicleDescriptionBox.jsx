import React, { useState } from 'react';

const VehicleDescriptionBox = ({ description }) => {
  const [expanded, setExpanded] = useState(false);
  const desc = description || '';

  // const vehicleData = vehicle || {
  //   name: 'lomitha',
  //   mobile: '0767120123',
  //   district: 'Matara',
  //   city: 'Akuressa',
  //   email: 'lomitha@example.com',
  //   vehicleType: 'Car',
  //   condition: 'Used',
  //   make: 'Toyota',
  //   model: 'Tercel',
  //   year: '1998',
  //   registeredYear: '1998',
  //   price: '2565000',
  //   ongoingLease: false,
  //   transmission: 'Manual',
  //   fuelType: 'Petrol',
  //   engineCapacity: '1500',
  //   mileage: '272000',
  //   description: 'Toyota Land Cruiser 150 in Akuressa. Well maintained. Family used. Company maintained. All services up to date. Updated documents and registration. Inspection on prior appointment can be arranged. Please call for more information.',
  //   views: '2164'
  // };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const shouldShowExpandButton = desc.length > 200;

  return (
    <div className="tw:max-w-4xl tw:w-full tw:mx-auto tw:p-4">
      <div className="tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:shadow-sm tw:overflow-hidden">
        {/* Header */}
        <div className="tw:p-6 tw:border-b tw:border-gray-100">
          <h3 className="tw:text-lg tw:font-semibold tw:text-gray-900">Description</h3>
        </div>

        {/* Description Content */}
        <div className="tw:p-6">
          <p className="tw:text-gray-700 tw:leading-relaxed tw:text-base tw:whitespace-pre-line">
            {expanded || !shouldShowExpandButton 
              ? desc
              : truncateText(desc, 200)
            }
          </p>

          {/* Expand/Collapse Button */}
          {shouldShowExpandButton && (
            <div className="tw:mt-4">
              <button
                onClick={handleExpandClick}
                className="tw:text-blue-600 tw:hover:text-blue-800 tw:font-medium tw:text-sm tw:transition-colors tw:duration-200 tw:hover:cursor-pointer"
              >
                {expanded ? 'Show Less' : 'Read More'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleDescriptionBox;