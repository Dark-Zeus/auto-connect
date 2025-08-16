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

import { useNavigate } from 'react-router-dom';

const ListedVehicleCard = ({ vehicle }) => {

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatOdometer = (mileage) => {
    return `${mileage.toLocaleString()} km`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit'
    });
  };

  const navigate = useNavigate();

  const handleHeaderClick = () => {
    navigate('/vehicleview', { state: { vehicle } });
  };

  return (
    <Card 
      className="tw:bg-white tw:shadow-lg tw:transition-all tw:mb-1.5"
      sx={{ 
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
          transform: 'translateY(-3px)'
        }
      }}
    >
      <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
        <Box sx={{ width: '30%', height: '100%', p: 1.5, boxSizing: 'border-box' }}>
          <CardMedia
            component="img"
            image={vehicle.photos?.[0]}
            alt={`${vehicle.make} ${vehicle.model} ${vehicle.year}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
          />
        </Box>

        <Box sx={{ width: '70%', height: '100%' }}>
          <CardContent className="tw:p-4 tw:h-full tw:flex tw:flex-col" sx={{ height: '100%', boxSizing: 'border-box', padding: '16px !important' }}>
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
                {vehicle.make} {vehicle.model} {vehicle.year}
              </Typography>
            </Box>
            <Box className="tw:space-y-2 tw:flex-grow">
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
                  {vehicle.district}, {vehicle.city}
                </Typography>
              </Box>
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
                  {formatPrice(vehicle.price)}
                </Typography>
              </Box>
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
                  {formatOdometer(vehicle.mileage)}
                </Typography>
              </Box>
              <Box className="tw:flex tw:items-center tw:gap-2">
                <LocalGasStation 
                  fontSize="small" 
                  style={{ color: '#7bb1d2' }}
                />
                <Chip
                  label={vehicle.fuelType}
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
            <Box className="tw:flex tw:justify-end tw:mt-3 tw:pt-2 tw:border-t tw:border-gray-300">
              <Typography 
                variant="caption" 
                className="tw:text-gray-500 tw:text-xs"
                fontSize={12}
              >
                Posted: {formatDate(vehicle.postedDate)}
              </Typography>
            </Box>
          </CardContent>
        </Box>
      </Box>
    </Card>
  );
};

export default ListedVehicleCard;