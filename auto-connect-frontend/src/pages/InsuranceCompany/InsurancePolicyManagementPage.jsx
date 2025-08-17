import React, { useState } from 'react';
import './InsurancePolicyManagementPage.css';
import { useNavigate } from "react-router-dom";
import PolicyDetailsTestData from './testData/PolicyDetailsTestData';

const InsurancePolicyManagement = () => {
  const [policies] = useState([...PolicyDetailsTestData]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [policiesPerPage, setPoliciesPerPage] = useState(10);

  const navigate = useNavigate();

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setTypeFilter('');
    setCurrentPage(1);
  };

  // Navigate to Add New Policy page
  const handleAddNewPolicy = () => {
    navigate('/addnewpolicy');
  };

  // Filter policies
  const filteredPolicies = policies.filter(policy => {
    const searchMatch =
      policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = statusFilter ? policy.status.toLowerCase() === statusFilter.toLowerCase() : true;
    
    const typeMatch = typeFilter ? policy.policyType.toLowerCase() === typeFilter.toLowerCase() : true;

    return searchMatch && statusMatch && typeMatch;
  });

  // Pagination logic
  const indexOfLastPolicy = currentPage * policiesPerPage;
  const indexOfFirstPolicy = indexOfLastPolicy - policiesPerPage;
  const currentPolicies = filteredPolicies.slice(indexOfFirstPolicy, indexOfLastPolicy);

  const totalPages = Math.ceil(filteredPolicies.length / policiesPerPage);

  return (
    <div className="policy-management-page">

      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-title">
            <h2>Policy Management</h2>
            <p>View, search, and filter all insurance policies. Click on a policy to view details.</p>
          </div>
        </div>
        <button onClick={handleAddNewPolicy} className="add-policy-btn">
          Add New Policy
        </button>
      </div>
      
      {/* Search and Filter Section */}
      <div className="filter-section">
        <input
          type="text"
          placeholder="Policy Number, Vehicle Number, Customer or Vehicle Model"
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
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Types</option>
          <option value="comprehensive">Comprehensive</option>
          <option value="third party">Third Party</option>
          <option value="third party fire theft">Third Party Fire & Theft</option>
        </select>
      </div>

      {/* Policies Table */}
      <div className="table-wrapper">
        <table className="policies-table">
          <thead>
            <tr>
              <th>Policy Number</th>
              <th>Customer</th>
              <th>Vehicle Number</th>
              <th>Vehicle Model</th>
              <th>Policy Type</th>
              <th>Premium (LKR)</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentPolicies.length > 0 ? (
              currentPolicies.map(policy => (
                <tr 
                  key={policy.policyNumber} 
                  onClick={() => navigate(`/insurancepolicydetails/${policy.policyNumber}`)}
                >
                  <td>{policy.policyNumber}</td>
                  <td>{policy.customerName}</td>
                  <td>{policy.vehicleNumber}</td>
                  <td>{policy.vehicleModel}</td>
                  <td>{policy.policyType}</td>
                  <td>{policy.premium.toLocaleString()}</td>
                  <td>{policy.startDate}</td>
                  <td>{policy.endDate}</td>
                  <td>{policy.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '1rem' }}>
                  No policies found.
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

              {/* Policies Per Page Selector */}
              <select
                value={policiesPerPage}
                onChange={(e) => {
                  setPoliciesPerPage(Number(e.target.value));
                  setCurrentPage(1); // reset to first page
                }}
                className="policies-per-page"
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

export default InsurancePolicyManagement;