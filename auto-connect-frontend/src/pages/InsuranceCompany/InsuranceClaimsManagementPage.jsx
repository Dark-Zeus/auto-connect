import React, { useState } from 'react';
import './InsuranceClaimsManagementPage.css';
import { useNavigate } from "react-router-dom";

const InsuranceClaimsManagement = () => {
  const [claims] = useState([
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

  const navigate = useNavigate();

  return (
    <div className="claim-management-page">
      <h2>Claim Management</h2>
      <table className="claims-table">
        <thead>
          <tr>
            <th>Claim ID</th>
            <th>Customer</th>
            <th>Vehicle</th>
            <th>Type</th>
            <th>Amount (LKR)</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {claims.map(claim => (
            <tr 
              key={claim.id} 
              onClick={() => navigate(`/insurance-claims/${claim.id}`)}
            >
              <td>{claim.id}</td>
              <td>{claim.customer}</td>
              <td>{claim.vehicle}</td>
              <td>{claim.type}</td>
              <td>{claim.amount.toLocaleString()}</td>
              <td>{claim.status}</td>
              <td>{claim.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InsuranceClaimsManagement;
