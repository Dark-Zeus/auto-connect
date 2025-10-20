import React, { useState, useEffect } from 'react';
import './InsurancePolicyManagementPage.css';
import { useNavigate } from "react-router-dom";
import PolicyDetailsTestData from './testData/PolicyDetailsTestData';

import * as insurancePolicyApiService from "@services/insurancePolicyApiService"; // Ensure the service is imported
import { toast } from 'react-toastify';

const InsurancePolicyManagement = () => {
  const [policies, setPolicies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [policiesPerPage, setPoliciesPerPage] = useState(10);

  const [policyTypes, setPolicyTypes] = useState([]);

  const navigate = useNavigate();

  // Function to check if policy is expired
  const checkIfExpired = (endDate) => {
    const today = new Date();
    const policyEndDate = new Date(endDate);
    return policyEndDate < today;
  };

  // Function to update expired policies
  const updateExpiredPolicies = (policiesData) => {
    return policiesData.map(policy => {
      if (checkIfExpired(policy.endDate) && policy.status.toLowerCase() !== 'expired') {
        // Update the policy status to expired
        const updatedPolicy = { ...policy, status: 'Expired' };
        
        // Update in the original data source
        const policyIndex = PolicyDetailsTestData.findIndex(p => p.policyNumber === policy.policyNumber);
        if (policyIndex !== -1) {
          PolicyDetailsTestData[policyIndex].status = 'Expired';
        }
        
        return updatedPolicy;
      }
      return policy;
    });
  };

  // Initialize and check for expired policies on component mount
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const data = await insurancePolicyApiService.getAllInsurancePolicies();
        const updatedPolicies = updateExpiredPolicies(data.data);
        setPolicies(updatedPolicies);
      } catch (error) {
        console.error("Error fetching policies:", error);
      }
    };

    const fetchPolicyTypes = async () => {
      try {
        const typesData = await insurancePolicyApiService.getAllInsurancePolicyTypes();
        setPolicyTypes(typesData.data);
      } catch (error) {
        toast.error("Failed to fetch policy types.");
        console.error("Error fetching policy types:", error);
      }
    };

   // fetchPolicyTypes();
    fetchPolicies();
  }, []);

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
      policy.vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = statusFilter ? policy.status.toLowerCase() === statusFilter.toLowerCase() : true;
    
    const typeMatch = typeFilter ? policy.policyType.toLowerCase() === typeFilter.toLowerCase() : true;

    return searchMatch && statusMatch && typeMatch;
  });

  // Pagination logic
  const indexOfLastPolicy = currentPage * policiesPerPage;
  const indexOfFirstPolicy = indexOfLastPolicy - policiesPerPage;
  const currentPolicies = filteredPolicies.slice(indexOfFirstPolicy, indexOfLastPolicy);

  const totalPages = Math.ceil(filteredPolicies.length / policiesPerPage);

  // Function to get status badge styling
  const getStatusBadgeClass = (status) => {
    switch(status.toLowerCase()) {
      case 'active': return 'status-active';
      case 'expired': return 'status-expired';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  };

  // Function to handle policy row click
  const handlePolicyClick = (policy) => {
    navigate(`/insurancepolicydetails/${policy.policyNumber}`);
  };

  // Function to handle renewal
  const handleRenewal = (e, policy) => {
    e.stopPropagation(); // Prevent row click
    navigate('/addnewpolicy', { 
      state: { 
        isRenewal: true, 
        existingPolicy: policy 
      } 
    });
  };

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

        {(searchTerm || statusFilter || typeFilter) && (
          <button onClick={clearFilters} className="clear-filters-btn">
            Clear Filters
          </button>
        )}
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPolicies.length > 0 ? (
              currentPolicies.map(policy => {
                const isExpired = policy.status.toLowerCase() === 'expired';
                return (
                  <tr 
                    key={policy.policyNumber} 
                    onClick={() => handlePolicyClick(policy)}
                    className={isExpired ? 'expired-row' : ''}
                  >
                    <td>{policy.policyNumber}</td>
                    <td>{policy.customer.fullName}</td>
                    <td>{policy.vehicle.vehicleNumber}</td>
                    <td>{policy.vehicle.model}</td>
                    <td>{policy.policyType}</td>
                    <td>{policy.premium.toLocaleString()}</td>
                    <td>{policy.startDate}</td>
                    <td>
                      {policy.endDate}
                      {isExpired && <span className="expired-indicator"> (Expired)</span>}
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(policy.status)}`}>
                        {policy.status}
                      </span>
                    </td>
                    <td className="actions-cell">
                      {isExpired && (
                        <button 
                          onClick={(e) => handleRenewal(e, policy)}
                          className="renew-btn-table"
                          title="Renew Policy"
                        >
                          🔄 Renew
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '1rem' }}>
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

        {/* Summary Information */}
        <div className="table-summary">
          <div className="summary-stats">
            <span className="stat-item">
              <strong>Total Policies:</strong> {filteredPolicies.length}
            </span>
            <span className="stat-item">
              <strong>Active:</strong> {filteredPolicies.filter(p => p.status.toLowerCase() === 'active').length}
            </span>
            <span className="stat-item">
              <strong>Expired:</strong> {filteredPolicies.filter(p => p.status.toLowerCase() === 'expired').length}
            </span>
            <span className="stat-item">
              <strong>Cancelled:</strong> {filteredPolicies.filter(p => p.status.toLowerCase() === 'cancelled').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsurancePolicyManagement;