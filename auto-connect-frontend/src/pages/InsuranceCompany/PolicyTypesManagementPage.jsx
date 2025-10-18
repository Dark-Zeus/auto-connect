import React, { useState } from 'react';
import './PolicyTypesManagementPage.css';
import OverlayWindow from '../../components/OverlayWindow';

const PolicyTypesManagementPage = () => {
  // Sample initial data
  const [policyTypes, setPolicyTypes] = useState([
    {
      id: 1,
      policyTypeNumber: 'POL-001',
      policyTypeName: 'Comprehensive Vehicle Insurance',
      effectiveDate: '2024-01-01',
      expiryDate: '2024-12-31',
      status: 'Active',
      description: 'Complete coverage for vehicle damage, theft, and third-party liability',
      premiumPerLakh: 2.5,
      documents: [
        { id: 1, name: 'Policy Terms and Conditions.pdf', url: '/documents/policy-terms.pdf', uploadDate: '2024-01-01' },
        { id: 2, name: 'Coverage Details.pdf', url: '/documents/coverage-details.pdf', uploadDate: '2024-01-01' }
      ],
      createdDate: '2024-01-01',
      lastModified: '2024-01-15'
    },
    {
      id: 2,
      policyTypeNumber: 'POL-002',
      policyTypeName: 'Third Party Vehicle Insurance',
      effectiveDate: '2024-01-01',
      expiryDate: '2024-12-31',
      status: 'Active',
      description: 'Basic third-party liability coverage',
      premiumPerLakh: 1.5,
      documents: [
        { id: 1, name: 'Third Party Terms.pdf', url: '/documents/third-party-terms.pdf', uploadDate: '2024-01-01' }
      ],
      createdDate: '2024-01-01',
      lastModified: '2024-01-10'
    },
    {
      id: 3,
      policyTypeNumber: 'POL-003',
      policyTypeName: 'Fire & Theft Insurance',
      effectiveDate: '2024-02-01',
      expiryDate: '2024-12-31',
      status: 'Inactive',
      description: 'Coverage for fire damage and theft only',
      premiumPerLakh: 1.8,
      documents: [
        { id: 1, name: 'Fire Theft Policy.pdf', url: '/documents/fire-theft-policy.pdf', uploadDate: '2024-02-01' }
      ],
      createdDate: '2024-02-01',
      lastModified: '2024-02-15'
    }
  ]);

  // Form states
  const [showAddEditOverlay, setShowAddEditOverlay] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPolicyId, setEditingPolicyId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    policyTypeNumber: '',
    policyTypeName: '',
    effectiveDate: '',
    expiryDate: '',
    status: 'Active',
    description: '',
    premiumPerLakh: '',
    documents: []
  });

  // File input for documents
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Initialize form for add
  const handleAddNew = () => {
    setIsEditMode(false);
    setEditingPolicyId(null);
    setFormData({
      policyTypeNumber: '',
      policyTypeName: '',
      effectiveDate: '',
      expiryDate: '',
      status: 'Active',
      description: '',
      premiumPerLakh: '',
      documents: []
    });
    setSelectedFiles([]);
    setShowAddEditOverlay(true);
  };

  // Initialize form for edit
  const handleEdit = (policy) => {
    setIsEditMode(true);
    setEditingPolicyId(policy.id);
    setFormData({
      policyTypeNumber: policy.policyTypeNumber,
      policyTypeName: policy.policyTypeName,
      effectiveDate: policy.effectiveDate,
      expiryDate: policy.expiryDate,
      status: policy.status,
      description: policy.description,
      premiumPerLakh: policy.premiumPerLakh,
      documents: policy.documents || []
    });
    setSelectedFiles([]);
    setShowAddEditOverlay(true);
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle file selection
  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      file: file,
      name: file.name,
      id: Date.now() + Math.random(),
      uploadDate: new Date().toISOString().split('T')[0],
      isNew: true
    }));
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  // Remove selected file
  const removeSelectedFile = (fileId, isExisting = false) => {
    if (isExisting) {
      setFormData(prev => ({
        ...prev,
        documents: prev.documents.filter(doc => doc.id !== fileId)
      }));
    } else {
      setSelectedFiles(prev => prev.filter(file => file.id !== fileId));
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate required fields
    if (!formData.policyTypeNumber || !formData.policyTypeName || !formData.effectiveDate) {
      alert('Please fill in all required fields');
      return;
    }

    // Create combined documents array
    const allDocuments = [
      ...formData.documents,
      ...selectedFiles.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        url: URL.createObjectURL(file.file), // In real app, this would be uploaded to server
        uploadDate: file.uploadDate
      }))
    ];

    const policyData = {
      ...formData,
      documents: allDocuments,
      premiumPerLakh: parseFloat(formData.premiumPerLakh),
      lastModified: new Date().toISOString().split('T')[0]
    };

    if (isEditMode) {
      // Update existing policy
      setPolicyTypes(prev => prev.map(policy => 
        policy.id === editingPolicyId 
          ? { ...policy, ...policyData }
          : policy
      ));
      alert('Policy type updated successfully!');
    } else {
      // Add new policy
      const newPolicy = {
        ...policyData,
        id: Date.now(),
        createdDate: new Date().toISOString().split('T')[0]
      };
      setPolicyTypes(prev => [...prev, newPolicy]);
      alert('Policy type added successfully!');
    }

    setShowAddEditOverlay(false);
  };

  // Handle delete
  const handleDelete = (policyId) => {
    if (window.confirm('Are you sure you want to delete this policy type?')) {
      setPolicyTypes(prev => prev.filter(policy => policy.id !== policyId));
      alert('Policy type deleted successfully!');
    }
  };

  // Open document in new tab
  const handleViewDocument = (document) => {
    window.open(document.url, '_blank');
  };

  // Filter and search policies
  const filteredPolicies = policyTypes.filter(policy => {
    const matchesSearch = policy.policyTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.policyTypeNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === '' || policy.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="policy-management-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-title">
            <h2>Policy Types Management</h2>
            <p>Manage insurance policy types and their configurations</p>
          </div>
        </div>
        <button onClick={handleAddNew} className="add-policy-btn">
          Add New Policy Type
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="filter-section">
        <input
          type="text"
          placeholder="Search by policy name or number..."
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
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Policy Types Table */}
      <div className="table-wrapper">
        <table className="policies-table">
          <thead>
            <tr>
              <th>Policy Type Number</th>
              <th>Policy Type Name</th>
              <th>Premium Per Lakh (%)</th>
              <th>Effective Date</th>
              <th>Status</th>
              <th>Documents</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPolicies.length > 0 ? (
              filteredPolicies.map(policy => (
                <tr key={policy.id}>
                  <td>{policy.policyTypeNumber}</td>
                  <td>
                    <div>
                      <strong>{policy.policyTypeName}</strong>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '12px', color: '#666' }}>
                        {policy.description}
                      </p>
                    </div>
                  </td>
                  <td>{policy.premiumPerLakh}%</td>
                  <td>{policy.effectiveDate}</td>
                  <td>
                    <span className={`status-badge ${policy.status.toLowerCase()}`}>
                      {policy.status}
                    </span>
                  </td>
                  <td>
                    <div className="documents-list">
                      {policy.documents.map(doc => (
                        <button
                          key={doc.id}
                          className="document-link"
                          onClick={() => handleViewDocument(doc)}
                        >
                          {doc.name}
                        </button>
                      ))}
                      {policy.documents.length === 0 && (
                        <span className="no-documents">No documents</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(policy)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(policy.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '1rem' }}>
                  No policy types found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Policy Overlay */}
      {showAddEditOverlay && (
        <OverlayWindow closeWindowFunction={() => setShowAddEditOverlay(false)}>
          <div className="policy-form">
            <h3>{isEditMode ? 'Edit Policy Type' : 'Add New Policy Type'}</h3>
            <p className="form-subtitle">
              {isEditMode ? 'Update policy type information' : 'Enter policy type details'}
            </p>

            <div className="form-sections">
              {/* Basic Information */}
              <div className="form-section">
                <h4>Basic Information</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Policy Type Number*</label>
                    <input
                      type="text"
                      value={formData.policyTypeNumber}
                      onChange={(e) => handleInputChange('policyTypeNumber', e.target.value)}
                      placeholder="e.g., POL-001"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Policy Name*</label>
                    <input
                      type="text"
                      value={formData.policyTypeName}
                      onChange={(e) => handleInputChange('policyTypeName', e.target.value)}
                      placeholder="e.g., Comprehensive Vehicle Insurance"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Premium Per Lakh (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.premiumPerLakh}
                      onChange={(e) => handleInputChange('premiumPerLakh', e.target.value)}
                      placeholder="e.g., 2.5"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="form-section">
                <h4>Validity Period</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Effective Date*</label>
                    <input
                      type="date"
                      value={formData.effectiveDate}
                      onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="form-section">
                <h4>Description</h4>
                <div className="form-group">
                  <label>Policy Description</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter detailed description of the policy coverage..."
                  />
                </div>
              </div>

              {/* Documents Section */}
              <div className="form-section">
                <h4>Policy Documents</h4>
                
                {/* Existing Documents (for edit mode) */}
                {isEditMode && formData.documents.length > 0 && (
                  <div className="existing-documents">
                    <h5>Existing Documents</h5>
                    <div className="document-grid">
                      {formData.documents.map(doc => (
                        <div key={doc.id} className="document-item">
                          <div className="document-info">
                            <span className="document-icon">📄</span>
                            <div className="document-details">
                              <p className="document-name">{doc.name}</p>
                              <p className="document-date">Uploaded: {doc.uploadDate}</p>
                            </div>
                          </div>
                          <div className="document-actions">
                            <button
                              type="button"
                              className="view-doc-btn"
                              onClick={() => window.open(doc.url, '_blank')}
                            >
                              View
                            </button>
                            <button
                              type="button"
                              className="remove-doc-btn"
                              onClick={() => removeSelectedFile(doc.id, true)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* File Upload */}
                <div className="file-upload-section">
                  <label className="file-upload-label">
                    Add Documents (PDF, DOC, DOCX)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelection}
                    className="file-input"
                  />
                  <p className="file-help-text">
                    Select one or more documents to attach to this policy type
                  </p>
                </div>

                {/* Selected New Files */}
                {selectedFiles.length > 0 && (
                  <div className="selected-files">
                    <h5>Selected Files</h5>
                    <div className="document-grid">
                      {selectedFiles.map(file => (
                        <div key={file.id} className="document-item new-file">
                          <div className="document-info">
                            <span className="document-icon">📄</span>
                            <div className="document-details">
                              <p className="document-name">{file.name}</p>
                              <p className="document-date">Size: {(file.file.size / 1024).toFixed(1)} KB</p>
                            </div>
                          </div>
                          <div className="document-actions">
                            <button
                              type="button"
                              className="remove-doc-btn"
                              onClick={() => removeSelectedFile(file.id, false)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowAddEditOverlay(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="submit-btn"
                onClick={handleSubmit}
              >
                {isEditMode ? 'Update Policy Type' : 'Add Policy Type'}
              </button>
            </div>
          </div>
        </OverlayWindow>
      )}
    </div>
  );
};

export default PolicyTypesManagementPage;