import React, { useState } from 'react';
import './CustomerProviderSelection.css';

const CustomerProviderSelection = () => {
  const [claimData] = useState({
    id: 'CLM-2024-001',
    customerName: 'John Silva',
    vehicleNumber: 'ABC-1234',
    vehicle: 'Toyota Aqua 2020',
    accidentDate: '2024-12-15',
    estimatedDamage: 'Front bumper damage, headlight repair needed'
  });

  const [providers] = useState([
    {
      id: 1,
      name: "AutoFix Garage",
      location: "Colombo 03",
      address: "123 Galle Road, Colombo 03",
      rating: 4.8,
      reviews: 245,
      specialization: "Body Repair",
      distance: "2.5 km",
      estimatedTime: "3-4 days",
      phone: "+94 11 234 5678",
      features: ["Free Towing", "Genuine Parts", "Warranty Included"],
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Premium Car Care",
      location: "Dehiwala",
      address: "456 Galle Road, Dehiwala",
      rating: 4.6,
      reviews: 189,
      specialization: "Paint & Body",
      distance: "4.2 km",
      estimatedTime: "4-5 days",
      phone: "+94 11 345 6789",
      features: ["Paint Booth", "Insurance Direct Billing", "Pickup Service"],
      image: "https://images.unsplash.com/photo-1632823469850-1ac2e4ac8c0e?w=400&h=300&fit=crop"
    },
  ]);

  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSelectProvider = (provider) => {
    setSelectedProvider(provider);
  };

  const handleConfirmSelection = () => {
    if (!selectedProvider) {
      alert("Please select a service provider first");
      return;
    }
    setShowConfirmation(true);
  };

  const handleFinalConfirm = () => {
    const message = `Service provider "${selectedProvider.name}" confirmed! Your insurance company will contact them shortly.`;
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setShowConfirmation(false);
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSelectedProvider(null);
  };

  return (
    <div className="customer-provider-container">
      {/* Header */}
      <div className="customer-header">
        <div className="header-content">
          <h1 className="page-title">Select Service Provider</h1>
          <p className="page-subtitle">Choose your preferred garage from our recommended partners</p>
        </div>
        <div className="claim-badge">
          <span className="claim-label">Claim ID:</span>
          <span className="claim-value">{claimData.id}</span>
        </div>
      </div>

      {/* Claim Summary Card */}
      <div className="claim-summary-card">
        <div className="summary-header">
          <h3 className="summary-title">📋 Your Claim Details</h3>
        </div>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Vehicle</span>
            <span className="summary-value">{claimData.vehicle}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Registration</span>
            <span className="summary-value">{claimData.vehicleNumber}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Accident Date</span>
            <span className="summary-value">{claimData.accidentDate}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Damage</span>
            <span className="summary-value">{claimData.estimatedDamage}</span>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="info-banner">
        <span className="info-icon">ℹ️</span>
        <div>
          <strong>Why these providers?</strong> All garages below are pre-approved by your insurance company, 
          ensuring quality work and direct billing. You won't need to pay upfront.
        </div>
      </div>

      {/* Provider Cards Grid */}
      <div className="providers-grid">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className={`provider-card ${selectedProvider?.id === provider.id ? 'selected' : ''}`}
            onClick={() => handleSelectProvider(provider)}
          >
            {selectedProvider?.id === provider.id && (
              <div className="selected-badge">
                <span>✓ Selected</span>
              </div>
            )}

            <div className="provider-content">
              <div className="provider-header">
                <h3 className="provider-name">{provider.name}</h3>
                <div className="rating-container">
                  <span className="rating-stars">⭐ {provider.rating}</span>
                  <span className="review-count">({provider.reviews} reviews)</span>
                </div>
              </div>

              <div className="provider-details">
                <div className="detail-item">
                  <span className="detail-icon">📍</span>
                  <div>
                    <div className="detail-label">Location</div>
                    <div className="detail-value">{provider.location}</div>
                    <div className="detail-subtext">{provider.distance} away</div>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-icon">🔧</span>
                  <div>
                    <div className="detail-label">Specialization</div>
                    <div className="detail-value">{provider.specialization}</div>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-icon">⏱️</span>
                  <div>
                    <div className="detail-label">Estimated Time</div>
                    <div className="detail-value">{provider.estimatedTime}</div>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-icon">📞</span>
                  <div>
                    <div className="detail-label">Contact</div>
                    <div className="detail-value">{provider.phone}</div>
                  </div>
                </div>
              </div>

              <div className="features-section">
                <div className="features-label">Key Features:</div>
                <div className="features-list">
                  {provider.features.map((feature, index) => (
                    <span key={index} className="feature-tag">
                      ✓ {feature}
                    </span>
                  ))}
                </div>
              </div>

              <button
                className={`select-button ${selectedProvider?.id === provider.id ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectProvider(provider);
                }}
              >
                {selectedProvider?.id === provider.id ? '✓ Selected' : 'Select This Garage'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action Bar */}
      {selectedProvider && (
        <div className="action-bar">
          <div className="action-bar-content">
            <div className="selected-info">
              <span className="selected-label">Selected:</span>
              <span className="selected-name">{selectedProvider.name}</span>
              <span className="selected-location">📍 {selectedProvider.location}</span>
            </div>
            <button className="confirm-button" onClick={handleConfirmSelection}>
              Confirm Selection
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="modal-overlay" onClick={() => setShowConfirmation(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Confirm Your Selection</h3>
            </div>
            
            <div className="modal-content">
              <div className="confirmation-card">
                <div className="confirm-icon">✓</div>
                <h4 className="confirm-provider-name">{selectedProvider.name}</h4>
                <p className="confirm-location">📍 {selectedProvider.address}</p>
                
                <div className="confirm-details">
                  <div className="confirm-detail-item">
                    <span>⭐ Rating:</span>
                    <strong>{selectedProvider.rating}/5</strong>
                  </div>
                  <div className="confirm-detail-item">
                    <span>⏱️ Estimated Time:</span>
                    <strong>{selectedProvider.estimatedTime}</strong>
                  </div>
                  <div className="confirm-detail-item">
                    <span>📞 Phone:</span>
                    <strong>{selectedProvider.phone}</strong>
                  </div>
                </div>
              </div>

              <div className="confirm-notice">
                <span className="notice-icon">ℹ️</span>
                <div>
                  <strong>What happens next?</strong>
                  <ul className="notice-list">
                    <li>Your insurance company will send the accident details to this garage</li>
                    <li>The garage will prepare a repair estimate</li>
                    <li>You'll be notified once the estimate is ready for approval</li>
                    <li>The garage will contact you directly to schedule the repair</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="cancel-button" onClick={() => setShowConfirmation(false)}>
                Go Back
              </button>
              <button className="final-confirm-button" onClick={handleFinalConfirm}>
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message Box */}
      {showSuccessMessage && (
        <div className="message-overlay" onClick={handleCloseSuccessMessage}>
          <div className="message-box" onClick={(e) => e.stopPropagation()}>
            <div className="message-header">
              <div className="message-icon-container">✓</div>
              <h3 className="message-title">Success!</h3>
            </div>
            
            <p className="message-text">{successMessage}</p>
            
            <div className="message-details">
              <div className="message-detail-row">
                <span className="message-detail-label">Provider:</span>
                <span className="message-detail-value">{selectedProvider?.name}</span>
              </div>
              <div className="message-detail-row">
                <span className="message-detail-label">Location:</span>
                <span className="message-detail-value">{selectedProvider?.location}</span>
              </div>
              <div className="message-detail-row">
                <span className="message-detail-label">Contact:</span>
                <span className="message-detail-value">{selectedProvider?.phone}</span>
              </div>
            </div>

            <button className="message-button" onClick={handleCloseSuccessMessage}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProviderSelection;