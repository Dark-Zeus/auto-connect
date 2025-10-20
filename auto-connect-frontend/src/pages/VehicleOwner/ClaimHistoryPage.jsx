import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ClaimHistoryPage.css';

import * as insuranceClaimApiService from '@services/insuranceClaimApiService';

// Context to get current user info can be added here
import { useContext } from 'react';
import UserContext from '@contexts/UserContext';

const ClaimHistoryPage = () => {
  const navigate = useNavigate();

  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [claimsPerPage, setClaimsPerPage] = useState(10);

  const { userContext } = useContext(UserContext);

  useEffect(() => {
    // Fetch claims for the current user
    const fetchClaims = async () => {
      try {
        // use user id
        const data = await insuranceClaimApiService.getInsuranceClaimsByCustomer(userContext.id);
        setClaims(data.data);
      } catch (error) {
        console.error('Error fetching claims:', error);
      }
    };

    fetchClaims();
  }, [userContext.id]);

  useEffect(() => {
    let filtered = [...claims];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(claim =>
        claim._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.incidentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.vehicleRef?.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.vehicleRef?.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.vehicleRef?.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(claim => claim.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Apply date filter
    if (startDate) {
      filtered = filtered.filter(claim => new Date(claim.date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(claim => new Date(claim.date) <= new Date(endDate));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortBy === 'amount') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredClaims(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [claims, searchTerm, statusFilter, startDate, endDate, sortBy, sortOrder]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  // Pagination logic
  const indexOfLastClaim = currentPage * claimsPerPage;
  const indexOfFirstClaim = indexOfLastClaim - claimsPerPage;
  const currentClaims = filteredClaims.slice(indexOfFirstClaim, indexOfLastClaim);
  const totalPages = Math.ceil(filteredClaims.length / claimsPerPage);

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'status-pending',
      'investigating': 'status-investigating',
      'processing-period-01': 'status-processing',
      'processing-period-02': 'status-processing',
      'processing-period-03': 'status-processing',
      'approved': 'status-approved',
      'rejected': 'status-rejected'
    };
    return colors[status.toLowerCase()] || 'status-pending';
  };

  const getStatusDisplayName = (status) => {
    const names = {
      'pending': 'Pending Review',
      'investigating': 'Under Investigation',
      'processing-period-01': 'Processing-Period-01',
      'processing-period-02': 'Processing-Period-02',
      'processing-period-03': 'Processing-Period-03',
      'approved': 'Approved',
      'rejected': 'Rejected'
    };
    return names[status.toLowerCase()] || status;
  };

  const handleClaimClick = (claimId) => {
    console.log('Navigating to claim:', claimId);
    // Updated to match the new route parameter name
    navigate(`/userclaimdetails/${claimId}`);
  };

  const handleNewClaim = () => {
    navigate('/claimsrequestform');
  };

  // Add cursor pointer style to table rows
  const tableRowStyle = {
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  };

  return (
    <div className="claim-management-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-title">
            <h2>My Insurance Claims</h2>
            <p>Track and manage your insurance claims</p>
          </div>
          <div className="header-actions">
            <button className="new-claim-btn" onClick={handleNewClaim}>
              New Claim Request
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="filter-section">
        <input
          type="text"
          placeholder="Search by Claim ID, Type, or Vehicle"
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
          <option value="Pending">Pending</option>
          <option value="Investigating">Investigating</option>
          <option value="Processing-Period-01">Processing-Period-01</option>
          <option value="Processing-Period-02">Processing-Period-02</option>
          <option value="Processing-Period-03">Processing-Period-03</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="date-input"
          placeholder="Start Date"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="date-input"
          placeholder="End Date"
        />

        <button onClick={clearFilters} className="clear-btn">Clear Filters</button>
      </div>

      {/* Simple Claims Table */}
      <div className="table-wrapper">
        <table className="claims-table">
          <thead>
            <tr>
              <th>Claim ID</th>
              <th>Vehicle</th>
              <th>Vehicle Number</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {currentClaims.length > 0 ? (
              currentClaims.map(claim => (
                <tr
                  key={claim._id}
                  onClick={() => handleClaimClick(claim._id)}
                  style={tableRowStyle}
                  onMouseEnter={(e) => e.target.closest('tr').style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.target.closest('tr').style.backgroundColor = 'transparent'}
                  title="Click to view claim details"
                >
                  <td>{claim._id}</td>
                  <td>{claim.vehicleRef?.model + ' ' + claim.vehicleRef?.make}</td>
                  <td>{claim.vehicleRef?.registrationNumber}</td>
                  <td>{claim.incidentType}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(claim.status)}`}>
                      {getStatusDisplayName(claim.status)}
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
                <td colSpan="8" className="empty-row">
                  <div className="empty-state">
                    <div className="empty-icon">📄</div>
                    <h3>No Claims Found</h3>
                    <p>
                      {searchTerm || statusFilter || startDate
                        ? "No claims match your current filters. Try adjusting your search criteria."
                        : "You haven't submitted any insurance claims yet. When you do, they'll appear here."
                      }
                    </p>
                    {!searchTerm && !statusFilter && !startDate && (
                      <button className="empty-action-btn" onClick={handleNewClaim}>
                        Submit Your First Claim
                      </button>
                    )}
                  </div>
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

              <select
                value={claimsPerPage}
                onChange={(e) => {
                  setClaimsPerPage(Number(e.target.value));
                  setCurrentPage(1);
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

      {/* Summary Footer */}
      <div className="table-footer">
        <div className="results-info">
          Showing {currentClaims.length} of {filteredClaims.length} claims (Total: {claims.length})
        </div>
        <div className="quick-stats">
          <span className="quick-stat">
            <span className="stat-icon">⏳</span>
            {claims.filter(c => c.status.toLowerCase().includes('processing') || c.status.toLowerCase() === 'investigating').length} Active
          </span>
          <span className="quick-stat">
            <span className="stat-icon">✅</span>
            {claims.filter(c => c.status.toLowerCase() === 'approved').length} Completed
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClaimHistoryPage;