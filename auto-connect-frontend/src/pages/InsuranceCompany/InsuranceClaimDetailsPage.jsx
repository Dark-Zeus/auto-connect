import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import './InsuranceClaimDetailsPage.css';
import ClaimDetailsTestData from './testData/ClaimDetailsTestData';
import PolicyDetailsTestData from './testData/PolicyDetailsTestData';

const InsuranceClaimDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data
  const [claims, setClaims] = useState([...ClaimDetailsTestData]);
  const claim = claims.find(c => c.id === id);
  const [comment, setComment] = useState('');

  React.useEffect(() => {
    setComment(claim?.comments || '');
  }, [claim]);

  const handleApprove = () => {
    setClaims(claims.map(c => c.id === id ? { ...c, status: 'Approved' } : c));
    navigate(-1);
  };

  const handleReject = () => {
    setClaims(claims.map(c => c.id === id ? { ...c, status: 'Rejected' } : c));
    navigate(-1);
  };

  const handleAddComment = () => {
    setClaims(claims.map(c => c.id === id ? { ...c, comments: comment } : c));
  };

  if (!claim) return <div>No claim found.</div>;

  // Mock policy details (replace with backend fetch in real app)
  const policyDetails = PolicyDetailsTestData.find(
    policy => policy.vehicleNumber === claim.vehicleNumber
  );

  return (
    <div className="claim-details-page">

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
            {/* Add more fields as needed */}
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
        </div>
      </section>

      {/* Customer Contact */}
      <section className="section-card">
        <div className="section-header">
          <h3>Customer Contact</h3>
        </div>
        <div className='contact-grid'>
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

      {/* Section 5: Internal Notes & Actions */}
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
          <button onClick={handleAddComment}>
            Save Comment
          </button>
        </div>
      </section>

      <div className="action-buttons">
        <button className="approve-btn" onClick={handleApprove}>
          Approve
        </button>
        <button className="reject-btn" onClick={handleReject}>
          Reject
        </button>
        <button className="close-btn" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
};

export default InsuranceClaimDetailsPage;