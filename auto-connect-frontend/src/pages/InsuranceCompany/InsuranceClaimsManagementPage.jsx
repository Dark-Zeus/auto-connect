import React, { useEffect, useState } from 'react';
import './InsuranceClaimsManagementPage.css';
import { useNavigate, useLocation } from "react-router-dom";
import ClaimDetailsTestData from './testData/ClaimDetailsTestData';

import * as InsuranceClaimsApiService from '../../services/insuranceClaimApiService';
import { toast } from 'react-toastify';

// Status color mapping
const getStatusColor = (status) => {
  const statusColors = {
    'Pending': 'status-pending',
    'Investigating': 'status-investigating',
    'Processing-Period-01': 'status-processing-1',
    'Processing-Period-02': 'status-processing-2',
    'Processing-Period-03': 'status-processing-3',
    'Approved': 'status-approved',
    'Completed': 'status-completed',
    'Rejected': 'status-rejected'
  };
  return statusColors[status] || 'status-default';
};

const InsuranceClaimsManagement = () => {
  const [claims, setClaims] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const isFraudMode = new URLSearchParams(location.search).get('fraudMode') === 'true';

  const [statusFilter, setStatusFilter] = useState(isFraudMode ? 'Rejected' : '');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [claimsPerPage, setClaimsPerPage] = useState(10);

  // Define status priority order
  const statusOrder = {
    'Pending': 1,
    'Investigating': 2,
    'Processing-Period-01': 3,
    'Processing-Period-02': 4,
    'Processing-Period-03': 5,
    'Approved': 6,
    'Completed': 7,
    'Rejected': 8
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    if (!isFraudMode) {
      setStatusFilter('');
    }
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  const fetchClaims = async () => {
    try {
      // Fetch claims from API
      const data = await InsuranceClaimsApiService.getInsuranceClaimsByCompany();
      setClaims(data.data); // Uncomment when integrating with real API
      toast.success("Insurance claims fetched successfully");
    } catch (error) {
      toast.error(error.message || "Error fetching insurance claims");
      console.error("Error fetching insurance claims:", error);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  // Filter and sort claims
  const filteredAndSortedClaims = claims
    .filter(claim => {
      const searchMatch =
        claim._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim?.vehicleRef?.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (claim?.customerRef?.firstName + ' ' + claim?.customerRef?.lastName).toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch = statusFilter ? claim.status.toLowerCase() === statusFilter.toLowerCase() : true;

      const dateMatch =
        (!startDate || new Date(claim.date) >= new Date(startDate)) &&
        (!endDate || new Date(claim.date) <= new Date(endDate));

      return searchMatch && statusMatch && dateMatch;
    })
    .sort((a, b) => {
      // First, sort by status priority
      const statusA = statusOrder[a.status] || 999;
      const statusB = statusOrder[b.status] || 999;

      if (statusA !== statusB) {
        return statusA - statusB;
      }

      // If status is the same, sort by date in descending order (newest first)
      return new Date(b.date) - new Date(a.date);
    });

  // Pagination logic
  const indexOfLastClaim = currentPage * claimsPerPage;
  const indexOfFirstClaim = indexOfLastClaim - claimsPerPage;
  const currentClaims = filteredAndSortedClaims.slice(indexOfFirstClaim, indexOfLastClaim);

  const totalPages = Math.ceil(filteredAndSortedClaims.length / claimsPerPage);

  return (
    <div className="claim-management-page">

      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-title">
            <h2>{isFraudMode ? 'Fraud Detection Center' : 'Claims Management'}</h2>
            <p>{isFraudMode ? 'Monitor and investigate rejected claims for potential fraudulent activities.' : 'View, search, and filter all insurance claims. Click on a claim to view details.'}</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="filter-section">
        <input
          type="text"
          placeholder="Claim ID, Vehicle number or Customer"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`filter-select ${isFraudMode ? 'filter-disabled' : ''}`}
          disabled={isFraudMode}
          title={isFraudMode ? "Status filter is locked to Rejected claims only" : ""}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Investigating">Investigating</option>
          <option value="Processing-Period-01">Processing-Period-01</option>
          <option value="Processing-Period-02">Processing-Period-02</option>
          <option value="Processing-Period-03">Processing-Period-03</option>
          <option value="Approved">Approved</option>
          <option value="Completed">Completed</option>
          <option value="Rejected">Rejected</option>
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="date-input"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="date-input"
        />

        <button onClick={clearFilters} className="clear-btn">Clear Filters</button>
      </div>

      {/* Claims Table */}
      <div className="table-wrapper">
        <table className="claims-table">
          <thead>
            <tr>
              <th>Claim ID</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>VehicleNumber</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {currentClaims.length > 0 ? (
              currentClaims.map(claim => (
                <tr
                  key={claim.id}
                  onClick={() => navigate(`/insurance-claims/${claim._id}`)}
                >
                  <td>{claim._id}</td>
                  <td>{claim.customerRef?.firstName + ' ' + claim.customerRef?.lastName}</td>
                  <td>{claim.vehicleRef?.model + ' ' + claim.vehicleRef?.make}</td>
                  <td>{claim.vehicleRef?.registrationNumber}</td>
                  <td>{claim.incidentType}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(claim.status)}`}>
                      {claim.status}
                    </span>
                  </td>
                  <td>{
                    new Date(claim.incidentAt).toLocaleString([], {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  }</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '1rem' }}>
                  {isFraudMode ? 'No rejected claims found.' : 'No claims found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className='pagination-container'>
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                &lt;&lt;
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={currentPage === i + 1 ? 'active' : ''}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                &gt;&gt;
              </button>

              <span style={{ marginLeft: '1rem' }}>Per Page</span>

              {/* Claims Per Page Selector */}
              <select
                value={claimsPerPage}
                onChange={(e) => {
                  setClaimsPerPage(Number(e.target.value));
                  setCurrentPage(1); // reset to first page
                }}
                className="claims-per-page"
              >
                {[5, 10, 20, 50, 100].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsuranceClaimsManagement;