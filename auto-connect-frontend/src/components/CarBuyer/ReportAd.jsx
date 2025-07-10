import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';

const ReportAd = ({
  open,
  onClose,
  onSubmit,
  vehicleData = {}
}) => {
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const reportReasons = [
    'Spam or fake listing',
    'Inappropriate content',
    'Scam or fraud',
    'Wrong category',
    'Duplicate listing',
    'Misleading information',
    'Other'
  ];

  const handleSubmit = () => {
    if (!reportReason) {
      setSnackbarMessage('Please select a reason for reporting');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const reportData = {
      reason: reportReason,
      description: reportDescription,
      vehicleId: vehicleData.id,
      vehicleMake: vehicleData.make,
      vehicleModel: vehicleData.model,
      reportedAt: new Date().toISOString()
    };

    if (onSubmit) {
      onSubmit(reportData);
    }

    setReportReason('');
    setReportDescription('');
    setSnackbarMessage('Report submitted successfully. We will review it shortly.');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);

    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleCancel = () => {
    setReportReason('');
    setReportDescription('');
    onClose();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleCancel}
        maxWidth="sm"
        fullWidth
        // Modern Dialog Styling
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '16px', // More pronounced rounded corners
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)', // Deeper, softer shadow
            background: 'linear-gradient(145deg, #f0f4f8, #ffffff)', // Subtle gradient background
            border: 'none', // Remove default border
            overflow: 'hidden' // Ensure content respects border-radius
          }
        }}
      >
        <DialogTitle className="tw:text-center tw:font-extrabold tw:text-gray-800 tw:text-2xl tw:py-6 tw:relative">
          Report Advertisement
          <span className="tw:block tw:w-16 tw:h-1 tw:bg-blue-500 tw:mx-auto tw:mt-2 tw:rounded-full"></span> {/* Underline effect */}
        </DialogTitle>

        <DialogContent className="tw:p-6 sm:tw:p-8 tw:space-y-6">
          <Typography variant="body1" className="tw:text-gray-600 tw:leading-relaxed tw:text-center">
            Help us maintain a safe and trustworthy marketplace by reporting inappropriate content.
          </Typography>

          {vehicleData.make && vehicleData.model && (
            <div className="tw:p-5 tw:bg-white tw:rounded-xl tw:border tw:border-blue-100 tw:shadow-sm">
              <Typography variant="subtitle1" className="tw:text-blue-600 tw:font-semibold">
                Reporting: <span className="tw:font-bold">{vehicleData.make} {vehicleData.model} {vehicleData.year}</span>
              </Typography>
              {vehicleData.price && (
                <Typography variant="subtitle1" className="tw:text-blue-600 tw:mt-1 tw:font-medium">
                  Price: <span className="tw:font-bold">{vehicleData.price}</span>
                </Typography>
              )}
              <Typography variant="subtitle1" className="tw:text-blue-600 tw:mt-1 tw:font-medium">
                  Ad Reference: <span className="tw:font-bold">#ad_245es5d9</span>
                </Typography>
            </div>
          )}

          <FormControl fullWidth size="medium" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#ffffff', '& fieldset': { borderColor: '#e0e0e0' }, '&:hover fieldset': { borderColor: '#a0a0a0' }, '&.Mui-focused fieldset': { borderColor: '#4299e1', borderWidth: '2px' } } }}>
            <InputLabel className="tw:text-gray-600">Reason for reporting *</InputLabel>
            <Select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              label="Reason for reporting *"
              MenuProps={{
                PaperProps: {
                  className: "tw:rounded-xl tw:shadow-lg tw:border tw:border-gray-100 tw:mt-2"
                }
              }}
            >
              {reportReasons.map((reason, index) => (
                <MenuItem key={index} value={reason} className="hover:tw:bg-blue-50 tw:text-gray-800 tw:py-2">
                  {reason}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Additional details (optional)"
            multiline
            rows={6}
            fullWidth
            value={reportDescription}
            onChange={(e) => setReportDescription(e.target.value)}
            placeholder="Please provide more details about the issue (e.g., specific misleading information, nature of scam)..."
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { marginTop: '20px', borderRadius: '12px', background: '#ffffff', '& fieldset': { borderColor: '#e0e0e0' }, '&:hover fieldset': { borderColor: '#a0a0a0' }, '&.Mui-focused fieldset': { borderColor: '#4299e1', borderWidth: '2px' } } }}
          />

          <Typography variant="caption" className="tw:text-gray-500 tw:block tw:text-sm tw:text-center">
            * Required fields. Your report will be reviewed within 24-48 hours.
          </Typography>
        </DialogContent>

        <DialogActions className="tw:p-6 tw:gap-4 tw:border-t tw:border-gray-100 tw:flex tw:justify-end tw:bg-gray-50">
          <Button
            onClick={handleCancel}
            variant="outlined"
            className="tw:text-gray-700 tw:border-gray-300 hover:tw:bg-gray-100 tw:px-7 tw:py-3 tw:rounded-xl tw:font-medium"
            sx={{ textTransform: 'none', transition: 'all 0.3s ease' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            className="tw:bg-blue-600 tw:text-white hover:tw:bg-blue-700 tw:px-7 tw:py-3 tw:rounded-xl tw:font-medium tw:shadow-lg hover:tw:shadow-xl"
            sx={{ textTransform: 'none', transition: 'all 0.3s ease', '&:disabled': { background: '#a0aec0', color: '#ffffff' } }}
            disabled={!reportReason}
          >
            Submit Report
          </Button>
        </DialogActions>
      </Dialog>

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
          className={
            snackbarSeverity === 'success'
              ? 'tw:bg-green-500 tw:text-white tw:rounded-lg tw:shadow-md'
              : 'tw:bg-red-500 tw:text-white tw:rounded-lg tw:shadow-md'
          }
          sx={{ '& .MuiAlert-icon': { color: 'white !important' } }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ReportAd;