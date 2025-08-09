import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import './InsuranceClaimDetailsPage.css';

const InsuranceClaimDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // In real app, fetch claim from backend using id
  const [claims, setClaims] = useState([
    {
      id: 'CLM-2024-001',
      customer: 'John Silva',
      vehicle: 'Honda Civic - ABC-1234',
      type: 'Accident',
      amount: 150000,
      status: 'Pending',
      date: '2024-08-05',
      accidentReport: 'Rear-end collision at Galle Road intersection.',
      images: ['/uploads/claim1_img1.jpg', '/uploads/claim1_img2.jpg'],
      policeReport: '/uploads/police_report_001.pdf',
      comments: ''
    },
    {
      id: 'CLM-2024-002',
      customer: 'Sarah Fernando',
      vehicle: 'Toyota Prius - XYZ-5678',
      type: 'Theft',
      amount: 280000,
      status: 'Under Review',
      date: '2024-08-04',
      accidentReport: 'Vehicle stolen from parking lot, CCTV footage available.',
      images: ['/uploads/claim2_img1.jpg'],
      policeReport: '/uploads/police_report_002.pdf',
      comments: ''
    }
  ]);

  const claim = claims.find(c => c.id === id);
  const [comment, setComment] = useState(claim?.comments || '');

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

  return (
    <div className="claim-details-modal">
      <h3>Claim Details: {claim.id}</h3>
      <div className="claim-details-content">
        <h6><strong>Customer:</strong> {claim.customer}</h6>
        <h6><strong>Vehicle:</strong> {claim.vehicle}</h6>
        <h6><strong>Type:</strong> {claim.type}</h6>
        <h6><strong>Amount:</strong> {claim.amount.toLocaleString()} LKR</h6>
        <h6><strong>Status:</strong> {claim.status}</h6>
        <h6><strong>Date:</strong> {claim.date}</h6>
        <h6><strong>Accident Report:</strong> {claim.accidentReport}</h6>

        <div>
          <h6><strong>Uploaded Images:</strong></h6>
          <div className="image-gallery">
            {claim.images.map((img, i) => (
              <img key={i} src={img} alt={`claim-${i}`} />
            ))}
          </div>
        </div>

        <p>
          <strong>Police Report:</strong> 
          <a href={claim.policeReport} target="_blank" rel="noopener noreferrer"> View Report</a>
        </p>
      </div>

      <div className="comment-section">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add internal comment..."
        />
        <button onClick={handleAddComment}>Save Comment</button>
      </div>

      <div className="action-buttons">
        <button className="approve-btn" onClick={handleApprove}>Approve</button>
        <button className="reject-btn" onClick={handleReject}>Reject</button>
        <button className="close-btn" onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
};

export default InsuranceClaimDetailsPage;
