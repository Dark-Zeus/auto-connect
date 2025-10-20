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
  LocalGasStation,
  Visibility 
} from '@mui/icons-material';

import toyotaImage from '../../assets/images/toyota-v8.jpg';
import noImage from '../../assets/images/noImage.jpeg';
import Confirm from '../atoms/Confirm';
import { useNavigate } from 'react-router-dom';
import listVehicleAPI from '../../services/listVehicleApiService';

const ListedVehicleCard = ({ vehicle = null }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmProps, setConfirmProps] = useState({});
  const navigate = useNavigate();

  const vehicleData = vehicle
    ? {
        id: vehicle._id,
        manufacturer: vehicle.make,
        model: vehicle.model,
        vehicleType: vehicle.vehicleType,
        year: vehicle.year,
        price: vehicle.price,
        odometer: vehicle.mileage,
        fuelType: vehicle.fuelType,
        engineCapacity: vehicle.engineCapacity,
        transmission: vehicle.transmission,
        image: vehicle.photos?.[0] || noImage,
        postedDate: vehicle.createdAt?.slice(0, 10),
        district: vehicle.district,
        city: vehicle.city,
        views: vehicle.views,
        promotion: vehicle.promotion,
        schedule: vehicle.bumpSchedule || null, // expose schedule if exists
      }
    : {
        // ...existing hardcoded fallback...
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

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return '-';
    const pad = (n) => String(n).padStart(2, '0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}, ${hh}:${mi}`;
  };

  const handleHeaderClick = () => {
    // Default ref for navigation - will be replaced with actual routing
    //navigate('/vehicleview');
  };

  const handleConfirm = (type) => {
    if (type === 'delete') {
      setConfirmProps({
        title: 'Delete Vehicle',
        message: 'Are you sure you want to delete this vehicle listing?',
        onOK: async () => {
        setConfirmOpen(false);
        try {
          await listVehicleAPI.deleteListing(vehicleData.id);
          navigate('/marketplace/my-ads');
          window.location.reload();
        } catch (err) {
          // Error handled by API service
        }
      },
        onCancel: () => setConfirmOpen(false)
      });
      setConfirmOpen(true);
    } else if (type === 'edit') {
      setConfirmProps({
        title: 'Edit Vehicle',
        message: 'Do you want to edit this vehicle listing?',
        onOK: () => {
          setConfirmOpen(false);
          navigate(`/update-vehicle-ad/${vehicleData.id}`); // Pass ID in route
        },
        onCancel: () => setConfirmOpen(false)
      });
      setConfirmOpen(true);
    } else if (type === 'promote') {
      setConfirmProps({
        title: 'Promote Vehicle',
        message: 'Boost this vehicle ad with a promotion?',
        onOK: () => {
          setConfirmOpen(false);
          navigate(`/vehicle-ad-promotion/${vehicleData.id}`);
        },
        onCancel: () => setConfirmOpen(false)
      });
      setConfirmOpen(true);
    }
  };

  return (
    <>
      <Card 
        className="tw:bg-white tw:shadow-lg tw:transition-all tw:duration-300 tw:mb-1.5"
        sx={{ 
          width: '50vw', 
          height: vehicleData.promotion === 1 && vehicleData.schedule ? 'auto' : '15vh',
          minWidth: 500,
          minHeight: vehicleData.promotion === 1 && vehicleData.schedule ? 280 : 200,
          
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease, height 0.3s ease',
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
                  className=" tw:mb-3 tw:group"
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
                
                {/* Posted Date and Views */}
                <Box className="tw:flex tw:justify-between tw:items-center tw:pt-2 tw:border-t tw:border-gray-300">
                  {/* Views Count */}
                  <Box className="tw:flex tw:items-center tw:gap-1">
                    <Visibility 
                      fontSize="small" 
                      style={{ color: '#7bb1d2', fontSize: '16px' }}
                    />
                    <Typography 
                      variant="caption" 
                      className="tw:text-gray-500 tw:text-xs"
                      fontSize={12}
                    >
                      {vehicleData.views || 0} views
                    </Typography>
                  </Box>

                  {/* Posted Date */}
                  <Typography 
                    variant="caption" 
                    className="tw:text-gray-500 tw:text-xs"
                    fontSize={12}
                  >
                    Posted: {vehicleData.postedDate}
                  </Typography>
                </Box>

                {/* Bump info (only when promoted) */}
                {vehicleData.promotion === 1 && vehicleData.schedule && (
                  <Box className="tw:mt-2 tw:pt-2 tw:border-t tw:border-gray-200">
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="caption" className="tw:text-gray-600" fontSize={12}>
                          First bump: {formatDateTime(
                            vehicleData.schedule.createdAt ||
                            vehicleData.schedule.lastBumpTime ||
                            vehicleData.schedule.nextBumpTime
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" className="tw:text-gray-600" fontSize={12}>
                          Last bump: {formatDateTime(vehicleData.schedule.lastBumpTime)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" className="tw:text-gray-600" fontSize={12}>
                          Next bump: {formatDateTime(vehicleData.schedule.nextBumpTime)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" className="tw:text-gray-600" fontSize={12}>
                          Remaining bumps: {vehicleData.schedule.remainingBumps ?? 0}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}

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
                  onClick={vehicleData.promotion === 1 ? undefined : () => handleConfirm('promote')}
                  disabled={vehicleData.promotion === 1}
                  className="tw:px-3 tw:py-2 tw:text-white tw:font-bold tw:border-none tw:rounded-md tw:transition-all tw:duration-200 tw:w-30"
                  style={{
                    background: vehicleData.promotion === 1 
                      ? '#9ca3af' 
                      : 'linear-gradient(135deg, #059669, #047857)',
                    fontSize: '14px',
                    cursor: vehicleData.promotion === 1 ? 'not-allowed' : 'pointer',
                    opacity: vehicleData.promotion === 1 ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (vehicleData.promotion !== 1) {
                      e.target.style.background = 'linear-gradient(135deg, #047857, #065f46)';
                      e.target.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (vehicleData.promotion !== 1) {
                      e.target.style.background = 'linear-gradient(135deg, #059669, #047857)';
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {vehicleData.promotion === 1 ? 'Promoted' : 'Promote'}
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