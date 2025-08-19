import React, { useState, useRef, useCallback } from 'react';
import './ClaimRequestForm.css';
import PolicyDetailsTestData from "../InsuranceCompany/testData/PolicyDetailsTestData";

const ClaimRequestForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    policyNumber: '',
    incidentType: '',
    incidentDate: '',
    incidentTime: '',
    incidentLocation: '',
    description: '',
    photos: {
      front: null,
      back: null,
      left: null,
      right: null,
      special: []
    },
    video: null,
    policeReport: null,
    additionalComments: '',
    digitalSignature: '',
    confirmation: false
  });

  const [policyDetails, setPolicyDetails] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [cameraMode, setCameraMode] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false); // Added missing state
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const signatureCanvasRef = useRef(null); // Separate ref for signature canvas

  // Company mock data
  const companyInfo = {
    name: "SecureGuard Insurance Company",
    email: "claims@secureguard.lk",
    phone: "+94 11 234 5678",
    hotline: "+94 11 CLAIMS (252467)",
    website: "www.secureguard.lk"
  };

  const steps = [
    { id: 1, title: "Policy & Incident Details", icon: "📋" },
    { id: 2, title: "Evidence Collection", icon: "📸" },
    { id: 3, title: "Confirmation & Submit", icon: "✅" }
  ];

  const incidentTypes = [
    "Vehicle Collision",
    "Hit and Run",
    "Vehicle Theft",
    "Fire Damage",
    "Flood Damage",
    "Vandalism",
    "Natural Disaster",
    "Glass Breakage",
    "Other"
  ];

  const photoTypes = [
    { key: 'front', label: 'Front View', required: true },
    { key: 'back', label: 'Back View', required: true },
    { key: 'left', label: 'Left Side', required: true },
    { key: 'right', label: 'Right Side', required: true }
  ];

  // Handle policy number input and auto-fill details
  const handlePolicyNumberChange = (e) => {
    const policyNum = e.target.value.toUpperCase();
    setFormData(prev => ({ ...prev, policyNumber: policyNum }));

    if (policyNum.length >= 8) {
      const policy = PolicyDetailsTestData.find(p => p.policyNumber === policyNum);
      if (policy) {
        setPolicyDetails(policy);
        setErrors(prev => ({ ...prev, policyNumber: '' }));
      } else {
        setPolicyDetails(null);
        setErrors(prev => ({ ...prev, policyNumber: 'Policy not found. Please check the policy number.' }));
      }
    } else {
      setPolicyDetails(null);
    }
  };

  // Camera functions
  const startCamera = async (photoType) => {
    try {
      setCameraMode(photoType);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      alert('Unable to access camera. Please check permissions.');
      console.error('Camera error:', error);
    }
  };

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const photoURL = URL.createObjectURL(blob);
        
        if (cameraMode === 'special') {
          setFormData(prev => ({
            ...prev,
            photos: {
              ...prev.photos,
              special: [...prev.photos.special, { url: photoURL, blob }]
            }
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            photos: {
              ...prev.photos,
              [cameraMode]: { url: photoURL, blob }
            }
          }));
        }
        
        stopCamera();
      });
    }
  }, [cameraMode]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraMode(null);
  };

  // Video recording
  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      // Implementation would use MediaRecorder API
      alert('Video recording feature would be implemented with MediaRecorder API');
    } catch (error) {
      alert('Unable to access camera/microphone for video recording.');
    }
  };

  // Digital signature functionality - Fixed
  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = signatureCanvasRef.current; // Use signature canvas ref
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = signatureCanvasRef.current; // Use signature canvas ref
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    // Save signature data
    if (signatureCanvasRef.current) {
      const signatureData = signatureCanvasRef.current.toDataURL();
      setFormData(prev => ({ ...prev, digitalSignature: signatureData }));
    }
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current; // Use signature canvas ref
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setFormData(prev => ({ ...prev, digitalSignature: '' }));
  };

  // Form validation
  const validateStep = (step) => {
    let stepFields = [];
    let newErrors = {};
    let isValid = true;

    switch (step) {
      case 1:
        if (!formData.policyNumber) newErrors.policyNumber = 'Policy number is required';
        if (!policyDetails) newErrors.policyNumber = 'Valid policy required';
        if (!formData.incidentType) newErrors.incidentType = 'Incident type is required';
        if (!formData.incidentDate) newErrors.incidentDate = 'Incident date is required';
        if (!formData.incidentTime) newErrors.incidentTime = 'Incident time is required';
        if (!formData.incidentLocation) newErrors.incidentLocation = 'Incident location is required';
        if (!formData.description) newErrors.description = 'Incident description is required';
        stepFields = ['policyNumber', 'incidentType', 'incidentDate', 'incidentTime', 'incidentLocation', 'description'];
        break;

      case 2:
        photoTypes.forEach(type => {
          if (type.required && !formData.photos[type.key]) {
            newErrors[`photo_${type.key}`] = `${type.label} photo is required`;
          }
        });
        stepFields = photoTypes.map(type => `photo_${type.key}`);
        break;

      case 3:
        if (!formData.confirmation) newErrors.confirmation = 'Please confirm the information is correct';
        if (!formData.digitalSignature) newErrors.digitalSignature = 'Digital signature is required';
        stepFields = ['confirmation', 'digitalSignature'];
        break;

      default:
        return false;
    }

    // Mark all fields in step as touched
    const newTouched = {};
    stepFields.forEach(field => {
      newTouched[field] = true;
    });

    setTouched(prev => ({ ...prev, ...newTouched }));
    setErrors(prev => ({ ...prev, ...newErrors }));

    return Object.keys(newErrors).length === 0;
  };

  // Navigation
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Submit form
  const handleSubmit = () => {
    if (validateStep(3)) {
      // Here you would submit to backend
      alert('Claim submitted successfully! You will receive a confirmation email shortly.');
      console.log('Form submitted:', formData);
    }
  };

  // Remove photo
  const removePhoto = (photoType, index = null) => {
    if (photoType === 'special' && index !== null) {
      setFormData(prev => ({
        ...prev,
        photos: {
          ...prev.photos,
          special: prev.photos.special.filter((_, i) => i !== index)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        photos: {
          ...prev.photos,
          [photoType]: null
        }
      }));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-section">
            <div className="section-header">
              <h3>📋 Policy & Incident Details</h3>
              <p>Enter your policy number to auto-fill vehicle and customer details</p>
            </div>

            {/* Policy Number Input */}
            <div className="input-group">
              <label htmlFor="policyNumber">Policy Number *</label>
              <input
                id="policyNumber"
                type="text"
                value={formData.policyNumber}
                onChange={handlePolicyNumberChange}
                placeholder="Enter your policy number (e.g., POL-2024-001)"
                className={errors.policyNumber ? 'error' : ''}
              />
              {errors.policyNumber && <span className="error-message">{errors.policyNumber}</span>}
            </div>

            {/* Policy Details Display */}
            {policyDetails && (
              <div className="policy-details-display">
                <h4>✅ Policy Found</h4>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Customer Name:</label>
                    <span>{policyDetails.customerName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Vehicle:</label>
                    <span>{policyDetails.vehicleModel}</span>
                  </div>
                  <div className="detail-item">
                    <label>Vehicle Number:</label>
                    <span>{policyDetails.vehicleNumber}</span>
                  </div>
                  <div className="detail-item">
                    <label>Policy Type:</label>
                    <span>{policyDetails.policyType}</span>
                  </div>
                  <div className="detail-item">
                    <label>Contact:</label>
                    <span>{policyDetails.contactNo}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{policyDetails.email}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Incident Details */}
            <div className="incident-details">
              <h4>Incident Information</h4>
              
              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="incidentType">Type of Incident *</label>
                  <select
                    id="incidentType"
                    value={formData.incidentType}
                    onChange={(e) => setFormData(prev => ({ ...prev, incidentType: e.target.value }))}
                    className={errors.incidentType ? 'error' : ''}
                  >
                    <option value="">Select incident type</option>
                    {incidentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.incidentType && <span className="error-message">{errors.incidentType}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="incidentDate">Date of Incident *</label>
                  <input
                    id="incidentDate"
                    type="date"
                    value={formData.incidentDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, incidentDate: e.target.value }))}
                    className={errors.incidentDate ? 'error' : ''}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {errors.incidentDate && <span className="error-message">{errors.incidentDate}</span>}
                </div>

                <div className="input-group">
                  <label htmlFor="incidentTime">Time of Incident *</label>
                  <input
                    id="incidentTime"
                    type="time"
                    value={formData.incidentTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, incidentTime: e.target.value }))}
                    className={errors.incidentTime ? 'error' : ''}
                  />
                  {errors.incidentTime && <span className="error-message">{errors.incidentTime}</span>}
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="incidentLocation">Location of Incident *</label>
                <input
                  id="incidentLocation"
                  type="text"
                  value={formData.incidentLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, incidentLocation: e.target.value }))}
                  placeholder="Provide detailed location (street, city, landmarks)"
                  className={errors.incidentLocation ? 'error' : ''}
                />
                {errors.incidentLocation && <span className="error-message">{errors.incidentLocation}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="description">Detailed Description *</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what happened in detail. Include circumstances, other parties involved, weather conditions, etc."
                  rows={5}
                  className={errors.description ? 'error' : ''}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-section">
            <div className="section-header">
              <h3>📸 Evidence Collection</h3>
              <p>Please provide clear photos of your vehicle damage from all required angles</p>
            </div>

            {/* Instructions */}
            <div className="instructions">
              <h4>Instructions :</h4>
              <ul>
                <li>Take photos in good lighting conditions</li>
                <li>Ensure damage is clearly visible</li>
                <li>Include license plate in at least one photo</li>
                <li>Take wide shots showing full vehicle sides</li>
                <li>Avoid using flash if possible</li>
              </ul>
            </div>

            {/* Required Photos */}
            <div className="photo-section">
              <h4>Required Vehicle Photos</h4>
              <div className="photo-grid">
                {photoTypes.map(photoType => (
                  <div key={photoType.key} className="photo-card">
                    <div className="photo-header">
                      <h5>{photoType.label} {photoType.required && '*'}</h5>
                    </div>
                    
                    {formData.photos[photoType.key] ? (
                      <div className="photo-preview">
                        <img src={formData.photos[photoType.key].url} alt={photoType.label} />
                        <button 
                          type="button"
                          className="remove-photo"
                          onClick={() => removePhoto(photoType.key)}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="photo-placeholder">
                        <div className="camera-icon">📷</div>
                        <p>No photo taken</p>
                        <button 
                          type="button"
                          className="camera-btn"
                          onClick={() => startCamera(photoType.key)}
                        >
                          Take Photo
                        </button>
                      </div>
                    )}
                    
                    {errors[`photo_${photoType.key}`] && (
                      <span className="error-message">{errors[`photo_${photoType.key}`]}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Special/Additional Photos */}
            <div className="photo-section">
              <h4>Additional Photos (Optional)</h4>
              <p>Add any additional photos showing specific damage details</p>
              
              <div className="special-photos">
                {formData.photos.special.map((photo, index) => (
                  <div key={index} className="special-photo">
                    <img src={photo.url} alt={`Special ${index + 1}`} />
                    <button 
                      type="button"
                      className="remove-photo"
                      onClick={() => removePhoto('special', index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                
                {formData.photos.special.length < 5 && (
                  <button 
                    type="button"
                    className="add-special-photo"
                    onClick={() => startCamera('special')}
                  >
                    <span>📷</span>
                    Add Photo
                  </button>
                )}
              </div>
            </div>

            {/* Video Section */}
            <div className="video-section">
              <h4>Video Evidence (Optional)</h4>
              <p>You may provide a short video showing the damage or incident scene</p>
              <button 
                type="button"
                className="video-btn"
                onClick={startVideoRecording}
              >
                🎥 Record Video
              </button>
            </div>

            {/* Police Report */}
            <div className="document-section">
              <h4>Police Report (Optional)</h4>
              <p>If available, please upload the police report</p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFormData(prev => ({ ...prev, policeReport: e.target.files[0] }))}
              />
            </div>

            {/* Additional Comments */}
            <div className="input-group">
              <label htmlFor="additionalComments">Additional Comments</label>
              <textarea
                id="additionalComments"
                value={formData.additionalComments}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalComments: e.target.value }))}
                placeholder="Any additional information that might be relevant to your claim"
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-section">
            <div className="section-header">
              <h3>✅ Confirmation & Submission</h3>
              <p>Please review your information and provide your digital signature</p>
            </div>

            {/* Summary */}
            <div className="claim-summary">
              <h4>Claim Summary</h4>
              <div className="summary-grid">
                <div className="summary-item">
                  <label>Policy Number:</label>
                  <span>{formData.policyNumber}</span>
                </div>
                <div className="summary-item">
                  <label>Incident Type:</label>
                  <span>{formData.incidentType}</span>
                </div>
                <div className="summary-item">
                  <label>Incident Date:</label>
                  <span>{formData.incidentDate} at {formData.incidentTime}</span>
                </div>
                <div className="summary-item">
                  <label>Location:</label>
                  <span>{formData.incidentLocation}</span>
                </div>
                <div className="summary-item">
                  <label>Photos Provided:</label>
                  <span>{Object.values(formData.photos).filter(photo => photo !== null).length + formData.photos.special.length} photos</span>
                </div>
              </div>
            </div>

            {/* Digital Signature Section - Fixed */}
            <div className="signature-section">
              <h4>Digital Signature *</h4>
              <p>Please sign in the box below using your mouse or touch screen</p>
              <div className="signature-container">
                <canvas
                  ref={signatureCanvasRef}
                  width={400}
                  height={150}
                  className="signature-canvas"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <div className="signature-label">Please sign above</div>
              </div>
              <button type="button" className="clear-signature-btn" onClick={clearSignature}>
                Clear Signature
              </button>
              {errors.digitalSignature && <span className="error-message">{errors.digitalSignature}</span>}
            </div>

            {/* Confirmation Checkbox */}
            <div className="confirmation-section">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.confirmation}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmation: e.target.checked }))}
                />
                <span className="checkbox-custom"></span>
                I confirm that all the information provided is true and accurate to the best of my knowledge. I understand that providing false information may result in claim rejection and policy cancellation. *
              </label>
              {errors.confirmation && <span className="error-message">{errors.confirmation}</span>}
            </div>

            {/* Terms */}
            <div className="terms-section">
              <p><strong>Important Notes:</strong></p>
              <ul>
                <li>You will receive a claim reference number via email.</li>
                <li>Our claims team will contact you within 2 business days.</li>
                <li>Keep all original documents safe.</li>
                <li>Do not repair the vehicle until authorized by us.</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="claim-form-container">
      {/* Company Header */}
      <div className="company-header">
        <div className="company-info">
          <h1>{companyInfo.name}</h1>
          <div className="contact-info">
            <span>📧 {companyInfo.email}</span>
            <span>📞 {companyInfo.phone}</span>
            <span>🆘 Emergency: {companyInfo.hotline}</span>
          </div>
        </div>
      </div>

      {/* Form Header */}
      <div className="form-header">
        <h2>Vehicle Insurance Claim Request</h2>
        <p>Please provide accurate information about your incident. All fields marked with * are required.</p>
      </div>

      {/* Progress Steps */}
      <div className="progress-steps">
        {steps.map((step) => (
          <div key={step.id} className={`step ${currentStep >= step.id ? 'active' : ''} ${currentStep === step.id ? 'current' : ''}`}>
            <div className="step-number">{step.id}</div>
            <div className="step-title">{step.title}</div>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="form-content">
        {renderStepContent()}

        {/* Camera Modal */}
        {cameraMode && (
          <div className="camera-modal">
            <div className="camera-content">
              <div className="camera-header">
                <h3>Take Photo - {cameraMode === 'special' ? 'Additional Photo' : photoTypes.find(p => p.key === cameraMode)?.label}</h3>
                <button className="close-camera" onClick={stopCamera}>✕</button>
              </div>
              
              <div className="camera-preview">
                <video ref={videoRef} autoPlay playsInline />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </div>
              
              <div className="camera-controls">
                <button className="capture-btn" onClick={capturePhoto}>
                  📷 Capture
                </button>
                <button className="cancel-btn" onClick={stopCamera}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="form-navigation">
          <button 
            type="button" 
            className="nav-btn prev-btn"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            ← Previous
          </button>
          
          <div className="nav-spacer"></div>
          
          {currentStep < steps.length ? (
            <button 
              type="button" 
              className="nav-btn next-btn"
              onClick={handleNext}
            >
              Next →
            </button>
          ) : (
            <button 
              type="button" 
              className="nav-btn submit-btn"
              onClick={handleSubmit}
            >
              Submit Claim 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimRequestForm;