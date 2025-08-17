import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Edit3,
  Save,
  X,
  Camera,
  Lock,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Upload,
  FileText,
  Download,
} from 'lucide-react';
import { insuranceCompanyTestData } from './testData/InsuranceCompanyTestData';
import './InsuranceCompanyProfile.css';

const InsuranceCompanyProfile = () => {
  const [profileData, setProfileData] = useState(insuranceCompanyTestData);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [changePasswordDialog, setChangePasswordDialog] = useState(false);
  const [uploadDocumentDialog, setUploadDocumentDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [saveProgress, setSaveProgress] = useState(false);
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false
  });
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentName, setDocumentName] = useState('');

  // Sri Lankan provinces and districts
  const sriLankanProvinces = {
    "Western Province": ["Colombo", "Gampaha", "Kalutara"],
    "Central Province": ["Kandy", "Matale", "Nuwara Eliya"],
    "Southern Province": ["Galle", "Matara", "Hambantota"],
    "Northern Province": ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
    "Eastern Province": ["Trincomalee", "Batticaloa", "Ampara"],
    "North Western Province": ["Kurunegala", "Puttalam"],
    "North Central Province": ["Anuradhapura", "Polonnaruwa"],
    "Uva Province": ["Badulla", "Moneragala"],
    "Sabaragamuwa Province": ["Ratnapura", "Kegalle"],
  };

  const provinces = Object.keys(sriLankanProvinces);
  const districts = editedData.address?.province
    ? sriLankanProvinces[editedData.address.province] || []
    : profileData.address?.province 
    ? sriLankanProvinces[profileData.address.province] || []
    : [];

  useEffect(() => {
    if (editMode) {
      setEditedData({ ...profileData });
    }
  }, [editMode, profileData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!editedData.firstName?.trim()) {
      newErrors.firstName = 'Company name is required';
    }
    if (!editedData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!editedData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!editedData.address?.street?.trim()) {
      newErrors.street = 'Street address is required';
    }
    if (!editedData.address?.city?.trim()) {
      newErrors.city = 'City is required';
    }
    if (!editedData.address?.district?.trim()) {
      newErrors.district = 'District is required';
    }
    if (!editedData.address?.province?.trim()) {
      newErrors.province = 'Province is required';
    }
    if (!editedData.address?.postalCode?.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }
    if (!editedData.businessInfo?.businessName?.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    if (!editedData.businessInfo?.licenseNumber?.trim()) {
      newErrors.licenseNumber = 'License number is required';
    }
    if (!editedData.businessInfo?.businessRegistrationNumber?.trim()) {
      newErrors.businessRegistrationNumber = 'Business registration number is required';
    }
    if (!editedData.businessInfo?.taxIdentificationNumber?.trim()) {
      newErrors.taxIdentificationNumber = 'Tax ID number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    setEditMode(true);
    setErrors({});
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaveProgress(true);
    
    // Simulate API call
    setTimeout(() => {
      setProfileData({ ...editedData });
      setEditMode(false);
      setSaveProgress(false);
      setErrors({});
    }, 1500);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedData({});
    setErrors({});
  };

  const handleInputChange = (field, value, nested = null) => {
    if (nested) {
      setEditedData(prev => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [field]: value
        }
      }));
    } else {
      setEditedData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    const errorKey = nested ? field : field;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }));
    }
  };

  const handlePasswordChange = () => {
    setChangePasswordDialog(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (editMode) {
          handleInputChange('avatar', e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleUploadDocument = () => {
    if (selectedFile && documentName.trim()) {
      const newDoc = {
        id: Date.now(),
        name: documentName,
        uploadDate: new Date().toISOString().split('T')[0],
        fileSize: (selectedFile.size / 1024 / 1024).toFixed(1) + ' MB',
        status: 'active'
      };
      
      setProfileData(prev => ({
        ...prev,
        policyDocuments: [...(prev.policyDocuments || []), newDoc]
      }));
      
      setUploadDocumentDialog(false);
      setSelectedFile(null);
      setDocumentName('');
    }
  };

  const handleDeleteDocument = (id) => {
    setProfileData(prev => ({
      ...prev,
      policyDocuments: prev.policyDocuments.filter(doc => doc.id !== id)
    }));
  };

  const CompanyAvatar = () => (
    <div className="company-avatar-container">
      <div className="company-avatar">
        {profileData.avatar ? (
          <img src={editMode ? editedData.avatar : profileData.avatar} alt="Company Logo" />
        ) : (
          <span className="avatar-initials">
            {profileData.firstName.charAt(0)}
          </span>
        )}
      </div>
      
      {editMode && (
        <label className="avatar-edit-button">
          <Camera size={20} />
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </label>
      )}
    </div>
  );

  const InputField = ({ 
    label, 
    value, 
    onChange, 
    disabled, 
    error, 
    icon: Icon, 
    type = 'text',
    isSelect = false,
    options = []
  }) => (
    <div className="input-field">
      <label className="input-label">{label}</label>
      <div className="input-wrapper">
        {Icon && <Icon className="input-icon" size={20} />}
        {isSelect ? (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={`form-select ${error ? 'error' : ''}`}
          >
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={`form-input ${error ? 'error' : ''}`}
          />
        )}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );

  const PersonalInfoTab = () => (
    <div className="tab-content">
      <h2 className="section-title">Company Information</h2>
      
      <div className="form-grid">
        <div className="grid-item">
          <InputField
            label="Company Name"
            value={editMode ? editedData.firstName : profileData.firstName}
            onChange={(value) => handleInputChange('firstName', value)}
            disabled={!editMode}
            error={errors.firstName}
            icon={Building2}
          />
        </div>
        
        <div className="grid-item">
          <InputField
            label="Email Address"
            value={editMode ? editedData.email : profileData.email}
            onChange={(value) => handleInputChange('email', value)}
            disabled={!editMode}
            error={errors.email}
            icon={Mail}
            type="email"
          />
        </div>
        
        <div className="grid-item">
          <InputField
            label="Phone Number"
            value={editMode ? editedData.phone : profileData.phone}
            onChange={(value) => handleInputChange('phone', value)}
            disabled={!editMode}
            error={errors.phone}
            icon={Phone}
          />
        </div>
      </div>
      
      <div className="section-divider"></div>
      
      <h2 className="section-title">Address Information</h2>
      
      <div className="form-grid">
        <div className="grid-item full-width">
          <InputField
            label="Street Address"
            value={editMode ? editedData.address?.street : profileData.address.street}
            onChange={(value) => handleInputChange('street', value, 'address')}
            disabled={!editMode}
            error={errors.street}
            icon={MapPin}
          />
        </div>
        
        <div className="grid-item">
          <InputField
            label="City"
            value={editMode ? editedData.address?.city : profileData.address.city}
            onChange={(value) => handleInputChange('city', value, 'address')}
            disabled={!editMode}
            error={errors.city}
          />
        </div>
        
        <div className="grid-item">
          <InputField
            label="Province"
            value={editMode ? editedData.address?.province : profileData.address.province}
            onChange={(value) => {
              handleInputChange('province', value, 'address');
              handleInputChange('district', '', 'address');
            }}
            disabled={!editMode}
            error={errors.province}
            isSelect={true}
            options={provinces}
          />
        </div>
        
        <div className="grid-item">
          <InputField
            label="District"
            value={editMode ? editedData.address?.district : profileData.address.district}
            onChange={(value) => handleInputChange('district', value, 'address')}
            disabled={!editMode || !districts.length}
            error={errors.district}
            isSelect={true}
            options={districts}
          />
        </div>
        
        <div className="grid-item">
          <InputField
            label="Postal Code"
            value={editMode ? editedData.address?.postalCode : profileData.address.postalCode}
            onChange={(value) => handleInputChange('postalCode', value, 'address')}
            disabled={!editMode}
            error={errors.postalCode}
          />
        </div>
      </div>
    </div>
  );

  const BusinessInfoTab = () => (
    <div className="tab-content">
      <h2 className="section-title">Business Information</h2>
      
      <div className="form-grid">
        <div className="grid-item">
          <InputField
            label="Business Name"
            value={editMode ? editedData.businessInfo?.businessName : profileData.businessInfo.businessName}
            onChange={(value) => handleInputChange('businessName', value, 'businessInfo')}
            disabled={!editMode}
            error={errors.businessName}
            icon={Building2}
          />
        </div>
        
        <div className="grid-item">
          <InputField
            label="License Number"
            value={editMode ? editedData.businessInfo?.licenseNumber : profileData.businessInfo.licenseNumber}
            onChange={(value) => handleInputChange('licenseNumber', value, 'businessInfo')}
            disabled={!editMode}
            error={errors.licenseNumber}
          />
        </div>
        
        <div className="grid-item">
          <InputField
            label="Business Registration Number"
            value={editMode ? editedData.businessInfo?.businessRegistrationNumber : profileData.businessInfo.businessRegistrationNumber}
            onChange={(value) => handleInputChange('businessRegistrationNumber', value, 'businessInfo')}
            disabled={!editMode}
            error={errors.businessRegistrationNumber}
          />
        </div>
        
        <div className="grid-item">
          <InputField
            label="Tax ID Number"
            value={editMode ? editedData.businessInfo?.taxIdentificationNumber : profileData.businessInfo.taxIdentificationNumber}
            onChange={(value) => handleInputChange('taxIdentificationNumber', value, 'businessInfo')}
            disabled={!editMode}
            error={errors.taxIdentificationNumber}
          />
        </div>
        
        <div className="grid-item">
          <InputField
            label="Established Date"
            value={editMode ? editedData.businessInfo?.establishedDate : profileData.businessInfo.establishedDate}
            onChange={(value) => handleInputChange('establishedDate', value, 'businessInfo')}
            disabled={!editMode}
            type="date"
          />
        </div>
      </div>
      
      <div className="section-divider"></div>
      
      <div className="documents-section">
        <div className="documents-header">
          <h2 className="section-title">Policy Terms & Conditions Documents</h2>
          <button
            className="btn btn-primary"
            onClick={() => setUploadDocumentDialog(true)}
          >
            <Upload size={20} />
            Add Document
          </button>
        </div>
        
        <div className="documents-list">
          {profileData.policyDocuments && profileData.policyDocuments.length > 0 ? (
            profileData.policyDocuments.map((doc) => (
              <div key={doc.id} className="document-item">
                <div className="document-info">
                  <FileText className="document-icon" size={24} />
                  <div>
                    <h3 className="document-name">{doc.name}</h3>
                    <p className="document-details">
                      Uploaded: {doc.uploadDate} • Size: {doc.fileSize}
                    </p>
                  </div>
                </div>
                <div className="document-actions">
                  <button 
                    className="btn btn-outline"
                    onClick={() => console.log('Download', doc.id)}
                  >
                    <Download size={16} />
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDeleteDocument(doc.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-documents">
              <p>No policy documents uploaded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div className="tab-content">
      <h2 className="section-title">Security Settings</h2>
      
      <div className="security-card">
        <div className="password-section">
          <div>
            <h3 className="password-title">Password</h3>
            <p className="password-subtitle">Last changed 3 months ago</p>
          </div>
          <button
            className="btn btn-outline"
            onClick={() => setChangePasswordDialog(true)}
          >
            <Lock size={20} />
            Change Password
          </button>
        </div>
      </div>
      
      <div className="security-card">
        <h3 className="notifications-title">Notification Preferences</h3>
        <div className="notification-controls">
          <label className="notification-control">
            <input
              type="checkbox"
              checked={notifications.emailNotifications}
              onChange={(e) => setNotifications(prev => ({...prev, emailNotifications: e.target.checked}))}
            />
            <span>Email Notifications</span>
          </label>
          <label className="notification-control">
            <input
              type="checkbox"
              checked={notifications.smsNotifications}
              onChange={(e) => setNotifications(prev => ({...prev, smsNotifications: e.target.checked}))}
            />
            <span>SMS Notifications</span>
          </label>
          <label className="notification-control">
            <input
              type="checkbox"
              checked={notifications.pushNotifications}
              onChange={(e) => setNotifications(prev => ({...prev, pushNotifications: e.target.checked}))}
            />
            <span>Push Notifications</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="header-top">
          <h1 className="profile-title">Insurance Company Profile</h1>
          {!editMode ? (
            <button className="btn btn-primary edit-profile-btn" onClick={handleEdit}>
              <Edit3 size={20} />
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button
                className="btn btn-success"
                onClick={handleSave}
                disabled={saveProgress}
              >
                {saveProgress ? (
                  <>
                    <div className="spinner"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
                )}
              </button>
              <button className="btn btn-outline" onClick={handleCancel}>
                <X size={20} />
                Cancel
              </button>
            </div>
          )}
        </div>
        
        <div className="profile-header-content">
          <CompanyAvatar />
          
          <div className="profile-info">
            <h2 className="profile-name">{profileData.businessInfo.businessName}</h2>
            <p className="company-type">Vehicle Insurance Provider</p>
            <div className="company-details">
              <p className="detail-item">
                <Mail size={16} />
                {profileData.email}
              </p>
              <p className="detail-item">
                <Phone size={16} />
                {profileData.phone}
              </p>
              <p className="detail-item">
                <MapPin size={16} />
                {profileData.address.city}, {profileData.address.province}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="profile-tabs-container">
        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === 0 ? 'active' : ''}`}
            onClick={() => setActiveTab(0)}
          >
            Company Info
          </button>
          <button
            className={`tab ${activeTab === 1 ? 'active' : ''}`}
            onClick={() => setActiveTab(1)}
          >
            Business Info
          </button>
          <button
            className={`tab ${activeTab === 2 ? 'active' : ''}`}
            onClick={() => setActiveTab(2)}
          >
            Security
          </button>
        </div>
        
        <div className="tab-panels">
          {activeTab === 0 && <PersonalInfoTab />}
          {activeTab === 1 && <BusinessInfoTab />}
          {activeTab === 2 && <SecurityTab />}
        </div>
      </div>

      {/* Change Password Dialog */}
      {changePasswordDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <h3>Change Password</h3>
              <button 
                className="dialog-close"
                onClick={() => setChangePasswordDialog(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="dialog-content">
              <div className="password-form">
                <div className="input-field">
                  <label className="input-label">Current Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({...prev, currentPassword: e.target.value}))}
                      className="form-input"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPasswords(prev => ({...prev, current: !prev.current}))}
                    >
                      {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                
                <div className="input-field">
                  <label className="input-label">New Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({...prev, newPassword: e.target.value}))}
                      className="form-input"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPasswords(prev => ({...prev, new: !prev.new}))}
                    >
                      {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                
                <div className="input-field">
                  <label className="input-label">Confirm New Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({...prev, confirmPassword: e.target.value}))}
                      className="form-input"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPasswords(prev => ({...prev, confirm: !prev.confirm}))}
                    >
                      {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                
                <div className="password-info">
                  <p>Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.</p>
                </div>
              </div>
            </div>
            <div className="dialog-actions">
              <button 
                className="btn btn-outline"
                onClick={() => setChangePasswordDialog(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handlePasswordChange}
                disabled={!passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Dialog */}
      {uploadDocumentDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <h3>Upload Policy Document</h3>
              <button 
                className="dialog-close"
                onClick={() => setUploadDocumentDialog(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="dialog-content">
              <div className="upload-form">
                <div className="input-field">
                  <label className="input-label">Document Name</label>
                  <input
                    type="text"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    className="form-input"
                    placeholder="Enter document name"
                  />
                </div>
                
                <div className="input-field">
                  <label className="input-label">Select PDF File</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="form-input"
                  />
                </div>
                
                {selectedFile && (
                  <div className="file-preview">
                    <FileText size={20} />
                    <span>{selectedFile.name}</span>
                    <span className="file-size">
                      {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="dialog-actions">
              <button 
                className="btn btn-outline"
                onClick={() => setUploadDocumentDialog(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleUploadDocument}
                disabled={!selectedFile || !documentName.trim()}
              >
                <Upload size={20} />
                Upload Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceCompanyProfile;