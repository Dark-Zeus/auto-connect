import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableRow, 
  Button, 
  Typography, 
  Box, 
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Phone, 
  Email, 
  Facebook, 
  Message, 
  Sms,
  Visibility,
  WhatsApp
} from '@mui/icons-material';
import WhatsAppSVG from '../../assets/images/whatsapp.svg';

// Import SVG icons (these would be your actual imports)
const MobileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 2H7C5.9 2 5 2.9 5 4V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V4C19 2.9 18.1 2 17 2ZM17 18H7V6H17V18Z" fill="currentColor"/>
  </svg>
);

const VehicleDetails = ({ vehicle }) => {

  const vehicleData = vehicle || {
    name: 'lomitha',
    mobile: '0767120123',
    district: 'Matara',
    city: 'Matara',
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
    description: 'A well-maintained car with good fuel efficiency.',
    views: '2164'
  };

  const [showMobile, setShowMobile] = useState(false);
  const [views] = useState(parseInt(vehicleData.views) || 0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatOdometer = (mileage) => {
    if (!mileage || mileage === '') return 'N/A';
    return `${parseInt(mileage).toLocaleString()} km`;
  };

  const handleShowMobile = () => {
    setShowMobile(!showMobile);
  };

  const [animatedViews, setAnimatedViews] = useState(0);

  React.useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = views / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= views) {
        setAnimatedViews(views);
        clearInterval(timer);
        } else {
        setAnimatedViews(Math.floor(current));
        }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [views]);

  const vehicleDetailsData = [
    { label: 'Ongoing Leasing', value: vehicleData.ongoingLease ? 'Yes' : 'No' },
    { label: 'Manufacturer', value: vehicleData.make || 'N/A' },
    { label: 'Model', value: vehicleData.model || 'N/A' },
    { label: 'Model Year', value: vehicleData.year || 'N/A' },
    { label: 'Registered Year', value: vehicleData.registeredYear || 'N/A' },
    { label: 'Condition', value: vehicleData.condition || 'N/A' },
    { label: 'Transmission', value: vehicleData.transmission || 'N/A' },
    { label: 'Fuel Type', value: vehicleData.fuelType || 'N/A' },
    { label: 'Engine Capacity', value: vehicleData.engineCapacity ? `${vehicleData.engineCapacity} CC` : 'N/A' },
    { label: 'Mileage', value: vehicleData.mileage ? formatOdometer(vehicleData.mileage) : 'N/A' }
  ];

  return (
    <div className="tw:max-w-4xl tw:mx-auto tw:p-4 tw:bg-white">
      {/* Main Price and Contact Section */}
      <Card className="tw:mb-6 tw:shadow-lg tw:border-0 tw:bg-gradient-to-br tw:from-blue-50 tw:to-purple-50">
        <CardContent className="tw:p-6">
          <div className="tw:flex tw:items-center tw:gap-6">
            {/* Price Section */}
            <div className="tw:flex-1">
              <Typography variant="h3" className="tw:font-bold tw:text-purple-900 tw:mb-1">
                {vehicleData.price ? formatPrice(vehicleData.price) : 'Negotiable'}
              </Typography>
            </div>

            {/* Vertical Divider */}
            <div className="tw:w-px tw:h-24 tw:bg-gradient-to-b tw:from-blue-400 tw:to-purple-400"></div>

            {/* Contact Section */}
            <div className="tw:flex tw:gap-4">
              {/* Phone Contact */}
              <div className="tw:flex-1 tw:max-w-xs">
                <Button
                  onClick={handleShowMobile}
                  className="tw:flex tw:items-center tw:gap-3 tw:p-3 tw:bg-white tw:text-gray-700 tw:border tw:border-gray-200 tw:rounded-lg tw:shadow-sm hover:tw:shadow-md tw:transition-all tw:w-full"
                  style={{ textTransform: 'none' }}
                >
                  <MobileIcon />
                  <div className="tw:text-left">
                    <Typography variant="h6" className="tw:font-bold tw:text-gray-900">
                      {showMobile ? (vehicleData.mobile || '0767120123') : '07XXXXXXXX'}
                    </Typography>
                    <Typography variant="caption" className="tw:text-gray-600">
                      Click to View Phone Number
                    </Typography>
                  </div>
                </Button>
              </div>

              {/* Email Inquiry */}
              <div className="tw:flex-1">
                <Button
                  href={vehicleData.inquiryUrl || "https://www.patpat.lk/Inquiry/1486540"}
                  className="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:p-4 tw:bg-gradient-to-r tw:from-blue-600 tw:to-purple-600 tw:text-white tw:rounded-lg tw:shadow-md hover:tw:shadow-lg tw:transition-all tw:w-full"
                  style={{ textTransform: 'none', color: 'white'}}
                >
                  <Email />
                  <Typography variant="body1" className="tw:font-medium">
                    Inquire Now
                  </Typography>
                </Button>
              </div>
            </div>
          </div>
            
          {/* WhatsApp Section */}
          <div className="tw:mt-4 tw:p-4 tw:bg-gradient-to-r tw:from-green-50 tw:to-emerald-50 tw:rounded-lg">
            <Button
                href={`https://api.whatsapp.com/send?phone=94${vehicleData.mobile?.replace(/^0/, '') || '767120123'}`}
                target="_blank"
                className="tw:flex tw:items-center tw:justify-center tw:gap-3 tw:p-3 tw:bg-green-600 tw:text-white tw:rounded-lg tw:shadow-md hover:tw:shadow-lg tw:transition-all tw:w-full"
                style={{ textTransform: 'none'}}
            >
                <img src={WhatsAppSVG} alt="WhatsApp" className="tw:w-6 tw:h-6" />
                <Typography variant="body1" className="tw:font-medium">
                Connect on WhatsApp
                </Typography>
            </Button>
          </div>

          {/* Views Section */}
          <div className="tw:mt-4 tw:p-4 tw:bg-gradient-to-r tw:from-blue-200 tw:to-purple-200 tw:rounded-lg">
            <div className="tw:flex tw:items-center tw:justify-center tw:gap-3 tw:text-gray-800">
                <Visibility className="tw:w-12 tw:h-12 tw:fill-current" style={{ color: '#000000' }} />
                <Typography 
                variant="h5" 
                className="tw:font-black tw:text-gray-900"
                style={{ fontSize: '2rem', fontWeight: 500 }}
                >
                {animatedViews.toLocaleString()} views
                </Typography>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Details Table */}
      <Card className="tw:mb-6 tw:shadow-lg tw:border-0">
        <CardContent className="tw:p-0">
          <Table>
            <TableBody>
              {vehicleDetailsData.map((item, index) => (
                <TableRow 
                  key={index}
                  className={`${index % 2 === 0 ? 'tw:bg-gray-50' : 'tw:bg-white'} hover:tw:bg-blue-50 tw:transition-colors`}
                >
                  <TableCell 
                    component="th" 
                    scope="row" 
                    className="tw:font-bold tw:text-gray-700 tw:py-4 tw:px-6 tw:border-r tw:border-gray-200"
                  >
                    {item.label}
                  </TableCell>
                  <TableCell className="tw:text-gray-900 tw:py-4 tw:px-6">
                    {item.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Share Section */}
      <Card className="tw:shadow-lg tw:border-0 tw:bg-gradient-to-br tw:from-indigo-50 tw:to-purple-50">
        <CardContent className="tw:p-6 tw:text-center">
          <Typography variant="h6" className="tw:mb-4 tw:text-gray-700 tw:font-bold">
            Suggest this advertisement to a friend on
          </Typography>
          
          <div className="tw:flex tw:items-center tw:justify-center tw:gap-4 tw:flex-wrap">
            <Tooltip title="Facebook">
              <IconButton 
                href={vehicleData.facebookShareUrl || "https://www.facebook.com/sharer.php?u=https://patpat.lk/vehicle/car/Fiat/Linea/2011/fiat-linea/1384302"}
                target="_blank"
                className="tw:bg-blue-600 tw:text-white hover:tw:bg-blue-700 tw:shadow-md hover:tw:shadow-lg tw:transition-all"
              >
                <Facebook />
              </IconButton>
            </Tooltip>

            <div className="tw:w-px tw:h-6 tw:bg-gray-300"></div>

            <Tooltip title="Messenger">
              <IconButton 
                href={vehicleData.messengerUrl || "fb-messenger://share?link=https://patpat.lk/vehicle/car/Fiat/Linea/2011/fiat-linea/1384302"}
                className="tw:bg-blue-500 tw:text-white hover:tw:bg-blue-600 tw:shadow-md hover:tw:shadow-lg tw:transition-all"
              >
                <Message />
              </IconButton>
            </Tooltip>

            <div className="tw:w-px tw:h-6 tw:bg-gray-300"></div>

            <Tooltip title="WhatsApp">
              <IconButton 
                href={vehicleData.whatsappShareUrl || "https://api.whatsapp.com/send?phone=940768795255"}
                target="_blank"
                className="tw:bg-green-600 tw:text-white hover:tw:bg-green-700 tw:shadow-md hover:tw:shadow-lg tw:transition-all"
              >
                <WhatsApp />
              </IconButton>
            </Tooltip>

            <div className="tw:w-px tw:h-6 tw:bg-gray-300"></div>

            <Tooltip title="SMS">
              <IconButton 
                href={vehicleData.smsShareUrl || "sms:?body=https://www.patpat.lk/vehicle/car/Fiat/Linea/2011/fiat-linea/1384302"}
                target="_blank"
                className="tw:bg-purple-600 tw:text-white hover:tw:bg-purple-700 tw:shadow-md hover:tw:shadow-lg tw:transition-all"
              >
                <Sms />
              </IconButton>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleDetails;