import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import './UserClaimDetailsPage.css';
import ClaimDetailsTestData from '../InsuranceCompany/testData/ClaimDetailsTestData';
import PolicyDetailsTestData from '../InsuranceCompany/testData/PolicyDetailsTestData';

const UserClaimDetailsPage = () => {
  const navigate = useNavigate();
  const { claimId } = useParams();

  // Mock current user
  const currentUser = {
    name: "John Silva",
    email: "john.silva@email.com",
    phone: "+94 77 123 4567",
    vehicleNumber: 'CAB-1234'
  };

  const claim = ClaimDetailsTestData.find(c => 
    c.id === claimId && c.vehicleNumber === currentUser.vehicleNumber
  );
  
  // Debug logging
  console.log('Looking for claim ID:', claimId);
  console.log('Available claims:', ClaimDetailsTestData.map(c => ({ id: c.id, vehicleNumber: c.vehicleNumber })));
  console.log('Found claim:', claim);
  
  const [selectedServiceProvider, setSelectedServiceProvider] = useState(null);
  const [showProviderSelection, setShowProviderSelection] = useState(false);
  
  // Mock available service providers (sent by insurance company)
  const availableServiceProviders = [
    { id: 1, name: "Auto Fix Garage", location: "Colombo 03", rating: 4.8, specialization: "Body Repair", distance: "2.5 km" },
    { id: 2, name: "Premium Car Care", location: "Dehiwala", rating: 4.6, specialization: "Paint & Body", distance: "4.2 km" },
    { id: 3, name: "City Motors", location: "Mount Lavinia", rating: 4.7, specialization: "Complete Repair", distance: "6.1 km" },
    { id: 4, name: "Express Auto", location: "Nugegoda", rating: 4.5, specialization: "Quick Repair", distance: "3.8 km" }
  ];

  useEffect(() => {
    // Simulate that user has already selected a provider for processing claims
    if (claim && (claim.status === 'Processing-Period-02' || claim.status === 'Processing-Period-03')) {
      setSelectedServiceProvider(availableServiceProviders[0]); // Auto Fix Garage
    }
  }, [claim]);

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'status-pending',
      'Investigating': 'status-investigating',
      'Processing-Period-01': 'status-processing',
      'Processing-Period-02': 'status-processing',
      'Processing-Period-03': 'status-processing',
      'Approved': 'status-approved',
      'Rejected': 'status-rejected'
    };
    return colors[status] || 'status-pending';
  };

  const getStatusDisplayName = (status) => {
    const names = {
      'Pending': 'Pending Review',
      'Investigating': 'Under Investigation',
      'Processing-Period-01': 'Awaiting Service Provider Selection',
      'Processing-Period-02': 'Repair Estimate Requested from Service Provider',
      'Processing-Period-03': 'Under Final Review',
      'Approved': 'Approved & Completed',
      'Rejected': 'Rejected'
    };
    return names[status] || status;
  };

  const handleProviderSelection = (providerId) => {
    const provider = availableServiceProviders.find(p => p.id === providerId);
    setSelectedServiceProvider(provider);
    setShowProviderSelection(false);
    // In real app, this would update the backend
    alert(`Service provider "${provider.name}" selected successfully! The insurance company has been notified.`);
  };

  const renderStatusSpecificContent = () => {
    switch (claim.status) {
      case 'Pending':
        return (
          <div className="status-info-card">
            <div className="status-icon">📋</div>
            <div className="status-content">
              <h3>Claim Submitted Successfully</h3>
              <p>Your claim has been received and is pending initial review by our claims team. You will be notified within 1-2 business days about the next steps.</p>
              <div className="expected-timeline">
                <strong>Expected Review Time:</strong> 1-2 business days
              </div>
            </div>
          </div>
        );

      case 'Investigating':
        return (
          <div className="status-info-card investigating">
            <div className="status-icon">🔍</div>
            <div className="status-content">
              <h3>Investigation in Progress</h3>
              <p>Our claims team is currently reviewing your accident details, policy coverage, and supporting documents. We may contact you if additional information is needed.</p>
              <div className="investigation-steps">
                <h4>What we're reviewing:</h4>
                <ul>
                  <li>✅ Policy coverage verification</li>
                  <li>✅ Damage assessment from photos & videos</li>
                  <li>🔄 Accident report validation</li>
                  <li>⏳ Supporting document review</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'Processing-Period-01':
        return (
          <div className="status-info-card processing">
            <div className="status-icon">🔧</div>
            <div className="status-content">
              <h3>Select Your Preferred Service Provider</h3>
              <p>Based on your location and vehicle type, we've recommended the following trusted service providers. Please select your preferred option.</p>
              
              {!selectedServiceProvider && (
                <>
                  <div className="provider-selection-section">
                    <div className="providers-grid">
                      {availableServiceProviders.map(provider => (
                        <div key={provider.id} className="provider-option">
                          <div className="provider-header">
                            <h4>{provider.name}</h4>
                            <div className="provider-rating">
                              <span className="rating-stars">⭐ {provider.rating}/5</span>
                            </div>
                          </div>
                          <div className="provider-details">
                            <p><span className="detail-icon">📍</span> {provider.location}</p>
                            <p><span className="detail-icon">🔧</span> {provider.specialization}</p>
                            <p><span className="detail-icon">📏</span> {provider.distance} away</p>
                          </div>
                          <button 
                            className="select-provider-btn"
                            onClick={() => handleProviderSelection(provider.id)}
                          >
                            Select This Provider
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {selectedServiceProvider && (
                <div className="selected-provider-info">
                  <div className="selection-success">
                    <div className="success-icon">✅</div>
                    <div>
                      <h4>Service Provider Selected</h4>
                      <p>You have selected <strong>{selectedServiceProvider.name}</strong>. The insurance company has been notified and will proceed with the next steps.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'Processing-Period-02':
        return (
          <div className="status-info-card processing">
            <div className="status-icon">📋</div>
            <div className="status-content">
              <h3>Repair Estimate Requested</h3>
              <p>Your selected service provider has been contacted with the accident details and will provide a repair estimate. This process typically takes 2-3 business days.</p>
              
              <div className="selected-provider-summary">
                <h4>Selected Service Provider:</h4>
                <div className="provider-card selected">
                  <div className="provider-info">
                    <h5>{selectedServiceProvider?.name}</h5>
                    <p>📍 {selectedServiceProvider?.location}</p>
                    <p>⭐ {selectedServiceProvider?.rating}/5</p>
                    <p>🔧 {selectedServiceProvider?.specialization}</p>
                  </div>
                  <div className="contact-provider">
                    <button className="contact-btn">📞 Contact Provider</button>
                  </div>
                </div>
              </div>

              <div className="next-steps">
                <h4>Next Steps:</h4>
                <ul>
                  <li>Service provider will assess the damage details</li>
                  <li>Repair estimate will be prepared and sent to insurance company</li>
                  <li>Insurance company will review the estimate</li>
                  <li>You will be notified once approved</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'Processing-Period-03':
        return (
          <div className="status-info-card processing">
            <div className="status-icon">📊</div>
            <div className="status-content">
              <h3>Final Review in Progress</h3>
              <p>The repair estimate has been received from your selected service provider and is currently under review by our claims team for final approval.</p>
              
              <div className="estimate-summary">
                <h4>Repair Estimate Details:</h4>
                <div className="estimate-card">
                  <div className="estimate-header">
                    <div className="provider-name">{selectedServiceProvider?.name}</div>
                    <div className="estimate-amount">LKR 125,000</div>
                  </div>
                  <div className="estimate-details">
                    <p><strong>Work Description:</strong> Front bumper replacement, headlight repair, paint touch-up</p>
                    <p><strong>Estimated Time:</strong> 3-4 working days</p>
                    <p><strong>Warranty:</strong> 6 months on all repairs</p>
                  </div>
                </div>
              </div>

              <div className="review-status">
                <div className="review-steps">
                  <div className="review-step completed">
                    <span className="step-icon">✅</span>
                    <span>Estimate Received</span>
                  </div>
                  <div className="review-step active">
                    <span className="step-icon">🔄</span>
                    <span>Under Review</span>
                  </div>
                  <div className="review-step pending">
                    <span className="step-icon">⏳</span>
                    <span>Final Decision</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Approved':
        return (
          <div className="status-info-card approved">
            <div className="status-icon">✅</div>
            <div className="status-content">
              <h3>Claim Approved - Proceed with Repairs</h3>
              <p>Congratulations! Your claim has been approved. You can now proceed with the repairs at your selected service provider.</p>
              
              <div className="approval-details">
                <div className="approved-amount">
                  <h4>Approved Repair Amount:</h4>
                  <div className="amount-display">LKR 125,000</div>
                </div>

                <div className="repair-instructions">
                  <h4>Next Steps:</h4>
                  <ol>
                    <li>Contact your selected service provider to schedule the repair</li>
                    <li>Present this claim approval and your vehicle for inspection</li>
                    <li>Repairs will be completed as per the approved estimate</li>
                    <li>Payment will be made directly to the service provider</li>
                  </ol>
                </div>

                <div className="provider-contact">
                  <h4>Your Selected Service Provider:</h4>
                  <div className="contact-card">
                    <div className="contact-info">
                      <h5>{selectedServiceProvider?.name}</h5>
                      <p>📍 {selectedServiceProvider?.location}</p>
                      <p>📞 011-2345678</p>
                      <p>🕒 Mon-Sat: 8:00 AM - 5:00 PM</p>
                    </div>
                    {/* <div className="contact-actions">
                      <button className="primary-btn">📞 Call Now</button>
                      <button className="secondary-btn">📍 Get Directions</button>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Rejected':
        return (
          <div className="status-info-card rejected">
            <div className="status-icon">❌</div>
            <div className="status-content">
              <h3>Claim Not Approved</h3>
              <p>We regret to inform you that your claim has not been approved after careful review.</p>
              
              <div className="rejection-details">
                <h4>Reason for Rejection:</h4>
                <div className="rejection-reason">
                  The damage reported appears to be pre-existing and not covered under the current policy terms. Additionally, the incident date falls outside the policy coverage period.
                </div>

                <div className="appeal-options">
                  <h4>Your Options:</h4>
                  <ul>
                    <li>Review the rejection details and policy terms</li>
                    <li>Submit additional supporting documentation if available</li>
                    <li>Contact our customer service for clarification</li>
                    <li>File an appeal if you believe this decision is incorrect</li>
                  </ul>
                </div>

                {/* <div className="contact-support">
                  <button className="support-btn">📞 Contact Support</button>
                  <button className="appeal-btn">📝 File an Appeal</button>
                </div> */}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!claim) {
    return (
      <div className="claim-not-found">
        <div className="not-found-content">
          <div className="not-found-icon">❓</div>
          <h2>Claim Not Found</h2>
          <p>The requested claim could not be found or you don't have permission to view it.</p>
          <p><strong>Claim ID:</strong> {claimId}</p>
          <p><strong>Your Vehicle:</strong> {currentUser.vehicleNumber}</p>
          <button onClick={() => navigate('/user/claims')} className="back-to-claims-btn">
            Back to My Claims
          </button>
        </div>
      </div>
    );
  };

  // Find policy details
  const policyDetails = PolicyDetailsTestData.find(
    policy => policy.vehicleNumber === claim.vehicleNumber
  );

  return (
    <div className="user-claim-details-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="claim-header-info">
            <h1>Claim Details</h1>
            <div className="claim-id-header">
              <span className="claim-id">{claim.id}</span>
              <span className={`status-badge ${getStatusColor(claim.status)}`}>
                {getStatusDisplayName(claim.status)}
              </span>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className="back-btn"
              onClick={() => navigate('/claimhistorypage')}
            >
              ← Back to Claims
            </button>
          </div>
        </div>
      </div>

      {/* Status Specific Content */}
      {renderStatusSpecificContent()}

      {/* Section 1: Claim Information */}
      <section className="section-card">
        <div className="section-header">
          <h3>Claim Information</h3>
        </div>
        
        <div className="claim-info-grid">
          <div className="info-item">
            <div className="info-icon">👤</div>
            <div className="info-content">
              <p className="info-label">Customer</p>
              <p className="info-value">{claim.customer}</p>
            </div>
          </div>
          
          <div className="info-item">
            <div className="info-icon">🚗</div>
            <div className="info-content">
              <p className="info-label">Vehicle</p>
              <p className="info-value">{claim.vehicle}</p>
            </div>
          </div>
          
          <div className="info-item">
            <div className="info-icon">⚠️</div>
            <div className="info-content">
              <p className="info-label">Incident Type</p>
              <p className="info-value">{claim.type}</p>
            </div>
          </div>
          
          <div className="info-item">
            <div className="info-icon">💰</div>
            <div className="info-content">
              <p className="info-label">Claim Amount</p>
              <p className="info-value">{claim.amount.toLocaleString()} LKR</p>
            </div>
          </div>
          
          <div className="info-item">
            <div className="info-icon">📅</div>
            <div className="info-content">
              <p className="info-label">Date Filed</p>
              <p className="info-value">{claim.date}</p>
            </div>
          </div>
          
          <div className="info-item">
            <div className="info-icon">🏷️</div>
            <div className="info-content">
              <p className="info-label">Priority</p>
              <p className="info-value">{claim.priority}</p>
            </div>
          </div>
        </div>
        
        <div className="accident-report">
          <h4>Accident Report</h4>
          <p>{claim.accidentReport || 'No report provided.'}</p>
        </div>
      </section>

      {/* Section 2: Damage Evidence */}
      <section className="section-card">
        <div className="section-header">
          <h3>Damage Evidence</h3>
        </div>
        
        <div className="photos-section">
          <h4>Photos ({claim.images.length})</h4>
          <div className="image-gallery">
            {claim.images.map((img, i) => (
              <div key={i} className="image-container">
                <img src={img} alt={`claim-${i}`} />
              </div>
            ))}
          </div>
        </div>
        
        <div className="video-gallery">
          <div className="video-icon">🎥</div>
          <div>
            <h4>Videos</h4>
            <p>No videos uploaded for this claim.</p>
          </div>
        </div>
      </section>

      {/* Section 3: Policy Details */}
      <section className="section-card">
        <div className="section-header">
          <h3>Policy Details</h3>
        </div>
        {policyDetails ? (
          <div className="policy-grid">
            <div className="policy-item">
              <p className="policy-label">Policy Number</p>
              <p className="policy-value">{policyDetails.policyNumber}</p>
            </div>
            <div className="policy-item">
              <p className="policy-label">Coverage Type</p>
              <p className="policy-value">{policyDetails.policyType}</p>
            </div>
            <div className="policy-item">
              <p className="policy-label">Start Date</p>
              <p className="policy-value">{policyDetails.startDate}</p>
            </div>
            <div className="policy-item">
              <p className="policy-label">End Date</p>
              <p className="policy-value">{policyDetails.endDate}</p>
            </div>
            <div className="policy-item">
              <p className="policy-label">Annual Premium</p>
              <p className="policy-value">{policyDetails.premium.toLocaleString()} LKR</p>
            </div>
          </div>
        ) : (
          <div>No policy details found for this vehicle.</div>
        )}
      </section>

      {/* Section 4: Additional Documents */}
        <section className="section-card">
          <div className="section-header">
            <h3>Additional Documents</h3>
          </div>
          
          <div className="document-list">
            <div className="document-item">
              <div className="document-info">
                <div className="document-icon red">
                  📋
                </div>
                <div className="document-details">
                  <h5>Police Report</h5>
                  <p>Official incident report</p>
                </div>
              </div>
              <button className="document-button">
                 View Report
              </button>
            </div>
          {claim.status === 'Approved' && (
            <div className="document-item">
              <div className="document-info">
                <div className="document-icon green">
                  📥
                </div>
                <div className="document-details">
                  <h5>Repair Estimate</h5>
                  <p>Garage assessment document</p>
                </div>
              </div>
              <button className="document-button">
                 Download
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Contact Information */}
      <div className="section-card">
        <div className="section-header">
          <h2>Need Help?</h2>
        </div>
        
        <div className="contact-section">
          <div className="contact-options">
            <div className="contact-option">
              <div className="contact-icon">📞</div>
              <div className="contact-details">
                <h4>Call Us</h4>
                <p>Speak with our claims team</p>
                <span className="contact-value">+94 11 234 5678</span>
              </div>
            </div>
            
            <div className="contact-option">
              <div className="contact-icon">✉️</div>
              <div className="contact-details">
                <h4>Email Support</h4>
                <p>Send us your questions</p>
                <span className="contact-value">claims@abcinsurance.lk</span>
              </div>
            </div>
          </div>
          
          <div className="office-hours">
            <p><strong>Emergency Claims:</strong> 24/7 Hotline - 011-252467</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserClaimDetailsPage;