import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Chip,
  Grid
} from '@mui/material';
import { 
  LocationOn, 
  AttachMoney, 
  Speed, 
  LocalGasStation 
} from '@mui/icons-material';

import toyotaImage from '../assets/images/toyota-v8.jpg';

const ListedVehicleCard = ({ vehicle = null }) => {
  // Use props or fallback to sample data
  const vehicleData = vehicle || {
    id: 1,
    manufacturer: 'Toyota',
    model: 'Land Cruiser 150',
    year: 2008,
    price: 32000000,
    odometer: 135000,
    fuelType: 'Diesel',
    image: toyotaImage,
    postedDate: '2025-06-20',
    district: 'Gampaha',
    city: 'Katana'
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatOdometer = (odometer) => {
    return `${odometer.toLocaleString()} km`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit'
    });
  };

  const handleHeaderClick = () => {
    // Default ref for navigation - will be replaced with actual routing
    console.log(`Maps to vehicle details for ${vehicleData.manufacturer} ${vehicleData.model}`);
  };

  return (
    <Card 
      className="tw:bg-white tw:shadow-lg tw:transition-all tw:duration-300 hover:tw:shadow-2xl hover:tw:translate-y-[-4px]"
      style={{ 
        width: '50vw', 
        height: '15vh',
        minWidth: 500,
        minHeight: 200,
        
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          transform: 'translateY(-4px)'
        }
      }}
    >
      <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
        <Box sx={{ width: '30%', height: '100%', p: 1.5, boxSizing: 'border-box' }}>
          <CardMedia
            component="img"
            image={vehicleData.image}
            alt={`${vehicleData.manufacturer} ${vehicleData.model} ${vehicleData.year}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
          />
        </Box>

        <Box sx={{ width: '70%', height: '100%' }}>
          <CardContent className="tw:p-4 tw:h-full tw:flex tw:flex-col" sx={{ height: '100%', boxSizing: 'border-box', padding: '16px !important' }}>
            {/* Clickable Header */}
            <Box 
              onClick={handleHeaderClick}
              className="tw:cursor-pointer tw:mb-3 tw:group"
            >
              <Typography 
                variant="h6" 
                component="h2"
                className="tw:font-bold tw:text-lg tw:mb-1 group-hover:tw:underline tw:transition-all"
                style={{ color: '#4a618a', fontWeight: '600' }}
              >
                {vehicleData.manufacturer} {vehicleData.model} {vehicleData.year}
              </Typography>
            </Box>
            {/* Vehicle Details */}
            <Box className="tw:space-y-2 tw:flex-grow">
              {/* Location */}
              <Box className="tw:flex tw:items-center tw:gap-2">
                <LocationOn 
                  fontSize="small" 
                  style={{ color: '#7bb1d2' }}
                />
                <Typography 
                  variant="body2" 
                  className="tw:text-gray-700"
                  fontSize={14}
                >
                  {vehicleData.district}, {vehicleData.city}
                </Typography>
              </Box>
              {/* Price */}
              <Box className="tw:flex tw:items-center tw:gap-2">
                <AttachMoney 
                  fontSize="small" 
                  style={{ color: '#7bb1d2' }}
                />
                <Typography 
                  variant="h6" 
                  className="tw:font-bold"
                  style={{ color: '#4a618a' }}
                >
                  {formatPrice(vehicleData.price)}
                </Typography>
              </Box>
              {/* Odometer */}
              <Box className="tw:flex tw:items-center tw:gap-2">
                <Speed 
                  fontSize="small" 
                  style={{ color: '#7bb1d2' }}
                />
                <Typography 
                  variant="body2" 
                  className="tw:text-gray-700"
                  fontSize={13}
                  fontWeight={600}
                >
                  {formatOdometer(vehicleData.odometer)}
                </Typography>
              </Box>
              {/* Fuel Type */}
              <Box className="tw:flex tw:items-center tw:gap-2">
                <LocalGasStation 
                  fontSize="small" 
                  style={{ color: '#7bb1d2' }}
                />
                <Chip
                  label={vehicleData.fuelType}
                  size="small"
                  className="tw:text-xs"
                  style={{ 
                    backgroundColor: '#b9e5e8',
                    color: '#000000',
                    fontWeight: '500',
                    fontSize: '0.75rem',
                  }}
                />
              </Box>
            </Box>
            {/* Posted Date */}
            <Box className="tw:flex tw:justify-end tw:mt-3 tw:pt-2 tw:border-t tw:border-gray-300">
              <Typography 
                variant="caption" 
                className="tw:text-gray-500 tw:text-xs"
                fontSize={12}
              >
                Posted: {vehicleData.postedDate}
              </Typography>
            </Box>
          </CardContent>
        </Box>
      </Box>
    </Card>
  );
};

export default ListedVehicleCard;