import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyInsuranceDetailsPage.css';

// Import test data - In real app, these would come from API calls
import PolicyDetailsTestData from '../InsuranceCompany/testData/PolicyDetailsTestData';
import { insuranceCompanyTestData } from '../InsuranceCompany/testData/InsuranceCompanyTestData';

const MyInsuranceDetailsPage = () => {
  const navigate = useNavigate();
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [userPolicies, setUserPolicies] = useState([]);
  const [insuranceCompany, setInsuranceCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock current user - In real app, this would come from auth context
  const currentUser = {
    nic: "912345678V", // This would be from logged-in user
    name: "John Silva"
  };

  useEffect(() => {
    // Simulate API call to get user's policies
    setTimeout(() => {
      // Filter policies for current user by NIC
      const policies = PolicyDetailsTestData.filter(policy => 
        policy.nic === currentUser.nic
      );
      setUserPolicies(policies);
      
      if (policies.length > 0) {
        setSelectedPolicy(policies[0]); // Select first policy by default
        setInsuranceCompany(insuranceCompanyTestData);
      }
      
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Active': 'status-badge active',
      'Expired': 'status-badge expired',
      'Cancelled': 'status-badge cancelled',
      'Suspended': 'status-badge suspended'
    };
    return statusClasses[status] || 'status-badge';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  const calculateDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderOverviewTab = () => (
    <div className="overview-tab">
      <div className="tab-content">
        <div className="overview-grid">
          {/* Policy Status Card */}
          <div className="info-card policy-status-card">
            <div className="card-header">
              <h3>Policy Status</h3>
              <span className={getStatusBadge(selectedPolicy.status)}>
                {selectedPolicy.status}
              </span>
            </div>
            <div className="status-details">
              {selectedPolicy.status === "Active" && (
                <div className="status-info">
                  <p className="days-remaining">
                    {calculateDaysRemaining(selectedPolicy.endDate)} days remaining
                  </p>
                  <p className="renewal-reminder">
                    Your policy expires on {formatDate(selectedPolicy.endDate)}
                  </p>
                </div>
              )}
              {selectedPolicy.status === "Expired" && (
                <div className="status-info expired-info">
                  <p>Policy expired on {formatDate(selectedPolicy.endDate)}</p>
                  <button className="renew-btn">Renew Policy</button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="info-card quick-actions-card">
            <div className="card-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="action-buttons">
              <button className="action-btn primary">
                <span className="action-icon">📄</span>
                Download Policy
              </button>
              <button
                className="action-btn secondary"
                onClick={() => navigate("/claimsrequestform")}
              >
                <span className="action-icon">🚗</span>
                Request Claim
                </button>
            </div>
          </div>

          {/* Coverage Summary */}
          <div className="info-card coverage-summary">
            <div className="card-header">
              <h3>Coverage Summary</h3>
            </div>
            <div className="coverage-details">
              <div className="coverage-item">
                <span className="coverage-label">Policy Type:</span>
                <span className="coverage-value">{selectedPolicy.policyType}</span>
              </div>
              <div className="coverage-item">
                <span className="coverage-label">Premium Amount:</span>
                <span className="coverage-value premium">
                  {formatCurrency(selectedPolicy.premium)}
                </span>
              </div>
              <div className="coverage-item">
                <span className="coverage-label">Vehicle Value:</span>
                <span className="coverage-value">
                  {formatCurrency(selectedPolicy.estimatedValue)}
                </span>
              </div>
            </div>
          </div>

          {/* Next Payment */}
          <div className="info-card payment-info">
            <div className="card-header">
              <h3>Next Payment</h3>
            </div>
            <div className="payment-details">
              <div className="payment-amount">
                {formatCurrency(selectedPolicy.premium)}
              </div>
              <div className="payment-date">
                Due: {formatDate(selectedPolicy.endDate)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="policy-details-sections">
        {/* Customer Information */}
        <div className="section-card">
          <h3>My Information</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-icon">👤</span>
              <div className="detail-content">
                <p className="detail-label">Full Name</p>
                <p className="detail-value">{selectedPolicy.customerName}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">🆔</span>
              <div className="detail-content">
                <p className="detail-label">NIC Number</p>
                <p className="detail-value">{selectedPolicy.nic}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📍</span>
              <div className="detail-content">
                <p className="detail-label">Address</p>
                <p className="detail-value">{selectedPolicy.address}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📞</span>
              <div className="detail-content">
                <p className="detail-label">Contact Number</p>
                <p className="detail-value">{selectedPolicy.contactNo}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📧</span>
              <div className="detail-content">
                <p className="detail-label">Email Address</p>
                <p className="detail-value">{selectedPolicy.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="section-card">
          <h3>Vehicle Information</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-icon">🚗</span>
              <div className="detail-content">
                <p className="detail-label">Vehicle Number</p>
                <p className="detail-value">{selectedPolicy.vehicleNumber}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">🚙</span>
              <div className="detail-content">
                <p className="detail-label">Make & Model</p>
                <p className="detail-value">{selectedPolicy.vehicleModel}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">🚗</span>
              <div className="detail-content">
                <p className="detail-label">Vehicle Type</p>
                <p className="detail-value">{selectedPolicy.vehicleType}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📋</span>
              <div className="detail-content">
                <p className="detail-label">Registration Number</p>
                <p className="detail-value">{selectedPolicy.registrationNumber}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">⚙️</span>
              <div className="detail-content">
                <p className="detail-label">Engine Capacity</p>
                <p className="detail-value">{selectedPolicy.engineCapacity}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">🔧</span>
              <div className="detail-content">
                <p className="detail-label">Chassis Number</p>
                <p className="detail-value">{selectedPolicy.chassisNumber}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">🏭</span>
              <div className="detail-content">
                <p className="detail-label">Vehicle Make</p>
                <p className="detail-value">{selectedPolicy.vehicleMake}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📅</span>
              <div className="detail-content">
                <p className="detail-label">Manufacture Year</p>
                <p className="detail-value">{selectedPolicy.manufactureYear}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">⛽</span>
              <div className="detail-content">
                <p className="detail-label">Fuel Type</p>
                <p className="detail-value">{selectedPolicy.fuelType}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">💰</span>
              <div className="detail-content">
                <p className="detail-label">Estimated Value</p>
                <p className="detail-value">{formatCurrency(selectedPolicy.estimatedValue)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Information */}
        <div className="section-card">
          <h3>Policy Information</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-icon">📋</span>
              <div className="detail-content">
                <p className="detail-label">Policy Number</p>
                <p className="detail-value policy-number">{selectedPolicy.policyNumber}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">🛡️</span>
              <div className="detail-content">
                <p className="detail-label">Policy Type</p>
                <p className="detail-value">{selectedPolicy.policyType}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">💵</span>
              <div className="detail-content">
                <p className="detail-label">Premium Amount</p>
                <p className="detail-value premium">{formatCurrency(selectedPolicy.premium)}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📅</span>
              <div className="detail-content">
                <p className="detail-label">Start Date</p>
                <p className="detail-value">{formatDate(selectedPolicy.startDate)}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📅</span>
              <div className="detail-content">
                <p className="detail-label">End Date</p>
                <p className="detail-value">{formatDate(selectedPolicy.endDate)}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📊</span>
              <div className="detail-content">
                <p className="detail-label">Status</p>
                <p className="detail-value">
                  <span className={`status-badge ${selectedPolicy.status.toLowerCase()}`}>
                    {selectedPolicy.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInsuranceCompanyTab = () => (
    <div className="tab-content">
      <div className="company-info-sections">
        {/* Company Overview */}
        <div className="section-card company-overview-section">
          <div className="section-header">
            <h3>Insurance Company Overview</h3>
          </div>
          <div className="company-details">
            <div className="company-logo-section">
              <div className="company-logo">
                <span className="logo-placeholder">ABC</span>
              </div>
              <div className="company-basic-info">
                <h4>{insuranceCompany.businessInfo.businessName}</h4>
                <p className="company-description">{insuranceCompany.businessInfo.description}</p>
                <div className="company-rating">
                  <span className="rating-stars">⭐⭐⭐⭐⭐</span>
                  <span className="rating-value">{insuranceCompany.stats.customerSatisfactionRating}/5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="section-card">
          <h3>Contact Information</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-icon">📞</span>
              <div className="detail-content">
                <p className="detail-label">Business Phone</p>
                <p className="detail-value">{insuranceCompany.phone}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📧</span>
              <div className="detail-content">
                <p className="detail-label">Email</p>
                <p className="detail-value">{insuranceCompany.email}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">🌐</span>
              <div className="detail-content">
                <p className="detail-label">Website</p>
                <p className="detail-value">
                  <a href={insuranceCompany.businessInfo.website} target="_blank" rel="noopener noreferrer">
                    {insuranceCompany.businessInfo.website}
                  </a>
                </p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📍</span>
              <div className="detail-content">
                <p className="detail-label">Address</p>
                <p className="detail-value">{insuranceCompany.address.street}, {insuranceCompany.address.city}</p>
              </div>
            </div>
          </div>
        </div>

        {/* License & Compliance */}
        <div className="section-card">
          <h3>License & Compliance</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-icon">📜</span>
              <div className="detail-content">
                <p className="detail-label">License Number</p>
                <p className="detail-value">{insuranceCompany.businessInfo.licenseNumber}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">🏢</span>
              <div className="detail-content">
                <p className="detail-label">Registration Number</p>
                <p className="detail-value">{insuranceCompany.businessInfo.businessRegistrationNumber}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📅</span>
              <div className="detail-content">
                <p className="detail-label">Established Date</p>
                <p className="detail-value">{formatDate(insuranceCompany.businessInfo.establishedDate)}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">✅</span>
              <div className="detail-content">
                <p className="detail-label">Regulatory Status</p>
                <p className="detail-value verified">Verified & Compliant</p>
              </div>
            </div>
          </div>
        </div>

        {/* Branch Network */}
        <div className="section-card branches-section">
          <h3>Branch Network</h3>
          <div className="branches-list">
            {insuranceCompany.branches.map(branch => (
              <div key={branch.id} className="branch-item">
                <div className="branch-info">
                  <h5>{branch.name}</h5>
                  <p className="branch-address">{branch.address}</p>
                  <p className="branch-contact">{branch.phone}</p>
                  <p className="branch-manager">Manager: {branch.manager}</p>
                </div>
                {branch.isHeadOffice && <span className="head-office-badge">Head Office</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Available Products */}
        <div className="section-card products-section">
          <h3>Available Insurance Products</h3>
          <div className="products-list">
            {insuranceCompany.products.map(product => (
              <div key={product.id} className="product-item">
                <h5>{product.name}</h5>
                <p className="product-description">{product.description}</p>
                <div className="product-details">
                  <span className="premium-range">
                    Premium: {formatCurrency(product.premiumRange.min)} - {formatCurrency(product.premiumRange.max)}
                  </span>
                  <span className="coverage-limit">
                    Coverage: Up to {formatCurrency(product.coverageLimit)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="my-insurance-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your insurance details...</p>
        </div>
      </div>
    );
  }

  if (userPolicies.length === 0) {
    return (
      <div className="my-insurance-page">
        <div className="no-policies-container">
          <div className="no-policies-icon">📋</div>
          <h2>No Insurance Policies Found</h2>
          <p>You don't have any insurance policies registered with your NIC number.</p>
          <button className="contact-btn" onClick={() => navigate('/contact')}>
            Contact Support
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-insurance-page">
      {/* Header */}
      <div className="page-headerM">
        <h1 className="page-title">My Insurance Details</h1>
        <p className="page-subtitle">View and manage your vehicle insurance policies</p>
      </div>

      {/* Policy Selector */}
      {userPolicies.length > 1 && (
        <div className="policy-selector">
          <label className="selector-label">Select Policy:</label>
          <select 
            className="policy-select"
            value={selectedPolicy?.policyNumber || ''}
            onChange={(e) => {
              const policy = userPolicies.find(p => p.policyNumber === e.target.value);
              setSelectedPolicy(policy);
            }}
          >
            {userPolicies.map(policy => (
              <option key={policy.policyNumber} value={policy.policyNumber}>
                {policy.policyNumber} - {policy.vehicleNumber} ({policy.status})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span className="tab-icon">📊</span>
          Policy Details
        </button>

        <button 
          className={`tab-btn ${activeTab === 'company' ? 'active' : ''}`}
          onClick={() => setActiveTab('company')}
        >
          <span className="tab-icon">🏢</span>
          Insurance Company
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-container">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'company' && renderInsuranceCompanyTab()}
      </div>

      {/* Bottom Actions */}
      <div className="bottom-actions">
        <button className="action-btn secondary large" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <button className="action-btn primary large">
          Print Details
        </button>
      </div>
    </div>
  );
};

export default MyInsuranceDetailsPage;