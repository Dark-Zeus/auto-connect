import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Collapse } from '@mui/material';
import { ExpandMore, ExpandLess, Description } from '@mui/icons-material';

const VehicleDescriptionBox = ({ vehicle }) => {
  const [expanded, setExpanded] = useState(false);

  const vehicleData = vehicle || {
    name: 'lomitha',
    mobile: '0767120123',
    district: 'Matara',
    city: 'Akuressa',
    email: 'lomitha@example.com',
    vehicleType: 'Car',
    condition: 'Used',
    make: 'Toyota',
    model: 'Tercel',
    year: '1998',
    registeredYear: '1998',
    price: '2565000',
    ongoingLease: false,
    transmission: 'Manual',
    fuelType: 'Petrol',
    engineCapacity: '1500',
    mileage: '272000',
    description: 'Toyota Tercel in Akuressa. Well maintained. Updated documents and registration. Inspection on prior appointment can be arranged. Please call for more information zzzzzzzzzzzzzzzzzzzzzzzzzzzzz zzzzzzzzzzz zzzzzzzzzz zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz zzzzzzzzzzz zzzzzzzzz zzzzzzzzz zzzzzzzzzzz zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz zzzzzzzzzzzzzzzzzzzzz',
    views: '2164'
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const shouldShowExpandButton = vehicleData.description.length > 200;

  return (
    <div className="tw:w-full tw:max-w-4xl tw:mx-auto tw:p-4">
      <Card 
        className="tw:shadow-xl tw:rounded-2xl tw:border-0 tw:overflow-hidden"
        sx={{
          background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
          position: 'relative',
        }}
      >
        {/* Decorative background pattern */}
        <div className="tw:absolute tw:inset-0 tw:opacity-10">
          <div className="tw:absolute tw:top-0 tw:right-0 tw:w-32 tw:h-32 tw:bg-white tw:rounded-full tw:-translate-y-16 tw:translate-x-16"></div>
          <div className="tw:absolute tw:bottom-0 tw:left-0 tw:w-24 tw:h-24 tw:bg-white tw:rounded-full tw:translate-y-12 tw:-translate-x-12"></div>
        </div>

        <CardContent className="tw:relative tw:z-10 tw:p-6">
          {/* Header */}
          <div className="tw:flex tw:items-center tw:gap-3 tw:mb-4">
            <div className="tw:p-2 tw:bg-white tw:bg-opacity-20 tw:rounded-xl tw:backdrop-blur-sm">
              <Description className="tw:text-blue-600" fontSize="medium" />
            </div>
            <Typography 
              variant="h5" 
              className="tw:text-white tw:font-bold tw:tracking-wide"
              sx={{ fontWeight: 700 }}
            >
              Description
            </Typography>
          </div>

          {/* Description Content */}
          <div className="tw:bg-white tw:bg-opacity-95 tw:backdrop-blur-sm tw:rounded-xl tw:p-5 tw:shadow-lg">
            <Typography
              variant="body1"
              className="tw:text-gray-800 tw:leading-relaxed tw:text-base"
              sx={{ 
                lineHeight: 1.7,
                fontSize: '1rem',
                fontWeight: 400
              }}
            >
              {expanded || !shouldShowExpandButton 
                ? vehicleData.description 
                : truncateText(vehicleData.description, 200)
              }
            </Typography>

            {shouldShowExpandButton && (
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <div className="tw:mt-3">
                  <Typography
                    variant="body1"
                    className="tw:text-gray-800 tw:leading-relaxed"
                    sx={{ 
                      lineHeight: 1.7,
                      fontSize: '1rem',
                      fontWeight: 400
                    }}
                  >
                    {vehicleData.description.substring(200)}
                  </Typography>
                </div>
              </Collapse>
            )}

            {/* Expand/Collapse Button */}
            {shouldShowExpandButton && (
              <div className="tw:flex tw:justify-center tw:mt-4">
                <IconButton
                  onClick={handleExpandClick}
                  className="tw:bg-gradient-to-r tw:from-blue-600 tw:to-purple-600 tw:text-white tw:shadow-lg hover:tw:shadow-xl tw:transition-all tw:duration-300"
                  sx={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)',
                      transform: 'translateY(-1px)',
                    },
                    borderRadius: '12px',
                    padding: '8px 16px',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Typography 
                    variant="button" 
                    className="tw:mr-2 tw:font-semibold tw:text-sm"
                    sx={{ textTransform: 'none' }}
                  >
                    {expanded ? 'Show Less' : 'Read More'}
                  </Typography>
                  {expanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </div>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleDescriptionBox;