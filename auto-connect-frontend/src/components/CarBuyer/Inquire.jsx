import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

const Inquire = ({ open, onClose, vehicleData, onSubmitSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    enquiry: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate default inquiry message
  const generateDefaultMessage = () => {
    const make = vehicleData?.make || 'Vehicle';
    const model = vehicleData?.model || '';
    const year = vehicleData?.year || '';
    return `Hi, I'm interested in this listing, ${year} ${make} ${model}. When is a good day/time to inspect? Thanks.`;
  };

  // Initialize inquiry message when dialog opens
  React.useEffect(() => {
    if (open && vehicleData) {
      setFormData(prev => ({
        ...prev,
        enquiry: generateDefaultMessage()
      }));
    }
  }, [open, vehicleData]);

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.enquiry.trim()) {
      newErrors.enquiry = 'Enquiry message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Inquiry submitted:', formData);
      
      // Call the onSubmitSuccess callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess(formData);
      }
      
      setFormData({
        name: '',
        phone: '',
        email: '',
        enquiry: ''
      });
      setCurrentStep(1);
      onClose();
    } catch (error) {
      console.error('Error submitting inquiry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      enquiry: ''
    });
    setErrors({});
    setCurrentStep(1);
    onClose();
  };

  const progressValue = (currentStep / 2) * 100;

  if (!open) return null;

  return (
    <div className="tw:fixed tw:inset-0 tw:bg-black/50 tw:flex tw:items-center tw:justify-center tw:z-50 tw:p-4 sm:tw:p-6">
      <div className="tw:bg-white tw:rounded-xl tw:w-full tw:max-w-lg tw:mx-auto tw:shadow-2xl tw:max-h-[95vh] tw:overflow-y-auto">
        {/* Progress Bar */}
        <div className="tw:px-6 tw:pt-6">
          <div className="tw:w-full tw:bg-gray-200 tw:rounded-full tw:h-2.5">
            <div 
              className="tw:bg-blue-600 tw:h-2.5 tw:rounded-full tw:transition-all tw:duration-300"
              style={{ width: `${progressValue}%` }}
            />
          </div>
        </div>

        {/* Header */}
        <div className="tw:flex tw:items-center tw:justify-between tw:px-6 tw:pt-4 tw:pb-3">
          <h2 className="tw:text-2xl tw:font-semibold tw:text-gray-900">
            {currentStep === 1 ? 'Send Your Enquiry' : 'Your Details'}
          </h2>
          <button 
            onClick={handleClose}
            className="tw:text-gray-500 tw:hover:text-red-700 tw:p-2 tw:rounded-full tw:hover:cursor-pointer tw:transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="tw:px-6 tw:pb-6">
          {/* Step 1: Inquiry Message */}
          {currentStep === 1 && (
            <div className="tw:space-y-5">
              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-1.5">
                  Your Enquiry *
                </label>
                <textarea
                  rows={5}
                  value={formData.enquiry}
                  onChange={(e) => handleInputChange('enquiry', e.target.value)}
                  className={`tw:w-full tw:px-4 tw:py-3 tw:border tw:rounded-lg tw:bg-gray-50 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:resize-none tw:text-sm tw:text-black ${
                    errors.enquiry ? 'tw:border-red-500' : 'tw:border-gray-300'
                  }`}
                />
                {errors.enquiry && (
                  <p className="tw:text-red-500 tw:text-xs tw:mt-1.5">{errors.enquiry}</p>
                )}
              </div>

              <div className="tw:flex tw:gap-4 tw:pt-2">
                <button
                  onClick={handleClose}
                  className="tw:flex-1 tw:py-2.5 tw:text-gray-700 tw:border tw:border-gray-300 tw:rounded-lg tw:font-medium tw:hover:bg-gray-200 tw:transition-colors tw:text-sm tw:hover:cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNext}
                  className="tw:flex-1 tw:py-2.5 tw:bg-blue-600 tw:text-white tw:rounded-lg tw:font-medium tw:hover:bg-blue-800 tw:hover:cursor-pointer tw:transition-colors tw:flex tw:items-center tw:justify-center tw:gap-2 tw:text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2: User Details */}
          {currentStep === 2 && (
            <div className="tw:space-y-5">
              <div className="tw:grid tw:grid-cols-1 sm:tw:grid-cols-2 tw:gap-4">
                <div>
                  <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-1.5">
                    Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`tw:w-full tw:px-4 tw:py-2.5 tw:text-black tw:border tw:rounded-lg tw:bg-gray-50 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:text-sm ${
                      errors.name ? 'tw:border-red-500' : 'tw:border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="tw:text-red-500 tw:text-xs tw:mt-1.5">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-1.5">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`tw:w-full tw:px-4 tw:py-2.5 tw:text-black tw:border tw:rounded-lg tw:bg-gray-50 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:text-sm ${
                      errors.phone ? 'tw:border-red-500' : 'tw:border-gray-300'
                    }`}
                  />
                  {errors.phone && (
                    <p className="tw:text-red-500 tw:text-xs tw:mt-1.5">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-1.5">
                  Email *
                </label>
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`tw:w-full tw:px-4 tw:py-2.5 tw:text-black tw:border tw:rounded-lg tw:bg-gray-50 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500 focus:tw:border-transparent tw:text-sm ${
                    errors.email ? 'tw:border-red-500' : 'tw:border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="tw:text-red-500 tw:text-xs tw:mt-1.5">{errors.email}</p>
                )}
              </div>

              <p className="tw:text-gray-500 tw:text-xs tw:leading-relaxed">
                By clicking 'Send Enquiry', you agree to our{' '}
                <span className="tw:text-blue-600 tw:underline tw:cursor-pointer">Terms of Use and Privacy Policy</span>.
                Your contact details will be forwarded to the seller.
              </p>

              <div className="tw:flex tw:gap-4 tw:pt-2">
                <button
                  onClick={handleBack}
                  className="tw:flex-1 tw:py-2.5 tw:text-gray-700 tw:border tw:border-gray-300 tw:rounded-lg tw:font-medium tw:hover:bg-gray-200 tw:hover:cursor-pointer tw:transition-colors tw:text-sm"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="tw:flex-1 tw:py-2.5 tw:bg-blue-600 tw:text-white tw:rounded-lg tw:font-medium tw:hover:bg-blue-800 tw:hover:cursor-pointer tw:transition-colors tw:disabled:tw:opacity-50 tw:disabled:tw:cursor-not-allowed tw:flex tw:items-center tw:justify-center tw:gap-2 tw:text-sm"
                >
                  {isSubmitting ? 'Sending...' : (
                    <>
                      <Send size={16} />
                      Send Enquiry
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inquire;