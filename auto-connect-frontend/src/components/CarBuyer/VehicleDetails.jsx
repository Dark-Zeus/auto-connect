import React, { useState, useEffect } from 'react';
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
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Phone, 
  Email, 
  Facebook, 
  Message, 
  Sms,
  Visibility,
  WhatsApp,
  Report,
  Bookmark,
  BookmarkBorder,
  Flag,
  Save
} from '@mui/icons-material';
import WhatsAppSVG from '../../assets/images/whatsapp.svg';
import ReportAd from '@components/CarBuyer/ReportAd';
import Inquire from '@components/CarBuyer/Inquire';
import buyVehicleAPI from "../../services/buyVehicleApiService";

// Import SVG icons (these would be your actual imports)
const MobileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 2H7C5.9 2 5 2.9 5 4V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V4C19 2.9 18.1 2 17 2ZM17 18H7V6H17V18Z" fill="currentColor"/>
  </svg>
);

const VehicleDetails = ({ vehicle }) => {

  const vehicleData = vehicle || {};

  const [showMobile, setShowMobile] = useState(false);
  const [views] = useState(parseInt(vehicleData.views) || 0);
  const [isSaved, setIsSaved] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [inquireDialogOpen, setInquireDialogOpen] = useState(false);
  const [alreadyReported, setAlreadyReported] = useState(false);

  const formatPrice = (price) => {
    if (!price) return 'Negotiable';
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

  useEffect(() => {
  if (vehicle && vehicle._id) {
    // Store vehicle ID for debugging
    console.log("Checking if vehicle is saved:", vehicle._id);
    
    // Define async function to check saved status
    async function checkSavedStatus() {
      try {
        // Get all saved ads
        const savedAds = await buyVehicleAPI.fetchSavedAds();
        console.log("Retrieved saved ads:", savedAds);
        
        // Check if current vehicle is in saved ads
        let found = false;
        
        if (Array.isArray(savedAds)) {
          savedAds.forEach(ad => {
            // Check different possible formats of vehicleId
            if (
              (ad.vehicleId === vehicle._id) || 
              (ad.vehicleId?._id === vehicle._id) ||
              (ad._id === vehicle._id)
            ) {
              found = true;
              console.log("Found vehicle in saved ads:", ad);
            }
          });
        }
        
        console.log("Setting isSaved to:", found);
        setIsSaved(found);
      } catch (error) {
        console.error("Error checking saved status:", error);
        setIsSaved(false);
      }
    }
    
    // Call the async function
    checkSavedStatus();
  }
}, [vehicle]);

  const handleSaveAd = async () => {
    try {
      if (isSaved) {
        await buyVehicleAPI.unsaveAd(vehicle._id);
        setIsSaved(false);
        setSnackbarMessage('Advertisement unsaved successfully');
        setSnackbarSeverity('info');
      } else {
        await buyVehicleAPI.saveAd(vehicle._id);
        setIsSaved(true);
        setSnackbarMessage('Advertisement saved successfully');
        setSnackbarSeverity('success');
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error toggling save ad:", error);
      setSnackbarMessage(error.message || 'Failed to update advertisement');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleReportAd = async () => {
    if (!vehicleData._id) return;
    try {
      const reported = await buyVehicleAPI.checkIfReported(vehicleData._id);
      if (reported) {
        setAlreadyReported(true);
        setSnackbarMessage("You've already reported this advertisement.");
        setSnackbarSeverity('info');
        setSnackbarOpen(true);
      } else {
        setReportDialogOpen(true);
      }
    } catch (error) {
      setSnackbarMessage(error.message || "Failed to check report status");
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleReportSubmit = async (reportData) => {
    try {
      await buyVehicleAPI.reportAd({
        adId: vehicleData._id,
        issue: reportData.issue,
        details: reportData.details
      });
      setReportDialogOpen(false);
      setSnackbarMessage('Report submitted successfully. We will review it shortly.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      if (error.message === "You have already reported this ad.") {
        setReportDialogOpen(false);
        setSnackbarMessage(error.message);
        setSnackbarSeverity('info');
        setSnackbarOpen(true);
        setAlreadyReported(true);
      } else {
        setSnackbarMessage(error.message || 'Failed to submit report');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
  };

  const handleReportClose = () => {
    setReportDialogOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setAlreadyReported(false);
  };

  const [animatedViews, setAnimatedViews] = useState(0);

  const handleInquireSubmitSuccess = (formData) => {
    // Show success message
    setSnackbarMessage(`Your inquiry was successfully sent to the seller. Check your email for updates.`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

    const handleInquireOpen = () => {
    setInquireDialogOpen(true); // Open Inquire dialog
  };

  const handleInquireClose = () => {
    setInquireDialogOpen(false); // Close Inquire dialog
  };

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
    //{ label: 'Registered Year', value: vehicleData.registeredYear || 'N/A' },
    { label: 'Condition', value: vehicleData.condition || 'N/A' },
    { label: 'Transmission', value: vehicleData.transmission || 'N/A' },
    { label: 'Fuel Type', value: vehicleData.fuelType || 'N/A' },
    { label: 'Engine Capacity', value: vehicleData.engineCapacity ? `${vehicleData.engineCapacity} CC` : 'N/A' },
    { label: 'Mileage', value: vehicleData.mileage ? formatOdometer(vehicleData.mileage) : 'N/A' }
  ];

  return (
    <div className="tw:w-full tw:p-2 sm:tw:p-4 tw:space-y-4">
      {/* Main Price and Contact Section */}
      <div className="tw:shadow-sm tw:border-gray-200 tw:rounded-xl tw:border tw:bg-white">
        <CardContent className="tw:p-3 sm:tw:p-6">
          {/* Mobile Layout - Stack vertically */}
          <div className="tw:block md:tw:hidden tw:space-y-4">
            {/* Price Section */}
            <div className="tw:text-center">
              <Typography variant="h4" className="tw:text-bold tw:text-[#4a618a] tw:mb-2">
                {vehicleData.price ? formatPrice(vehicleData.price) : 'Negotiable'}
              </Typography>
            </div>

            {/* Contact Buttons - Stack vertically on mobile */}
            <div className="tw:space-y-3">
              {/* Phone Contact */}
              <Button
                onClick={handleShowMobile}
                className="tw:flex tw:items-center tw:gap-3 tw:p-3 tw:bg-gray-50 tw:text-gray-700 tw:border tw:border-gray-200 tw:rounded-lg tw:shadow-sm hover:tw:shadow-md tw:transition-all tw:w-full"
                style={{ textTransform: 'none' }}
              >
                <MobileIcon />
                <div className="tw:text-left tw:flex-1">
                  <Typography variant="body1" className="tw:font-bold tw:text-gray-900">
                    {showMobile ? (vehicleData.mobile || '0767120123') : '07XXXXXXXX'}
                  </Typography>
                  <Typography variant="caption" className="tw:text-gray-600">
                    Click to View Phone Number
                  </Typography>
                </div>
              </Button>

              {/* Email Inquiry */}
              <Button
                onClick={handleInquireOpen} // Trigger Inquire component
                className="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:p-3 tw:bg-[linear-gradient(135deg,var(--sky-blue),var(--navy-blue))] tw:text-white tw:rounded-lg tw:shadow-md tw:hover:bg-[linear-gradient(135deg,var(--navy-blue),var(--sky-blue))] tw:transition-all tw:w-full"
                style={{ textTransform: 'none', color: 'white'}}
              >
                <Email />
                <Typography variant="body1" className="tw:font-medium">
                  Enquire Now
                </Typography>
              </Button>
            </div>
          </div>
            
          {/* WhatsApp Section */}
          <div className="tw:mt-4 tw:p-3 sm:tw:p-4 tw:bg-gradient-to-r tw:from-green-50 tw:to-emerald-50 tw:rounded-lg">
            <Button
                href={`https://api.whatsapp.com/send?phone=94${vehicleData.mobile?.replace(/^0/, '') || '767120123'}`}
                target="_blank"
                className="tw:flex tw:items-center tw:justify-center tw:gap-3 tw:p-3 tw:bg-green-500 tw:text-white tw:rounded-lg tw:shadow-md hover:tw:shadow-lg tw:transition-all tw:w-full"
                style={{ textTransform: 'none'}}
            >
                <img src={WhatsAppSVG} alt="WhatsApp" className="tw:w-6 tw:h-6" />
                <Typography variant="body1" className="tw:font-medium">
                Connect on WhatsApp
                </Typography>
            </Button>
          </div>

          {/* Views Section */}
          <div className="tw:mt-4 tw:p-3 sm:tw:p-4 tw:bg-gradient-to-r tw:from-slate-100 tw:to-blue-50 tw:rounded-lg">
            <div className="tw:flex tw:items-center tw:justify-center tw:gap-3 tw:text-gray-800">
                <Visibility className="tw:w-8 tw:h-8 sm:tw:w-10 sm:tw:h-10 tw:fill-current" style={{ color: '#475569' }} />
                <Typography 
                variant="h6" 
                className="tw:font-bold tw:text-slate-600"
                style={{ fontSize: '1.25rem', fontWeight: 600 }}
                >
                {animatedViews.toLocaleString()} views
                </Typography>
            </div>
          </div>
        </CardContent>
      </div>

      {/* Vehicle Details Table */}
      <div className="tw:shadow-sm tw:border tw:border-gray-200 tw:rounded-xl tw:bg-white">
        <CardContent className="tw:p-0">
          <Table>
            <TableBody>
              {vehicleDetailsData.map((item, index) => (
                <TableRow 
                  key={index}
                  className={`${index % 2 === 0 ? 'tw:bg-slate-50' : 'tw:bg-white'} hover:tw:bg-blue-50 tw:transition-colors`}
                >
                  <TableCell 
                    component="th" 
                    scope="row" 
                    className="tw:font-semibold tw:text-slate-700 tw:py-3 tw:px-3 sm:tw:py-4 sm:tw:px-6 tw:border-r tw:border-gray-200 tw:text-sm sm:tw:text-base"
                  >
                    {item.label}
                  </TableCell>
                  <TableCell className="tw:text-slate-900 tw:py-3 tw:px-3 sm:tw:py-4 sm:tw:px-6 tw:font-medium tw:text-sm sm:tw:text-base">
                    {item.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </div>

      {/* Share Section */}
      <div className="tw:shadow-sm tw:border tw:border-gray-200 tw:rounded-xl tw:bg-white">
        <CardContent className="tw:p-4 sm:tw:p-6 tw:text-center">
          <Typography variant="h6" className="tw:mb-4 tw:text-slate-700 tw:font-bold tw:text-sm sm:tw:text-base">
            Suggest this advertisement to a friend on
          </Typography>
          
          <div className="tw:flex tw:items-center tw:justify-center tw:gap-2 sm:tw:gap-4 tw:flex-wrap">
            <Tooltip title="Facebook">
              <IconButton 
                href={vehicleData.facebookShareUrl || "https://www.facebook.com/sharer.php?u=https://patpat.lk/vehicle/car/Fiat/Linea/2011/fiat-linea/1384302"}
                target="_blank"
                className="tw:bg-blue-600 tw:text-white hover:tw:bg-blue-700 tw:shadow-md hover:tw:shadow-lg tw:transition-all tw:w-10 tw:h-10 sm:tw:w-12 sm:tw:h-12"
              >
                <Facebook className="tw:w-5 tw:h-5 sm:tw:w-6 sm:tw:h-6" />
              </IconButton>
            </Tooltip>

            <div className="tw:w-px tw:h-6 tw:bg-gray-300"></div>

            <Tooltip title="Messenger">
              <IconButton 
                href={vehicleData.messengerUrl || "fb-messenger://share?link=https://patpat.lk/vehicle/car/Fiat/Linea/2011/fiat-linea/1384302"}
                className="tw:bg-blue-500 tw:text-white hover:tw:bg-blue-600 tw:shadow-md hover:tw:shadow-lg tw:transition-all tw:w-10 tw:h-10 sm:tw:w-12 sm:tw:h-12"
              >
                <Message className="tw:w-5 tw:h-5 sm:tw:w-6 sm:tw:h-6" />
              </IconButton>
            </Tooltip>

            <div className="tw:w-px tw:h-6 tw:bg-gray-300"></div>

            <Tooltip title="WhatsApp">
              <IconButton 
                href={vehicleData.whatsappShareUrl || "https://api.whatsapp.com/send?phone=940768795255"}
                target="_blank"
                className="tw:bg-green-600 tw:text-white hover:tw:bg-green-700 tw:shadow-md hover:tw:shadow-lg tw:transition-all tw:w-10 tw:h-10 sm:tw:w-12 sm:tw:h-12"
              >
                <WhatsApp className="tw:w-5 tw:h-5 sm:tw:w-6 sm:tw:h-6" />
              </IconButton>
            </Tooltip>
           
          </div>
        </CardContent>
      </div>

      {/* Report and Save Section */}
      <div className="tw:shadow-sm tw:border tw:border-gray-200 tw:rounded-xl tw:bg-white">
        <CardContent className="tw:p-4 sm:tw:p-6">
          <div className="tw:flex tw:flex-col sm:tw:flex-row tw:gap-4 tw:items-center tw:justify-center">
            {/* Save Advertisement Button */}
            <Button
              onClick={handleSaveAd}
              className={`tw:flex tw:items-center tw:justify-center tw:gap-2 tw:p-3 tw:rounded-lg tw:shadow-md hover:tw:shadow-lg tw:transition-all tw:w-full sm:tw:w-auto ${
                isSaved 
                  ? 'tw:bg-amber-500 tw:text-white hover:tw:bg-amber-600' 
                  : 'tw:bg-white tw:text-amber-600 tw:border tw:border-amber-400 hover:tw:bg-amber-50'
              }`}
              style={{ textTransform: 'none' }}
            >
              {isSaved ? <Bookmark className="tw:w-5 tw:h-5" /> : <BookmarkBorder className="tw:w-5 tw:h-5" />}
              <Typography variant="body1" className="tw:font-medium">
                {isSaved ? 'Saved' : 'Save Advertisement'}
              </Typography>
            </Button>

            {/* Vertical Divider for Desktop */}
            <div className="tw:hidden sm:tw:block tw:w-px tw:h-12 tw:bg-gray-300"></div>

            {/* Report Advertisement Button */}
            <Button
              onClick={handleReportAd}
              className="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:p-3 tw:bg-white tw:text-red-600 tw:border tw:border-red-400 tw:rounded-lg tw:shadow-md hover:tw:bg-red-50 hover:tw:shadow-lg tw:transition-all tw:w-full sm:tw:w-auto"
              style={{ textTransform: 'none' }}
            >
              <Flag className="tw:w-5 tw:h-5" />
              <Typography variant="body1" className="tw:font-medium">
                Report Advertisement
              </Typography>
            </Button>
          </div>
        </CardContent>
      </div>

      {/* Inquire Dialog */}
      <Inquire 
        open={inquireDialogOpen}
        onClose={handleInquireClose}
        vehicleData={vehicleData}
        onSubmitSuccess={handleInquireSubmitSuccess}
      />

      {/* Report Dialog */}
      <ReportAd
        open={reportDialogOpen}
        onClose={handleReportClose}
        vehicleData={{
          _id: vehicleData._id,
          make: vehicleData.make,
          model: vehicleData.model,
          year: vehicleData.year
        }}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          className="tw:w-full"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default VehicleDetails;