import React, { useState } from 'react';
import './Form.css';

const RegisterServiceProviderForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    businessRegNumber: '',
    serviceType: '',
    otherServiceType: '',
    phoneNumber: '',
    email: '',
    altPhoneNumber: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    mapLink: '',
    daysOpen: '',
    openingTime: '',
    closingTime: '',
    businessLicense: null,
    insuranceDocument: null,
    certifications: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    infoAccurate: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
        setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
        setFormData({ ...formData, [name]: files[0] });
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Car Service Provider Registration</h2>

      <fieldset>
        <legend>Business Details</legend>
        <div className="form-field">
          <label>Business Name (required)</label>
          <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label>Owner/Manager Name (required)</label>
          <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label>Business Registration Number</label>
          <input type="text" name="businessRegNumber" value={formData.businessRegNumber} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Type of Service Provided</label>
          <select name="serviceType" value={formData.serviceType} onChange={handleChange}>
            <option value="">Select a service</option>
            <option value="General Maintenance">General Maintenance</option>
            <option value="Engine Repair">Engine Repair</option>
            <option value="Car Wash & Detailing">Car Wash & Detailing</option>
            <option value="Tire Services">Tire Services</option>
            <option value="Electrical Work">Electrical Work</option>
            <option value="Towing Services">Towing Services</option>
            <option value="Other">Other</option>
          </select>
          {formData.serviceType === 'Other' && (
            <input
              type="text"
              name="otherServiceType"
              placeholder="Please specify"
              value={formData.otherServiceType}
              onChange={handleChange}
              style={{ marginTop: '10px' }}
            />
          )}
        </div>
      </fieldset>

      <fieldset>
        <legend>Contact Information</legend>
        <div className="form-field">
          <label>Phone Number (required)</label>
          <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label>Email Address (required)</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label>Alternate Phone Number</label>
          <input type="tel" name="altPhoneNumber" value={formData.altPhoneNumber} onChange={handleChange} />
        </div>
      </fieldset>

      <fieldset>
        <legend>Location Details</legend>
        <div className="form-field">
          <label>Business Address (required)</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label>City</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>State/Province</label>
          <input type="text" name="state" value={formData.state} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>ZIP/Postal Code</label>
          <input type="text" name="zip" value={formData.zip} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Google Map Link or Location Pin</label>
          <input type="text" name="mapLink" value={formData.mapLink} onChange={handleChange} />
        </div>
      </fieldset>

      <fieldset>
        <legend>Operating Hours</legend>
        <div className="form-field">
          <label>Days Open</label>
          <input type="text" name="daysOpen" placeholder="e.g., Monday to Saturday" value={formData.daysOpen} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Opening Time</label>
          <input type="time" name="openingTime" value={formData.openingTime} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Closing Time</label>
          <input type="time" name="closingTime" value={formData.closingTime} onChange={handleChange} />
        </div>
      </fieldset>

      <fieldset>
        <legend>Licensing & Certification</legend>
        <div className="form-field">
          <label>Upload Business License</label>
          <input type="file" name="businessLicense" onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Upload Insurance Document</label>
          <input type="file" name="insuranceDocument" onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Certifications or Accreditations</label>
          <input type="text" name="certifications" value={formData.certifications} onChange={handleChange} />
        </div>
      </fieldset>

      <fieldset>
        <legend>User Account Info</legend>
        <div className="form-field">
          <label>Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
        </div>
      </fieldset>

      <fieldset>
        <legend>Terms & Consent</legend>
        <div className="form-field">
          <label>
            <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} required />
            I agree to the Terms and Conditions
          </label>
        </div>
        <div className="form-field">
          <label>
            <input type="checkbox" name="infoAccurate" checked={formData.infoAccurate} onChange={handleChange} required />
            I certify that the information provided is accurate
          </label>
        </div>
      </fieldset>

      <button type="submit">Register / Submit</button>
    </form>
  );
};

export default RegisterServiceProviderForm;