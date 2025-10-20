import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import './InsuranceClaimDetailsPage.css';
import ClaimDetailsTestData from './testData/ClaimDetailsTestData';
import PolicyDetailsTestData from './testData/PolicyDetailsTestData';
import OverlayWindow from '../../components/OverlayWindow';

const InsuranceClaimDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data
  const [claims, setClaims] = useState([...ClaimDetailsTestData]);
  const claim = claims.find(c => c.id === id);
  const [comment, setComment] = useState('');
  const [selectedServiceProviders, setSelectedServiceProviders] = useState([]);
  const [reRequestCount, setReRequestCount] = useState(0);
  const [customerSelectedProvider, setCustomerSelectedProvider] = useState(null);
  const [repairEstimate, setRepairEstimate] = useState(null);
  const [showProviderOverlay, setShowProviderOverlay] = useState(false);
  const [providerSearch, setProviderSearch] = useState('');
  
  // Message popup states
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [messagePopupContent, setMessagePopupContent] = useState({
    title: '',
    message: '',
    type: 'success'
  });
  
  // Final report states
  const [showFinalReportOverlay, setShowFinalReportOverlay] = useState(false);
  const [finalReportData, setFinalReportData] = useState({
    vehicleNumber: '',
    policyNumber: '',
    customerName: '',
    accidentDate: '',
    accidentLocation: '',
    accidentDescription: '',
    serviceProvider: '',
    repairsCompleted: '',
    totalCost: '',
    additionalNotes: '',
    inspectionDate: '',
    inspectorName: '',
    qualityRating: '5'
  });

  // Available service providers
  const [availableServiceProviders] = useState([
    { id: 1, name: "AutoFix Garage", location: "Colombo 03", rating: 4.8, specialization: "Body Repair" },
    { id: 2, name: "Premium Car Care", location: "Dehiwala", rating: 4.6, specialization: "Paint & Body" },
    { id: 3, name: "City Motors", location: "Mount Lavinia", rating: 4.7, specialization: "Complete Repair" },
    { id: 4, name: "Express Auto", location: "Nugegoda", rating: 4.5, specialization: "Quick Repair" }
  ]);

  const showMessage = (title, message, type = 'success') => {
    setMessagePopupContent({ title, message, type });
    setShowMessagePopup(true);
  };

  useEffect(() => {
    setComment(claim?.comments || '');
    
    if (claim) {
      const policyDetails = PolicyDetailsTestData.find(
        policy => policy.vehicleNumber === claim.vehicleNumber
      );
      
      setFinalReportData({
        vehicleNumber: claim.vehicleNumber || 'ABC-1234',
        policyNumber: policyDetails?.policyNumber || 'POL-001-2024',
        customerName: claim.customer || 'John Silva',
        accidentDate: claim.date || '2024-12-15',
        accidentLocation: 'Galle Road, Colombo 06',
        accidentDescription: claim.accidentReport || 'Vehicle collision with front-end damage.',
        serviceProvider: 'AutoFix Garage - Colombo 03',
        repairsCompleted: 'Front bumper replacement, headlight assembly repair, paint touch-up work.',
        totalCost: '125,000',
        additionalNotes: 'All repairs completed to manufacturer specifications.',
        inspectionDate: new Date().toISOString().split('T')[0],
        inspectorName: 'Inspector Perera',
        qualityRating: '5'
      });
    }
  }, [claim]);

  const handleStatusChange = (newStatus) => {
    setClaims(claims.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleApprove = () => {
    setClaims(claims.map(c => c.id === id ? { ...c, status: 'Approved' } : c));
    showMessage('Claim Approved', 'Notifications sent to customer and service provider.', 'success');
  };

  const handleReject = () => {
    setClaims(claims.map(c => c.id === id ? { ...c, status: 'Rejected' } : c));
    showMessage('Claim Rejected', 'The claim has been rejected successfully.', 'error');
    setTimeout(() => navigate(-1), 2000);
  };

  const handleAddComment = () => {
    setClaims(claims.map(c => c.id === id ? { ...c, comments: comment } : c));
    showMessage('Comment Saved', 'Your comment has been saved successfully!', 'success');
  };

  const handleServiceProviderSelection = (providerId, isSelected) => {
    if (isSelected) {
      if (selectedServiceProviders.length >= 4) {
        showMessage('Selection Limit', 'Maximum 4 service providers can be selected.', 'warning');
        return;
      }
      const provider = availableServiceProviders.find(p => p.id === providerId);
      setSelectedServiceProviders([...selectedServiceProviders, provider]);
    } else {
      setSelectedServiceProviders(selectedServiceProviders.filter(p => p.id !== providerId));
    }
  };

  const requestRepairEstimate = () => {
    if (!customerSelectedProvider) {
      showMessage('No Provider Selected', 'No service provider selected by customer yet.', 'warning');
      return;
    }
    
    showMessage('Request Sent', 'Accident details sent to service provider. Waiting for estimate...', 'info');
    
    setTimeout(() => {
      const estimate = {
        provider: customerSelectedProvider.name,
        amount: Math.floor(Math.random() * 100000) + 50000,
        details: "Front bumper replacement, headlight repair, paint touch-up",
        date: new Date().toLocaleDateString(),
        breakdown: [
          { item: "Front Bumper", cost: 45000 },
          { item: "Headlight Assembly", cost: 25000 },
          { item: "Paint Work", cost: 35000 },
          { item: "Labor", cost: 20000 }
        ]
      };
      setRepairEstimate(estimate);
      handleStatusChange('Processing-Period-03');
      showMessage('Estimate Received', 'Repair estimate received from service provider!', 'success');
    }, 2000);
  };

  const reRequestEstimate = () => {
    setReRequestCount(prev => prev + 1);
    showMessage('Re-estimation Requested', 'Re-estimation request sent with lower budget requirements.', 'info');
  };

  const handleFinalReportChange = (field, value) => {
    setFinalReportData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCompleteFinalReport = () => {
    const requiredFields = ['vehicleNumber', 'policyNumber', 'customerName', 'accidentDate', 'serviceProvider', 'totalCost'];
    const missingFields = requiredFields.filter(field => !finalReportData[field].trim());
    
    if (missingFields.length > 0) {
      showMessage('Missing Fields', `Please fill in all required fields: ${missingFields.join(', ')}`, 'warning');
      return;
    }

    setClaims(claims.map(c => c.id === id ? { 
      ...c, 
      status: 'Completed',
      finalReport: finalReportData
    } : c));
    
    setShowFinalReportOverlay(false);
    showMessage('Report Completed', 'Final report completed successfully!', 'success');
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'Pending',
      'Investigating': 'under-review',
      'Processing-Period-01': 'under-review',
      'Processing-Period-02': 'under-review',
      'Processing-Period-03': 'under-review',
      'Approved': 'Approved',
      'Completed': 'completed',
      'Rejected': 'Rejected'
    };
    return colors[status] || 'pending';
  };

  const getStatusDisplayName = (status) => {
    const names = {
      'Pending': 'Pending',
      'Investigating': 'Investigating',
      'Processing-Period-01': 'Processing Period 01',
      'Processing-Period-02': 'Processing Period 02',
      'Processing-Period-03': 'Processing Period 03',
      'Approved': 'Approved',
      'Completed': 'Completed',
      'Rejected': 'Rejected'
    };
    return names[status] || status;
  };

  const renderStageSpecificContent = () => {
    if (!claim) return null;

    switch (claim.status) {
      case 'Pending':
        return (
          <section className="section-card stage-specific">
            <div className="section-header">
              <h3>Stage Actions</h3>
            </div>
            <div className="stage-actions">
              <div className="stage-info">
                <div className="stage-icon">📋</div>
                <div>
                  <h4>Pending Review</h4>
                  <p>Claim submitted and awaiting initial review. All basic information has been collected.</p>
                </div>
              </div>
              <button 
                className="action-btn investigating-btn"
                onClick={() => handleStatusChange('Investigating')}
              >
                Start Investigation
              </button>
            </div>
          </section>
        );

      case 'Investigating':
        return (
          <section className="section-card stage-specific">
            <div className="section-header">
              <h3>Stage Actions</h3>
            </div>
            <div className="stage-actions">
              <div className="stage-info">
                <div className="stage-icon">🔍</div>
                <div>
                  <h4>Under Investigation</h4>
                  <p>Reviewing accident details, policy coverage, and supporting documents.</p>
                </div>
              </div>
              <div className="investigation-actions">
                <button 
                  className="action-btn processing-btn"
                  onClick={() => handleStatusChange('Processing-Period-01')}
                >
                  Investigation Complete - Proceed
                </button>
                <button 
                  className="action-btn reject-btn"
                  onClick={handleReject}
                >
                  Reject Claim
                </button>
              </div>
            </div>
          </section>
        );

      case 'Processing-Period-01':
        return (
          <section className="section-card stage-specific">
            <div className="section-header">
              <h3>Service Provider Selection</h3>
            </div>
            <div className="stage-actions">
              <div className="stage-info">
                <div className="stage-icon">🔧</div>
                <div>
                  <h4>Select Service Providers</h4>
                  <p>Select recommended service providers to send to the customer.</p>
                </div>
              </div>
              <button
                className="action-btn send-btn"
                onClick={() => setShowProviderOverlay(true)}
              >
                Select Service Providers
              </button>

              {selectedServiceProviders.length > 0 && (
                <div className="selected-providers-list">
                  <h5>Selected Service Providers:</h5>
                  <div className="provider-grid">
                    {selectedServiceProviders.map(provider => (
                      <div key={provider.id} className="provider-card selected">
                        <div className="provider-info">
                          <h6>{provider.name}</h6>
                          <p>📍 {provider.location}</p>
                          <p>⭐ {provider.rating}/5</p>
                          <p>🔧 {provider.specialization}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!claim.providersSent && (
                <div className="selection-summary">
                  <p>Selected: {selectedServiceProviders.length}</p>
                  <button
                    className="action-btn send-btn"
                    onClick={() => {
                      if (selectedServiceProviders.length < 1) {
                        showMessage('Selection Required', 'Please select at least 1 service provider.', 'warning');
                        return;
                      }
                      setClaims(claims.map(c =>
                        c.id === id ? { ...c, providersSent: true } : c
                      ));
                      handleStatusChange('Processing-Period-02');
                      showMessage('Providers Sent', `${selectedServiceProviders.length} service provider(s) sent to customer.`, 'success');
                    }}
                    disabled={selectedServiceProviders.length < 1}
                  >
                    Send to Customer ({selectedServiceProviders.length})
                  </button>
                </div>
              )}
              {claim.providersSent && (
                <div className="selection-summary">
                  <p><strong>Service providers sent to customer. Waiting for selection.</strong></p>
                </div>
              )}
            </div>
          </section>
        );

      case 'Processing-Period-02':
        return (
          <section className="section-card stage-specific">
            <div className="section-header">
              <h3>Customer Service Provider Selection</h3>
            </div>
            <div className="stage-actions">
              <div className="stage-info">
                <div className="stage-icon">⚙️</div>
                <div>
                  <h4>Customer Selected Service Provider</h4>
                  <p>Customer has selected a service provider. Request repair estimate.</p>
                </div>
              </div>
              
              <div className="selected-provider">
                <h5>Customer Selected Provider:</h5>
                <div className="provider-card selected">
                  <div className="provider-info">
                    <h6>AutoFix Garage</h6>
                    <p>📍 Colombo, Sri Lanka</p>
                    <p>⭐ 4.8/5</p>
                    <p>🔧 Body Repair</p>
                  </div>
                  <div className="selected-badge">✅ Selected</div>
                </div>
                <button 
                  className="action-btn processing-btn2"
                  onClick={() => {
                    setCustomerSelectedProvider({
                      id: 1,
                      name: "AutoFix Garage",
                      location: "Colombo, Sri Lanka",
                      rating: 4.8,
                      specialization: "Body Repair"
                    });
                    requestRepairEstimate();
                  }}
                >
                  Send Accident Details & Request Repair Estimate
                </button>
              </div>
            </div>
          </section>
        );

      case 'Processing-Period-03':
        return (
          <section className="section-card stage-specific">
            <div className="section-header">
              <h3>Repair Estimate Review</h3>
            </div>
            <div className="stage-actions">
              <div className="stage-info">
                <div className="stage-icon">📄</div>
                <div>
                  <h4>Review Repair Estimate</h4>
                  <p>Review the repair estimate from the selected service provider.</p>
                  {reRequestCount > 0 && (
                    <div className="re-request-notice">
                      ⚠️ Re-estimation requested {reRequestCount} time(s) with lower budget.
                    </div>
                  )}
                </div>
              </div>

              <div className="repair-estimate">
                <div className="estimate-header">
                  <h5>Repair Estimate</h5>
                  <span className="estimate-date">{new Date().toLocaleDateString()}</span>
                </div>
                
                <div className="estimate-details">
                  <div className="estimate-total">
                    <strong>Total Amount: 125,000 LKR</strong>
                  </div>
                  <p className="estimate-description">Repairing the vehicle body and related parts.</p>
                </div>
                
                <div className="estimate-actions">
                  <button className="download-btn" onClick={() => showMessage('Download', 'Estimate document downloading.', 'info')}>📥 Download Estimate</button>
                  <div className="approval-actions">
                    <button 
                      className="action-btn approve-btn"
                      onClick={handleApprove}
                    >
                      Approve & Process
                    </button>
                    <button 
                      className="action-btn re-request-btn"
                      onClick={reRequestEstimate}
                    >
                      Request Lower Estimate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'Approved':
        return (
          <section className="section-card stage-specific">
            <div className="section-header">
              <h3>Final Report</h3>
            </div>
            <div className="stage-actions">
              <div className="stage-info">
                <div className="stage-icon">📝</div>
                <div>
                  <h4>Generate Final Report</h4>
                  <p>Create comprehensive final report with all claim details.</p>
                </div>
              </div>
              <button 
                className="action-btn final-report-btn"
                onClick={() => setShowFinalReportOverlay(true)}
              >
                Create Final Report
              </button>
            </div>
          </section>
        );

      case 'Completed':
        return (
          <section className="section-card stage-specific completed-section">
            <div className="section-header">
              <h3>Claim Completed</h3>
            </div>
            <div className="stage-actions">
              <div className="stage-info">
                <div className="stage-icon">✅</div>
                <div>
                  <h4>Claim Processing Complete</h4>
                  <p>All processing completed successfully. Final report is available.</p>
                </div>
              </div>
              
              <div className="completed-summary">
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-label">Total Claim Amount:</span>
                    <span className="summary-value">{finalReportData.totalCost} LKR</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Service Provider:</span>
                    <span className="summary-value">{finalReportData.serviceProvider}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Completion Date:</span>
                    <span className="summary-value">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Quality Rating:</span>
                    <span className="summary-value">{'⭐'.repeat(parseInt(finalReportData.qualityRating))} ({finalReportData.qualityRating}/5)</span>
                  </div>
                </div>
              </div>

              <button 
                className="action-btn download-final-btn"
                onClick={() => showMessage('Download', 'Final report downloaded successfully!', 'success')}
              >
                📥 Download Final Report
              </button>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  const shouldShowActionButtons = () => {
    return !['Pending', 'Investigating', 'Processing-Period-01', 'Processing-Period-02', 'Processing-Period-03', 'Approved'].includes(claim?.status);
  };

  if (!claim) return <div>No claim found.</div>;

  const policyDetails = PolicyDetailsTestData.find(
    policy => policy.vehicleNumber === claim.vehicleNumber
  );

  return (
    <div className="claim-details-page">
      {/* Page Header */}
      <div className="page-headerP">
        <div className="header-content">
          <div>
            <h2>Claim Details - {claim.id}</h2>
            <p>Complete claim information and processing details</p>
          </div>
        </div>
        <div className="claim-status">
          <span className={`status-badge ${getStatusColor(claim.status)}`}>
            {getStatusDisplayName(claim.status)}
          </span>
        </div>
      </div>

      {/* Stage-specific content */}
      {renderStageSpecificContent()}

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
          <h4>Photos ({claim.images?.length || 0})</h4>
          <div className="image-gallery">
            {claim.images?.map((img, i) => (
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
              <div className="document-icon red">📋</div>
              <div className="document-details">
                <h5>Police Report</h5>
                <p>Official incident report</p>
              </div>
            </div>
            <button className="document-button">View Report</button>
          </div>
          {(claim.status === 'Approved' || claim.status === 'Completed') && (
            <div className="document-item">
              <div className="document-info">
                <div className="document-icon green">📥</div>
                <div className="document-details">
                  <h5>Repair Estimate</h5>
                  <p>Garage assessment document</p>
                </div>
              </div>
              <button className="document-button">Download</button>
            </div>
          )}
        </div>
      </section>

      {/* Section 5: Customer Contact */}
      <section className="section-card">
        <div className="section-header">
          <h3>Customer Contact</h3>
        </div>
        <div className="contact-grid">
          <div className="contact-item">
            <div className="contact-icon">📞</div>
            <div className="contact-info">
              <p className="contact-label">Phone</p>
              <p className="contact-value">+94 77 123 4567</p>
            </div>
          </div>
          
          <div className="contact-item">
            <div className="contact-icon">✉️</div>
            <div className="contact-info">
              <p className="contact-label">Email</p>
              <p className="contact-value">john.silva@email.com</p>
            </div>
          </div>
          
          <div className="contact-item">
            <div className="contact-icon">📍</div>
            <div className="contact-info">
              <p className="contact-label">Address</p>
              <p className="contact-value">123 Colombo Road, Dehiwala</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Internal Notes & Actions */}
      <section className="section-card">
        <div className="section-header">
          <h3>Internal Notes</h3>
        </div>
        <div className="comment-section">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add internal comment or notes about this claim..."
          />
          <button onClick={handleAddComment}>Save Comment</button>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="action-buttons">
        <div className="buttons">
          <button className="back-btn" onClick={() => navigate(-1)}>Back</button> 
        </div>
      </div>

      {/* Service Provider Selection Overlay */}
      {showProviderOverlay && (
        <OverlayWindow closeWindowFunction={() => setShowProviderOverlay(false)}>
          <div className="overlay-content">
            <div className="search-section">
              <input 
                className="search-input"
                type="text"
                placeholder="Search by name, location, or specialization"
                value={providerSearch}
                onChange={e => setProviderSearch(e.target.value)}
              />
            </div>
            <div className="provider-grid">
              {availableServiceProviders
                .filter(provider =>
                  provider.name.toLowerCase().includes(providerSearch.toLowerCase()) ||
                  provider.location.toLowerCase().includes(providerSearch.toLowerCase()) ||
                  provider.specialization.toLowerCase().includes(providerSearch.toLowerCase())
                )
                .map(provider => (
                  <div key={provider.id} className="provider-card">
                    <div className="provider-info">
                      <h6>{provider.name}</h6>
                      <p>📍 {provider.location}</p>
                      {/* <p>⭐ {provider.rating}/5</p> */}
                      {/* <p>🔧 {provider.specialization}</p> */}
                    </div>
                    <label className="provider-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedServiceProviders.some(p => p.id === provider.id)}
                        onChange={e => handleServiceProviderSelection(provider.id, e.target.checked)}
                        disabled={
                          !selectedServiceProviders.some(p => p.id === provider.id) &&
                          selectedServiceProviders.length >= 4
                        }
                      />
                      Select
                    </label>
                  </div>
                ))}
            </div>
            <div className="selection-summary">
              <p>Selected: {selectedServiceProviders.length}</p>
              <button
                className="action-btn send-btn"
                onClick={() => setShowProviderOverlay(false)}
              >
                Done
              </button>
            </div>
          </div>
        </OverlayWindow>
      )}

      {/* Final Report Overlay */}
      {showFinalReportOverlay && (
        <OverlayWindow closeWindowFunction={() => setShowFinalReportOverlay(false)}>
          <div className="final-report-form">
            <h3>Final Claim Report</h3>
            <p className="form-subtitle">Complete all details for the final claim report</p>

            <div className="form-sections">
              {/* Basic Information Section */}
              <div className="form-section">
                <h4>Basic Information</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Vehicle Number*</label>
                    <input
                      type="text"
                      value={finalReportData.vehicleNumber}
                      onChange={(e) => handleFinalReportChange('vehicleNumber', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Policy Number*</label>
                    <input
                      type="text"
                      value={finalReportData.policyNumber}
                      onChange={(e) => handleFinalReportChange('policyNumber', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Customer Name*</label>
                    <input
                      type="text"
                      value={finalReportData.customerName}
                      onChange={(e) => handleFinalReportChange('customerName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Accident Date*</label>
                    <input
                      type="date"
                      value={finalReportData.accidentDate}
                      onChange={(e) => handleFinalReportChange('accidentDate', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Accident Details Section */}
              <div className="form-section">
                <h4>Accident Details</h4>
                <div className="form-group">
                  <label>Accident Location</label>
                  <input
                    type="text"
                    value={finalReportData.accidentLocation}
                    onChange={(e) => handleFinalReportChange('accidentLocation', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Accident Description</label>
                  <textarea
                    rows={4}
                    value={finalReportData.accidentDescription}
                    onChange={(e) => handleFinalReportChange('accidentDescription', e.target.value)}
                  />
                </div>
              </div>

              {/* Repair Details Section */}
              <div className="form-section">
                <h4>Repair Details</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Service Provider*</label>
                    <input
                      type="text"
                      value={finalReportData.serviceProvider}
                      onChange={(e) => handleFinalReportChange('serviceProvider', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Total Cost (LKR)*</label>
                    <input
                      type="text"
                      value={finalReportData.totalCost}
                      onChange={(e) => handleFinalReportChange('totalCost', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Repairs Completed</label>
                  <textarea
                    rows={3}
                    value={finalReportData.repairsCompleted}
                    onChange={(e) => handleFinalReportChange('repairsCompleted', e.target.value)}
                  />
                </div>
              </div>

              {/* Inspection Details Section */}
              <div className="form-section">
                <h4>Inspection Details</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Inspection Date</label>
                    <input
                      type="date"
                      value={finalReportData.inspectionDate}
                      onChange={(e) => handleFinalReportChange('inspectionDate', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Inspector Name</label>
                    <input
                      type="text"
                      value={finalReportData.inspectorName}
                      onChange={(e) => handleFinalReportChange('inspectorName', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Quality Rating</label>
                    <select
                      value={finalReportData.qualityRating}
                      onChange={(e) => handleFinalReportChange('qualityRating', e.target.value)}
                    >
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Good</option>
                      <option value="3">3 - Average</option>
                      <option value="2">2 - Below Average</option>
                      <option value="1">1 - Poor</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Additional Notes</label>
                  <textarea
                    rows={3}
                    value={finalReportData.additionalNotes}
                    onChange={(e) => handleFinalReportChange('additionalNotes', e.target.value)}
                    placeholder="Any additional observations or notes..."
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setShowFinalReportOverlay(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="complete-btn"
                onClick={handleCompleteFinalReport}
              >
                Complete Final Report
              </button>
            </div>
          </div>
        </OverlayWindow>
      )}

      {/* Message Popup */}
      {showMessagePopup && (
        <div className="message-popup-overlay" onClick={() => setShowMessagePopup(false)}>
          <div className="message-popup" onClick={(e) => e.stopPropagation()}>
            <div className={`message-popup-icon ${messagePopupContent.type}`}>
              {messagePopupContent.type === 'success' && '✓'}
              {messagePopupContent.type === 'error' && '✕'}
              {messagePopupContent.type === 'warning' && '⚠'}
              {messagePopupContent.type === 'info' && 'ℹ'}
            </div>
            <h3 className="message-popup-title">{messagePopupContent.title}</h3>
            <p className="message-popup-message">{messagePopupContent.message}</p>
            <button 
              className="message-popup-close-btn"
              onClick={() => setShowMessagePopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceClaimDetailsPage;