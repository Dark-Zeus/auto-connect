import React, { useState } from 'react';
import './InsuranceModuleCSS/InsuranceClaimsManagementPage.css';
import { useNavigate } from "react-router-dom";
import ClaimDetailsTestData from './testData/ClaimDetailsTestData';

const InsuranceClaimsManagement = () => {
  const [claims] = useState([...ClaimDetailsTestData]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [claimsPerPage, setClaimsPerPage] = useState(10);

  const navigate = useNavigate();

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  // Filter claims
  const filteredClaims = claims.filter(claim => {
    const searchMatch =
      claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.customer.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = statusFilter ? claim.status.toLowerCase() === statusFilter.toLowerCase() : true;

    const dateMatch =
      (!startDate || new Date(claim.date) >= new Date(startDate)) &&
      (!endDate || new Date(claim.date) <= new Date(endDate));

    return searchMatch && statusMatch && dateMatch;
  });

  // Pagination logic
  const indexOfLastClaim = currentPage * claimsPerPage;
  const indexOfFirstClaim = indexOfLastClaim - claimsPerPage;
  const currentClaims = filteredClaims.slice(indexOfFirstClaim, indexOfLastClaim);

  const totalPages = Math.ceil(filteredClaims.length / claimsPerPage);

  return (
    <div className="claim-management-page">

      {/* Page Header */}
      <div className="page-header">
        <h2>Claims Management</h2>
        <p>View, search, and filter all insurance claims. Click on a claim to view details.</p>
      </div>
      
      {/* Search and Filter Section */}
      <div className="filter-section">
        <input
          type="text"
          placeholder="Search by Claim ID, Vehicle or Customer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="investigating">Investigating</option>
          <option value="approved">Approved</option>
          <option value="processing">Processing</option>
          <option value="rejected">Rejected</option>
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
            <th>Type</th>
            <th>Amount (LKR)</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {currentClaims.length > 0 ? (
            currentClaims.map(claim => (
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
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '1rem' }}>
                No claims found.
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
