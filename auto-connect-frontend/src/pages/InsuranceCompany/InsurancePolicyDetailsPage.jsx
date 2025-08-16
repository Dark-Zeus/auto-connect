import React, { useState, useEffect } from 'react';
import './InsurancePolicyDetailsPage.css';
import { useNavigate, useParams } from "react-router-dom";
import PolicyDetailsTestData from './testData/PolicyDetailsTestData';
import ClaimDetailsTestData from './testData/ClaimDetailsTestData';
import PolicyHistoryTestData from './testData/PolicyHistoryTestData';

const InsurancePolicyDetailsPage = () => {
  const { policyNumber } = useParams();
  const navigate = useNavigate();
  
  const [policyDetails, setPolicyDetails] = useState(null);
  const [currentClaim, setCurrentClaim] = useState(null);
  const [claimsHistory, setClaimsHistory] = useState([]);
  const [policyHistory, setPolicyHistory] = useState([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');

  useEffect(() => {
    // Find policy details
    const policy = PolicyDetailsTestData.find(policy => policy.policyNumber === policyNumber);
    setPolicyDetails(policy);

    if (policy) {
      // Find current active claim for this vehicle
      const activeClaim = ClaimDetailsTestData.find(claim => 
        claim.vehicleNumber === policy.vehicleNumber && 
        (claim.status === 'pending' || claim.status === 'investigating' || claim.status === 'processing')
      );
      setCurrentClaim(activeClaim);

      // Get all claims history for this vehicle
      const vehicleClaims = ClaimDetailsTestData.filter(claim => 
        claim.vehicleNumber === policy.vehicleNumber
      );
      setClaimsHistory(vehicleClaims);

      // Get policy history for this vehicle
      const vehiclePolicyHistory = PolicyHistoryTestData.filter(history => 
        history.vehicleNumber === policy.vehicleNumber
      );
      setPolicyHistory(vehiclePolicyHistory);
    }
  }, [policyNumber]);

  if (!policyDetails) {
    return (
      <div className="policy-details-page">
        <div className="section-card">
          <h2>Policy Not Found</h2>
          <p>The policy with number {policyNumber} could not be found.</p>
          <div className="action-buttons">
            <button onClick={() => navigate('/policymanagement')} className="back-btn">
              ← Back to Policies
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleClaimNavigation = (claimId) => {
    navigate(`/insurance-claims/${claimId}`);
  };

  const handleStatusChange = () => {
    setNewStatus(policyDetails.status);
    setStatusReason('');
    setShowStatusModal(true);
  };

  const handleStatusSave = () => {
    if (newStatus && statusReason.trim()) {
      // Update the policy status
      setPolicyDetails(prev => ({
        ...prev,
        status: newStatus
      }));
      
      // Here you would typically make an API call to save the status change
      console.log('Status changed to:', newStatus, 'Reason:', statusReason);
      
      // Close modal and reset form
      setShowStatusModal(false);
      setNewStatus('');
      setStatusReason('');
      
      // You could show a success message here
      alert('Status updated successfully!');
    } else {
      alert('Please select a status and provide a reason.');
    }
  };

  const handleModalClose = () => {
    setShowStatusModal(false);
    setNewStatus('');
    setStatusReason('');
  };

  const getStatusBadgeClass = (status) => {
    switch(status.toLowerCase()) {
      case 'active': return 'status-active';
      case 'expired': return 'status-expired';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  };

  const getHistoryIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'active': return { class: 'green', icon: '✓' };
      case 'expired': return { class: 'red', icon: '×' };
      case 'cancelled': return { class: 'yellow', icon: '!' };
      default: return { class: 'blue', icon: 'ℹ' };
    }
  };

  return (
    <div className="policy-details-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Policy Details</h1>
          <div className="policy-info-header">
            <p className="policy-number-header">{policyDetails.policyNumber}</p>
            <span className={`status-badge-header ${getStatusBadgeClass(policyDetails.status)}`}>
              {policyDetails.status}
            </span>
          </div>
        </div>
        <div className="header-right">
          <button className="change-status-btn" onClick={handleStatusChange}>
            Change Status
          </button>
          <button className="edit-details-btn">
            Edit Details
          </button>
        </div>
      </div>

      {/* Vehicle & Policy Information Section */}
      <div className="section-card">
        <h3>Vehicle & Policy Information</h3>
        <div className="policy-info-grid">
          <div className="info-item">
            <span className="info-icon">📋</span>
            <div className="info-content">
              <p className="info-label">Policy Number</p>
              <p className="info-value">{policyDetails.policyNumber}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">👤</span>
            <div className="info-content">
              <p className="info-label">Customer Name</p>
              <p className="info-value">{policyDetails.customerName}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">🚗</span>
            <div className="info-content">
              <p className="info-label">Vehicle Number</p>
              <p className="info-value">{policyDetails.vehicleNumber}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">🚙</span>
            <div className="info-content">
              <p className="info-label">Vehicle Model</p>
              <p className="info-value">{policyDetails.vehicleModel}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">🛡️</span>
            <div className="info-content">
              <p className="info-label">Policy Type</p>
              <p className="info-value">{policyDetails.policyType}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">💰</span>
            <div className="info-content">
              <p className="info-label">Premium Amount</p>
              <p className="info-value">LKR {policyDetails.premium.toLocaleString()}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">📅</span>
            <div className="info-content">
              <p className="info-label">Policy Start Date</p>
              <p className="info-value">{policyDetails.startDate}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">📅</span>
            <div className="info-content">
              <p className="info-label">Policy End Date</p>
              <p className="info-value">{policyDetails.endDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Details Section */}
      <div className="section-card">
        <h3>Customer Details</h3>
        <div className="policy-info-grid">
          <div className="info-item">
            <span className="info-icon">👤</span>
            <div className="info-content">
              <p className="info-label">Full Name</p>
              <p className="info-value">{policyDetails.customerName}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">🆔</span>
            <div className="info-content">
              <p className="info-label">NIC Number</p>
              <p className="info-value">{policyDetails.nic}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">📍</span>
            <div className="info-content">
              <p className="info-label">Address</p>
              <p className="info-value">{policyDetails.address}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">📞</span>
            <div className="info-content">
              <p className="info-label">Contact Number</p>
              <p className="info-value">{policyDetails.contactNo}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">📧</span>
            <div className="info-content">
              <p className="info-label">Email Address</p>
              <p className="info-value">{policyDetails.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Active Claim Section */}
      <div className="section-card">
        <h3>Current Active Claim</h3>
        {currentClaim ? (
          <div>
            <div className="policy-info-grid">
              <div className="info-item">
                <span className="info-icon">🆔</span>
                <div className="info-content">
                  <p className="info-label">Claim ID</p>
                  <p className="info-value">{currentClaim.id}</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📝</span>
                <div className="info-content">
                  <p className="info-label">Claim Type</p>
                  <p className="info-value">{currentClaim.type}</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">💵</span>
                <div className="info-content">
                  <p className="info-label">Claim Amount</p>
                  <p className="info-value">LKR {currentClaim.amount.toLocaleString()}</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📊</span>
                <div className="info-content">
                  <p className="info-label">Claim Status</p>
                  <p className="info-value">
                    <span className={`status-badge ${getStatusBadgeClass(currentClaim.status)}`}>
                      {currentClaim.status}
                    </span>
                  </p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📅</span>
                <div className="info-content">
                  <p className="info-label">Claim Date</p>
                  <p className="info-value">{currentClaim.date}</p>
                </div>
              </div>
            </div>
            
            <div className="action-buttons">
              <button 
                onClick={() => handleClaimNavigation(currentClaim.id)}
                className="view-claim-btn"
              >
                View Claim Details →
              </button>
            </div>
          </div>
        ) : (
          <div className="no-claims-message">
            <span className="no-claims-icon">ℹ️</span>
            <div>
              <h4>No Active Claims</h4>
              <p>No active claims for this vehicle at the moment.</p>
            </div>
          </div>
        )}
      </div>

      {/* Claims History Section */}
      <div className="section-card">
        <h3>Claims History</h3>
        {claimsHistory.length > 0 ? (
          <div className="history-list">
            {claimsHistory.map(claim => {
              const iconInfo = getHistoryIcon(claim.status);
              return (
                <div key={claim.id} className="history-item">
                  <div className="history-info">
                    <div className={`history-icon ${iconInfo.class}`}>
                      {iconInfo.icon}
                    </div>
                    <div className="history-details">
                      <h5>{claim.id} - {claim.type}</h5>
                      <p>LKR {claim.amount.toLocaleString()} • {claim.date} • 
                        <span className={`status-badge ${getStatusBadgeClass(claim.status)}`}>
                          {claim.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleClaimNavigation(claim.id)}
                    className="history-button"
                  >
                    View Details →
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-claims-message">
            <span className="no-claims-icon">📋</span>
            <div>
              <h4>No Claims History</h4>
              <p>No claims history available for this vehicle.</p>
            </div>
          </div>
        )}
      </div>

      {/* Policy History Section */}
      <div className="section-card">
        <h3>Policy History</h3>
        {policyHistory.length > 0 ? (
          <div className="history-list">
            {policyHistory.map((policy, index) => {
              const iconInfo = getHistoryIcon(policy.status);
              return (
                <div key={index} className="history-item">
                  <div className="history-info">
                    <div className={`history-icon ${iconInfo.class}`}>
                      {iconInfo.icon}
                    </div>
                    <div className="history-details">
                      <h5>{policy.policyNumber} - {policy.policyType}</h5>
                      <p>LKR {policy.premium.toLocaleString()} • {policy.startDate} to {policy.endDate} • 
                        <span className={`status-badge ${getStatusBadgeClass(policy.status)}`}>
                          {policy.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-claims-message">
            <span className="no-claims-icon">📜</span>
            <div>
              <h4>No Policy History</h4>
              <p>No policy history available for this vehicle.</p>
            </div>
          </div>
        )}
      </div>

      {/* Back to Policies Button - Moved to bottom */}
      <div className="bottom-action-buttons">
        <button onClick={() => navigate('/policymanagement')} className="back-btn">
          ← Back to Policies
        </button>
      </div>

      {/* Status Change Modal */}
      {showStatusModal && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change Policy Status</h3>
              <button className="modal-close-btn" onClick={handleModalClose}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Select New Status:</label>
                <select 
                  className="form-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Reason for Status Change:</label>
                <textarea
                  className="form-textarea"
                  placeholder="Please provide a reason for this status change..."
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  rows="4"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-cancel-btn" onClick={handleModalClose}>
                Cancel
              </button>
              <button className="modal-save-btn" onClick={handleStatusSave}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsurancePolicyDetailsPage;