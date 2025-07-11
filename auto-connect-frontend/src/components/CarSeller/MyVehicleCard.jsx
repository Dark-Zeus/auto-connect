import React, { useState } from 'react';
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

import toyotaImage from '../../assets/images/toyota-v8.jpg';
import Confirm from '../atoms/Confirm';
import { useNavigate } from 'react-router-dom';

const ListedVehicleCard = ({ vehicle = null }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmProps, setConfirmProps] = useState({});
  const navigate = useNavigate();

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

  const handleConfirm = (type) => {
    if (type === 'delete') {
      setConfirmProps({
        title: 'Delete Vehicle',
        message: 'Are you sure you want to delete this vehicle listing?',
        onOK: () => setConfirmOpen(false),
        onCancel: () => setConfirmOpen(false)
      });
      setConfirmOpen(true);
    } else if (type === 'edit') {
      setConfirmProps({
        title: 'Edit Vehicle',
        message: 'Do you want to edit this vehicle listing?',
        onOK: () => setConfirmOpen(false),
        onCancel: () => setConfirmOpen(false)
      });
      setConfirmOpen(true);
    } else if (type === 'promote') {
      navigate('/vehicle-ad-promotion');}
  };

  return (
    <>
      <Card 
        className="tw:bg-white tw:shadow-lg tw:transition-all tw:duration-300 tw:mb-1.5"
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

          <Box sx={{ width: '70%', height: '100%', display: 'flex' }}>
            {/* Vehicle Details Section */}
            <Box sx={{ width: '75%', height: '100%' }}>
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
                <Box className="tw:flex tw:justify-end tw:pt-2 tw:border-t tw:border-gray-300">
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
            
            {/* Action Buttons Section */}
            <Box sx={{ width: '25%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}>
              <Box className="tw:flex tw:flex-col tw:gap-2">
                <button
                  onClick={() => handleConfirm('delete')}
                  className="tw:px-3 tw:py-2 tw:text-white tw:font-bold tw:border-none tw:rounded-md tw:transition-all tw:duration-200 tw:w-30"
                  style={{
                    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #b91c1c, #991b1b)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.cursor = 'pointer';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Delete
                </button>
                
                <button
                  onClick={() => handleConfirm('edit')}
                  className="tw:px-3 tw:py-2 tw:text-white tw:font-bold tw:border-none tw:rounded-md tw:transition-all tw:duration-200 tw:w-30"
                  style={{
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #1d4ed8, #1e40af)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.cursor = 'pointer';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #2563eb, #1d4ed8)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Edit
                </button>
                
                <button
                  onClick={() => handleConfirm('promote')}
                  className="tw:px-3 tw:py-2 tw:text-white tw:font-bold tw:border-none tw:rounded-md tw:transition-all tw:duration-200 tw:w-30"
                  style={{
                    background: 'linear-gradient(135deg, #059669, #047857)',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #047857, #065f46)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.cursor = 'pointer';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #059669, #047857)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Promote
                </button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>

      {confirmOpen && (
        <Confirm
          {...confirmProps}
        />
      )}
    </>
  );
};

export default ListedVehicleCard;