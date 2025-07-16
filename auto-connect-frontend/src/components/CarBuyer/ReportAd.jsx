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
import { ReportProblem } from '@mui/icons-material';

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
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '24px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.08)',
            background: 'linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            backdropFilter: 'blur(10px)',
            overflow: 'hidden'
          },
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(8px)'
          }
        }}
      >
        <DialogTitle className="tw:p-0 tw:m-0">
          <div className="tw:bg-gradient-to-br tw:from-blue-400 tw:to-indigo-400 tw:text-white tw:p-3 tw:text-center tw:relative tw:overflow-hidden tw:rounded-2xl">
            <div className="tw:absolute tw:inset-0 tw:bg-black tw:opacity-5"></div>
            <div className="tw:relative tw:z-10">
              <div className="tw:inline-flex tw:items-center tw:justify-center tw:w-16 tw:h-16 tw:bg-white tw:bg-opacity-20 tw:rounded-full tw:mb-4">
                <ReportProblem className="tw:w-8 tw:h-8 tw:text-black" fill="currentColor" viewBox="0 0 24 24"/>                  
              </div>
              <Typography variant="h4" className="tw:font-bold tw:text-white tw:mb-2">
                Report Advertisement
              </Typography>
              <Typography variant="body1" className="tw:text-white tw:text-opacity-90 tw:font-medium">
                Help us maintain a safe marketplace
              </Typography>
            </div>
          </div>
        </DialogTitle>

        <DialogContent className="tw:p-6 tw:space-y-6">
          <div className="tw:text-center tw:mb-3">
            <Typography variant="body1" className="tw:text-slate-600 tw:leading-relaxed">
              Your report helps us keep the community safe and trustworthy for everyone.
            </Typography>
          </div>

          {vehicleData.make && vehicleData.model && (
            <div className="tw:relative tw:overflow-hidden tw:bg-gradient-to-br tw:from-blue-50 tw:to-indigo-50 tw:rounded-2xl tw:border tw:border-blue-100 tw:shadow-sm">
              <div className="tw:absolute tw:top-0 tw:left-0 tw:w-full tw:h-1 tw:bg-gradient-to-r tw:from-blue-500 tw:to-indigo-500"></div>
              <div className="tw:p-4">
                <div className="tw:space-y-4">
                  <div>
                    <div className="tw:flex tw:items-center tw:mb-2">
                      <div className="tw:w-3 tw:h-3 tw:bg-blue-500 tw:rounded-full tw:mr-3"></div>
                      <Typography variant="subtitle1" className="tw:text-slate-700 tw:font-semibold tw:text-lg">
                        Reporting Vehicle
                      </Typography>
                    </div>
                    <div className="tw:flex tw:flex-wrap tw:gap-2">
                      <span className="tw:bg-white tw:text-slate-700 tw:px-4 tw:py-2 tw:rounded-full tw:text-sm tw:font-medium tw:shadow-sm">
                        {vehicleData.make} {vehicleData.model} {vehicleData.year}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="tw:flex tw:items-center tw:mb-2">
                      <div className="tw:w-3 tw:h-3 tw:bg-blue-500 tw:rounded-full tw:mr-3"></div>
                      <Typography variant="subtitle1" className="tw:text-slate-700 tw:font-semibold tw:text-lg">
                        Ad Reference
                      </Typography>
                    </div>
                    <div className="tw:flex tw:flex-wrap tw:gap-2">
                      <span className="tw:bg-white tw:text-slate-700 tw:px-4 tw:py-2 tw:rounded-full tw:text-sm tw:font-medium tw:shadow-sm">
                        #ad_245es5d9
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="tw:space-y-8">
            <FormControl fullWidth size="large">
              <InputLabel className="tw:text-slate-600 tw:font-medium">
                What's the issue? *
              </InputLabel>
              <Select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                label="What's the issue? *"
                className="tw:rounded-2xl"
                sx={{
                  marginBottom: 2,
                  borderRadius: '16px',
                  background: '#ffffff',
                  transition: 'all 0.3s ease',
                  '& fieldset': {
                    borderColor: '#e2e8f0',
                    borderWidth: '2px'
                  },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    background: '#ffffff',
                    transition: 'all 0.3s ease',
                    '& fieldset': {
                      borderColor: '#e2e8f0',
                      borderWidth: '2px'
                    },
                    '&:hover fieldset': {
                      borderColor: '#cbd5e1'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                      borderWidth: '2px'
                    }
                  }
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: '16px',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e2e8f0',
                      marginTop: '8px',
                      '& .MuiMenuItem-root': {
                        borderRadius: '8px',
                        margin: '4px 8px',
                        padding: '12px 16px',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#f1f5f9',
                          transform: 'translateX(4px)'
                        },
                        '&.Mui-selected': {
                          backgroundColor: '#dbeafe',
                          color: '#1e40af',
                          fontWeight: 600
                        }
                      }
                    }
                  }
                }}
              >
                {reportReasons.map((reason, index) => (
                  <MenuItem key={index} value={reason}>
                    {reason}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Additional details (optional)"
              multiline
              rows={4}
              fullWidth
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="Please provide more details about the issue..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  background: '#ffffff',
                  transition: 'all 0.3s ease',
                  '& fieldset': {
                    borderColor: '#e2e8f0',
                    borderWidth: '2px'
                  },
                  '&:hover fieldset': {
                    borderColor: '#cbd5e1'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6',
                    borderWidth: '2px'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#64748b',
                  fontWeight: 500
                }
              }}
            />
          </div>

          <div className="tw:bg-amber-50 tw:border tw:border-amber-200 tw:rounded-2xl tw:p-4">
            <div className="tw:flex tw:items-start tw:space-x-3">
              <div className="tw:flex-shrink-0">
                <svg className="tw:w-4 tw:h-4 tw:text-amber-600 tw:mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div>
                <Typography variant="body2" className="tw:text-amber-800 tw:font-medium tw:mb-1">
                  Review Process
                </Typography>
                <Typography variant="body2" className="tw:text-amber-700 tw:text-sm tw:leading-relaxed">
                  Our team will review your report within 24-48 hours.
                </Typography>
              </div>
            </div>
          </div>
        </DialogContent>

        <DialogActions className="tw:p-4 tw:pt-0 tw:gap-4">
          <div className="tw:flex tw:w-full tw:space-x-4 tw:gap-8 tw:justify-between">
            <Button
              onClick={handleCancel}
              variant="outlined"
              className="tw:flex-1 tw:h-14 tw:font-semibold tw:text-base tw:!text-white"
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                backgroundColor: '#dc2626', // Tailwind's red-600 (approximate, actual is #e53935)
                transition: 'all 0.3s ease',
                borderWidth: '2px',
                borderColor: '#dc2626', // Match normal background for border
                '&:hover': {
                  borderColor: '#b91c1c', // Tailwind's red-800 (approximate, actual is #c62828)
                  backgroundColor: '#b91c1c', // Tailwind's red-800 (approximate, actual is #c62828)
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)' // Adjusted for red-600 shadow
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
             // disabled={!reportReason}
              className="tw:flex-1 tw:h-14 tw:font-semibold tw:text-base tw:text-white"
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', // blue-600 to blue-700 equivalent
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)', // blue-700 to blue-800 equivalent
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(37, 99, 235, 0.4)' // Adjusted for blue shadow
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
                  color: 'white',
                  opacity: 0.7
                }
              }}
            >
              Submit Report
            </Button>
          </div>
        </DialogActions>
      </Dialog>

    {/*  <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '14px',
            '& .MuiAlert-icon': {
              color: 'white !important'
            },
            ...(snackbarSeverity === 'success' && {
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)'
            }),
            ...(snackbarSeverity === 'error' && {
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)'
            })
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar> */}
    </>
  );
};

export default ReportAd;